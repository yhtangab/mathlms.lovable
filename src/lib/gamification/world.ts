import { termSummary, type Assessment } from "@/lib/assessments";
import type { MathSet, Student } from "@/lib/data";
import { CHAPTER_STRANDS, STRANDS, computeUnlocks } from "./catalog";
import {
  buildGameProfiles,
  homeworkFromAssessments,
  itemId,
  releasedHomeworkIds,
  type GameInput,
} from "./rules";
import type {
  BoardMetric,
  BoardScope,
  BoardStanding,
  Distribution,
  DistributionKind,
  GameProfile,
  LedgerEntry,
  Leaderboard,
  LeaderboardEntry,
  RadarAxis,
  StudentSnapshot,
} from "./types";

export const SNAPSHOT_VERSION = 1;
/** A set's spread for one assessment is only shown when at least this many students sat it. */
export const MIN_DISTRIBUTION_COUNT = 5;
export const TOP_N = 10;
export const BOARD_SCOPES: BoardScope[] = ["S2M3", "S2M5", "S2"];
export const BOARD_METRICS: BoardMetric[] = ["total", "coursework", "exp"];
export const BOARD_TERMS: (1 | 2)[] = [1, 2];

const SETS: MathSet[] = ["S2M3", "S2M5"];

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function ceil1(n: number): number {
  return Math.ceil(n * 10 - 1e-9) / 10;
}

function mean(values: readonly number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

export function boardId(scope: BoardScope, metric: BoardMetric, term: 1 | 2 | null): string {
  return `${scope}|${metric}|${term ?? "all"}`;
}

export function boardTerm(metric: BoardMetric, term: 1 | 2): 1 | 2 | null {
  return metric === "exp" ? null : term;
}

/** Linear-interpolation quantile of an ascending list (the same method as Excel's QUARTILE.INC). */
export function quantile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const a = sorted[lo] ?? 0;
  const b = sorted[hi] ?? a;
  return a + (b - a) * (idx - lo);
}

/* --------------------------------------------------------------- Metrics */

/** Coursework out of 200 for a term, or null when the term has no coursework marks yet. */
export function coursework200(list: Assessment[], term: number): number | null {
  const { parts, coursework200: total } = termSummary(list, term);
  return parts.some((p) => p.value !== null) ? total : null;
}

function metricValue(
  student: Student,
  profile: GameProfile,
  metric: BoardMetric,
  term: 1 | 2,
): number | null {
  if (metric === "exp") return profile.exp > 0 ? profile.exp : null;
  if (metric === "total") return term === 1 ? profile.t1Total : profile.t2Total;
  return coursework200(student.assessments ?? [], term);
}

/* ------------------------------------------------------------- Radar */

function quizStrandAverages(profile: GameProfile): Map<string, number | null> {
  const byStrand = new Map<string, number[]>();
  for (const q of profile.quizHistory) {
    if (q.percent === null || q.chapter === null) continue;
    const strand = CHAPTER_STRANDS[q.chapter];
    if (!strand) continue;
    const list = byStrand.get(strand);
    if (list) list.push(q.percent);
    else byStrand.set(strand, [q.percent]);
  }
  const out = new Map<string, number | null>();
  for (const [k, v] of byStrand) out.set(k, mean(v));
  return out;
}

export function chapterAverages(profile: GameProfile, chapters = 7): (number | null)[] {
  return Array.from({ length: chapters }, (_, i) =>
    mean(
      profile.quizHistory
        .filter((q) => q.chapter === i + 1 && q.percent !== null)
        .map((q) => q.percent ?? 0),
    ),
  );
}

