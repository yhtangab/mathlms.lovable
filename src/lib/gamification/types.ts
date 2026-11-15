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

/**
 * One term's academic result, every part out of 200:
 * total = 20% Term Test (TT) + 40% Continuous Assessment (CA, TnA2) + 40% Exam (TnA3).
 */
export interface TermResult {
  term: 1 | 2;
  tt: number | null;
  ca: number | null;
  exam: number | null;
  /** Null until the term test, CA and exam all have a mark. */
  total: number | null;
}

export interface GameProfile extends Cosmetics {
  set: MathSet;
  /** Term 1 total academic score out of 200; null until TT, CA and exam are all in. */
  t1Total: number | null;
  /** Term 2 total academic score out of 200. */
  t2Total: number | null;
  termResults: TermResult[];
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

/** The six areas on the competency radar. */
export type Strand =
  "number_algebra" | "geometry" | "mensuration" | "trigonometry" | "data_handling" | "attitude";

export interface RadarAxis {
  strand: Strand;
  label: string;
  /** 0 to 100; null when there is no mark in this area yet. */
  mine: number | null;
  setAverage: number | null;
}

/**
 * "SQ" short quiz, "CQ" chapter quiz, "TT" term test, "CA" continuous assessment,
 * "EXAM" exam, "TOTAL" term total.
 */
export type DistributionKind = "SQ" | "CQ" | "TT" | "CA" | "EXAM" | "TOTAL";

/** How the set did on one assessment, in percentages. Never lists individual students. */
export interface Distribution {
  itemId: string;
  label: string;
  kind: DistributionKind;
  term: number;
  position: number;
  count: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean: number;
  /** This student's percentage; null when absent or not sat. */
  mine: number | null;
}

/** "S2" means both sets of the form together. */
export type BoardScope = MathSet | "S2";
/** "total" term academic score, "ca" continuous assessment (TnA2), "exp" EXP. */
export type BoardMetric = "total" | "ca" | "exp";

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  set: MathSet;
  className: string;
  classNo: string;
  score: number;
}

/**
 * A leaderboard. In the published version `top` holds ranks 1 to 10 only, and everyone below
 * appears only as an anonymous code, with no name, score or rank.
 */
export interface Leaderboard {
  id: string;
  scope: BoardScope;
  metric: BoardMetric;
  /** Null for boards that cover the whole year (EXP). */
  term: 1 | 2 | null;
  unit: string;
  top: LeaderboardEntry[];
  anonymousCodes: number[];
  rankedCount: number;
  generatedAt: string;
}

/** One student's place on one leaderboard. */
export interface BoardStanding {
  boardId: string;
  /** "#1" to "#10", "10+", or "—" when the student has no score on this board. */
  display: string;
  /** Only when 1 to 10. */
  rank: number | null;
  isTop10: boolean;
  score: number | null;
  /** How much more is needed to reach 10th place; null when already in the top 10. */
  gapToTop10: number | null;
  /** The code shown on the student's anonymous card when they are below 10th. */
  anonymousCode: number | null;
}

export interface Unlocks {
  frames: string[];
  titles: string[];
}

/** Everything one student may see about their own game data, saved by the teacher's publish. */
export interface StudentSnapshot {
  version: 2;
  studentId: string;
  set: MathSet;
  generatedAt: string;
  profile: GameProfile;
  radar: RadarAxis[];
  distributions: Distribution[];
  boards: BoardStanding[];
  unlocks: Unlocks;
}

/** A dated thing the student did, for the activity heatmap. */
export interface ActivityEvent {
  /** Local date, "YYYY-MM-DD". */
  date: string;
  kind: "lesson" | "homework" | "video";
}
