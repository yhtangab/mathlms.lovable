import { chapterScoresFromAssessments, type Assessment } from "@/lib/assessments";
import type { MathSet, ScoreSource, Student } from "@/lib/data";
import { buildGameProfiles } from "./rules";
import {
  DEFAULT_SYSTEM_CONFIG,
  type Cosmetics,
  type HomeworkStatus,
  type LedgerEntry,
} from "./types";

/**
 * Sandbox students for the teacher's "Preview student version" bar and for tests.
 * They live only in the browser and are never saved to the database.
 */
export const MOCK_ID_PREFIX = "mock-";

export function isMockStudentId(id: string): boolean {
  return id.startsWith(MOCK_ID_PREFIX);
}

/** The newest quiz is treated as just synced, so its rewards follow today's 2x setting. */
export const MOCK_FRESH_QUIZ_ID = "2:CQ5";

/** When the rest of the sandbox rewards count as given (before any 2x event). */
export const MOCK_HISTORY_DATE = "2026-11-02T08:00:00.000Z";

const SETS: readonly MathSet[] = ["S2M3", "S2M5"];
const SEEDS: Record<MathSet, number> = { S2M3: 2603, S2M5: 2605 };

/** A small seeded random generator, so the sandbox is the same on every load and in tests. */
function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

interface MockName {
  name: string;
  className: string;
}

const NAMES: Record<MathSet, MockName[]> = {
  S2M3: [
    { name: "Chan Ho Yin (Kelvin)", className: "2A" },
    { name: "Wong Tsz Ching (Chloe)", className: "2B" },
    { name: "Lee Ka Lok (Marcus)", className: "2A" },
    { name: "Cheung Hiu Tung (Natalie)", className: "2B" },
    { name: "Lam Chun Hei (Ethan)", className: "2A" },
    { name: "Ho Wing Sze (Stephanie)", className: "2B" },
    { name: "Ng Pak Hei (Jayden)", className: "2A" },
    { name: "Leung Yan Ting (Kelly)", className: "2B" },
    { name: "Tang Cheuk Hin (Aaron)", className: "2A" },
    { name: "Yeung Hoi Ching (Bella)", className: "2B" },
    { name: "Choi Man Kit (Derek)", className: "2A" },
    { name: "Kwok Sze Wing (Fiona)", className: "2B" },
    { name: "Mak Tsz Hin (Gabriel)", className: "2A" },
    { name: "Fung Lok Yi (Hailey)", className: "2B" },
    { name: "Tse Chi Ho (Ian)", className: "2A" },
  ],
  S2M5: [
    { name: "Lau Ka Ho (Jason)", className: "2C" },
    { name: "Siu Wing Yan (Karen)", className: "2D" },
    { name: "Poon Chi Fung (Leo)", className: "2C" },
    { name: "Yip Hoi Yan (Mandy)", className: "2D" },
    { name: "Chow Tsz Long (Nathan)", className: "2C" },
    { name: "Wan Ching Man (Olivia)", className: "2D" },
    { name: "Kong Ho Lam (Patrick)", className: "2C" },
    { name: "So Wai Ying (Queenie)", className: "2D" },
    { name: "Law Chun Kit (Ryan)", className: "2C" },
    { name: "Hui Sum Yi (Sharon)", className: "2D" },
    { name: "Tam Ka Chun (Tony)", className: "2C" },
    { name: "Lui Hoi Lam (Vanessa)", className: "2D" },
    { name: "Ma Tsz Kin (Wilson)", className: "2C" },
    { name: "Chu Yan Yu (Yvonne)", className: "2D" },
    { name: "Wu Ka Wai (Zack)", className: "2C" },
  ],
};

interface PlanItem {
  term: 1 | 2;
  label: string;
  category: "homework" | "short_quiz" | "chapter_quiz";
  full: number;
  position: number;
}

const QUIZ_PLAN: PlanItem[] = [
  { term: 1, label: "SQ1.1", category: "short_quiz", full: 14, position: 40 },
  { term: 1, label: "SQ1.2", category: "short_quiz", full: 13, position: 41 },
  { term: 1, label: "CQ1", category: "chapter_quiz", full: 50, position: 42 },
  { term: 1, label: "SQ2.1", category: "short_quiz", full: 15, position: 43 },
  { term: 1, label: "SQ2.2", category: "short_quiz", full: 15, position: 44 },
  { term: 1, label: "CQ2", category: "chapter_quiz", full: 50, position: 45 },
  { term: 1, label: "SQ3.1", category: "short_quiz", full: 14, position: 46 },
  { term: 1, label: "CQ3", category: "chapter_quiz", full: 50, position: 47 },
  { term: 2, label: "SQ4.1", category: "short_quiz", full: 15, position: 100 },
  { term: 2, label: "CQ4", category: "chapter_quiz", full: 50, position: 101 },
  { term: 2, label: "SQ5.1", category: "short_quiz", full: 14, position: 102 },
  { term: 2, label: "CQ5", category: "chapter_quiz", full: 50, position: 103 },
];