/** Homework handed in, daily lesson mark and class participation, averaged into one 0–100 score. */
function attitudeScore(
  student: Student,
  profile: GameProfile,
  released: ReadonlySet<string>,
  maxVoice: number,
): number | null {
  const list = student.assessments ?? [];
  const homework = homeworkFromAssessments(list, released);
  const counted = homework.filter((h) => h.status !== "EXCUSED");
  const homeworkRate = counted.length
    ? (counted.filter((h) => h.status === "SUBMITTED").length / counted.length) * 100
    : null;
  const daily = list
    .filter((a) => a.kind === "summary" && a.category === "daily" && a.score !== null)
    .sort((a, b) => b.term - a.term)[0];
  const dailyRate =
    daily && daily.score !== null ? (daily.score / (daily.full_marks || 10)) * 100 : null;
  const voiceRate =
    maxVoice > 0 ? Math.min(100, (profile.activeVoiceCount / maxVoice) * 100) : null;
  const parts = [homeworkRate, dailyRate, voiceRate].filter((v): v is number => v !== null);
  return parts.length ? mean(parts) : null;
}

/* ------------------------------------------------------- Distributions */

interface ItemValue {
  itemId: string;
  label: string;
  kind: DistributionKind;
  term: number;
  position: number;
  percent: number | null;
}

function studentItemValues(student: Student, profile: GameProfile): ItemValue[] {
  const out: ItemValue[] = profile.quizHistory.map((q) => ({
    itemId: q.quizId,
    label: q.label,
    kind: q.kind,
    term: q.term,
    position: q.position,
    percent: q.percent,
  }));
  for (const a of student.assessments ?? []) {
    if (a.kind !== "item" || a.category !== "term_test") continue;
    const full = a.full_marks !== null && a.full_marks > 0 ? a.full_marks : null;
    out.push({
      itemId: itemId(a.term, a.label),
      label: a.label,
      kind: "TT",
      term: a.term,
      position: a.position,
      percent: !a.absent && a.score !== null && full !== null ? (a.score / full) * 100 : null,
    });
  }
  const totals: [1 | 2, number | null][] = [
    [1, profile.t1Total],
    [2, profile.t2Total],
  ];
  for (const [term, total] of totals) {
    out.push({
      itemId: `${term}:TOTAL`,
      label: `Term ${term} total`,
      kind: "TOTAL",
      term,
      position: 100000,
      percent: total === null ? null : total / 2,
    });
  }
  return out;
}

function setDistributions(
  rows: { studentId: string; items: ItemValue[] }[],
): Map<string, Distribution[]> {
  const catalogue = new Map<string, ItemValue>();
  const values = new Map<string, number[]>();
  for (const r of rows) {
    for (const it of r.items) {
      if (!catalogue.has(it.itemId)) catalogue.set(it.itemId, it);
      if (it.percent === null) continue;
      const list = values.get(it.itemId);
      if (list) list.push(it.percent);
      else values.set(it.itemId, [it.percent]);
    }
  }
  const stats = new Map<string, Omit<Distribution, "mine">>();
  for (const [id, it] of catalogue) {
    const sorted = [...(values.get(id) ?? [])].sort((a, b) => a - b);
    if (sorted.length < MIN_DISTRIBUTION_COUNT) continue;
    stats.set(id, {
      itemId: id,
      label: it.label,
      kind: it.kind,
      term: it.term,
      position: it.position,
      count: sorted.length,
      min: round1(sorted[0] ?? 0),
      q1: round1(quantile(sorted, 0.25)),
      median: round1(quantile(sorted, 0.5)),
      q3: round1(quantile(sorted, 0.75)),
      max: round1(sorted[sorted.length - 1] ?? 0),
      mean: round1(mean(sorted) ?? 0),
    });
  }
  const out = new Map<string, Distribution[]>();
  for (const r of rows) {
    const mine = new Map(r.items.map((it) => [it.itemId, it.percent]));
    out.set(
      r.studentId,
      [...stats.values()]
        .map((s) => {
          const p = mine.get(s.itemId) ?? null;
          return { ...s, mine: p === null ? null : round1(p) };
        })
        .sort((a, b) => a.term - b.term || a.position - b.position),
    );
  }
  return out;
}

/* -------------------------------------------------------- Leaderboards */

/** A two-digit code (three when the list is long) that hides who is behind an anonymous card. */
function anonymousCodes(studentIds: readonly string[], salt: string): Map<string, number> {
  const width = studentIds.length > 80 ? 900 : 90;
  const base = width === 900 ? 100 : 10;
  const used = new Set<number>();
  const out = new Map<string, number>();
  for (const id of [...studentIds].sort()) {
    let h = 2166136261;
    for (const ch of `${salt}|${id}`) h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 16777619) >>> 0;
    let code = base + (h % width);
    while (used.has(code)) code = base + ((code - base + 1) % width);
    used.add(code);
    out.set(id, code);
  }
  return out;
}

