import type { MathSet } from "@/lib/data";

/** The two quiz types that take part in rank rewards. */
export type QuizKind = "SQ" | "CQ";

/** One Short Quiz or Chapter Quiz result for one student. */
export interface QuizResult {
  /** The same for every student who sat the quiz, e.g. "1:SQ1.1". */
  quizId: string;
  term: number;
  kind: QuizKind;
  label: string;
  chapter: number | null;
  /** Null when the student was absent or has no mark yet. */
  score: number | null;
  fullMarks: number | null;
  absent: boolean;
  /** 0 to 100, not rounded. Null when absent, blank, or the full marks are unknown. */
  percent: number | null;
  /** Column order in the Google Sheet, used to put quizzes in time order. */
  position: number;
  /** True when this Chapter Quiz is at least 15 percentage points above the previous one. */
  isMostImproved: boolean;
}

export type HomeworkStatus = "SUBMITTED" | "MISSING" | "EXCUSED";

export interface HomeworkRecord {
  homeworkId: string;
  term: number;
  label: string;
  position: number;
  status: HomeworkStatus;
}

export type RewardReason = "quiz_top3" | "quiz_top10" | "most_improved" | "homework_streak";

/** A reward the rules say a student has earned, before the 2x event is applied. */
export interface RewardGrant {
  /** Unique for each student, so the same quiz or streak can never pay twice. */
  sourceKey: string;
  studentId: string;
  reason: RewardReason;
  baseMc: number;
  exp: number;
  /** What the student sees, e.g. "Rank 2 in SQ1.1". */
  description: string;
  /** The quiz that earned it; null for homework streaks. */
  quizId: string | null;
}

/** A reward once it has been given. The 2x multiplier is fixed at that moment. */
export interface LedgerEntry extends RewardGrant {
  multiplier: number;
  mc: number;
  awardedAt: string;
}

export interface SystemConfig {
  isDoubleMCEventActive: boolean;
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = { isDoubleMCEventActive: false };

/**
 * A student's full standing in one quiz, including the exact rank.
 * Only teacher views and the server may hold this; students get a PublicStanding.
 */
export interface QuizStanding {
  quizId: string;
  label: string;
  kind: QuizKind;
  term: number;
  status: "ranked" | "absent" | "blank";
  rank: number | null;
  rankedCount: number;
  rosterCount: number;
  /** True until enough of the set has a mark or ABS. No rank rewards are given while provisional. */
  provisional: boolean;
  score: number | null;
  fullMarks: number | null;
  percent: number | null;
  /** The lowest percentage that still places in the top 10; null when fewer than 10 sat the quiz. */
  top10CutoffPercent: number | null;
}

/** What a student may see about a quiz standing. Exact ranks below 10th are never included. */
export interface PublicStanding {
  quizId: string;
  label: string;
  kind: QuizKind;
  term: number;
  /** "#1" to "#10", "10+", "ABS" or "—". */
  display: string;
  /** The exact rank, only when it is 1 to 10. */
  rank: number | null;
  isTop10: boolean;
  provisional: boolean;
  /** Marks still needed to reach 10th place; null when already in the top 10. */
  marksToTop10: number | null;
  /** Percentage points still needed to reach 10th place. */
  pointsToTop10: number | null;
}

export interface Cosmetics {
  avatarId: string;
  equippedFrameId: string | null;
  equippedTitle: string | null;
}

export const DEFAULT_COSMETICS: Cosmetics = {
  avatarId: "avatar-default",
  equippedFrameId: null,
  equippedTitle: null,
};

export interface GameProfile extends Cosmetics {
  set: MathSet;
  /** Term 1 total academic score out of 200 (the term result, not coursework). */
  t1Total: number | null;
  /** Term 2 total academic score out of 200. */
  t2Total: number | null;
  /** Balance the student can spend. Includes game rewards only when rewardsSpendable is true. */
  mathCoins: number;
  /** Math Coins earned from game rewards (quiz ranks, most improved, homework streaks). */
  rewardCoins: number;
  /** False while game rewards are worked out in the browser and not saved to the database yet. */
  rewardsSpendable: boolean;
  exp: number;
  level: number;
  homeworkStreak: number;
  bestHomeworkStreak: number;
  missingHomeworkCount: number;
  /** Times the student answered or took part in class (from lesson marks). */
  activeVoiceCount: number;
  quizHistory: QuizResult[];
  standings: PublicStanding[];
  rewards: LedgerEntry[];
}
