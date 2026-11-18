import { checkinStreak, hkDateKey } from "./checkin";
import { chapterCompletion, objectivesFor } from "./catalog";
import type { PublicBadge, QuizResult, RewardGrant } from "./types";

export const TIER_NAMES = ["Locked", "Bronze", "Silver", "Gold", "Diamond"] as const;
export type Tier = 0 | 1 | 2 | 3 | 4;
/** Math Coins for reaching that tier. Bronze 1, Silver 2, Gold 3, Diamond 5. */
export const BADGE_TIER_MC = [0, 1, 2, 3, 5] as const;

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  /** What the number counts, e.g. "full-mark quizzes". */
  unit: string;
  /** Targets for Bronze, Silver, Gold and Diamond. */
  thresholds: readonly [number, number, number, number];
  /** Hidden badges stay in the teacher list but are not shown or paid. */
  published?: boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "full-marks",
    name: "Full Marks Slayer",
    emoji: "🛡️",
    description: "Score 100% in a short quiz or chapter quiz.",
    unit: "full-mark quizzes",
    thresholds: [1, 3, 6, 10],
  },
  {
    id: "homework-hero",
    name: "Homework Hero",
    emoji: "🔥",
    description: "Hand in homework on time, many in a row.",
    unit: "in a row (your best)",
    thresholds: [10, 20, 30, 40],
  },
  {
    id: "topic-master",
    name: "Chapter Complete",
    emoji: "🎯",
    description: "Reach 100% of the progress of a chapter.",
    unit: "chapters at 100%",
    thresholds: [1, 3, 7, 12],
  },
  {
    id: "active-voice",
    name: "Active Voice",
    emoji: "🙋",
    description: "Get picked in the class lucky draw and answer correctly.",
    unit: "correct lucky-draw answers",
    thresholds: [10, 20, 35, 50],
  },
  {
    id: "comeback-kid",
    name: "Comeback Kid",
    emoji: "🚀",
    description: "Improve a chapter quiz by 15 points or more on the one before.",
    unit: "comebacks",
    thresholds: [1, 2, 3, 5],
  },
  {
    id: "mistake-conqueror",
    name: "Mistake Conqueror",
    emoji: "🧠",
    description: "Log your mistakes in the Mistake Vault and work on them until they are mastered.",
    unit: "mistakes mastered",
    thresholds: [3, 10, 20, 40],
  },
  {
    id: "daily-streak",
    name: "Daily Streak Master",
    emoji: "⚡",
    description: "Do the daily check-in on days in a row.",
    unit: "days in a row (your best)",
    thresholds: [3, 7, 14, 30],
  },
  {
    id: "cq-top1",
    name: "Quiz Champion",
    emoji: "🥇",
    description: "Finish 1st in a chapter quiz in your set.",
    unit: "chapter quizzes in 1st",
    thresholds: [1, 3, 5, 10],
  },
  {
    id: "cq-top3",
    name: "Quiz Podium",
    emoji: "🥉",
    description: "Finish in the top 3 of a chapter quiz in your set.",
    unit: "chapter quizzes in the top 3",
    thresholds: [1, 3, 5, 10],
  },
  {
    id: "cq-bottom3",
    name: "Keep Going",
    emoji: "💪",
    description: "Finish in the bottom 3 of a chapter quiz, once at least 4 people have a mark.",
    unit: "chapter quizzes in the bottom 3",
    thresholds: [1, 3, 5, 10],
  },
  {
    id: "board-top1",
    name: "Board Leader",
    emoji: "👑",
    description:
      "Be 1st on your set Continuous Assessment leaderboard. Each day counts once, when the teacher publishes.",
    unit: "days in 1st",
    thresholds: [1, 5, 10, 20],
  },
  {
    id: "board-top3",
    name: "Board Podium",
    emoji: "🏅",
    description: "Be in the top 3 of your set Continuous Assessment leaderboard.",
    unit: "days in the top 3",
    thresholds: [1, 5, 10, 20],
  },
  {
    id: "board-top10",
    name: "Board Regular",
    emoji: "📈",
    description: "Be in the top 10 of your set Continuous Assessment leaderboard.",
    unit: "days in the top 10",
    thresholds: [1, 5, 10, 20],
  },
];

