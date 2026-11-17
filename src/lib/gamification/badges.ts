import { checkinStreak, hkDateKey } from "./checkin";
import { objectivesFor } from "./catalog";
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
    name: "Topic Master",
    emoji: "🎯",
    description: "Reach 85% in both the self-check and the chapter quiz of a chapter.",
    unit: "chapters mastered",
    thresholds: [1, 3, 5, 7],
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
];

export interface BadgeInput {
  quizzes: readonly QuizResult[];
  bestHomeworkStreak: number;
  selfChecks: readonly string[];
  luckyDrawCorrect: number;
  masteredMistakes: number;
  bestCheckinStreak: number;
}

/** Chapters where the self-check is at least 85% ticked and the best chapter quiz is at least 85%. */
export function topicMasterCount(
  quizzes: readonly QuizResult[],
  selfChecks: readonly string[],
): number {
  let count = 0;
  for (let chapter = 1; chapter <= 7; chapter++) {
    const objectives = objectivesFor(chapter);
    const ticked = objectives.filter((o) => selfChecks.includes(o.id)).length;
    const selfPct = objectives.length ? (ticked / objectives.length) * 100 : 0;
    const best = Math.max(
      -1,
      ...quizzes
        .filter((q) => q.kind === "CQ" && q.chapter === chapter && q.percent !== null)
        .map((q) => q.percent ?? 0),
    );
    if (selfPct >= 85 && best >= 85) count++;
  }
  return count;
}

export function badgeValues(input: BadgeInput): Record<string, number> {
  return {
    "full-marks": input.quizzes.filter((q) => q.percent !== null && q.percent >= 100 - 1e-9).length,
    "homework-hero": input.bestHomeworkStreak,
    "topic-master": topicMasterCount(input.quizzes, input.selfChecks),
    "active-voice": input.luckyDrawCorrect,
    "comeback-kid": input.quizzes.filter((q) => q.isMostImproved).length,
    "mistake-conqueror": input.masteredMistakes,
    "daily-streak": input.bestCheckinStreak,
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

export function badgeProgress(input: BadgeInput): BadgeProgress[] {
  const values = badgeValues(input);
  return BADGES.map((def) => {
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
export function highestBadges(progress: readonly BadgeProgress[]): PublicBadge[] {
  return progress.flatMap((b) => {
    if (b.tier < 1) return [];
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

export interface BadgeStats {
  selfChecks: Map<string, string[]>;
  masteredMistakes: Map<string, number>;
  bestCheckinStreak: Map<string, number>;
  luckyDrawCorrect: Map<string, number>;
}

/** Turns class-wide rows into the counts each badge uses. */
export function badgeStatsFromRows(input: {
  selfChecks: readonly { student_id: string; objective_id: string }[];
  mistakes: readonly { student_id: string; status: string }[];
  checkins: readonly { student_id: string; checkin_date: string }[];
  luckyDraws: readonly { student_id: string }[];
  today?: string;
}): BadgeStats {
  const selfChecks = new Map<string, string[]>();
  const masteredMistakes = new Map<string, number>();
  const bestCheckinStreak = new Map<string, number>();
  const luckyDrawCorrect = new Map<string, number>();
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
  return { selfChecks, masteredMistakes, bestCheckinStreak, luckyDrawCorrect };
}