/** 14 homework in Term 1 (Ch1–3) and 10 in Term 2 (Ch4–5), each out of 10. */
const HOMEWORK_CHAPTERS: { term: 1 | 2; chapter: number; count: number }[] = [
  { term: 1, chapter: 1, count: 5 },
  { term: 1, chapter: 2, count: 5 },
  { term: 1, chapter: 3, count: 4 },
  { term: 2, chapter: 4, count: 5 },
  { term: 2, chapter: 5, count: 5 },
];

const HOMEWORK_PLAN: PlanItem[] = HOMEWORK_CHAPTERS.flatMap(({ term, chapter, count }) =>
  Array.from({ length: count }, (_, i) => ({
    term,
    label: `HW${chapter}.${i + 1}`,
    category: "homework" as const,
    full: 10,
    position: (term === 2 ? 50 : 10) + chapter * 6 + i,
  })),
);

/** Whole quiz columns set by hand, to test ties at the top-3 and top-10 boundaries. */
const QUIZ_COLUMNS: Record<MathSet, Record<string, number[]>> = {
  // Two students tie for 1st and two tie for 3rd.
  S2M3: { "SQ1.1": [14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 8, 7, 6, 5] },
  // Three students tie for 9th (all in the top 10); the 12th student needs 1 more mark.
  S2M5: { "SQ1.1": [14, 13, 13, 12, 12, 11, 11, 10, 9, 9, 9, 8, 7, 6, 5] },
};

interface QuizOverride {
  set: MathSet;
  index: number;
  label: string;
  score: number | "ABS";
}

const QUIZ_OVERRIDES: QuizOverride[] = [
  // Most improved: CQ1 36% to CQ2 60% (+24 points).
  { set: "S2M3", index: 12, label: "CQ1", score: 18 },
  { set: "S2M3", index: 12, label: "CQ2", score: 30 },
  // Just short: CQ3 50% to CQ4 64% (+14 points), so no reward.
  { set: "S2M5", index: 6, label: "CQ3", score: 25 },
  { set: "S2M5", index: 6, label: "CQ4", score: 32 },
  // Most improved across an absence: CQ1 40%, absent for CQ2, CQ3 58%.
  { set: "S2M5", index: 13, label: "CQ1", score: 20 },
  { set: "S2M5", index: 13, label: "CQ2", score: "ABS" },
  { set: "S2M5", index: 13, label: "CQ3", score: 29 },
];

interface HomeworkOverride {
  set: MathSet;
  index: number;
  /** Status for every homework not listed in `only`. */
  rest?: HomeworkStatus;
  only?: Record<string, HomeworkStatus>;
}

const HOMEWORK_OVERRIDES: HomeworkOverride[] = [
  // Every homework handed in: two streak rewards (at 10 and 20).
  { set: "S2M3", index: 0, rest: "SUBMITTED" },
  // An excused absence in the middle does not break the streak.
  { set: "S2M3", index: 5, rest: "SUBMITTED", only: { "HW2.3": "EXCUSED" } },
  // Five pieces of missing homework.
  {
    set: "S2M5",
    index: 14,
    only: {
      "HW1.2": "MISSING",
      "HW2.1": "MISSING",
      "HW3.3": "MISSING",
      "HW4.4": "MISSING",
      "HW5.2": "MISSING",
    },
  },
];

const AVATARS = ["avatar-owl", "avatar-fox", "avatar-panda", "avatar-robot", "avatar-penguin"];
const FRAMES: (string | null)[] = ["frame-gold", "frame-silver", "frame-bronze", null, null];
const TITLES: (string | null)[] = [
  "Algebra Ace",
  "Factor Finder",
  "Data Detective",
  "Angle Hunter",
  null,
];

function itemRow(p: PlanItem, score: number | null, absent: boolean): Assessment {
  return {
    term: p.term,
    kind: "item",
    category: p.category,
    label: p.label,
    score,
    absent,
    full_marks: p.full,
    position: p.position,
  };
}

function summaryRow(
  term: 1 | 2,
  label: string,
  category: Assessment["category"],
  score: number,
  full: number,
  position: number,
): Assessment {
  return {
    term,
    kind: "summary",
    category,
    label,
    score,
    absent: false,
    full_marks: full,
    position,
  };
}

function homeworkStatus(
  set: MathSet,
  index: number,
  label: string,
  fallback: HomeworkStatus,
): HomeworkStatus {
  const o = HOMEWORK_OVERRIDES.find((x) => x.set === set && x.index === index);
  if (!o) return fallback;
  return o.only?.[label] ?? o.rest ?? fallback;
}

function quizScore(set: MathSet, index: number, label: string): number | "ABS" | undefined {
  const column = QUIZ_COLUMNS[set][label];
  if (column) return column[index];
  return QUIZ_OVERRIDES.find((o) => o.set === set && o.index === index && o.label === label)?.score;
}