export interface CqStanding {
  kind: string;
  provisional: boolean;
  rank: number | null;
  rankedCount: number;
  status?: string;
}

export interface BadgeInput {
  quizzes: readonly QuizResult[];
  bestHomeworkStreak: number;
  selfChecks: readonly string[];
  luckyDrawCorrect: number;
  masteredMistakes: number;
  bestCheckinStreak: number;
  /** How many videos exist in each chapter. */
  videosByChapter?: ReadonlyMap<number, number>;
  /** How many of those videos this student has finished. */
  watchedByChapter?: ReadonlyMap<number, number>;
  cqStandings?: readonly CqStanding[];
  boardDays?: { top1: number; top3: number; top10: number };
}

/** Chapters whose progress bar is at 100% (videos, self-check and the chapter quiz). */
export function fullProgressChapters(input: {
  quizzes: readonly QuizResult[];
  selfChecks: readonly string[];
  videosByChapter?: ReadonlyMap<number, number>;
  watchedByChapter?: ReadonlyMap<number, number>;
}): number {
  let count = 0;
  for (let chapter = 1; chapter <= 7; chapter++) {
    const objectives = objectivesFor(chapter);
    const checked = objectives.filter((o) => input.selfChecks.includes(o.id)).length;
    const quizDone = input.quizzes.some(
      (q) => q.kind === "CQ" && q.chapter === chapter && q.percent !== null,
    );
    const percent = chapterCompletion({
      videosTotal: input.videosByChapter?.get(chapter) ?? 0,
      videosWatched: input.watchedByChapter?.get(chapter) ?? 0,
      objectivesTotal: objectives.length,
      objectivesChecked: checked,
      chapterQuizDone: quizDone,
    }).percent;
    if (percent >= 100) count++;
  }
  return count;
}

/** 1st, top 3, and bottom 3 finishes in settled chapter quizzes. */
export function cqBadgeCounts(standings: readonly CqStanding[]): {
  top1: number;
  top3: number;
  bottom3: number;
} {
  const cq = standings.filter(
    (s) => s.kind === "CQ" && !s.provisional && s.rank !== null && s.status !== "absent",
  );
  return {
    top1: cq.filter((s) => s.rank === 1).length,
    top3: cq.filter((s) => (s.rank ?? 99) <= 3).length,
    bottom3: cq.filter((s) => {
      const rank = s.rank ?? 0;
      return s.rankedCount >= 4 && rank > 3 && rank > s.rankedCount - 3;
    }).length,
  };
}

export function badgeValues(input: BadgeInput): Record<string, number> {
  const cq = cqBadgeCounts(input.cqStandings ?? []);
  const days = input.boardDays ?? { top1: 0, top3: 0, top10: 0 };
  return {
    "full-marks": input.quizzes.filter((q) => q.percent !== null && q.percent >= 100 - 1e-9).length,
    "homework-hero": input.bestHomeworkStreak,
    "topic-master": fullProgressChapters(input),
    "active-voice": input.luckyDrawCorrect,
    "comeback-kid": input.quizzes.filter((q) => q.isMostImproved).length,
    "mistake-conqueror": input.masteredMistakes,
    "daily-streak": input.bestCheckinStreak,
    "cq-top1": cq.top1,
    "cq-top3": cq.top3,
    "cq-bottom3": cq.bottom3,
    "board-top1": days.top1,
    "board-top3": days.top3,
    "board-top10": days.top10,
  };
}

export interface BadgeProgress {
  def: BadgeDef;
  value: number;
  tier: Tier;
  /** The next target, or null at Diamond. */
  next: number | null;
  /** 0 to 1 between the last tier reached and the next. */
  progress: number;
}

export function tierFor(value: number, thresholds: readonly number[]): Tier {
  let tier = 0;
  thresholds.forEach((t, i) => {
    if (value >= t) tier = i + 1;
  });
  return tier as Tier;
}