interface BoardBuild {
  published: Leaderboard;
  full: Leaderboard;
  standings: Map<string, BoardStanding>;
}

function buildBoard(
  scope: BoardScope,
  metric: BoardMetric,
  term: 1 | 2,
  members: { student: Student; profile: GameProfile }[],
  generatedAt: string,
): BoardBuild {
  const bTerm = boardTerm(metric, term);
  const id = boardId(scope, metric, bTerm);
  const scored = members
    .map((m) => ({ ...m, score: metricValue(m.student, m.profile, metric, term) }))
    .filter((m): m is typeof m & { score: number } => m.score !== null)
    .sort((a, b) => b.score - a.score || a.student.name.localeCompare(b.student.name));
  const keys = scored.map((m) => Math.round(m.score * 10));
  const entries: LeaderboardEntry[] = scored.map((m, i) => ({
    rank: 1 + keys.filter((k) => k > (keys[i] ?? 0)).length,
    studentId: m.student.id,
    name: m.student.name,
    set: m.student.set,
    className: m.student.className ?? "",
    classNo: m.student.classNo ?? "",
    score: round1(m.score),
  }));
  const top = entries.filter((e) => e.rank <= TOP_N);
  const rest = entries.filter((e) => e.rank > TOP_N);
  const cutoff = scored.length >= TOP_N ? (scored[TOP_N - 1]?.score ?? null) : null;
  const codes = anonymousCodes(
    rest.map((e) => e.studentId),
    id,
  );
  const base = {
    id,
    scope,
    metric,
    term: bTerm,
    unit: metric === "exp" ? "EXP" : "/ 200",
    rankedCount: entries.length,
    generatedAt,
  };
  const standings = new Map<string, BoardStanding>();
  for (const m of members) {
    const entry = entries.find((e) => e.studentId === m.student.id);
    if (!entry) {
      standings.set(m.student.id, {
        boardId: id,
        display: "—",
        rank: null,
        isTop10: false,
        score: null,
        gapToTop10: null,
        anonymousCode: null,
      });
      continue;
    }
    const inTop = entry.rank <= TOP_N;
    standings.set(m.student.id, {
      boardId: id,
      display: inTop ? `#${entry.rank}` : "10+",
      rank: inTop ? entry.rank : null,
      isTop10: inTop,
      score: entry.score,
      gapToTop10: inTop || cutoff === null ? null : ceil1(Math.max(0, cutoff - entry.score)),
      anonymousCode: inTop ? null : (codes.get(entry.studentId) ?? null),
    });
  }
  return {
    published: { ...base, top, anonymousCodes: [...codes.values()].sort((a, b) => a - b) },
    full: { ...base, top: entries, anonymousCodes: [] },
    standings,
  };
}

/* --------------------------------------------------------------- World */

export interface GameWorld {
  profiles: Map<string, GameProfile>;
  /** Rewards given by this run, to be saved to the ledger. */
  added: LedgerEntry[];
  snapshots: Map<string, StudentSnapshot>;
  /** What students may see: top 10 by name, everyone else as anonymous codes. */
  boards: Leaderboard[];
  /** Full rankings with every name, for teachers only. Never publish these. */
  fullBoards: Leaderboard[];
}

/**
 * Works out the whole game for a class list: profiles, rewards, each student's private
 * snapshot and the public leaderboards. Pass every student of each set (teacher data).
 */
