import { chapterOfLabel, type Assessment } from "@/lib/assessments";
import { coinBalance } from "@/lib/coins";
import { level, type MathSet, type Student } from "@/lib/data";
import {
  DEFAULT_COSMETICS,
  type Cosmetics,
  type GameProfile,
  type HomeworkRecord,
  type LedgerEntry,
  type PublicStanding,
  type QuizKind,
  type QuizResult,
  type QuizStanding,
  type RewardGrant,
  type SystemConfig,
} from "./types";

/** Every number the reward rules use, in one place. */
export const REWARD_RULES = {
  top3: { maxRank: 3, mc: 3, exp: 150 },
  top10: { maxRank: 10, mc: 1, exp: 50 },
  mostImproved: { minGainPoints: 15, mc: 2, exp: 100 },
  homeworkStreak: { every: 10, mc: 3, exp: 0 },
  eventMultiplier: 2,
  /** Rank rewards wait until this share of the set has a mark or ABS for the quiz. */
  minQuizCompletion: 0.8,
} as const;

/** Lesson-mark reasons that count as the student speaking up in class. */
const VOICE_REASONS = new Set(["participation", "correct_answer", "incorrect_answer"]);

/**
 * Which Google Sheet column holds a term's total academic score (out of 200).
 * Change these patterns if the sheet names the columns differently.
 */
export const TERM_TOTAL_LABELS: Record<1 | 2, RegExp> = {
  1: /^(T1\s*total|T1A3)\b/i,
  2: /^(T2\s*total|T2A3)\b/i,
};

const EPSILON = 1e-9;

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Rounds up to one decimal place, so "marks needed" never comes out a little too low. */
function ceil1(n: number): number {
  return Math.ceil(n * 10 - EPSILON) / 10;
}

/** Percentages are compared to 0.001 so that 2/3 and 4/6 count as a tie. */
function percentKey(p: number): number {
  return Math.round(p * 1000);
}

interface Timed {
  term: number;
  position: number;
  label: string;
}

function byTime(a: Timed, b: Timed): number {
  return a.term - b.term || a.position - b.position || a.label.localeCompare(b.label);
}

/** The same id for a column in every student's record, e.g. "1:SQ1.1". */
export function itemId(term: number, label: string): string {
  return `${term}:${label.trim().toUpperCase()}`;
}

export function quizKindOf(a: Pick<Assessment, "kind" | "category">): QuizKind | null {
  if (a.kind !== "item") return null;
  if (a.category === "short_quiz") return "SQ";
  if (a.category === "chapter_quiz") return "CQ";
  return null;
}

/** All Short Quiz and Chapter Quiz results of one student, oldest first. */
export function quizResultsFromAssessments(list: readonly Assessment[]): QuizResult[] {
  const out: QuizResult[] = [];
  for (const a of list) {
    const kind = quizKindOf(a);
    if (kind === null) continue;
    const fullMarks = a.full_marks !== null && a.full_marks > 0 ? a.full_marks : null;
    const score = a.absent ? null : a.score;
    out.push({
      quizId: itemId(a.term, a.label),
      term: a.term,
      kind,
      label: a.label,
      chapter: chapterOfLabel(a.label),
      score,
      fullMarks,
      absent: a.absent,
      percent: score !== null && fullMarks !== null ? (score / fullMarks) * 100 : null,
      position: a.position,
      isMostImproved: false,
    });
  }
  return out.sort(byTime);
}

export interface RosterQuizzes {
  studentId: string;
  quizzes: readonly QuizResult[];
}

/**
 * Ranks every quiz within one set. Ties share a rank and the next rank is skipped (1, 1, 3).
 * Absent or blank students are not ranked.
 */