export function badgeProgress(
  input: BadgeInput,
  defs: readonly BadgeDef[] = BADGES,
): BadgeProgress[] {
  const values = badgeValues(input);
  return defs.map((def) => {
    const value = values[def.id] ?? 0;
    const tier = tierFor(value, def.thresholds);
    const targets: readonly number[] = def.thresholds;
    const next = tier < 4 ? (targets[tier] ?? null) : null;
    const prev = tier === 0 ? 0 : (targets[tier - 1] ?? 0);
    const progress = next === null ? 1 : Math.min(1, Math.max(0, (value - prev) / (next - prev)));
    return { def, value, tier, next, progress };
  });
}

/** One pin per badge: Silver replaces Bronze, Gold replaces Silver, and so on. */
function isPublished(def: BadgeDef): boolean {
  return def.published !== false;
}

export function highestBadges(progress: readonly BadgeProgress[]): PublicBadge[] {
  return progress.flatMap((b) => {
    if (!isPublished(b.def) || b.tier < 1) return [];
    const tier = b.tier as PublicBadge["tier"];
    return [{ id: b.def.id, emoji: b.def.emoji, tier }];
  });
}

/** One coin grant for every tier already reached. Repeats use the same source key. */
export function badgeRewardGrants(
  studentId: string,
  progress: readonly BadgeProgress[],
): RewardGrant[] {
  const grants: RewardGrant[] = [];
  for (const b of progress) {
    if (!isPublished(b.def)) continue;
    for (let tier = 1; tier <= b.tier; tier++) {
      grants.push({
        sourceKey: `badge:${b.def.id}:t${tier}`,
        studentId,
        reason: "badge",
        baseMc: BADGE_TIER_MC[tier] ?? 0,
        exp: 0,
        description: `${b.def.name}, ${TIER_NAMES[tier] ?? "tier"}`,
        quizId: null,
      });
    }
  }
  return grants;
}

export interface BoardDayCounts {
  top1: number;
  top3: number;
  top10: number;
}

export interface BadgeStats {
  selfChecks: Map<string, string[]>;
  masteredMistakes: Map<string, number>;
  bestCheckinStreak: Map<string, number>;
  luckyDrawCorrect: Map<string, number>;
  videosByChapter: Map<number, number>;
  watched: Map<string, Map<number, number>>;
  boardDays: Map<string, BoardDayCounts>;
  /** `${studentId}|${badgeId}` already stored for today. */
  recordedToday: Set<string>;
  defs: BadgeDef[];
}

const BOARD_DAY_KEY: Record<string, keyof BoardDayCounts> = {
  "board-top1": "top1",
  "board-top3": "top3",
  "board-top10": "top10",
};

export function emptyBadgeStats(defs: BadgeDef[] = BADGES): BadgeStats {
  return {
    selfChecks: new Map(),
    masteredMistakes: new Map(),
    bestCheckinStreak: new Map(),
    luckyDrawCorrect: new Map(),
    videosByChapter: new Map(),
    watched: new Map(),
    boardDays: new Map(),
    recordedToday: new Set(),
    defs,
  };
}