function makeStudent(
  set: MathSet,
  index: number,
  who: MockName,
  classNo: number,
  rnd: () => number,
): Student {
  const ability = clamp(0.93 - index * 0.033 + (rnd() - 0.5) * 0.06, 0.3, 0.98);
  const diligence = clamp(1.02 - index * 0.012 - rnd() * 0.06, 0.7, 1);
  const id = `${MOCK_ID_PREFIX}${set.toLowerCase()}-${String(index + 1).padStart(2, "0")}`;
  const assessments: Assessment[] = [];

  for (const hw of HOMEWORK_PLAN) {
    const roll = rnd();
    const mark = clamp(Math.round(hw.full * (ability + (rnd() - 0.5) * 0.2)), 1, hw.full);
    const random: HomeworkStatus =
      roll < diligence ? "SUBMITTED" : roll < diligence + 0.04 ? "EXCUSED" : "MISSING";
    const status = homeworkStatus(set, index, hw.label, random);
    assessments.push(itemRow(hw, status === "SUBMITTED" ? mark : null, status === "EXCUSED"));
  }

  for (const q of QUIZ_PLAN) {
    const roll = rnd();
    const noisy = clamp(
      Math.round(q.full * clamp(ability + (rnd() - 0.5) * 0.2, 0.08, 1)),
      0,
      q.full,
    );
    const forced = quizScore(set, index, q.label);
    if (forced === "ABS" || (forced === undefined && roll < 0.04)) {
      assessments.push(itemRow(q, null, true));
    } else {
      assessments.push(itemRow(q, forced ?? noisy, false));
    }
  }

  const total = () => clamp(Math.round(200 * clamp(ability + (rnd() - 0.5) * 0.08, 0, 1)), 0, 200);
  const daily = clamp(Math.round(10 * ability + (rnd() - 0.5) * 2), 0, 10);
  assessments.push(summaryRow(1, "Daily (10%)", "daily", daily, 10, 50));
  assessments.push(summaryRow(1, "T1 Total (200)", "other", total(), 200, 55));
  assessments.push(summaryRow(2, "Daily (10%)", "daily", daily, 10, 110));
  assessments.push(summaryRow(2, "T2 Total (200)", "other", total(), 200, 115));

  const scores = chapterScoresFromAssessments(assessments);
  const scoreSources: ScoreSource[] = scores.map((s) => (s === null ? null : "sheet"));
  const dailyMarks = 4 + Math.round(rnd() * 24 * ability);
  const videoMarks = Math.round(rnd() * 12);
  const coinsSpent = Math.min(dailyMarks + videoMarks, Math.floor(rnd() * 4) * 5);

  return {
    id,
    userId: null,
    name: who.name,
    email: `${id}@sandbox.invalid`,
    set,
    scores,
    scoreSources,
    lastMonthAvg: Math.round(clamp(ability * 100 - 4 + (rnd() - 0.5) * 10, 20, 100)),
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks,
    videoMarks,
    coinsSpent,
    completedVideos: [],
    assessments,
    hlcNo: `SANDBOX${set.slice(-2)}${String(index + 1).padStart(2, "0")}`,
    className: who.className,
    classNo: String(classNo),
  };
}

interface Sandbox {
  students: Student[];
  cosmetics: Map<string, Cosmetics>;
  voice: Map<string, number>;
}

function buildSandbox(): Sandbox {
  const students: Student[] = [];
  const cosmetics = new Map<string, Cosmetics>();
  const voice = new Map<string, number>();
  for (const set of SETS) {
    const rnd = seededRandom(SEEDS[set]);
    const classCounters = new Map<string, number>();
    NAMES[set].forEach((who, index) => {
      const classNo = (classCounters.get(who.className) ?? 0) + 1;
      classCounters.set(who.className, classNo);
      const s = makeStudent(set, index, who, classNo, rnd);
      students.push(s);
      cosmetics.set(s.id, {
        avatarId: AVATARS[index % AVATARS.length] ?? "avatar-default",
        equippedFrameId: FRAMES[index % FRAMES.length] ?? null,
        equippedTitle: TITLES[index % TITLES.length] ?? null,
      });
      voice.set(s.id, Math.round(rnd() * 30 * (1 - index / 25)));
    });
  }
  return { students, cosmetics, voice };
}

const SANDBOX = buildSandbox();

export const MOCK_STUDENTS: readonly Student[] = SANDBOX.students;
export const MOCK_COSMETICS: ReadonlyMap<string, Cosmetics> = SANDBOX.cosmetics;
export const MOCK_VOICE_COUNTS: ReadonlyMap<string, number> = SANDBOX.voice;

let seedLedger: LedgerEntry[] | null = null;

/** Sandbox rewards that count as already given (at 1x). The newest quiz is left out on purpose. */
export function mockSeedLedger(): LedgerEntry[] {
  if (seedLedger === null) {
    const { added } = buildGameProfiles({
      students: MOCK_STUDENTS,
      config: DEFAULT_SYSTEM_CONFIG,
      cosmetics: MOCK_COSMETICS,
      now: new Date(MOCK_HISTORY_DATE),
    });
    seedLedger = added.filter((e) => e.quizId !== MOCK_FRESH_QUIZ_ID);
  }
  return seedLedger;
}