export function computeSetStandings(
  roster: readonly RosterQuizzes[],
  minCompletion: number = REWARD_RULES.minQuizCompletion,
): Map<string, QuizStanding[]> {
  const result = new Map<string, QuizStanding[]>();
  for (const r of roster) result.set(r.studentId, []);

  const catalogue = new Map<string, QuizResult>();
  for (const r of roster) {
    for (const q of r.quizzes) {
      if (!catalogue.has(q.quizId)) catalogue.set(q.quizId, q);
    }
  }

  for (const quiz of [...catalogue.values()].sort(byTime)) {
    const rows = roster.map((r) => ({
      studentId: r.studentId,
      q: r.quizzes.find((x) => x.quizId === quiz.quizId) ?? null,
    }));
    const ranked: number[] = [];
    let entered = 0;
    for (const { q } of rows) {
      if (q === null) continue;
      if (q.percent !== null) {
        ranked.push(q.percent);
        entered++;
      } else if (q.absent) {
        entered++;
      }
    }
    ranked.sort((a, b) => b - a);
    const keys = ranked.map(percentKey);
    const cutoff = ranked.length >= 10 ? (ranked[9] ?? null) : null;
    const provisional = roster.length === 0 || entered / roster.length < minCompletion - EPSILON;

    for (const { studentId, q } of rows) {
      const percent = q?.percent ?? null;
      const key = percent === null ? null : percentKey(percent);
      result.get(studentId)?.push({
        quizId: quiz.quizId,
        label: quiz.label,
        kind: quiz.kind,
        term: quiz.term,
        status: percent !== null ? "ranked" : q?.absent ? "absent" : "blank",
        rank: key === null ? null : 1 + keys.filter((k) => k > key).length,
        rankedCount: ranked.length,
        rosterCount: roster.length,
        provisional,
        score: q?.score ?? null,
        fullMarks: q?.fullMarks ?? quiz.fullMarks,
        percent,
        top10CutoffPercent: cutoff,
      });
    }
  }
  return result;
}

/** "#1" to "#10" for the top 10, "10+" for everyone below, "—" when there is no rank. */
export function rankLabel(rank: number | null): string {
  if (rank === null) return "—";
  return rank <= REWARD_RULES.top10.maxRank ? `#${rank}` : "10+";
}

/** Strips the exact rank of anyone below 10th and adds how far they are from 10th place. */
export function toPublicStanding(s: QuizStanding): PublicStanding {
  const base = {
    quizId: s.quizId,
    label: s.label,
    kind: s.kind,
    term: s.term,
    provisional: s.provisional,
  };
  if (s.status === "absent") {
    return {
      ...base,
      display: "ABS",
      rank: null,
      isTop10: false,
      marksToTop10: null,
      pointsToTop10: null,
    };
  }
  if (s.rank === null) {
    return {
      ...base,
      display: "—",
      rank: null,
      isTop10: false,
      marksToTop10: null,
      pointsToTop10: null,
    };
  }
  if (s.rank <= REWARD_RULES.top10.maxRank) {
    return {
      ...base,
      display: rankLabel(s.rank),
      rank: s.rank,
      isTop10: true,
      marksToTop10: null,
      pointsToTop10: null,
    };
  }
  const gap =
    s.top10CutoffPercent !== null && s.percent !== null
      ? Math.max(0, s.top10CutoffPercent - s.percent)
      : null;
  return {
    ...base,
    display: rankLabel(s.rank),
    rank: null,
    isTop10: false,
    pointsToTop10: gap === null ? null : ceil1(gap),
    marksToTop10: gap === null || s.fullMarks === null ? null : ceil1((gap / 100) * s.fullMarks),
  };
}

/** Rank rewards for one student: top 3 gets the big reward, 4th to 10th the small one. */
export function rankRewardGrants(
  studentId: string,
  standings: readonly QuizStanding[],
): RewardGrant[] {
  const grants: RewardGrant[] = [];
  for (const s of standings) {
    if (s.provisional || s.rank === null) continue;
    const top3 = s.rank <= REWARD_RULES.top3.maxRank;
    if (!top3 && s.rank > REWARD_RULES.top10.maxRank) continue;
    const rule = top3 ? REWARD_RULES.top3 : REWARD_RULES.top10;
    grants.push({
      sourceKey: `rank:${s.quizId}`,
      studentId,
      reason: top3 ? "quiz_top3" : "quiz_top10",
      baseMc: rule.mc,
      exp: rule.exp,
      description: `Rank ${s.rank} in ${s.label}`,
      quizId: s.quizId,
    });
  }
  return grants;
}

/**
 * Flags each Chapter Quiz that is at least 15 percentage points above the student's
 * previous Chapter Quiz (absent quizzes are skipped), and returns the matching rewards.
 */
export function markMostImproved(
  studentId: string,
  quizzes: readonly QuizResult[],
): { quizzes: QuizResult[]; grants: RewardGrant[] } {
  const rule = REWARD_RULES.mostImproved;
  const grants: RewardGrant[] = [];
  const improved = new Set<string>();
  let previous: { label: string; percent: number } | null = null;
  for (const q of [...quizzes].sort(byTime)) {
    if (q.kind !== "CQ" || q.percent === null) continue;
    if (previous !== null) {
      const gain = q.percent - previous.percent;
      if (gain >= rule.minGainPoints - EPSILON) {
        improved.add(q.quizId);
        grants.push({
          sourceKey: `improved:${q.quizId}`,
          studentId,
          reason: "most_improved",
          baseMc: rule.mc,
          exp: rule.exp,
          description: `Most improved: ${q.label} is ${round1(gain)} points above ${previous.label}`,
          quizId: q.quizId,
        });
      }
    }
    previous = { label: q.label, percent: q.percent };
  }
  return {
    quizzes: quizzes.map((q) => (improved.has(q.quizId) ? { ...q, isMostImproved: true } : q)),
    grants,
  };
}