/** Turns class-wide rows into the counts each badge uses. */
export function badgeStatsFromRows(input: {
  selfChecks: readonly { student_id: string; objective_id: string }[];
  mistakes: readonly { student_id: string; status: string }[];
  checkins: readonly { student_id: string; checkin_date: string }[];
  luckyDraws: readonly { student_id: string }[];
  videos?: readonly { id: string; chapter: number }[];
  completions?: readonly { student_id: string; video_id: string | null; chapter: number }[];
  days?: readonly { student_id: string; badge_id: string; day: string }[];
  defs?: readonly BadgeDef[];
  today?: string;
}): BadgeStats {
  const selfChecks = new Map<string, string[]>();
  const masteredMistakes = new Map<string, number>();
  const bestCheckinStreak = new Map<string, number>();
  const luckyDrawCorrect = new Map<string, number>();
  const videosByChapter = new Map<number, number>();
  const watched = new Map<string, Map<number, number>>();
  const boardDays = new Map<string, BoardDayCounts>();
  const recordedToday = new Set<string>();
  for (const row of input.selfChecks) {
    const list = selfChecks.get(row.student_id) ?? [];
    list.push(row.objective_id);
    selfChecks.set(row.student_id, list);
  }
  for (const row of input.mistakes) {
    if (row.status !== "mastered") continue;
    masteredMistakes.set(row.student_id, (masteredMistakes.get(row.student_id) ?? 0) + 1);
  }
  const dates = new Map<string, string[]>();
  for (const row of input.checkins) {
    const list = dates.get(row.student_id) ?? [];
    list.push(row.checkin_date);
    dates.set(row.student_id, list);
  }
  const today = input.today ?? hkDateKey(new Date());
  for (const [id, list] of dates) bestCheckinStreak.set(id, checkinStreak(list, today).best);
  for (const row of input.luckyDraws) {
    luckyDrawCorrect.set(row.student_id, (luckyDrawCorrect.get(row.student_id) ?? 0) + 1);
  }
  for (const video of input.videos ?? []) {
    videosByChapter.set(video.chapter, (videosByChapter.get(video.chapter) ?? 0) + 1);
  }
  const seenVideo = new Set<string>();
  for (const row of input.completions ?? []) {
    if (!row.video_id) continue;
    const key = `${row.student_id}|${row.video_id}`;
    if (seenVideo.has(key)) continue;
    seenVideo.add(key);
    const byChapter = watched.get(row.student_id) ?? new Map<number, number>();
    byChapter.set(row.chapter, (byChapter.get(row.chapter) ?? 0) + 1);
    watched.set(row.student_id, byChapter);
  }
  for (const row of input.days ?? []) {
    const which = BOARD_DAY_KEY[row.badge_id];
    if (!which) continue;
    const cur = boardDays.get(row.student_id) ?? { top1: 0, top3: 0, top10: 0 };
    cur[which] += 1;
    boardDays.set(row.student_id, cur);
    if (row.day === today) recordedToday.add(`${row.student_id}|${row.badge_id}`);
  }
  return {
    selfChecks,
    masteredMistakes,
    bestCheckinStreak,
    luckyDrawCorrect,
    videosByChapter,
    watched,
    boardDays,
    recordedToday,
    defs: input.defs?.length ? [...input.defs] : BADGES,
  };
}

export function addBoardDays(
  stats: BadgeStats,
  additions: readonly { studentId: string; badgeId: string }[],
): BadgeStats {
  const boardDays = new Map(stats.boardDays);
  for (const [id, counts] of boardDays) boardDays.set(id, { ...counts });
  for (const row of additions) {
    const which = BOARD_DAY_KEY[row.badgeId];
    if (!which) continue;
    const cur = boardDays.get(row.studentId) ?? { top1: 0, top3: 0, top10: 0 };
    cur[which] += 1;
    boardDays.set(row.studentId, cur);
  }
  return { ...stats, boardDays };
}

/** Fills any missing maps so callers can pass a partial. */
export function badgeStatsOf(partial: Partial<BadgeStats> | undefined): BadgeStats {
  const empty = emptyBadgeStats();
  if (!partial) return empty;
  return {
    selfChecks: partial.selfChecks ?? empty.selfChecks,
    masteredMistakes: partial.masteredMistakes ?? empty.masteredMistakes,
    bestCheckinStreak: partial.bestCheckinStreak ?? empty.bestCheckinStreak,
    luckyDrawCorrect: partial.luckyDrawCorrect ?? empty.luckyDrawCorrect,
    videosByChapter: partial.videosByChapter ?? empty.videosByChapter,
    watched: partial.watched ?? empty.watched,
    boardDays: partial.boardDays ?? empty.boardDays,
    recordedToday: partial.recordedToday ?? empty.recordedToday,
    defs: partial.defs?.length ? partial.defs : empty.defs,
  };
}