export function buildGameWorld(input: GameInput): GameWorld {
  const now = input.now ?? new Date();
  const generatedAt = now.toISOString();
  const { profiles, added } = buildGameProfiles({ ...input, now });
  const members = input.students.flatMap((student) => {
    const profile = profiles.get(student.id);
    return profile ? [{ student, profile }] : [];
  });

  // Radar and distributions are worked out within each set.
  const radarByStudent = new Map<string, RadarAxis[]>();
  const distributionsByStudent = new Map<string, Distribution[]>();
  for (const set of SETS) {
    const list = members.filter((m) => m.student.set === set);
    if (list.length === 0) continue;
    const released = releasedHomeworkIds(list.map((m) => m.student));
    const maxVoice = Math.max(0, ...list.map((m) => m.profile.activeVoiceCount));
    const raw = list.map((m) => {
      const strands = quizStrandAverages(m.profile);
      return {
        id: m.student.id,
        values: new Map<string, number | null>([
          ...STRANDS.filter((s) => s.id !== "attitude").map((s): [string, number | null] => [
            s.id,
            strands.get(s.id) ?? null,
          ]),
          ["attitude", attitudeScore(m.student, m.profile, released, maxVoice)],
        ]),
      };
    });
    const averages = new Map<string, number | null>(
      STRANDS.map((s) => [
        s.id,
        mean(
          raw.flatMap((r) => {
            const v = r.values.get(s.id);
            return v === null || v === undefined ? [] : [v];
          }),
        ),
      ]),
    );
    for (const r of raw) {
      radarByStudent.set(
        r.id,
        STRANDS.map((s) => {
          const mine = r.values.get(s.id) ?? null;
          const avg = averages.get(s.id) ?? null;
          return {
            strand: s.id,
            label: s.label,
            mine: mine === null ? null : round1(mine),
            setAverage: avg === null ? null : round1(avg),
          };
        }),
      );
    }
    const dist = setDistributions(
      list.map((m) => ({
        studentId: m.student.id,
        items: studentItemValues(m.student, m.profile),
      })),
    );
    for (const [id, d] of dist) distributionsByStudent.set(id, d);
  }

  const boards: Leaderboard[] = [];
  const fullBoards: Leaderboard[] = [];
  const standingsByStudent = new Map<string, BoardStanding[]>();
  for (const scope of BOARD_SCOPES) {
    const scopeMembers = scope === "S2" ? members : members.filter((m) => m.student.set === scope);
    if (scopeMembers.length === 0) continue;
    for (const metric of BOARD_METRICS) {
      const terms: (1 | 2)[] = metric === "exp" ? [1] : BOARD_TERMS;
      for (const term of terms) {
        const built = buildBoard(scope, metric, term, scopeMembers, generatedAt);
        boards.push(built.published);
        fullBoards.push(built.full);
        for (const [id, s] of built.standings) {
          const list = standingsByStudent.get(id);
          if (list) list.push(s);
          else standingsByStudent.set(id, [s]);
        }
      }
    }
  }

  const snapshots = new Map<string, StudentSnapshot>();
  for (const { student, profile } of members) {
    const radar = radarByStudent.get(student.id) ?? [];
    snapshots.set(student.id, {
      version: SNAPSHOT_VERSION,
      studentId: student.id,
      set: student.set,
      generatedAt,
      profile,
      radar,
      distributions: distributionsByStudent.get(student.id) ?? [],
      boards: standingsByStudent.get(student.id) ?? [],
      unlocks: computeUnlocks({ profile, radar, chapterAverages: chapterAverages(profile) }),
    });
  }
  return { profiles, added, snapshots, boards, fullBoards };
}

/* ------------------------------------------------------- Reading saved data */

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Reads a snapshot saved by the publish step; returns null for anything unexpected. */
export function parseSnapshot(payload: unknown): StudentSnapshot | null {
  if (!isObject(payload) || payload["version"] !== SNAPSHOT_VERSION) return null;
  if (!isObject(payload["profile"]) || !Array.isArray(payload["boards"])) return null;
  if (!Array.isArray(payload["radar"]) || !Array.isArray(payload["distributions"])) return null;
  if (!isObject(payload["unlocks"])) return null;
  return payload as unknown as StudentSnapshot;
}

/** Reads a leaderboard saved by the publish step; returns null for anything unexpected. */
export function parseLeaderboard(payload: unknown): Leaderboard | null {
  if (!isObject(payload) || typeof payload["id"] !== "string") return null;
  if (!Array.isArray(payload["top"]) || !Array.isArray(payload["anonymousCodes"])) return null;
  return payload as unknown as Leaderboard;
}