/** Homework columns that at least one student in the set has a mark for, i.e. already collected. */
export function releasedHomeworkIds(students: readonly Student[]): Set<string> {
  const ids = new Set<string>();
  for (const s of students) {
    for (const a of s.assessments ?? []) {
      if (a.kind === "item" && a.category === "homework" && a.score !== null) {
        ids.add(itemId(a.term, a.label));
      }
    }
  }
  return ids;
}

/**
 * Homework status from the sheet: a mark means SUBMITTED, ABS means EXCUSED, and a blank
 * means MISSING once the homework has been collected (someone in the set has a mark).
 */
export function homeworkFromAssessments(
  list: readonly Assessment[],
  released: ReadonlySet<string>,
): HomeworkRecord[] {
  const out: HomeworkRecord[] = [];
  for (const a of list) {
    if (a.kind !== "item" || a.category !== "homework") continue;
    const homeworkId = itemId(a.term, a.label);
    const status = a.absent
      ? "EXCUSED"
      : a.score !== null
        ? "SUBMITTED"
        : released.has(homeworkId)
          ? "MISSING"
          : null;
    if (status === null) continue;
    out.push({ homeworkId, term: a.term, label: a.label, position: a.position, status });
  }
  return out.sort(byTime);
}

/**
 * Every 10 homework submitted in a row pays a streak reward. Missing homework resets the
 * streak; excused homework (ABS) neither counts nor breaks it.
 */
export function summarizeHomework(
  studentId: string,
  records: readonly HomeworkRecord[],
): { current: number; best: number; missing: number; grants: RewardGrant[] } {
  const rule = REWARD_RULES.homeworkStreak;
  let current = 0;
  let best = 0;
  let missing = 0;
  const grants: RewardGrant[] = [];
  for (const r of [...records].sort(byTime)) {
    if (r.status === "EXCUSED") continue;
    if (r.status === "MISSING") {
      missing++;
      current = 0;
      continue;
    }
    current++;
    best = Math.max(best, current);
    if (current % rule.every === 0) {
      grants.push({
        sourceKey: `hw-streak:${r.homeworkId}`,
        studentId,
        reason: "homework_streak",
        baseMc: rule.mc,
        exp: rule.exp,
        description: `${current} homework handed in a row (up to ${r.label})`,
        quizId: null,
      });
    }
  }
  return { current, best, missing, grants };
}

export function eventMultiplier(config: SystemConfig): number {
  return config.isDoubleMCEventActive ? REWARD_RULES.eventMultiplier : 1;
}

export function applyMultiplier(baseMc: number, config: SystemConfig): number {
  return baseMc * eventMultiplier(config);
}

export function ledgerKey(e: Pick<RewardGrant, "studentId" | "sourceKey">): string {
  return `${e.studentId}|${e.sourceKey}`;
}

/**
 * Gives each reward that is not in the ledger yet, at today's multiplier. Rewards already
 * given keep the multiplier they were given with, so switching the 2x event on or off never
 * changes past rewards, and running this again never pays twice.
 */
export function reconcileLedger(
  existing: readonly LedgerEntry[],
  grants: readonly RewardGrant[],
  config: SystemConfig,
  now: Date = new Date(),
): LedgerEntry[] {
  const given = new Set(existing.map(ledgerKey));
  const multiplier = eventMultiplier(config);
  const added: LedgerEntry[] = [];
  for (const g of grants) {
    const key = ledgerKey(g);
    if (given.has(key)) continue;
    given.add(key);
    added.push({ ...g, multiplier, mc: g.baseMc * multiplier, awardedAt: now.toISOString() });
  }
  return added;
}

/** A term's total academic score, scaled to /200, from the matching sheet column. */
export function termTotal200(list: readonly Assessment[], term: 1 | 2): number | null {
  const pattern = TERM_TOTAL_LABELS[term];
  const row = list.find((a) => pattern.test(a.label.trim()) && a.score !== null && !a.absent);
  if (!row || row.score === null) return null;
  const full = row.full_marks !== null && row.full_marks > 0 ? row.full_marks : 200;
  return round1((row.score / full) * 200);
}

/** How many times each student has answered or taken part, from lesson-mark rows. */
export function countVoiceMarks(
  rows: readonly { student_id: string; reason: string }[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (VOICE_REASONS.has(r.reason)) counts.set(r.student_id, (counts.get(r.student_id) ?? 0) + 1);
  }
  return counts;
}

export interface GameInput {
  students: readonly Student[];
  config: SystemConfig;
  /** Rewards already given. They keep the multiplier they were given with. */
  ledger?: readonly LedgerEntry[];
  cosmetics?: ReadonlyMap<string, Cosmetics>;
  voiceCounts?: ReadonlyMap<string, number>;
  /** False while rewards are only worked out in the browser and not saved yet. Default true. */
  rewardsSpendable?: boolean;
  now?: Date;
}

export interface GameOutput {
  profiles: Map<string, GameProfile>;
  /** Rewards given by this run, to be added to the ledger. */
  added: LedgerEntry[];
}

type ProfileBase = Omit<
  GameProfile,
  "mathCoins" | "rewardCoins" | "rewardsSpendable" | "exp" | "level" | "rewards"
>;

/**
 * Works out every student's game profile. Ranks are only correct when `students` holds the
 * whole of each set, so call this with a teacher's full class list, never with one student.
 */
export function buildGameProfiles(input: GameInput): GameOutput {
  const ledger = input.ledger ?? [];
  const spendable = input.rewardsSpendable ?? true;
  const bySet = new Map<MathSet, Student[]>();
  for (const s of input.students) {
    const list = bySet.get(s.set);
    if (list) list.push(s);
    else bySet.set(s.set, [s]);
  }

  const grants: RewardGrant[] = [];
  const bases = new Map<string, ProfileBase>();
  for (const [set, list] of bySet) {
    const released = releasedHomeworkIds(list);
    const quizzesByStudent = new Map<string, QuizResult[]>();
    for (const s of list) {
      const improved = markMostImproved(s.id, quizResultsFromAssessments(s.assessments ?? []));
      grants.push(...improved.grants);
      quizzesByStudent.set(s.id, improved.quizzes);
    }
    const standings = computeSetStandings(
      list.map((s) => ({ studentId: s.id, quizzes: quizzesByStudent.get(s.id) ?? [] })),
    );
    for (const s of list) {
      const assessments = s.assessments ?? [];
      const own = standings.get(s.id) ?? [];
      grants.push(...rankRewardGrants(s.id, own));
      const homework = summarizeHomework(s.id, homeworkFromAssessments(assessments, released));
      grants.push(...homework.grants);
      bases.set(s.id, {
        ...DEFAULT_COSMETICS,
        ...input.cosmetics?.get(s.id),
        set,
        t1Total: termTotal200(assessments, 1),
        t2Total: termTotal200(assessments, 2),
        homeworkStreak: homework.current,
        bestHomeworkStreak: homework.best,
        missingHomeworkCount: homework.missing,
        activeVoiceCount: input.voiceCounts?.get(s.id) ?? 0,
        quizHistory: quizzesByStudent.get(s.id) ?? [],
        standings: own.map(toPublicStanding),
      });
    }
  }

  const added = reconcileLedger(ledger, grants, input.config, input.now ?? new Date());
  const rewardsByStudent = new Map<string, LedgerEntry[]>();
  for (const e of [...ledger, ...added]) {
    const list = rewardsByStudent.get(e.studentId);
    if (list) list.push(e);
    else rewardsByStudent.set(e.studentId, [e]);
  }

  const profiles = new Map<string, GameProfile>();
  for (const s of input.students) {
    const base = bases.get(s.id);
    if (!base) continue;
    const rewards = rewardsByStudent.get(s.id) ?? [];
    const rewardCoins = rewards.reduce((t, e) => t + e.mc, 0);
    const exp = s.xp + rewards.reduce((t, e) => t + e.exp, 0);
    profiles.set(s.id, {
      ...base,
      rewards,
      rewardCoins,
      rewardsSpendable: spendable,
      mathCoins: coinBalance(s) + (spendable ? rewardCoins : 0),
      exp,
      level: level(exp),
    });
  }
  return { profiles, added };
}

/** Returns the student with their game profile attached, if there is one. */
export function attachGame(s: Student, profiles: ReadonlyMap<string, GameProfile>): Student {
  const game = profiles.get(s.id);
  return game ? { ...s, game } : s;
}

/** The Math Coins figure to show for a student: game balance when there is one. */
export function displayCoins(s: Student): number {
  return s.game?.mathCoins ?? coinBalance(s);
}
