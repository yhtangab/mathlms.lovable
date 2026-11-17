This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/integrations/supabase/types.ts, src/lib/**, src/components/AppShell.tsx, src/components/PageParts.tsx, src/components/SheetGradebook.tsx, src/routes/_authenticated/teacher.tsx, src/routes/_authenticated/homework.tsx, src/routes/_authenticated/activity.tsx
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/
  components/
    AppShell.tsx
    PageParts.tsx
    SheetGradebook.tsx
  integrations/
    supabase/
      types.ts
  lib/
    gamification/
      badges.ts
      catalog.ts
      checkin.ts
      math-text.ts
      mock-activity.ts
      mock-data.ts
      publish.ts
      rules.ts
      student-data.ts
      types.ts
      vault.ts
      world.ts
    app-store.tsx
    assessments.ts
    coins.ts
    data.ts
    drive-link.ts
    error-capture.ts
    error-page.ts
    game.functions.ts
    grade-rules.ts
    homework.ts
    lovable-error-reporting.ts
    math.functions.ts
    nav.ts
    sheet-parse.ts
    sheets.functions.ts
    tones.ts
    utils.ts
    video-watch.ts
  routes/
    _authenticated/
      activity.tsx
      homework.tsx
      teacher.tsx
```

# Files

## File: src/lib/gamification/badges.ts
```typescript
import { objectivesFor } from "./catalog";
import type { QuizResult } from "./types";
export const TIER_NAMES = ["Locked", "Bronze", "Silver", "Gold", "Diamond"] as const;
export type Tier = 0 | 1 | 2 | 3 | 4;
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
```

## File: src/lib/gamification/checkin.ts
```typescript
/** Daily 1-question check-in: question bank, today's question and streaks. */
export interface CheckinQuestion {
  id: string;
  chapter: number;
  /** May contain $…$ maths. */
  prompt: string;
  options: [string, string, string, string];
  /** Index of the correct option. */
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}
/** Every 5 check-ins (right or wrong) earn 1 Math Coin. */
export const CHECKINS_PER_COIN = 5;
export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: "q1-sf",
    chapter: 1,
    prompt: "Round $3.14159$ to 3 significant figures.",
    options: ["$3.14$", "$3.141$", "$3.1$", "$3.142$"],
    answer: 0,
    explanation: "The 4th figure is 1, so 3.14159 rounds down to 3.14.",
  },
  {
    id: "q1-sci",
    chapter: 1,
    prompt: "Write $0.00052$ in scientific notation.",
    options: [
      "$5.2 \\times 10^{-3}$",
      "$5.2 \\times 10^{-4}$",
      "$52 \\times 10^{-5}$",
      "$0.52 \\times 10^{-3}$",
    ],
    answer: 1,
    explanation:
      "Move the decimal point 4 places right: $5.2 \\times 10^{-4}$, with $1 \\le 5.2 < 10$.",
  },
  {
    id: "q1-abs",
    chapter: 1,
    prompt: "A length is 12 cm, correct to the nearest cm. What is the maximum absolute error?",
    options: ["1 cm", "0.5 cm", "0.05 cm", "0.1 cm"],
    answer: 1,
    explanation:
      "The maximum absolute error is half of the unit used: $\\frac{1}{2} \\times 1 = 0.5$ cm.",
  },
  {
    id: "q1-pct",
    chapter: 1,
    prompt:
      "A measurement of 20 cm has a maximum absolute error of 0.5 cm. What is the percentage error?",
    options: ["$2.5\\%$", "$5\\%$", "$0.5\\%$", "$25\\%$"],
    answer: 0,
    explanation: "$\\frac{0.5}{20} \\times 100\\% = 2.5\\%$.",
  },
  {
    id: "q2-degree",
    chapter: 2,
    prompt: "What is the degree of $3x^4 - 2x^2 + 7$?",
    options: ["2", "3", "4", "7"],
    answer: 2,
    explanation: "The highest power of $x$ is 4.",
  },
  {
    id: "q2-expand",
    chapter: 2,
    prompt: "Expand $(x + 3)(x - 2)$.",
    options: ["$x^2 + x - 6$", "$x^2 - x - 6$", "$x^2 + 5x - 6$", "$x^2 + x + 6$"],
    answer: 0,
    explanation: "$x^2 - 2x + 3x - 6 = x^2 + x - 6$.",
  },
  {
    id: "q2-common",
    chapter: 2,
    prompt: "Factorize $6ab + 9a$.",
    options: ["$3a(2b + 3)$", "$3(2ab + 3a)$", "$a(6b + 9)$", "$3ab(2 + 3)$"],
    answer: 0,
    explanation: "The highest common factor is $3a$, so $6ab + 9a = 3a(2b + 3)$.",
  },
  {
    id: "q2-group",
    chapter: 2,
    prompt: "Factorize $ax + ay + bx + by$.",
    options: ["$(a + b)(x + y)$", "$(a + x)(b + y)$", "$abxy$", "$(a - b)(x - y)$"],
    answer: 0,
    explanation: "$a(x + y) + b(x + y) = (a + b)(x + y)$.",
  },
  {
    id: "q3-square",
    chapter: 3,
    prompt: "Expand $(a + b)^2$.",
    options: ["$a^2 + b^2$", "$a^2 + 2ab + b^2$", "$a^2 + ab + b^2$", "$2a + 2b$"],
    answer: 1,
    explanation: "Perfect square identity: $(a + b)^2 \\equiv a^2 + 2ab + b^2$.",
  },
  {
    id: "q3-diff",
    chapter: 3,
    prompt: "Factorize $x^2 - 25$.",
    options: ["$(x - 5)^2$", "$(x + 5)(x - 5)$", "$(x + 25)(x - 1)$", "$x(x - 25)$"],
    answer: 1,
    explanation: "Difference of two squares: $x^2 - 5^2 = (x + 5)(x - 5)$.",
  },
  {
    id: "q3-calc",
    chapter: 3,
    prompt: "Find $101^2 - 99^2$ without a calculator.",
    options: ["$4$", "$200$", "$400$", "$2$"],
    answer: 2,
    explanation: "$(101 + 99)(101 - 99) = 200 \\times 2 = 400$.",
  },
  {
    id: "q3-identity",
    chapter: 3,
    prompt: "Which of these is an identity?",
    options: ["$2(x + 1) = 2x + 2$", "$x + 1 = 3$", "$x^2 = 4$", "$2x = x + 5$"],
    answer: 0,
    explanation: "It is true for every value of $x$; the others are true for only some values.",
  },
  {
    id: "q4-simplify",
    chapter: 4,
    prompt: "Simplify $\\dfrac{6x^2}{3x}$.",
    options: ["$2x$", "$3x$", "$2x^2$", "$\\dfrac{2}{x}$"],
    answer: 0,
    explanation: "$\\frac{6}{3} = 2$ and $\\frac{x^2}{x} = x$.",
  },
  {
    id: "q4-add",
    chapter: 4,
    prompt: "Simplify $\\dfrac{1}{x} + \\dfrac{1}{2x}$.",
    options: ["$\\dfrac{2}{3x}$", "$\\dfrac{3}{2x}$", "$\\dfrac{1}{3x}$", "$\\dfrac{2}{x}$"],
    answer: 1,
    explanation: "$\\frac{2}{2x} + \\frac{1}{2x} = \\frac{3}{2x}$.",
  },
  {
    id: "q4-subject",
    chapter: 4,
    prompt: "Make $h$ the subject of $A = \\dfrac{1}{2}bh$.",
    options: ["$h = 2Ab$", "$h = \\dfrac{A}{2b}$", "$h = \\dfrac{2A}{b}$", "$h = \\dfrac{b}{2A}$"],
    answer: 2,
    explanation: "Multiply both sides by 2, then divide by $b$.",
  },
  {
    id: "q4-sub",
    chapter: 4,
    prompt: "If $v = u + at$, find $v$ when $u = 5$, $a = 2$, $t = 3$.",
    options: ["$10$", "$11$", "$21$", "$30$"],
    answer: 1,
    explanation: "$v = 5 + 2 \\times 3 = 11$.",
  },
  {
    id: "q5-solve",
    chapter: 5,
    prompt: "Solve $x + y = 10$ and $x - y = 2$.",
    options: ["$x = 4, y = 6$", "$x = 6, y = 4$", "$x = 5, y = 5$", "$x = 8, y = 2$"],
    answer: 1,
    explanation: "Adding gives $2x = 12$, so $x = 6$ and $y = 4$.",
  },
  {
    id: "q5-point",
    chapter: 5,
    prompt: "Which point lies on the graph of $y = 2x + 1$?",
    options: ["$(2, 4)$", "$(1, 2)$", "$(3, 7)$", "$(0, 2)$"],
    answer: 2,
    explanation: "$2 \\times 3 + 1 = 7$.",
  },
  {
    id: "q5-elim",
    chapter: 5,
    prompt: "Solve $2x + y = 7$ and $x + y = 4$.",
    options: ["$x = 3, y = 1$", "$x = 1, y = 3$", "$x = 2, y = 3$", "$x = 4, y = 0$"],
    answer: 0,
    explanation: "Subtracting gives $x = 3$, then $y = 4 - 3 = 1$.",
  },
  {
    id: "q5-parallel",
    chapter: 5,
    prompt:
      "The graphs of two linear equations are parallel lines. How many solutions do they have together?",
    options: ["None", "One", "Two", "Infinitely many"],
    answer: 0,
    explanation: "Parallel lines never meet, so there is no common solution.",
  },
  {
    id: "q6-hexagon",
    chapter: 6,
    prompt: "What is the sum of the interior angles of a hexagon?",
    options: ["$540^\\circ$", "$720^\\circ$", "$900^\\circ$", "$1080^\\circ$"],
    answer: 1,
    explanation: "$(6 - 2) \\times 180^\\circ = 720^\\circ$.",
  },
  {
    id: "q6-octagon",
    chapter: 6,
    prompt: "What is each exterior angle of a regular octagon?",
    options: ["$30^\\circ$", "$40^\\circ$", "$45^\\circ$", "$60^\\circ$"],
    answer: 2,
    explanation: "$360^\\circ \\div 8 = 45^\\circ$.",
  },
  {
    id: "q6-alternate",
    chapter: 6,
    prompt: "Two parallel lines are cut by a transversal. Alternate angles are…",
    options: ["equal", "supplementary", "complementary", "always $90^\\circ$"],
    answer: 0,
    explanation: "Alternate angles between parallel lines are equal (alt. ∠s, AB // CD).",
  },
  {
    id: "q6-interior",
    chapter: 6,
    prompt: "Interior angles on the same side of a transversal between parallel lines add up to…",
    options: ["$90^\\circ$", "$180^\\circ$", "$270^\\circ$", "$360^\\circ$"],
    answer: 1,
    explanation: "They are supplementary (int. ∠s, AB // CD).",
  },
  {
    id: "q7-stem",
    chapter: 7,
    prompt: "In a stem-and-leaf diagram, stem 4 with leaf 7 stands for…",
    options: ["$4.7$", "$47$", "$74$", "$11$"],
    answer: 1,
    explanation: "The stem is the tens digit and the leaf is the units digit.",
  },
  {
    id: "q7-mode",
    chapter: 7,
    prompt: "What is the mode of $3, 5, 5, 8, 9$?",
    options: ["$3$", "$5$", "$6$", "$8$"],
    answer: 1,
    explanation: "5 appears most often.",
  },
  {
    id: "q7-cumulative",
    chapter: 7,
    prompt: "Which graph shows running totals of frequencies?",
    options: [
      "Pie chart",
      "Frequency polygon",
      "Cumulative frequency polygon",
      "Stem-and-leaf diagram",
    ],
    answer: 2,
    explanation:
      "A cumulative frequency polygon plots running totals against upper class boundaries.",
  },
  {
    id: "q7-polygon",
    chapter: 7,
    prompt: "A frequency polygon is drawn by joining…",
    options: [
      "the class boundaries",
      "the class marks at the tops of the bars",
      "the corners of each bar",
      "the cumulative frequencies",
    ],
    answer: 1,
    explanation: "Join the mid-points (class marks) of the tops of the histogram bars.",
  },
];
/** "YYYY-MM-DD" for a moment in Hong Kong time, the same day the database uses. */
export function hkDateKey(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 16777619) >>> 0;
  return h;
}
/** Each student gets their own question each day; the same one all day. */
export function questionForDay(studentId: string, dateKey: string): CheckinQuestion {
  const q = CHECKIN_QUESTIONS[hash(`${studentId}|${dateKey}`) % CHECKIN_QUESTIONS.length];
  if (!q) throw new Error("The check-in question bank is empty");
  return q;
}
export function checkinById(id: string): CheckinQuestion | null {
  return CHECKIN_QUESTIONS.find((q) => q.id === id) ?? null;
}
function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.round(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / 86_400_000);
}
/**
 * Days in a row with a check-in. The current streak still counts if the last check-in was
 * yesterday (today's has not been done yet).
 */
export function checkinStreak(
  dates: readonly string[],
  today: string,
): { current: number; best: number } {
  const days = [...new Set(dates.map(dayNumber))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  const t = dayNumber(today);
  const last = days[days.length - 1];
  const current = last !== undefined && (last === t || last === t - 1) ? run : 0;
  return { current, best };
}
```

## File: src/lib/gamification/math-text.ts
```typescript
/** Splits text into plain parts and maths parts written as $…$ (inline) or $$…$$ (display). */
export type MathPart =
  { kind: "text"; value: string } | { kind: "math"; value: string; display: boolean };
export function splitMath(text: string): MathPart[] {
  const parts: MathPart[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (m.index > last) parts.push({ kind: "text", value: text.slice(last, m.index) });
    const display = m[1] !== undefined;
    parts.push({ kind: "math", value: (display ? m[1] : m[2]) ?? "", display });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: "text", value: text.slice(last) });
  return parts;
}
```

## File: src/lib/gamification/student-data.ts
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isMockStudentId } from "./mock-data";
import { mockCheckinDates, mockLuckyDraws, mockMistakes } from "./mock-activity";
import { hkDateKey } from "./checkin";
import type { ErrorType, Mistake, MistakeStatus } from "./vault";
export interface CheckinRecord {
  date: string;
  questionId: string;
  correct: boolean;
}
export interface StudentProgress {
  mistakes: Mistake[];
  checkins: CheckinRecord[];
  /** Correct answers after being picked in the class lucky draw. */
  luckyDrawCorrect: number;
}
export const studentProgressKey = (studentId: string) => ["student-progress", studentId] as const;
async function loadProgress(studentId: string): Promise<StudentProgress> {
  const [mistakes, checkins, lucky] = await Promise.all([
    supabase
      .from("mistakes")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_checkins")
      .select("checkin_date, question_id, correct")
      .eq("student_id", studentId)
      .order("checkin_date"),
    supabase
      .from("daily_marks")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("reason", "correct_answer")
      .eq("note", "Lucky draw"),
  ]);
  const error = mistakes.error ?? checkins.error ?? lucky.error;
  if (error) {
    throw new Error(
      `${error.message}. If this mentions a missing table, run supabase/sql/0011_shop_badges_vault.sql.`,
    );
  }
  return {
    mistakes: (mistakes.data ?? []).map((m) => ({
      id: m.id,
      studentId: m.student_id,
      chapter: m.chapter,
      errorType: m.error_type as ErrorType,
      question: m.question,
      imagePath: m.image_path,
      solution: m.solution,
      status: m.status as MistakeStatus,
      createdAt: m.created_at,
    })),
    checkins: (checkins.data ?? []).map((c) => ({
      date: c.checkin_date,
      questionId: c.question_id,
      correct: c.correct,
    })),
    luckyDrawCorrect: lucky.count ?? 0,
  };
}
function mockProgress(studentId: string): StudentProgress {
  return {
    mistakes: mockMistakes(studentId),
    checkins: mockCheckinDates(studentId).map((date) => ({
      date,
      questionId: "q1-sf",
      correct: true,
    })),
    luckyDrawCorrect: mockLuckyDraws(studentId),
  };
}
/** A student's mistakes, check-ins and lucky-draw answers (sandbox students use sample data). */
export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: studentProgressKey(studentId),
    enabled: Boolean(studentId),
    queryFn: () =>
      isMockStudentId(studentId)
        ? Promise.resolve(mockProgress(studentId))
        : loadProgress(studentId),
  });
}
/** Today's check-in, if there is one. */
export function todaysCheckin(progress: StudentProgress | undefined): CheckinRecord | null {
  const today = hkDateKey();
  return progress?.checkins.find((c) => c.date === today) ?? null;
}
```

## File: src/lib/gamification/vault.ts
```typescript
import type { MathSet } from "@/lib/data";
export type ErrorType = "careless" | "concept" | "formula" | "misread";
export type MistakeStatus = "review" | "practiced" | "mastered";
export const ERROR_TYPES: { id: ErrorType; label: string; emoji: string }[] = [
  { id: "careless", label: "Careless calculation", emoji: "🧮" },
  { id: "concept", label: "Concept misunderstanding", emoji: "🤔" },
  { id: "formula", label: "Formula forgotten", emoji: "📐" },
  { id: "misread", label: "Misread question", emoji: "👀" },
];
export const MISTAKE_STATUS: Record<MistakeStatus, { label: string; emoji: string; cls: string }> =
  {
    review: { label: "Needs review", emoji: "🔴", cls: "bg-destructive/10 text-destructive" },
    practiced: { label: "Practiced", emoji: "🟡", cls: "bg-gold/25 text-gold-deep" },
    mastered: { label: "Mastered", emoji: "🟢", cls: "bg-success/15 text-success-deep" },
  };
/** Needs review → Practiced → Mastered → back to Needs review. */
export function nextStatus(s: MistakeStatus): MistakeStatus {
  return s === "review" ? "practiced" : s === "practiced" ? "mastered" : "review";
}
export function errorTypeLabel(id: string): string {
  return ERROR_TYPES.find((e) => e.id === id)?.label ?? id;
}
export interface Mistake {
  id: string;
  studentId: string;
  chapter: number;
  errorType: ErrorType;
  question: string;
  imagePath: string | null;
  solution: string;
  status: MistakeStatus;
  createdAt: string;
}
export type ExamKind = "term_test" | "exam" | "quiz" | "other";
export interface ExamDate {
  id: string;
  title: string;
  kind: ExamKind;
  set: "ALL" | MathSet;
  startsAt: string;
}
export const EXAM_KINDS: { id: ExamKind; label: string }[] = [
  { id: "term_test", label: "Term test" },
  { id: "exam", label: "Exam" },
  { id: "quiz", label: "Quiz" },
  { id: "other", label: "Other" },
];
/** The next test or exam for this set (or for everyone) that has not started yet. */
export function nextExam(
  list: readonly ExamDate[],
  set: MathSet,
  now: Date = new Date(),
): ExamDate | null {
  return (
    [...list]
      .filter(
        (e) => (e.set === "ALL" || e.set === set) && new Date(e.startsAt).getTime() > now.getTime(),
      )
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null
  );
}
export function countdownParts(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
```

## File: src/lib/drive-link.ts
```typescript
/** Old notes were PDFs uploaded to Supabase Storage and saved as "<chapter>/<uuid>.pdf". */
export function isStoragePath(value: string): boolean {
  return /^\d+\/[\w-]+\.pdf$/i.test(value.trim());
}
export function isWebLink(value: string): boolean {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
}
/** A version of a Google Drive / Docs / Slides / Sheets link that can be shown inside the page. */
export function notesPreviewUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const id = url.pathname.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get("id") ?? "";
  if (!/^[\w-]{10,}$/.test(id)) return null;
  if (url.hostname === "drive.google.com") return `https://drive.google.com/file/d/${id}/preview`;
  if (url.hostname === "docs.google.com") {
    const kind = url.pathname.match(/^\/(document|presentation|spreadsheets)\//)?.[1];
    return kind ? `https://docs.google.com/${kind}/d/${id}/preview` : null;
  }
  return null;
}
```

## File: src/lib/error-capture.ts
```typescript
// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.
let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;
function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}
// h3's HTTPError serializes to {"status":500,"unhandled":true,"message":"HTTPError"} —
// no stack, no cause — so a plain console.error(error) reaches the log pipeline with
// the failure detail stripped. Expand Error-like args into a string that keeps the
// message, stack, and the full cause chain.
const CAUSE_DEPTH_LIMIT = 5;
const DESCRIPTION_LENGTH_LIMIT = 8_000;
export function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
    if (!(current instanceof Error)) {
      parts.push(typeof current === "string" ? current : safeStringify(current));
      break;
    }
    const label = depth === 0 ? "" : "caused by: ";
    const status = describeStatus(current);
    parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
    current = current.cause;
  }
  return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error: Error): string {
  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown };
  const value = status ?? statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
function isErrorLike(value: unknown): value is Error {
  return value instanceof Error;
}
// Wrap console.error so errors logged by any layer — including h3's internal
// unhandled-error logging, which this file cannot hook directly — are both
// recorded for consumeLastCapturedError and expanded before serialization.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const expanded = args.map((arg) => {
    if (!isErrorLike(arg)) return arg;
    record(arg);
    return describeError(arg);
  });
  originalConsoleError(...expanded);
};
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}
export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
```

## File: src/lib/error-page.ts
```typescript
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
```

## File: src/lib/game.functions.ts
```typescript
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { publishGame, type PublishReport } from "./gamification/publish";
/** Teacher action: work out the game for every student and publish what students may see. */
export const publishGameData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PublishReport> => {
    const { data: allowed, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (error) throw new Error(`Could not check teacher access: ${error.message}`);
    if (!allowed) throw new Error("Only teacher accounts can publish game data");
    return publishGame(context.supabase);
  });
```

## File: src/lib/homework.ts
```typescript
import type { Database } from "@/integrations/supabase/types";
export type Homework = Database["public"]["Tables"]["homework"]["Row"];
export type HomeworkSet = "ALL" | "S2M3" | "S2M5";
export type DueStatus = "past" | "today" | "tomorrow" | "week" | "later";
export const HOMEWORK_SETS: HomeworkSet[] = ["ALL", "S2M3", "S2M5"];
export const DUE_LABEL: Record<DueStatus, string> = {
  past: "Deadline passed",
  today: "Due today",
  tomorrow: "Due tomorrow",
  week: "This week",
  later: "Upcoming",
};
export const DUE_TONE: Record<DueStatus, string> = {
  past: "bg-muted text-muted-foreground",
  today: "bg-destructive/10 text-destructive",
  tomorrow: "bg-gold/25 text-gold-deep",
  week: "bg-primary/10 text-primary",
  later: "bg-muted text-foreground",
};
const DAY_MS = 86_400_000;
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function time(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}
/** How close a deadline is, counted in calendar days on this device's clock. */
export function dueStatus(dueAt: string, now: Date = new Date()): DueStatus {
  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime()) || due.getTime() < now.getTime()) return "past";
  const days = Math.round((startOfDay(due).getTime() - startOfDay(now).getTime()) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days <= 7) return "week";
  return "later";
}
export function setLabel(set: string): string {
  return set === "ALL" ? "All sets" : set;
}
/** Homework a student in this set should see: their own set plus homework for all sets. */
export function homeworkForSet<T extends { math_set: string }>(list: T[], set: string): T[] {
  return list.filter((h) => h.math_set === "ALL" || h.math_set === set);
}
/** Upcoming (nearest deadline first) and past (most recent first). */
export function splitByDue<T extends { due_at: string }>(list: T[], now: Date = new Date()) {
  const t = now.getTime();
  const upcoming = list
    .filter((h) => time(h.due_at) >= t)
    .sort((a, b) => time(a.due_at) - time(b.due_at));
  const past = list
    .filter((h) => time(h.due_at) < t)
    .sort((a, b) => time(b.due_at) - time(a.due_at));
  return { upcoming, past };
}
export function formatDue(dueAt: string): string {
  const d = new Date(dueAt);
  if (Number.isNaN(d.getTime())) return "No date";
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
const pad = (n: number) => String(n).padStart(2, "0");
/** Value for an <input type="datetime-local"> in this device's time zone. */
export function toLocalInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
/** Turns a datetime-local value back into an ISO time for the database. */
export function fromLocalInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
/** New homework defaults to 8:00 the next morning. */
export function defaultDue(now: Date = new Date()): string {
  return toLocalInput(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0));
}
```

## File: src/lib/tones.ts
```typescript
/**
 * Colour tones shared by the navigation rail, page banners, panels and chapter tiles.
 * Class names are written out in full so Tailwind can find them.
 */
export type Tone = "blue" | "green" | "gold" | "flame" | "berry" | "grape" | "sky";
export interface ToneStyle {
  /** Solid fill with readable text and a chunky bottom edge. */
  solid: string;
  /** The same fill without the edge, for small tiles. */
  flat: string;
  /** Pale fill with coloured text, for badges. */
  soft: string;
  /** Coloured text on a white surface. */
  text: string;
  /** Plain fill, for progress bars and small markers. */
  bar: string;
  /** Dimmed fill, for inactive items on the dark navigation rail. */
  dim: string;
}
export const TONES: Record<Tone, ToneStyle> = {
  blue: {
    solid: "bg-primary text-primary-foreground shadow-chunky-primary",
    flat: "bg-primary text-primary-foreground",
    soft: "bg-primary/10 text-primary-deep",
    text: "text-primary",
    bar: "bg-primary",
    dim: "bg-primary/40",
  },
  green: {
    solid: "bg-success text-primary-foreground shadow-chunky-success",
    flat: "bg-success text-primary-foreground",
    soft: "bg-success/15 text-success-deep",
    text: "text-success",
    bar: "bg-success",
    dim: "bg-success/40",
  },
  gold: {
    solid: "bg-gold text-accent-foreground shadow-chunky-gold",
    flat: "bg-gold text-accent-foreground",
    soft: "bg-gold/30 text-gold-deep",
    text: "text-gold-deep",
    bar: "bg-gold",
    dim: "bg-gold/40",
  },
  flame: {
    solid: "bg-flame text-white shadow-chunky-flame",
    flat: "bg-flame text-white",
    soft: "bg-flame/15 text-flame-deep",
    text: "text-flame-deep",
    bar: "bg-flame",
    dim: "bg-flame/40",
  },
  berry: {
    solid: "bg-berry text-white shadow-chunky-berry",
    flat: "bg-berry text-white",
    soft: "bg-berry/15 text-berry-deep",
    text: "text-berry-deep",
    bar: "bg-berry",
    dim: "bg-berry/40",
  },
  grape: {
    solid: "bg-grape text-white shadow-chunky-grape",
    flat: "bg-grape text-white",
    soft: "bg-grape/15 text-grape-deep",
    text: "text-grape-deep",
    bar: "bg-grape",
    dim: "bg-grape/40",
  },
  sky: {
    solid: "bg-sky text-white shadow-chunky-sky",
    flat: "bg-sky text-white",
    soft: "bg-sky/15 text-sky-deep",
    text: "text-sky-deep",
    bar: "bg-sky",
    dim: "bg-sky/40",
  },
};
/** One tone for each of the seven chapters. */
const CHAPTER_TONES: readonly Tone[] = ["blue", "green", "gold", "flame", "berry", "grape", "sky"];
export function chapterTone(chapter: number): Tone {
  const n = CHAPTER_TONES.length;
  const index = (((Math.trunc(chapter) - 1) % n) + n) % n;
  return CHAPTER_TONES[index] ?? "blue";
}
/** Each page has one colour, shared by its link in the navigation and its banner. */
const ROUTE_TONES: readonly (readonly [string, Tone])[] = [
  ["/dashboard", "blue"],
  ["/courses", "green"],
  ["/homework", "flame"],
  ["/awards", "gold"],
  ["/teacher", "grape"],
  ["/activity", "berry"],
  ["/upload", "sky"],
  ["/leaderboard", "blue"],
];
export function toneForPath(pathname: string): Tone {
  for (const [prefix, tone] of ROUTE_TONES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return tone;
  }
  return "blue";
}
```

## File: src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: src/routes/_authenticated/homework.tsx
```typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { CalendarClock, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import { CHAPTERS } from "@/lib/data";
import { isWebLink } from "@/lib/drive-link";
import {
  DUE_LABEL,
  DUE_TONE,
  HOMEWORK_SETS,
  defaultDue,
  dueStatus,
  formatDue,
  fromLocalInput,
  homeworkForSet,
  setLabel,
  splitByDue,
  toLocalInput,
  type Homework,
  type HomeworkSet,
} from "@/lib/homework";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/_authenticated/homework")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Homework — HLC Math" },
      { name: "description", content: "Homework and deadlines for S2 Mathematics." },
      { property: "og:title", content: "Homework — HLC Math" },
      { property: "og:description", content: "Homework and deadlines." },
    ],
  }),
  component: HomeworkPage,
});
const PAST_LIMIT = 20;
const field =
  "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
function HomeworkPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherHomework /> : <StudentHomework />}</AppShell>;
}
function HomeworkRow({
  item,
  showSet,
  actions,
}: {
  item: Homework;
  showSet: boolean;
  actions?: ReactNode;
}) {
  const status = dueStatus(item.due_at);
  const meta = [
    `Due ${formatDue(item.due_at)}`,
    showSet ? setLabel(item.math_set) : "",
    item.chapter === null ? "" : `Chapter ${item.chapter}`,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <li className="flex flex-wrap items-start gap-3 py-3">
      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
        {item.details !== "" && (
          <p className="mt-1.5 whitespace-pre-wrap text-sm">{item.details}</p>
        )}
        {(item.link !== "" || item.chapter !== null) && (
          <div className="mt-1.5 flex flex-wrap gap-4 text-sm">
            {item.link !== "" && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Open link <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {item.chapter !== null && (
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(item.chapter) }}
                className="font-medium text-primary hover:underline"
              >
                Chapter {item.chapter} materials
              </Link>
            )}
          </div>
        )}
      </div>
      <span className={cn("shrink-0 rounded px-2 py-0.5 text-xs font-semibold", DUE_TONE[status])}>
        {DUE_LABEL[status]}
      </span>
      {actions}
    </li>
  );
}
function StudentHomework() {
  const { me, homework, homeworkError } = useApp();
  const { upcoming, past } = useMemo(
    () => splitByDue(homeworkForSet(homework, me.set)),
    [homework, me.set],
  );
  return (
    <>
      <PageHeader
        title="Homework"
        description={`${me.set} Mathematics. Deadlines are set by your teacher.`}
      />
      {homeworkError && (
        <div className="mt-4">
          <Notice tone="info">Homework is not available yet.</Notice>
        </div>
      )}
      <div className="mt-6 space-y-6">
        <Panel
          title="Upcoming"
          description={upcoming.length === 1 ? "1 item" : `${upcoming.length} items`}
          bodyClassName="px-5 py-1"
        >
          {upcoming.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">Nothing is due at the moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((h) => (
                <HomeworkRow key={h.id} item={h} showSet={false} />
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Past deadlines" bodyClassName="px-5 py-1">
          {past.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">No past homework.</p>
          ) : (
            <ul className="divide-y divide-border">
              {past.slice(0, PAST_LIMIT).map((h) => (
                <HomeworkRow key={h.id} item={h} showSet={false} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
interface Draft {
  id: string | null;
  mathSet: HomeworkSet;
  chapter: string;
  title: string;
  details: string;
  link: string;
  due: string;
}
function emptyDraft(): Draft {
  return {
    id: null,
    mathSet: "ALL",
    chapter: "",
    title: "",
    details: "",
    link: "",
    due: defaultDue(),
  };
}
function asSet(value: string): HomeworkSet {
  return value === "S2M3" || value === "S2M5" ? value : "ALL";
}
function TeacherHomework() {
  const { homework, homeworkError, refresh } = useApp();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<HomeworkSet>("ALL");
  const { upcoming, past } = useMemo(
    () => splitByDue(filter === "ALL" ? homework : homeworkForSet(homework, filter)),
    [homework, filter],
  );
  const change = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const save = async () => {
    const title = draft.title.trim();
    const link = draft.link.trim();
    const details = draft.details.trim();
    const due = fromLocalInput(draft.due);
    if (!title) {
      toast.error("Add a title");
      return;
    }
    if (title.length > 200) {
      toast.error("Keep the title under 200 characters");
      return;
    }
    if (!due) {
      toast.error("Choose a due date and time");
      return;
    }
    if (link !== "" && !(link.startsWith("https://") && isWebLink(link))) {
      toast.error("The link must start with https://");
      return;
    }
    if (details.length > 2000) {
      toast.error("Keep the instructions under 2000 characters");
      return;
    }
    const row = {
      math_set: draft.mathSet,
      chapter: draft.chapter === "" ? null : Number(draft.chapter),
      title,
      details,
      link,
      due_at: due,
    };
    setBusy(true);
    try {
      const { error } = draft.id
        ? await supabase
            .from("homework")
            .update({ ...row, updated_at: new Date().toISOString() })
            .eq("id", draft.id)
        : await supabase.from("homework").insert(row);
      if (error) throw new Error(error.message);
      await refresh();
      toast.success(draft.id ? "Homework updated" : "Homework posted");
      setDraft(emptyDraft());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the homework");
    } finally {
      setBusy(false);
    }
  };
  const edit = (h: Homework) => {
    setDraft({
      id: h.id,
      mathSet: asSet(h.math_set),
      chapter: h.chapter === null ? "" : String(h.chapter),
      title: h.title,
      details: h.details,
      link: h.link,
      due: toLocalInput(new Date(h.due_at)),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (h: Homework) => {
    if (!window.confirm(`Delete "${h.title}"? Students will no longer see it.`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("homework").delete().eq("id", h.id);
      if (error) throw new Error(error.message);
      await refresh();
      if (draft.id === h.id) setDraft(emptyDraft());
      toast.success("Homework deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the homework");
    } finally {
      setBusy(false);
    }
  };
  const actionsFor = (h: Homework) => (
    <div className="flex shrink-0 gap-1">
      <Button variant="ghost" size="sm" onClick={() => edit(h)} aria-label={`Edit ${h.title}`}>
        <Pencil /> Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={() => void remove(h)}
        aria-label={`Delete ${h.title}`}
      >
        <Trash2 /> Delete
      </Button>
    </div>
  );
  return (
    <>
      <PageHeader
        title="Homework"
        description="Post homework with a deadline. Students see it on their dashboard and on this page."
      />
      {homeworkError && (
        <div className="mt-4">
          <Notice tone="error">{homeworkError}</Notice>
        </div>
      )}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title={draft.id ? "Edit homework" : "New homework"}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <label className="block text-sm font-medium">
              Title
              <input
                required
                maxLength={200}
                value={draft.title}
                onChange={(e) => change({ title: e.target.value })}
                placeholder="e.g. Ex 5B Q1–12"
                className={field}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Class set
                <select
                  value={draft.mathSet}
                  onChange={(e) => change({ mathSet: asSet(e.target.value) })}
                  className={field}
                >
                  {HOMEWORK_SETS.map((s) => (
                    <option key={s} value={s}>
                      {setLabel(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Chapter
                <select
                  value={draft.chapter}
                  onChange={(e) => change({ chapter: e.target.value })}
                  className={field}
                >
                  <option value="">None</option>
                  {CHAPTERS.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      Chapter {c.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">
              Due
              <input
                type="datetime-local"
                required
                value={draft.due}
                onChange={(e) => change({ due: e.target.value })}
                className={field}
              />
            </label>
            <label className="block text-sm font-medium">
              Link <span className="font-normal text-muted-foreground">(optional)</span>
              <input
                type="url"
                value={draft.link}
                onChange={(e) => change({ link: e.target.value })}
                placeholder="https://drive.google.com/…"
                className={field}
              />
            </label>
            <label className="block text-sm font-medium">
              Instructions <span className="font-normal text-muted-foreground">(optional)</span>
              <textarea
                rows={4}
                maxLength={2000}
                value={draft.details}
                onChange={(e) => change({ details: e.target.value })}
                placeholder="Show all working. Hand in at the start of the lesson."
                className={field}
              />
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : draft.id ? "Save changes" : "Post homework"}
              </Button>
              {draft.id !== null && (
                <Button type="button" variant="outline" onClick={() => setDraft(emptyDraft())}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Panel>
        <div className="space-y-6">
          <div className="flex w-fit rounded-md border border-border bg-card p-0.5">
            {HOMEWORK_SETS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded px-3 py-1 text-sm font-medium",
                  filter === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>
          <Panel
            title="Upcoming"
            description={upcoming.length === 1 ? "1 item" : `${upcoming.length} items`}
            bodyClassName="px-5 py-1"
          >
            {upcoming.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No upcoming homework. Use the form to post some.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.map((h) => (
                  <HomeworkRow key={h.id} item={h} showSet actions={actionsFor(h)} />
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Past deadlines" bodyClassName="px-5 py-1">
            {past.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">No past homework.</p>
            ) : (
              <ul className="divide-y divide-border">
                {past.slice(0, PAST_LIMIT).map((h) => (
                  <HomeworkRow key={h.id} item={h} showSet actions={actionsFor(h)} />
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
```

## File: src/components/PageParts.tsx
```typescript
import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { TONES, toneForPath, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
/** Each page has its own colour, shared with its link in the navigation. */
function useRouteTone(): Tone {
  return useRouterState({ select: (state) => toneForPath(state.location.pathname) });
}
/** Colour banner used at the top of every page. */
export function PageHeader({
  title,
  description,
  actions,
  tone,
  eyebrow,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: Tone;
  eyebrow?: string;
}) {
  const routeTone = useRouteTone();
  const style = TONES[tone ?? routeTone];
  return (
    <header
      className={cn("relative overflow-hidden rounded-xl px-5 py-4 md:px-6 md:py-5", style.solid)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-7 h-28 w-28 rotate-12 rounded-3xl bg-white/10"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-9 right-24 h-20 w-20 rounded-full bg-white/10"
      />
      <div className="relative flex flex-wrap items-end gap-3">
        <div className="mr-auto min-w-0">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">{eyebrow}</p>
          ) : null}
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
/** A white section with a coloured marker and an optional title bar. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  tone,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  tone?: Tone;
}) {
  const routeTone = useRouteTone();
  const style = TONES[tone ?? routeTone];
  return (
    <section className={cn("rounded-xl border-2 border-border bg-card shadow-chunky", className)}>
      {title || actions ? (
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-border px-5 py-3">
          <div className="mr-auto flex min-w-0 items-center gap-2.5">
            {title ? (
              <span
                aria-hidden="true"
                className={cn("h-6 w-1.5 shrink-0 rounded-full", style.bar)}
              />
            ) : null}
            <div className="min-w-0">
              {title ? <h2 className="text-base font-bold">{title}</h2> : null}
              {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
            </div>
          </div>
          {actions}
        </div>
      ) : null}
      <div className={bodyClassName ?? "px-5 py-4"}>{children}</div>
    </section>
  );
}
/** A short message box for set-up problems or information. */
export function Notice({
  tone = "warning",
  children,
}: {
  tone?: "warning" | "error" | "info";
  children: ReactNode;
}) {
  const cls =
    tone === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : tone === "info"
        ? "border-primary/30 bg-primary/10 text-foreground"
        : "border-gold/70 bg-gold/20 text-foreground";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-lg border-2 px-3 py-2 text-sm font-medium", cls)}
    >
      {children}
    </div>
  );
}
/** A solid coloured number card, used for the main figures on a page. */
export function StatCard({
  label,
  value,
  suffix,
  note,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: ReactNode;
  tone: Tone;
}) {
  return (
    <div className={cn("h-full rounded-xl p-4", TONES[tone].solid)}>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {value}
        {suffix ? <span className="text-sm font-semibold opacity-80"> {suffix}</span> : null}
      </p>
      {note ? <div className="mt-1 text-xs font-medium opacity-90">{note}</div> : null}
    </div>
  );
}
```

## File: src/lib/gamification/catalog.ts
```typescript
import type { Tone } from "@/lib/tones";
import type { GameProfile, RadarAxis, Strand, Unlocks } from "./types";
/* ------------------------------------------------------------------ Avatars */
export interface AvatarDef {
  id: string;
  name: string;
  emoji: string;
  tone: Tone;
}
/** Every avatar is free. Avatars sold in the Shop can be added here later with an unlock rule. */
export const AVATARS: AvatarDef[] = [
  { id: "avatar-owl", name: "Math Wizard Owl", emoji: "🦉", tone: "grape" },
  { id: "avatar-shiba", name: "Cyber Shiba", emoji: "🐕", tone: "sky" },
  { id: "avatar-fox", name: "Geometry Fox", emoji: "🦊", tone: "flame" },
  { id: "avatar-cat", name: "Einstein Cat", emoji: "🐱", tone: "gold" },
  { id: "avatar-robot", name: "Pi Robot", emoji: "🤖", tone: "blue" },
  { id: "avatar-astronaut", name: "Calculus Astronaut", emoji: "🧑‍🚀", tone: "grape" },
  { id: "avatar-panda", name: "Prime Panda", emoji: "🐼", tone: "green" },
  { id: "avatar-penguin", name: "Proof Penguin", emoji: "🐧", tone: "sky" },
  { id: "avatar-dragon", name: "Fractal Dragon", emoji: "🐉", tone: "green" },
  { id: "avatar-octopus", name: "Octagon Octopus", emoji: "🐙", tone: "berry" },
];
export const DEFAULT_AVATAR_ID = "avatar-owl";
export function avatarById(id: string | null | undefined): AvatarDef {
  return (
    AVATARS.find((a) => a.id === id) ??
    AVATARS[0] ?? {
      id: DEFAULT_AVATAR_ID,
      name: "Math Wizard Owl",
      emoji: "🦉",
      tone: "grape",
    }
  );
}
/* ------------------------------------------------------------- Unlock rules */
/** What the unlock rules look at. Worked out from the student's own game profile. */
export interface UnlockContext {
  profile: GameProfile;
  radar: readonly RadarAxis[];
  /** Average quiz percentage for each chapter (index 0 = Chapter 1); null when no quiz yet. */
  chapterAverages: readonly (number | null)[];
}
function strand(ctx: UnlockContext, s: Strand): number | null {
  return ctx.radar.find((a) => a.strand === s)?.mine ?? null;
}
function bestSettledRank(ctx: UnlockContext): number | null {
  const ranks = ctx.profile.standings
    .filter((s) => !s.provisional && s.rank !== null)
    .map((s) => s.rank ?? 99);
  return ranks.length ? Math.min(...ranks) : null;
}
const hasMostImproved = (ctx: UnlockContext) =>
  ctx.profile.quizHistory.some((q) => q.isMostImproved);
/* -------------------------------------------------------------------- Frames */
export type FrameStyle = "default" | "gold" | "neon" | "prism" | "poly";
export interface FrameDef {
  id: string;
  name: string;
  style: FrameStyle;
  /** How to unlock it, shown to the student. */
  requirement: string;
  isUnlocked: (ctx: UnlockContext) => boolean;
}
export const DEFAULT_FRAME_ID = "frame-default";
export const FRAMES: FrameDef[] = [
  {
    id: DEFAULT_FRAME_ID,
    name: "Classic",
    style: "default",
    requirement: "Everyone has this frame.",
    isUnlocked: () => true,
  },
  {
    id: "frame-gold",
    name: "Golden Compass",
    style: "gold",
    requirement: "Reach Level 2 (1,000 EXP), or buy it in the Shop.",
    isUnlocked: (ctx) => ctx.profile.level >= 2,
  },
  {
    id: "frame-neon",
    name: "Calculus Master Neon",
    style: "neon",
    requirement: "Finish in the top 3 of any quiz in your set, or buy it in the Shop.",
    isUnlocked: (ctx) => (bestSettledRank(ctx) ?? 99) <= 3,
  },
  {
    id: "frame-prism",
    name: "Prism Rainbow",
    style: "prism",
    requirement: "Win a Most Improved award (+15 points on a chapter quiz).",
    isUnlocked: hasMostImproved,
  },
  {
    id: "frame-poly",
    name: "3D Polyhedron",
    style: "poly",
    requirement: "Hand in 20 pieces of homework in a row.",
    isUnlocked: (ctx) => ctx.profile.bestHomeworkStreak >= 20,
  },
];
export function frameById(id: string | null | undefined): FrameDef {
  return (
    FRAMES.find((f) => f.id === id) ??
    FRAMES[0] ?? {
      id: DEFAULT_FRAME_ID,
      name: "Classic",
      style: "default",
      requirement: "",
      isUnlocked: () => true,
    }
  );
}
/* -------------------------------------------------------------------- Titles */
export interface TitleDef {
  id: string;
  label: string;
  requirement: string;
  isUnlocked: (ctx: UnlockContext) => boolean;
}
export const TITLES: TitleDef[] = [
  {
    id: "title-pythagoras",
    label: "Pythagoras' Heir",
    requirement: "Come 1st in any quiz in your set.",
    isUnlocked: (ctx) => bestSettledRank(ctx) === 1,
  },
  {
    id: "title-algebra-ace",
    label: "Algebra Ace",
    requirement: "Average 80% or more in Number & Algebra quizzes.",
    isUnlocked: (ctx) => (strand(ctx, "number_algebra") ?? 0) >= 80,
  },
  {
    id: "title-factor-finder",
    label: "Factor Finder",
    requirement: "Average 80% or more in Chapter 2 quizzes.",
    isUnlocked: (ctx) => (ctx.chapterAverages[1] ?? 0) >= 80,
  },
  {
    id: "title-angle-hunter",
    label: "Angle Hunter",
    requirement: "Average 80% or more in Geometry quizzes.",
    isUnlocked: (ctx) => (strand(ctx, "geometry") ?? 0) >= 80,
  },
  {
    id: "title-data-detective",
    label: "Data Detective",
    requirement: "Average 80% or more in Data Handling quizzes.",
    isUnlocked: (ctx) => (strand(ctx, "data_handling") ?? 0) >= 80,
  },
  {
    id: "title-homework-hero",
    label: "Homework Hero",
    requirement: "Hand in 10 pieces of homework in a row.",
    isUnlocked: (ctx) => ctx.profile.bestHomeworkStreak >= 10,
  },
  {
    id: "title-comeback-kid",
    label: "Comeback Kid",
    requirement: "Win a Most Improved award.",
    isUnlocked: hasMostImproved,
  },
  {
    id: "title-curious-mind",
    label: "Curious Mind",
    requirement: "Answer or take part in class 10 times.",
    isUnlocked: (ctx) => ctx.profile.activeVoiceCount >= 10,
  },
  {
    id: "title-rising-star",
    label: "Rising Star",
    requirement: "Reach Level 2 (1,000 EXP).",
    isUnlocked: (ctx) => ctx.profile.level >= 2,
  },
  // The Title Pack in the Shop: these can only be bought.
  {
    id: "title-formula-fan",
    label: "Formula Fanatic",
    requirement: "Buy the Title Pack in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "title-graph-guru",
    label: "Graph Guru",
    requirement: "Buy the Title Pack in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "title-sigma-scholar",
    label: "Sigma Scholar",
    requirement: "Buy the Title Pack in the Shop.",
    isUnlocked: () => false,
  },
];
/** Finds a title by its id, or by its label (older sandbox data stores the label). */
export function titleById(id: string | null | undefined): TitleDef | null {
  if (!id) return null;
  return TITLES.find((t) => t.id === id || t.label === id) ?? null;
}
/** Achievement unlocks plus everything the student has bought in the Shop. */
export function mergeUnlocks(earned: Unlocks | null, boughtGrants: readonly string[]): Unlocks {
  const frames = new Set([DEFAULT_FRAME_ID, ...(earned?.frames ?? [])]);
  const titles = new Set(earned?.titles ?? []);
  for (const g of boughtGrants) {
    if (g.startsWith("frame-")) frames.add(g);
    if (g.startsWith("title-")) titles.add(g);
  }
  return { frames: [...frames], titles: [...titles] };
}
export function computeUnlocks(ctx: UnlockContext): Unlocks {
  return {
    frames: FRAMES.filter((f) => f.isUnlocked(ctx)).map((f) => f.id),
    titles: TITLES.filter((t) => t.isUnlocked(ctx)).map((t) => t.id),
  };
}
/* ------------------------------------------------------- Strands and chapters */
export const STRANDS: { id: Strand; label: string }[] = [
  { id: "number_algebra", label: "Number & Algebra" },
  { id: "geometry", label: "Geometry" },
  { id: "mensuration", label: "Mensuration" },
  { id: "trigonometry", label: "Trigonometry" },
  { id: "data_handling", label: "Data Handling" },
  { id: "attitude", label: "Learning Attitude" },
];
/**
 * Which radar area each chapter's quizzes count towards (OUP S2, Chapters 1–7).
 * Mensuration and Trigonometry have no S2 chapter in this list yet, so they stay empty
 * until those chapters are added.
 */
export const CHAPTER_STRANDS: Record<number, Strand> = {
  1: "number_algebra",
  2: "number_algebra",
  3: "number_algebra",
  4: "number_algebra",
  5: "number_algebra",
  6: "geometry",
  7: "data_handling",
};
export interface Objective {
  id: string;
  chapter: number;
  text: string;
}
/** "I can…" statements for each chapter's self-check. */
export const CHAPTER_OBJECTIVES: Objective[] = [
  {
    id: "ch1-round",
    chapter: 1,
    text: "I can round numbers to decimal places and significant figures.",
  },
  { id: "ch1-scientific", chapter: 1, text: "I can write numbers in scientific notation." },
  { id: "ch1-estimate", chapter: 1, text: "I can estimate answers by rounding." },
  { id: "ch1-limits", chapter: 1, text: "I can find the upper and lower limits of a measurement." },
  { id: "ch1-errors", chapter: 1, text: "I can find absolute, relative and percentage errors." },
  {
    id: "ch2-terms",
    chapter: 2,
    text: "I can name the terms, degree and coefficients of a polynomial.",
  },
  { id: "ch2-add", chapter: 2, text: "I can add and subtract polynomials." },
  { id: "ch2-multiply", chapter: 2, text: "I can multiply polynomials." },
  { id: "ch2-common", chapter: 2, text: "I can factorize by taking out common factors." },
  { id: "ch2-grouping", chapter: 2, text: "I can factorize by grouping terms." },
  { id: "ch3-tell", chapter: 3, text: "I can tell an identity from an equation." },
  {
    id: "ch3-expand",
    chapter: 3,
    text: "I can expand using the difference of squares and perfect square identities.",
  },
  { id: "ch3-factorize", chapter: 3, text: "I can factorize using identities." },
  { id: "ch3-calculate", chapter: 3, text: "I can use identities to make calculations easier." },
  { id: "ch4-simplify", chapter: 4, text: "I can simplify algebraic fractions." },
  { id: "ch4-multiply", chapter: 4, text: "I can multiply and divide algebraic fractions." },
  {
    id: "ch4-add",
    chapter: 4,
    text: "I can add and subtract algebraic fractions with different denominators.",
  },
  { id: "ch4-substitute", chapter: 4, text: "I can substitute values into a formula." },
  { id: "ch4-subject", chapter: 4, text: "I can change the subject of a formula." },
  {
    id: "ch5-graph",
    chapter: 5,
    text: "I can draw the graph of a linear equation in two unknowns.",
  },
  { id: "ch5-graphical", chapter: 5, text: "I can solve simultaneous equations with graphs." },
  {
    id: "ch5-substitution",
    chapter: 5,
    text: "I can solve simultaneous equations by substitution.",
  },
  { id: "ch5-elimination", chapter: 5, text: "I can solve simultaneous equations by elimination." },
  {
    id: "ch5-problems",
    chapter: 5,
    text: "I can set up and solve word problems with two unknowns.",
  },
  { id: "ch6-angles", chapter: 6, text: "I can use corresponding, alternate and interior angles." },
  { id: "ch6-parallel", chapter: 6, text: "I can prove that two lines are parallel." },
  { id: "ch6-polygon", chapter: 6, text: "I can find interior and exterior angles of polygons." },
  {
    id: "ch6-reasons",
    chapter: 6,
    text: "I can give reasons for each step in a geometry problem.",
  },
  { id: "ch7-stem", chapter: 7, text: "I can draw and read stem-and-leaf diagrams." },
  { id: "ch7-polygon", chapter: 7, text: "I can draw frequency polygons and frequency curves." },
  { id: "ch7-cumulative", chapter: 7, text: "I can draw and read cumulative frequency polygons." },
  { id: "ch7-choose", chapter: 7, text: "I can choose a suitable diagram for a set of data." },
  { id: "ch7-misleading", chapter: 7, text: "I can spot misleading graphs." },
];
export function objectivesFor(chapter: number): Objective[] {
  return CHAPTER_OBJECTIVES.filter((o) => o.chapter === chapter);
}
/* ------------------------------------------------------ Chapter completion */
export const COMPLETION_WEIGHTS = { videos: 40, selfCheck: 40, chapterQuiz: 20 } as const;
export interface CompletionInput {
  videosTotal: number;
  videosWatched: number;
  objectivesTotal: number;
  objectivesChecked: number;
  chapterQuizDone: boolean;
}
export interface Completion {
  /** 0 to 100. */
  percent: number;
  parts: {
    id: "videos" | "selfCheck" | "chapterQuiz";
    label: string;
    done: number;
    total: number;
    weight: number;
  }[];
}
/**
 * Videos 40%, self-check 40%, chapter quiz 20%. When a chapter has no videos yet, the other
 * two parts share the whole 100% so the bar can still reach the end.
 */
export function chapterCompletion(input: CompletionInput): Completion {
  const parts = [
    {
      id: "videos" as const,
      label: "Videos",
      done: Math.min(input.videosWatched, input.videosTotal),
      total: input.videosTotal,
      weight: COMPLETION_WEIGHTS.videos,
    },
    {
      id: "selfCheck" as const,
      label: "Self-check",
      done: Math.min(input.objectivesChecked, input.objectivesTotal),
      total: input.objectivesTotal,
      weight: COMPLETION_WEIGHTS.selfCheck,
    },
    {
      id: "chapterQuiz" as const,
      label: "Chapter quiz",
      done: input.chapterQuizDone ? 1 : 0,
      total: 1,
      weight: COMPLETION_WEIGHTS.chapterQuiz,
    },
  ].filter((p) => p.total > 0);
  const totalWeight = parts.reduce((t, p) => t + p.weight, 0);
  const earned = parts.reduce((t, p) => t + (p.done / p.total) * p.weight, 0);
  return { percent: totalWeight ? Math.round((earned / totalWeight) * 100) : 0, parts };
}
/** Mastery stars from the chapter score: 50% one star, 70% two, 85% three. */
export function chapterStars(score: number | null): 0 | 1 | 2 | 3 {
  if (score === null) return 0;
  if (score >= 85) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
```

## File: src/lib/gamification/mock-activity.ts
```typescript
import { CHAPTER_OBJECTIVES } from "./catalog";
import type { ActivityEvent } from "./types";
import type { Mistake } from "./vault";
/** Small stable hash, so each sandbox student always gets the same pattern. */
function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 16777619) >>> 0;
  return h;
}
/** A number from 0 to 1 that depends only on the text. */
function chance(text: string): number {
  return (hash(text) % 10000) / 10000;
}
/** "YYYY-MM-DD" in the device's local time. */
export function localDateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
/** The student number at the end of a sandbox id, e.g. 3 for "mock-s2m3-03". */
function rosterIndex(studentId: string): number {
  const n = Number(studentId.slice(-2));
  return Number.isFinite(n) ? n : 8;
}
/**
 * Lesson, homework and video activity on school days over the past `days` days, for the
 * sandbox students. Stronger students (lower numbers) are more active.
 */
export function mockActivity(
  studentId: string,
  today: Date = new Date(),
  days = 182,
): ActivityEvent[] {
  const keen = Math.max(0.2, 0.85 - rosterIndex(studentId) * 0.04);
  const out: ActivityEvent[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const weekday = d.getDay();
    if (weekday === 0 || weekday === 6) continue;
    const date = localDateKey(d);
    if (chance(`${studentId}|lesson|${date}`) < keen) out.push({ date, kind: "lesson" });
    if (chance(`${studentId}|lesson2|${date}`) < keen * 0.35) out.push({ date, kind: "lesson" });
    if (weekday % 2 === 1 && chance(`${studentId}|hw|${date}`) < keen) {
      out.push({ date, kind: "homework" });
    }
    if (chance(`${studentId}|video|${date}`) < keen * 0.25) out.push({ date, kind: "video" });
  }
  return out;
}
/** Ticked "I can…" statements for a sandbox student (Chapters 1–5 only, like real progress). */
export function mockSelfChecks(studentId: string): string[] {
  const keen = Math.max(0.15, 0.95 - rosterIndex(studentId) * 0.05);
  return CHAPTER_OBJECTIVES.filter(
    (o) => o.chapter <= 5 && chance(`${studentId}|check|${o.id}`) < keen,
  ).map((o) => o.id);
}
/** Sample Mistake Vault entries for a sandbox student. */
export function mockMistakes(studentId: string): Mistake[] {
  const n = rosterIndex(studentId);
  const samples: Omit<Mistake, "id" | "studentId" | "createdAt">[] = [
    {
      chapter: 2,
      errorType: "careless",
      question: "Expand $(x - 3)^2$.",
      imagePath: null,
      solution: "$(x - 3)^2 = x^2 - 6x + 9$. I wrote $x^2 + 9$ and forgot the middle term $-6x$.",
      status: "mastered",
    },
    {
      chapter: 3,
      errorType: "formula",
      question: "Factorize $4x^2 - 9$.",
      imagePath: null,
      solution: "Difference of squares: $$4x^2 - 9 = (2x + 3)(2x - 3)$$",
      status: "practiced",
    },
    {
      chapter: 4,
      errorType: "concept",
      question: "Make $r$ the subject of $A = \\pi r^2$.",
      imagePath: null,
      solution:
        "$r^2 = \\dfrac{A}{\\pi}$, so $r = \\sqrt{\\dfrac{A}{\\pi}}$ (take the positive root for a length).",
      status: "review",
    },
    {
      chapter: 1,
      errorType: "misread",
      question: "Round 0.04567 to 2 significant figures.",
      imagePath: null,
      solution: "The first significant figure is 4, so the answer is $0.046$, not $0.05$.",
      status: n % 2 === 0 ? "mastered" : "review",
    },
  ];
  return samples.slice(0, 2 + (n % 3)).map((m, i) => ({
    ...m,
    id: `${studentId}-mistake-${i + 1}`,
    studentId,
    createdAt: new Date(2026, 9, 5 + i * 6).toISOString(),
  }));
}
/** Days a sandbox student did the daily check-in (Hong Kong dates, "YYYY-MM-DD"). */
export function mockCheckinDates(studentId: string, today: Date = new Date()): string[] {
  const keen = Math.max(0.2, 0.9 - rosterIndex(studentId) * 0.05);
  const out: string[] = [];
  for (let i = 1; i <= 40; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const date = localDateKey(d);
    if (i <= 3 || chance(`${studentId}|checkin|${date}`) < keen) out.push(date);
  }
  return out;
}
/** Correct answers after being picked in the lucky draw, for a sandbox student. */
export function mockLuckyDraws(studentId: string): number {
  return Math.max(0, 22 - rosterIndex(studentId) * 2);
}
```

## File: src/lib/gamification/mock-data.ts
```typescript
import { chapterScoresFromAssessments, termSummary, type Assessment } from "@/lib/assessments";
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
  // Term results, each out of 200: Term Test (typed), CA = TnA2 (formula), Exam = TnA3 (formula).
  const outOf200 = () =>
    clamp(Math.round(200 * clamp(ability + (rnd() - 0.5) * 0.12, 0.05, 1)), 1, 200);
  const daily = clamp(Math.round(10 * ability + (rnd() - 0.5) * 2), 0, 10);
  assessments.push(summaryRow(1, "Daily (10%)", "daily", daily, 10, 50));
  assessments.push(summaryRow(2, "Daily (10%)", "daily", daily, 10, 110));
  const tt1 = outOf200();
  const exam1 = outOf200();
  const tt2 = outOf200();
  const exam2 = outOf200();
  assessments.push({ ...summaryRow(1, "1st TT (200)", "term_test", tt1, 200, 52), kind: "item" });
  assessments.push(
    summaryRow(1, "T1A2 (200)", "overall", termSummary(assessments, 1).coursework200, 200, 54),
  );
  assessments.push(summaryRow(1, "T1A3 (200)", "exam", exam1, 200, 56));
  assessments.push({ ...summaryRow(2, "2nd TT (200)", "term_test", tt2, 200, 112), kind: "item" });
  assessments.push(
    summaryRow(2, "T2A2 (200)", "overall", termSummary(assessments, 2).coursework200, 200, 114),
  );
  assessments.push(summaryRow(2, "T2A3 (200)", "exam", exam2, 200, 116));
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
```

## File: src/lib/gamification/publish.ts
```typescript
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import type { Assessment } from "@/lib/assessments";
import { DEMO_EMAIL, type MathSet, type Student } from "@/lib/data";
import { MOCK_COSMETICS, MOCK_STUDENTS, MOCK_VOICE_COUNTS, mockSeedLedger } from "./mock-data";
import { countVoiceMarks } from "./rules";
import {
  DEFAULT_SYSTEM_CONFIG,
  type Cosmetics,
  type LedgerEntry,
  type RewardReason,
  type SystemConfig,
} from "./types";
import { buildGameWorld } from "./world";
type Client = SupabaseClient<Database>;
type Tables = Database["public"]["Tables"];
type StudentRow = Tables["students"]["Row"];
type AssessmentRow = Tables["assessment_scores"]["Row"];
type MarkRow = Pick<Tables["daily_marks"]["Row"], "student_id" | "reason">;
type RewardRow = Tables["game_rewards"]["Row"];
type CosmeticsRow = Tables["student_cosmetics"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];
const PAGE = 1000;
const WRITE_CHUNK = 500;
const REASONS: RewardReason[] = ["quiz_top3", "quiz_top10", "most_improved", "homework_streak"];
export interface PublishReport {
  students: number;
  snapshots: number;
  boards: number;
  newRewards: number;
  publishedAt: string;
}
interface Page<T> {
  data: T[] | null;
  error: { message: string } | null;
}
/** Supabase caps rows per request, so keep paging until a page comes back empty. */
async function readAll<T>(
  what: string,
  fetchPage: (from: number, to: number) => PromiseLike<Page<T>>,
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await fetchPage(from, from + PAGE - 1);
    if (error) throw new Error(`Could not read ${what}: ${error.message}`);
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}
function chunk<T>(list: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
export function ledgerFromRow(row: RewardRow): LedgerEntry | null {
  const reason = REASONS.find((r) => r === row.reason);
  if (!reason) return null;
  return {
    sourceKey: row.source_key,
    studentId: row.student_id,
    reason,
    baseMc: row.base_mc,
    exp: row.exp,
    description: row.description,
    quizId: row.quiz_id,
    multiplier: row.multiplier,
    mc: row.mc,
    awardedAt: row.awarded_at,
  };
}
function ledgerToRow(e: LedgerEntry): Tables["game_rewards"]["Insert"] {
  return {
    student_id: e.studentId,
    source_key: e.sourceKey,
    reason: e.reason,
    quiz_id: e.quizId,
    description: e.description.slice(0, 300),
    base_mc: e.baseMc,
    multiplier: e.multiplier,
    mc: e.mc,
    exp: e.exp,
    awarded_at: e.awardedAt,
  };
}
export function cosmeticsFromRow(row: CosmeticsRow): Cosmetics {
  return {
    avatarId: row.avatar_id,
    equippedFrameId: row.frame_id,
    equippedTitle: row.title_id,
  };
}
function toAssessment(row: AssessmentRow): Assessment {
  return {
    term: row.term,
    kind: row.kind === "summary" ? "summary" : "item",
    category: row.category as Assessment["category"],
    label: row.label,
    score: row.score,
    absent: row.absent,
    full_marks: row.full_marks,
    position: row.position,
  };
}
function toStudent(s: StudentRow, assessments: Assessment[], totals?: CoinTotalRow): Student {
  return {
    id: s.id,
    userId: s.user_id,
    name: s.name,
    email: s.email,
    set: s.math_set as MathSet,
    scores: [],
    lastMonthAvg: s.last_month_avg,
    lastMonthFormRank: s.last_month_form_rank,
    xp: s.xp,
    streak: s.streak,
    dailyMarks: totals?.daily_earned ?? 0,
    videoMarks: totals?.video_earned ?? 0,
    coinsSpent: totals?.spent ?? 0,
    rewardCoins: totals?.reward_earned ?? 0,
    checkinCoins: totals?.checkin_earned ?? 0,
    shopSpent: totals?.shop_spent ?? 0,
    assessments,
    hlcNo: s.hlc_no,
    className: s.class_name,
    classNo: s.class_no,
  };
}
/**
 * Works out the game for every student with the teacher's own access, then saves new rewards,
 * each student's private snapshot and the public leaderboards. Run after every Google Sheet
 * sync, or from the teacher bar.
 */
export async function publishGame(
  supabase: Client,
  now: Date = new Date(),
): Promise<PublishReport> {
  const [configResult, totalsResult, cosmeticsResult] = await Promise.all([
    supabase.from("system_config").select("double_mc_event_active").eq("id", true).maybeSingle(),
    supabase.from("student_coin_totals").select("*"),
    supabase.from("student_cosmetics").select("*"),
  ]);
  if (cosmeticsResult.error) {
    throw new Error(
      `Game tables are not set up yet (${cosmeticsResult.error.message}). Run supabase/sql/0010_game_data.sql in the Supabase SQL Editor.`,
    );
  }
  const config: SystemConfig = configResult.error
    ? DEFAULT_SYSTEM_CONFIG
    : { isDoubleMCEventActive: configResult.data?.double_mc_event_active === true };
  const [studentRows, assessmentRows, markRows, rewardRows] = await Promise.all([
    readAll<StudentRow>("the class list", (from, to) =>
      supabase.from("students").select("*").order("id").range(from, to),
    ),
    readAll<AssessmentRow>("assessment marks", (from, to) =>
      supabase
        .from("assessment_scores")
        .select("*")
        .order("student_id")
        .order("term")
        .order("kind")
        .order("label")
        .range(from, to),
    ),
    readAll<MarkRow>("lesson marks", (from, to) =>
      supabase.from("daily_marks").select("student_id, reason").order("id").range(from, to),
    ),
    readAll<RewardRow>("game rewards", (from, to) =>
      supabase
        .from("game_rewards")
        .select("*")
        .order("student_id")
        .order("source_key")
        .range(from, to),
    ),
  ]);
  const assessmentsByStudent = new Map<string, Assessment[]>();
  for (const row of assessmentRows) {
    const list = assessmentsByStudent.get(row.student_id);
    if (list) list.push(toAssessment(row));
    else assessmentsByStudent.set(row.student_id, [toAssessment(row)]);
  }
  const totals = new Map<string, CoinTotalRow>();
  for (const t of totalsResult.data ?? []) if (t.student_id) totals.set(t.student_id, t);
  const students = studentRows
    .filter((s) => s.math_set === "S2M3" || s.math_set === "S2M5")
    .map((s) => toStudent(s, assessmentsByStudent.get(s.id) ?? [], totals.get(s.id)));
  const ledger = rewardRows.flatMap((r) => {
    const e = ledgerFromRow(r);
    return e ? [e] : [];
  });
  const cosmetics = new Map<string, Cosmetics>(
    (cosmeticsResult.data ?? []).map((r) => [r.student_id, cosmeticsFromRow(r)]),
  );
  const voiceCounts = countVoiceMarks(markRows);
  // The public demo account must never see real students, so it is placed in the sandbox.
  const real = students.filter((s) => s.email !== DEMO_EMAIL);
  const demo = students.find((s) => s.email === DEMO_EMAIL);
  const realIds = new Set(real.map((s) => s.id));
  const world = buildGameWorld({
    students: real,
    config,
    ledger: ledger.filter((e) => realIds.has(e.studentId)),
    cosmetics,
    voiceCounts,
    rewardsSpendable: false,
    now,
  });
  const newRewards: LedgerEntry[] = [...world.added];
  const snapshots = [...world.snapshots.values()];
  if (demo) {
    const demoCosmetics = cosmetics.get(demo.id);
    const sandbox = buildGameWorld({
      students: [...MOCK_STUDENTS, demo],
      config,
      ledger: [...mockSeedLedger(), ...ledger.filter((e) => e.studentId === demo.id)],
      cosmetics: new Map<string, Cosmetics>([
        ...MOCK_COSMETICS,
        ...(demoCosmetics ? [[demo.id, demoCosmetics] as [string, Cosmetics]] : []),
      ]),
      voiceCounts: new Map<string, number>([
        ...MOCK_VOICE_COUNTS,
        [demo.id, voiceCounts.get(demo.id) ?? 0],
      ]),
      rewardsSpendable: false,
      now,
    });
    newRewards.push(...sandbox.added.filter((e) => e.studentId === demo.id));
    const demoSnapshot = sandbox.snapshots.get(demo.id);
    if (demoSnapshot) snapshots.push(demoSnapshot);
  }
  for (const part of chunk(newRewards.map(ledgerToRow), WRITE_CHUNK)) {
    const { error } = await supabase
      .from("game_rewards")
      .upsert(part, { onConflict: "student_id,source_key", ignoreDuplicates: true });
    if (error) throw new Error(`Could not save game rewards: ${error.message}`);
  }
  const publishedAt = now.toISOString();
  for (const part of chunk(snapshots, WRITE_CHUNK)) {
    const { error } = await supabase.from("game_snapshots").upsert(
      part.map((s) => ({
        student_id: s.studentId,
        math_set: s.set,
        payload: s as unknown as Json,
        generated_at: publishedAt,
      })),
      { onConflict: "student_id" },
    );
    if (error) throw new Error(`Could not save student game data: ${error.message}`);
  }
  const { error: boardError } = await supabase.from("game_leaderboards").upsert(
    world.boards.map((b) => ({
      id: b.id,
      scope: b.scope,
      metric: b.metric,
      term: b.term,
      payload: b as unknown as Json,
      generated_at: publishedAt,
    })),
    { onConflict: "id" },
  );
  if (boardError) throw new Error(`Could not save leaderboards: ${boardError.message}`);
  return {
    students: real.length,
    snapshots: snapshots.length,
    boards: world.boards.length,
    newRewards: newRewards.length,
    publishedAt,
  };
}
```

## File: src/lib/gamification/rules.ts
```typescript
import { chapterOfLabel, termSummary, type Assessment } from "@/lib/assessments";
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
  type TermResult,
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
/** How a term's academic result is made up (each part is out of 200). */
export const TERM_WEIGHTS = { tt: 0.2, ca: 0.4, exam: 0.4 } as const;
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
/** A mark scaled to /200, or null when absent, blank or 0 (a 0 is a formula waiting for marks). */
function scaled200(a: Assessment): number | null {
  if (a.absent || a.score === null || a.score <= 0) return null;
  const full = a.full_marks !== null && a.full_marks > 0 ? a.full_marks : 200;
  return round1((a.score / full) * 200);
}
/**
 * A term's result out of 200: 20% Term Test + 40% Continuous Assessment + 40% Exam.
 * - Term Test: the term's "1st TT" / "2nd TT" (or TnA1) column.
 * - CA: the sheet's TnA2 column; if the sheet has none, worked out from HW, SQ, CQ, Mock and Daily.
 * - Exam: the sheet's TnA3 column.
 * The total stays empty until all three parts have a mark.
 */
export function termResult(list: readonly Assessment[], term: 1 | 2): TermResult {
  const inTerm = list.filter((a) => a.term === term);
  const byLabel = (re: RegExp) =>
    inTerm.find((a) => re.test(a.label.trim()) && scaled200(a) !== null) ?? null;
  const ttRow =
    byLabel(new RegExp(`^(${term === 1 ? "1st" : "2nd"}\\s*TT|T${term}A1)\\b`, "i")) ??
    inTerm.find((a) => a.category === "term_test" && scaled200(a) !== null) ??
    null;
  const caRow = byLabel(new RegExp(`^T${term}A2\\b`, "i"));
  const examRow = byLabel(new RegExp(`^T${term}A3\\b`, "i"));
  const caItems = termSummary([...list], term);
  const caFromItems = caItems.parts.some((p) => p.value !== null) ? caItems.coursework200 : null;
  const tt = ttRow ? scaled200(ttRow) : null;
  const ca = caRow ? scaled200(caRow) : caFromItems;
  const exam = examRow ? scaled200(examRow) : null;
  const total =
    tt !== null && ca !== null && exam !== null
      ? round1(TERM_WEIGHTS.tt * tt + TERM_WEIGHTS.ca * ca + TERM_WEIGHTS.exam * exam)
      : null;
  return { term, tt, ca, exam, total };
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
      const terms = [termResult(assessments, 1), termResult(assessments, 2)];
      bases.set(s.id, {
        ...DEFAULT_COSMETICS,
        ...input.cosmetics?.get(s.id),
        set,
        t1Total: terms[0]?.total ?? null,
        t2Total: terms[1]?.total ?? null,
        termResults: terms,
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
/**
 * The Math Coins figure to show. Real students' balances come from the database (which already
 * counts saved rewards); sandbox students keep their rewards in the game profile.
 */
export function displayCoins(s: Student): number {
  return s.game?.rewardsSpendable ? s.game.mathCoins : coinBalance(s);
}
```

## File: src/lib/gamification/world.ts
```typescript
import type { MathSet, Student } from "@/lib/data";
import { CHAPTER_STRANDS, STRANDS, computeUnlocks } from "./catalog";
import {
  buildGameProfiles,
  homeworkFromAssessments,
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
export const SNAPSHOT_VERSION = 2;
/** A set's spread for one assessment is only shown when at least this many students sat it. */
export const MIN_DISTRIBUTION_COUNT = 5;
export const TOP_N = 10;
export const BOARD_SCOPES: BoardScope[] = ["S2M3", "S2M5", "S2"];
export const BOARD_METRICS: BoardMetric[] = ["total", "ca", "exp"];
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
function metricValue(profile: GameProfile, metric: BoardMetric, term: 1 | 2): number | null {
  if (metric === "exp") return profile.exp > 0 ? profile.exp : null;
  const result = profile.termResults.find((r) => r.term === term);
  if (!result) return null;
  return metric === "total" ? result.total : result.ca;
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
function studentItemValues(profile: GameProfile): ItemValue[] {
  const out: ItemValue[] = profile.quizHistory.map((q) => ({
    itemId: q.quizId,
    label: q.label,
    kind: q.kind,
    term: q.term,
    position: q.position,
    percent: q.percent,
  }));
  const parts: {
    key: "tt" | "ca" | "exam" | "total";
    kind: DistributionKind;
    label: (t: number) => string;
    position: number;
  }[] = [
    {
      key: "tt",
      kind: "TT",
      label: (t) => `${t === 1 ? "1st" : "2nd"} Term Test`,
      position: 90000,
    },
    { key: "ca", kind: "CA", label: (t) => `CA (T${t}A2)`, position: 90001 },
    { key: "exam", kind: "EXAM", label: (t) => `Exam (T${t}A3)`, position: 90002 },
    { key: "total", kind: "TOTAL", label: (t) => `Term ${t} total`, position: 90003 },
  ];
  for (const r of profile.termResults) {
    for (const p of parts) {
      const value = r[p.key];
      out.push({
        itemId: `${r.term}:${p.kind}`,
        label: p.label(r.term),
        kind: p.kind,
        term: r.term,
        position: p.position,
        percent: value === null ? null : value / 2,
      });
    }
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
    .map((m) => ({ ...m, score: metricValue(m.profile, metric, term) }))
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
      list.map((m) => ({ studentId: m.student.id, items: studentItemValues(m.profile) })),
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
```

## File: src/lib/coins.ts
```typescript
import { supabase } from "@/integrations/supabase/client";
import type { Student } from "./data";
export const COIN_NAME = "Math Coins";
export const COIN_NAME_ZH = "數學幣";
export const COIN_EMOJI = "🪙";
/** Coins for watching one chapter video to the end. */
export const VIDEO_COINS = 1;
export type MarkReason =
  | "classwork"
  | "participation"
  | "correct_answer"
  | "incorrect_answer"
  | "homework"
  | "bonus"
  | "deduction";
export interface ReasonInfo {
  id: MarkReason;
  label: string;
  zh: string;
}
export const REASONS: ReasonInfo[] = [
  { id: "correct_answer", label: "Correct answer", zh: "答啱問題" },
  { id: "incorrect_answer", label: "Tried to answer", zh: "有嘗試作答（0 分紀錄）" },
  { id: "classwork", label: "Classwork completed", zh: "完成課堂練習" },
  { id: "participation", label: "Great lesson performance", zh: "課堂表現好" },
  { id: "homework", label: "Homework on time", zh: "準時交齊功課" },
  { id: "bonus", label: "Bonus", zh: "其他獎勵" },
  { id: "deduction", label: "Deduction", zh: "扣分（欠交 / 違規）" },
];
export const QUICK_REASONS: ReasonInfo[] = REASONS.filter(
  (r) => r.id !== "correct_answer" && r.id !== "incorrect_answer",
);
export const QUICK_AMOUNTS = [-5, -2, -1, 1, 2, 5];
export function reasonLabel(id: string): string {
  return REASONS.find((r) => r.id === id)?.label ?? id;
}
type CoinFields = Pick<
  Student,
  "dailyMarks" | "videoMarks" | "coinsSpent" | "rewardCoins" | "checkinCoins" | "shopSpent"
>;
/** Everything earned: lesson marks, videos, game rewards and daily check-ins. */
export function coinsEarned(s: Partial<CoinFields>): number {
  return (
    (s.dailyMarks ?? 0) +
    (s.videoMarks ?? 0) * VIDEO_COINS +
    (s.rewardCoins ?? 0) +
    (s.checkinCoins ?? 0)
  );
}
/** Everything spent: reward tickets (not rejected) and Shop items. */
export function coinsSpentTotal(s: Partial<CoinFields>): number {
  return (s.coinsSpent ?? 0) + (s.shopSpent ?? 0);
}
/** The same sum as the database's coin_balance() function. */
export function coinBalance(s: Partial<CoinFields>): number {
  return coinsEarned(s) - coinsSpentTotal(s);
}
const STATUS = {
  pending: { label: "⏳ Pending teacher approval", cls: "bg-gold/25 text-gold-deep" },
  approved: { label: "🎟️ Approved, show your teacher", cls: "bg-primary/10 text-primary" },
  used: { label: "✅ Redeemed", cls: "bg-success/15 text-success" },
  rejected: { label: "❌ Rejected, coins returned", cls: "bg-muted text-muted-foreground" },
} as const;
export function redemptionStatus(status: string): { label: string; cls: string } {
  return (
    STATUS[status as keyof typeof STATUS] ?? {
      label: status,
      cls: "bg-muted text-muted-foreground",
    }
  );
}
/** Saves the same marks for every chosen student in one go and returns the new row ids (for undo). */
export async function giveCoins(input: {
  studentIds: string[];
  marks: number;
  reason: MarkReason;
  note: string;
}): Promise<string[]> {
  if (!input.studentIds.length) throw new Error("Choose at least one student first");
  if (!Number.isInteger(input.marks) || input.marks < -100 || input.marks > 100) {
    throw new Error("Marks must be a whole number from -100 to 100");
  }
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Please sign in with your teacher account again");
  const batchId = crypto.randomUUID();
  const { data, error } = await supabase
    .from("daily_marks")
    .insert(
      input.studentIds.map((studentId) => ({
        student_id: studentId,
        marks: input.marks,
        reason: input.reason,
        note: input.note.trim().slice(0, 200),
        awarded_by: userId,
        batch_id: batchId,
      })),
    )
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.id);
}
export async function deleteMarks(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await supabase
      .from("daily_marks")
      .delete()
      .in("id", ids.slice(i, i + 100));
    if (error) throw new Error(error.message);
  }
}
```

## File: src/lib/grade-rules.ts
```typescript
import { z } from "zod";
export const scoreSchema = z.number().int().min(0).max(100).nullable();
export const awardSchema = z.object({
  studentId: z.string().uuid(),
  marks: z.number().int().min(0).max(100),
  reason: z.enum(["classwork", "participation", "correct_answer", "incorrect_answer"]),
});
export const answerMarks = (correct: boolean) => (correct ? 1 : 0);
export const VIDEO_MARKS = 1;
export function parseScoreCsv(text: string) {
  const rows = new Map<string, (number | null)[]>();
  text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .forEach((line, index) => {
      const [email, ...cells] = line.split(",").map((v) => v.trim());
      if (index === 0 && email?.toLowerCase() === "email") return;
      if (!email?.includes("@") || cells.length !== 7)
        throw new Error(`Row ${index + 1}: expected email and seven scores.`);
      const key = email.toLowerCase();
      if (rows.has(key)) throw new Error(`Row ${index + 1}: duplicate email.`);
      rows.set(
        key,
        cells.map((v) => scoreSchema.parse(v === "" ? null : Number(v))),
      );
    });
  return rows;
}
```

## File: src/lib/math.functions.ts
```typescript
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { awardSchema, scoreSchema } from "./grade-rules";
export const saveScores = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .array(
        z.object({
          student_id: z.string().uuid(),
          chapter: z.number().int().min(1).max(7),
          score: scoreSchema,
        }),
      )
      .min(1)
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (!allowed) throw new Error("Teacher access required");
    const { error } = await context.supabase.from("chapter_scores").upsert(data);
    if (error) throw new Error(error.message);
    return { saved: data.length };
  });
export const awardMarks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => awardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (!allowed) throw new Error("Teacher access required");
    const { error } = await context.supabase
      .from("daily_marks")
      .insert({
        student_id: data.studentId,
        marks: data.marks,
        reason: data.reason,
        awarded_by: context.userId,
      });
    if (error) throw new Error(error.message);
    return { saved: true };
  });
```

## File: src/lib/video-watch.ts
```typescript
/** Share of a video a student must actually play (not skip) before the mark is awarded. */
export const REQUIRED_COVERAGE = 0.9;
/** Largest gap between two position samples still counted as continuous playback (allows up to 2x speed). */
const MAX_STEP_SECONDS = 2.5;
export type VideoSource = { kind: "youtube"; id: string } | { kind: "file"; url: string };
/** Recognise links that can be played and tracked inside the app: YouTube or a direct video file. */
export function parseVideoSource(raw: string): VideoSource | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const idOk = (id: string | null | undefined): id is string =>
    Boolean(id && /^[\w-]{11}$/.test(id));
  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return idOk(id) ? { kind: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (idOk(v)) return { kind: "youtube", id: v };
    const [, section, id] = url.pathname.split("/");
    return section && ["embed", "shorts", "live"].includes(section) && idOk(id)
      ? { kind: "youtube", id }
      : null;
  }
  if (/\.(mp4|webm|ogg|m4v)$/i.test(url.pathname)) return { kind: "file", url: url.toString() };
  return null;
}
/**
 * Records which whole seconds of a video were actually played. Jumps (seeking ahead)
 * are not counted, so a student cannot skip to the end to earn the mark.
 */
export function createWatchTracker() {
  const watched = new Set<number>();
  let last: number | null = null;
  return {
    /** Feed the current playback position while the video is playing. */
    tick(position: number) {
      if (last !== null) {
        const step = position - last;
        if (step > 0 && step <= MAX_STEP_SECONDS)
          for (let s = Math.floor(last); s < Math.floor(position); s++) watched.add(s);
      }
      last = position;
    },
    /** Call on pause, buffering or seeking so the next position starts a new stretch. */
    pause() {
      last = null;
    },
    coverage(duration: number) {
      return duration > 0 ? Math.min(1, watched.size / Math.floor(duration)) : 0;
    },
    reset() {
      watched.clear();
      last = null;
    },
  };
}
```

## File: src/routes/_authenticated/activity.tsx
```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, RotateCcw, Search, Undo2, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import {
  COIN_NAME,
  QUICK_AMOUNTS,
  QUICK_REASONS,
  coinBalance,
  deleteMarks,
  giveCoins,
  reasonLabel,
  type MarkReason,
} from "@/lib/coins";
import { sortByClass, type MathSet, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Class activity — HLC Math" },
      { name: "description", content: "Pick a student at random and record Math Coins." },
      { property: "og:title", content: "Class activity — HLC Math" },
      { property: "og:description", content: "Random student picker and quick Math Coins." },
    ],
  }),
  component: ActivityPage,
});
const SETS: MathSet[] = ["S2M3", "S2M5"];
const BALL_COLORS = [
  "var(--primary)",
  "var(--success)",
  "var(--gold-deep)",
  "var(--flame)",
  "var(--destructive)",
  "oklch(0.55 0.13 300)",
];
const PILE_ROWS = [5, 4, 3, 2];
const BALL_SIZE = 30;
const BALL_COUNT = 14;
const ANIMATION_CSS = `
.hlc-ball { position: absolute; left: 50%; top: 50%; width: ${BALL_SIZE}px; height: ${BALL_SIZE}px; margin: -${BALL_SIZE / 2}px 0 0 -${BALL_SIZE / 2}px; border-radius: 9999px; display: grid; place-items: center; font-size: 11px; font-weight: 700; color: white; box-shadow: inset -4px -4px 6px rgb(0 0 0 / 0.25), inset 3px 3px 5px rgb(255 255 255 / 0.45); transition: transform 0.4s ease; }
.hlc-ball[data-spin="true"] { animation: hlc-orbit var(--d) linear infinite; animation-delay: var(--delay); }
@keyframes hlc-orbit { from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); } }
.hlc-machine[data-spin="true"] { animation: hlc-shake 0.25s ease-in-out infinite; }
@keyframes hlc-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
.hlc-winner { animation: hlc-pop 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) both; }
@keyframes hlc-pop { 0% { transform: translateY(-60px) scale(0.4); opacity: 0; } 70% { transform: translateY(4px) scale(1.04); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
.hlc-confetti { position: absolute; left: 50%; top: 45%; width: 8px; height: 12px; border-radius: 2px; opacity: 0; animation: hlc-burst 1.3s cubic-bezier(0.15, 0.7, 0.3, 1) forwards; animation-delay: var(--delay); }
@keyframes hlc-burst { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--rot)); opacity: 0; } }
.hlc-ticker { animation: hlc-flick 0.12s linear infinite alternate; }
@keyframes hlc-flick { from { opacity: 0.6; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .hlc-ball[data-spin="true"], .hlc-machine[data-spin="true"], .hlc-winner, .hlc-ticker, .hlc-confetti { animation: none; } }
`;
function randomIndex(n: number): number {
  if (n <= 1) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) % n;
}
/** Where each ball rests at the bottom of the machine when it is not spinning. */
function pilePosition(i: number): { x: number; y: number } {
  let index = i;
  for (let row = 0; row < PILE_ROWS.length; row++) {
    const count = PILE_ROWS[row] ?? 0;
    if (index < count) {
      return { x: (index - (count - 1) / 2) * (BALL_SIZE + 2), y: 78 - row * (BALL_SIZE - 4) };
    }
    index -= count;
  }
  return { x: 0, y: 0 };
}
function ActivityPage() {
  const { students, coinsError } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const list = useMemo(() => sortByClass(students.filter((s) => s.set === set)), [students, set]);
  return (
    <AppShell>
      <TeacherOnly>
        <style>{ANIMATION_CSS}</style>
        <PageHeader
          title="Class activity"
          description={`Random student picker and quick ${COIN_NAME} for ${set}`}
          actions={
            <div className="flex rounded-md border border-border bg-card p-0.5">
              {SETS.map((x) => (
                <button
                  type="button"
                  key={x}
                  onClick={() => setSet(x)}
                  className={cn(
                    "rounded px-4 py-1.5 text-sm font-semibold",
                    set === x
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {x}
                </button>
              ))}
            </div>
          }
        />
        {coinsError && (
          <div className="mt-4">
            <Notice tone="error">{coinsError}</Notice>
          </div>
        )}
        <LuckyDraw key={`draw-${set}`} list={list} />
        <QuickPoints key={`points-${set}`} list={list} />
        <RecentActivity />
      </TeacherOnly>
    </AppShell>
  );
}
type Phase = "idle" | "spinning" | "revealed";
function LuckyDraw({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [ticker, setTicker] = useState("");
  const [winner, setWinner] = useState<Student | null>(null);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [noRepeat, setNoRepeat] = useState(true);
  const [sound, setSound] = useState(true);
  const [reward, setReward] = useState(1);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      void audio.current?.close();
    },
    [],
  );
  const spinning = phase === "spinning";
  const pool = noRepeat ? list.filter((s) => !drawn.includes(s.id)) : list;
  const live = winner ? (list.find((s) => s.id === winner.id) ?? winner) : null;
  const balls = useMemo(
    () =>
      Array.from({ length: BALL_COUNT }, (_, i) => ({
        label: list.length
          ? list[i % list.length]?.classNo || String((i % list.length) + 1)
          : String(i + 1),
        color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--primary)",
        radius: 28 + (i % 4) * 18,
        duration: 0.8 + (i % 5) * 0.2,
        delay: -(i * 0.37),
        pile: pilePosition(i),
      })),
    [list],
  );
  const confetti = useMemo(
    () =>
      Array.from({ length: burst ? 32 : 0 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 160;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60,
          rot: Math.random() * 720 - 360,
          color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--gold)",
          delay: Math.random() * 0.15,
        };
      }),
    [burst],
  );
  const beep = (freq: number, seconds: number, volume = 0.05) => {
    if (!sound) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + seconds);
    } catch {
      // Sound is optional; some browsers block it.
    }
  };
  const fanfare = () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => beep(f, 0.35, 0.07), i * 120);
    });
  };
  const draw = () => {
    if (spinning) return;
    if (!pool.length) {
      toast.info(
        list.length
          ? "Everyone has had a turn. Press Reset to start again."
          : "There are no students in this set yet.",
      );
      return;
    }
    const pick = pool[randomIndex(pool.length)];
    if (!pick) return;
    setPhase("spinning");
    setWinner(null);
    setSaved(null);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = reduced ? 3 : 20;
    let i = 0;
    const step = () => {
      i += 1;
      if (i >= steps) {
        setTicker(pick.name);
        setWinner(pick);
        setPhase("revealed");
        setDrawn((d) => (d.includes(pick.id) ? d : [...d, pick.id]));
        setBurst((b) => b + 1);
        fanfare();
        return;
      }
      setTicker(list[randomIndex(list.length)]?.name ?? "");
      beep(300 + i * 25, 0.05, 0.03);
      timer.current = setTimeout(step, 50 + Math.pow(i / steps, 2) * 380);
    };
    step();
  };
  const reset = () => {
    setDrawn([]);
    setWinner(null);
    setSaved(null);
    setPhase("idle");
  };
  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      setSaved(null);
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };
  const answer = async (correct: boolean) => {
    if (!winner) return;
    setBusy(true);
    try {
      const ids = await giveCoins({
        studentIds: [winner.id],
        marks: correct ? reward : 0,
        reason: correct ? "correct_answer" : "incorrect_answer",
        note: "Lucky draw",
      });
      await refresh();
      const message = correct
        ? `+${reward} ${COIN_NAME} for ${winner.name}`
        : `Answer recorded for ${winner.name}`;
      setSaved(message);
      toast.success(message, { action: { label: "Undo", onClick: () => void undo(ids) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel
      className="mt-6"
      title="Lucky draw"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={noRepeat}
              onChange={(e) => setNoRepeat(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            No repeats
          </label>
          <Button
            variant="ghost"
            size="icon"
            aria-label={sound ? "Turn sound off" : "Turn sound on"}
            onClick={() => setSound(!sound)}
          >
            {sound ? <Volume2 /> : <VolumeX />}
          </Button>
          <Button variant="outline" size="sm" onClick={reset} disabled={spinning || !drawn.length}>
            <RotateCcw /> Reset
          </Button>
        </div>
      }
    >
      <div className="grid items-center gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <div
            className="hlc-machine relative h-60 w-60 rounded-full border-4 border-primary/30 bg-gradient-to-b from-primary/5 to-primary/15"
            data-spin={spinning}
          >
            {balls.map((b, i) => (
              <span
                key={i}
                className="hlc-ball"
                data-spin={spinning}
                style={
                  {
                    background: b.color,
                    "--r": `${b.radius}px`,
                    "--d": `${b.duration}s`,
                    "--delay": `${b.delay}s`,
                    ...(spinning ? {} : { transform: `translate(${b.pile.x}px, ${b.pile.y}px)` }),
                  } as CSSProperties
                }
              >
                {b.label}
              </span>
            ))}
          </div>
          <div className="h-4 w-20 rounded-b-md bg-primary/30" />
          <Button
            size="lg"
            onClick={draw}
            disabled={spinning || !list.length}
            className="mt-4 h-12 w-full text-base font-semibold"
          >
            {spinning ? "Drawing…" : winner ? "Draw again" : "Draw a student"}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            {noRepeat
              ? `${pool.length} of ${list.length} students left`
              : `${list.length} students in the draw`}
          </p>
        </div>
        <div className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40 p-6 text-center">
          {phase === "idle" && (
            <p className="text-lg text-muted-foreground">Press Draw a student to begin.</p>
          )}
          {spinning && <p className="hlc-ticker text-4xl font-semibold md:text-6xl">{ticker}</p>}
          {phase === "revealed" && live && (
            <>
              <div key={burst} className="pointer-events-none absolute inset-0">
                {confetti.map((p, i) => (
                  <span
                    key={i}
                    className="hlc-confetti"
                    style={
                      {
                        background: p.color,
                        "--x": `${p.x}px`,
                        "--y": `${p.y}px`,
                        "--rot": `${p.rot}deg`,
                        "--delay": `${p.delay}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Selected student</p>
              <div className="hlc-winner mt-3 rounded-md border-2 border-gold bg-card px-8 py-5 shadow-chunky">
                <p className="text-4xl font-semibold md:text-6xl">{live.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {live.className} {live.classNo}, {coinBalance(live)} coins
                </p>
              </div>
              {saved ? (
                <p className="mt-5 flex items-center gap-1 font-semibold text-success">
                  <Check className="h-4 w-4" /> {saved}
                </p>
              ) : (
                <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
                  <div className="flex rounded-md border border-border bg-card p-0.5">
                    {[1, 2, 3].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setReward(n)}
                        className={cn(
                          "rounded px-3 py-1 text-sm font-semibold",
                          reward === n
                            ? "bg-success text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                  <Button
                    disabled={busy}
                    onClick={() => void answer(true)}
                    className="bg-success text-primary-foreground hover:bg-success/90"
                  >
                    <Check /> Correct +{reward}
                  </Button>
                  <Button disabled={busy} variant="outline" onClick={() => void answer(false)}>
                    <X /> Incorrect
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {noRepeat && drawn.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-muted-foreground">Already drawn:</span>
          {drawn.map((id) => (
            <span key={id} className="rounded bg-muted px-2 py-0.5">
              {list.find((s) => s.id === id)?.name ?? "?"}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}
function QuickPoints({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState<MarkReason>("classwork");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const q = query.trim().toLowerCase();
  const shown = q
    ? list.filter((s) =>
        `${s.name} ${s.className ?? ""}${s.classNo ?? ""} ${s.hlcNo ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : list;
  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  const chooseAmount = (n: number) => {
    const value = Number.isFinite(n) ? Math.max(-100, Math.min(100, Math.trunc(n))) : 0;
    setAmount(value);
    if (value < 0) setReason("deduction");
    else if (reason === "deduction") setReason("classwork");
  };
  const chooseReason = (r: MarkReason) => {
    setReason(r);
    if (r === "deduction" && amount > 0) setAmount(-amount);
    if (r !== "deduction" && amount < 0) setAmount(-amount);
  };
  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };
  const save = async () => {
    if (amount === 0) {
      toast.error("Choose an amount other than 0");
      return;
    }
    setBusy(true);
    try {
      const count = selected.length;
      const ids = await giveCoins({ studentIds: selected, marks: amount, reason, note });
      await refresh();
      setSelected([]);
      setNote("");
      toast.success(
        `${amount > 0 ? "+" : ""}${amount} ${COIN_NAME} saved for ${count} student${count === 1 ? "" : "s"}`,
        { action: { label: "Undo", onClick: () => void undo(ids) } },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Panel
      className="mt-6"
      title={`Quick ${COIN_NAME}`}
      description="Tick students, choose an amount and a reason, then save."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search students"
              className="w-32 bg-transparent text-sm outline-none"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected([...new Set([...selected, ...shown.map((s) => s.id)])])}
          >
            Select all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected([])}
            disabled={!selected.length}
          >
            Clear
          </Button>
        </div>
      }
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">There are no students in this set yet.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s) => {
            const on = selected.includes(s.id);
            return (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-2.5 transition-colors",
                  on ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                  className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.className} {s.classNo}
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {coinBalance(s)}
                </span>
              </label>
            );
          })}
        </div>
      )}
      <div className="sticky bottom-3 mt-4 flex flex-wrap items-end gap-3 rounded-md border border-border bg-card p-3 shadow-lg">
        <div>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Amount</p>
          <div className="flex flex-wrap items-center gap-1">
            {QUICK_AMOUNTS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => chooseAmount(n)}
                className={cn(
                  "min-w-10 rounded px-2 py-1.5 text-sm font-semibold",
                  amount === n
                    ? n < 0
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-success text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {n > 0 ? `+${n}` : n}
              </button>
            ))}
            <input
              type="number"
              min={-100}
              max={100}
              value={amount}
              aria-label="Custom amount"
              onChange={(e) => chooseAmount(Number(e.target.value))}
              className="w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <label className="text-xs font-semibold text-muted-foreground">
          Reason
          <select
            value={reason}
            onChange={(e) => chooseReason(e.target.value as MarkReason)}
            className="mt-1 block rounded-md border border-input bg-card p-2 text-sm font-normal text-foreground"
          >
            {QUICK_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-40 flex-1 text-xs font-semibold text-muted-foreground">
          Note (optional)
          <input
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ex 5B Q1–6"
            className="mt-1 block w-full rounded-md border border-input bg-card p-2 text-sm font-normal text-foreground"
          />
        </label>
        <Button
          disabled={busy || !selected.length || amount === 0}
          onClick={() => void save()}
          className={cn(
            "h-10",
            amount < 0 && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          )}
        >
          {busy
            ? "Saving…"
            : `Give ${amount > 0 ? "+" : ""}${amount} to ${selected.length} student${selected.length === 1 ? "" : "s"}`}
        </Button>
      </div>
    </Panel>
  );
}
interface LogGroup {
  key: string;
  ids: string[];
  studentIds: string[];
  marks: number;
  reason: string;
  note: string;
  at: string;
}
function RecentActivity() {
  const { markLog, students, refresh } = useApp();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const names = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const groups = useMemo(() => {
    const out: LogGroup[] = [];
    const index = new Map<string, number>();
    for (const m of markLog) {
      const key = m.batch_id ?? m.id;
      const at = index.get(key);
      const group = at === undefined ? undefined : out[at];
      if (group) {
        group.ids.push(m.id);
        group.studentIds.push(m.student_id);
      } else {
        index.set(key, out.length);
        out.push({
          key,
          ids: [m.id],
          studentIds: [m.student_id],
          marks: m.marks,
          reason: m.reason,
          note: m.note ?? "",
          at: m.created_at,
        });
      }
    }
    return out.slice(0, 12);
  }, [markLog]);
  const undo = async (g: LogGroup) => {
    const who = g.studentIds.map((id) => names.get(id) ?? "?").join(", ");
    if (
      !window.confirm(
        `Undo ${g.marks > 0 ? "+" : ""}${g.marks} (${reasonLabel(g.reason)}) for ${who}?`,
      )
    )
      return;
    setBusyKey(g.key);
    try {
      await deleteMarks(g.ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    } finally {
      setBusyKey(null);
    }
  };
  return (
    <Panel className="mt-6" title="Recent activity" bodyClassName="px-5 py-2">
      {groups.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No {COIN_NAME} given yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {groups.map((g) => {
            const who = g.studentIds.map((id) => names.get(id) ?? "?");
            return (
              <li key={g.key} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {new Date(g.at).toLocaleString("en-HK", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={cn(
                    "w-12 rounded text-center font-semibold tabular-nums",
                    g.marks > 0
                      ? "bg-success/15 text-success"
                      : g.marks < 0
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {g.marks > 0 ? `+${g.marks}` : g.marks}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{reasonLabel(g.reason)}</span>
                  {g.note && <span className="text-muted-foreground">, {g.note}</span>}
                  <span className="block truncate text-xs text-muted-foreground">
                    {who.slice(0, 5).join(", ")}
                    {who.length > 5 ? ` and ${who.length - 5} more` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyKey === g.key}
                  onClick={() => void undo(g)}
                >
                  <Undo2 /> Undo
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
```

## File: src/lib/gamification/types.ts
```typescript
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
```

## File: src/lib/nav.ts
```typescript
import {
  Archive,
  BookOpen,
  ClipboardList,
  Dices,
  Gift,
  LayoutDashboard,
  Medal,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";
/** Pages that exist today. Add a path here when its route file is created. */
export type LiveRoute =
  | "/dashboard"
  | "/courses"
  | "/homework"
  | "/awards"
  | "/teacher"
  | "/activity"
  | "/upload"
  | "/leaderboard"
  | "/profile"
  | "/shop"
  | "/badges"
  | "/mistake-vault"
  | "/gacha";
/**
 * A navigation entry. "soon" entries are pages planned for the next steps: real students
 * never see them, a teacher previewing the student site sees them greyed out.
 */
export type NavItem =
  | { status: "live"; to: LiveRoute; label: string; icon: LucideIcon }
  | { status: "soon"; path: string; label: string; icon: LucideIcon };
export const STUDENT_NAV: NavItem[] = [
  { status: "live", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { status: "live", to: "/courses", label: "Chapters", icon: BookOpen },
  { status: "live", to: "/homework", label: "Homework", icon: ClipboardList },
  { status: "live", to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { status: "live", to: "/mistake-vault", label: "Mistake Vault", icon: Archive },
  { status: "live", to: "/badges", label: "Badges", icon: Medal },
  { status: "live", to: "/shop", label: "Shop", icon: Store },
  { status: "live", to: "/gacha", label: "Gacha", icon: Sparkles },
];
export const TEACHER_NAV: NavItem[] = [
  { status: "live", to: "/teacher", label: "Analytics", icon: Users },
  { status: "live", to: "/homework", label: "Homework", icon: ClipboardList },
  { status: "live", to: "/activity", label: "Class activity", icon: Dices },
  { status: "live", to: "/upload", label: "Content", icon: Upload },
  { status: "live", to: "/mistake-vault", label: "Exam dates", icon: Timer },
  { status: "live", to: "/awards", label: "Awards", icon: Gift },
  { status: "live", to: "/leaderboard", label: "Rankings", icon: Trophy },
];
export function navKey(item: NavItem): string {
  return item.status === "live" ? item.to : item.path;
}
/** Real students only see pages that exist; a teacher previewing also sees what is coming. */
export function visibleNav(items: readonly NavItem[], showSoon: boolean): NavItem[] {
  return showSoon ? [...items] : items.filter((i) => i.status === "live");
}
```

## File: src/lib/sheet-parse.ts
```typescript
// Pure rules for turning the teacher's Google Sheet tab into student records.
export type Category =
  | "homework"
  | "short_quiz"
  | "chapter_quiz"
  | "term_test"
  | "mock"
  | "exam"
  | "daily"
  | "overall"
  | "other";
export type MathSet = "S2M3" | "S2M5";
export interface ParsedScore {
  term: 1 | 2;
  kind: "item" | "summary";
  category: Category;
  label: string;
  score: number | null;
  absent: boolean;
  full_marks: number | null;
  position: number;
}
export interface ParsedStudent {
  hlcNo: string;
  email: string;
  name: string;
  className: string;
  classNo: string;
  set: MathSet;
  scores: ParsedScore[];
}
type Cell = string | number | boolean | null | undefined;
const text = (c: Cell) => (c === null || c === undefined ? "" : String(c)).trim();
const isFormula = (c: Cell) => typeof c === "string" && c.trim().startsWith("=");
const HLC_NO = /^HLC\d+$/i;
const HLC_HEADING = /^hlc\s*no\.?$/i;
const FULL_MARKS_HEADING = /^(full\s*marks?|max\.?\s*marks?|滿分)$/i;
const WEIGHT_HEADER = /\(\s*\d+(?:\.\d+)?\s*%\s*\)\s*$/;
// Column G. A = HLC no., B = Class, C = No., D = Name in English, E = 姓名, F = Sex.
const FIRST_SCORE_COLUMN = 6;
export function toNumber(c: Cell): number | null {
  if (typeof c === "number") return Number.isFinite(c) ? c : null;
  const t = text(c).replace(/%$/, "").replace(/,/g, "");
  if (!t || t.startsWith("#") || t === "-" || t === "—" || /^n\/?a$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
export function isAbsent(c: Cell) {
  const t = text(c).toUpperCase().replace(/\.$/, "");
  return t === "ABS" || t === "ABSENT";
}
/** "Homework (30%)" -> 30, "1st TT (200)" -> 200, "HW(30)" -> 30. */
export function bracketMarks(header: string): number | null {
  const m = header.match(/\(\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/);
  return m ? Number(m[1]) : null;
}
export function itemCategory(label: string, group = ""): Category {
  const l = label.toLowerCase().trim();
  const g = group.toLowerCase().trim();
  const combined = `${g} ${l}`;
  if (/^hw|\bhw\b|homework|assignment|worksheet|\bws\b|\bex\b|\bch\d*\s*hw/i.test(combined)) {
    return "homework";
  }
  if (/^sq|\bsq\b|short\s*quiz|s\.?q\.?\d/i.test(combined)) {
    return "short_quiz";
  }
  if (/^cq|\bcq\b|chapter\s*quiz|ch\.?\s*quiz|c\.?q\.?\d|post-summer|quiz/i.test(combined)) {
    return "chapter_quiz";
  }
  if (/\btt\b|term\s*test|t\da1|\but\b|unit\s*test|uniform\s*test/i.test(combined)) {
    return "term_test";
  }
  if (/mock/i.test(combined)) {
    return "mock";
  }
  if (/exam|t\da3/i.test(combined)) {
    return "exam";
  }
  return "other";
}
export function summaryCategory(header: string): Category {
  const h = header.toLowerCase().trim();
  if (/^t\da2|annual|overall|coursework/i.test(h)) return "overall";
  if (/^t\da1|\btt\b|term\s*test/i.test(h)) return "term_test";
  if (/^t\da3|exam/i.test(h) && !/mock/i.test(h)) return "exam";
  if (/homework|^hw|\bhw\b/i.test(h)) return "homework";
  if (/short\s*quiz|^sq|\bsq\b/i.test(h)) return "short_quiz";
  if (/chapter\s*quiz|^cq|\bcq\b/i.test(h)) return "chapter_quiz";
  if (/mock/i.test(h)) return "mock";
  if (/daily/i.test(h)) return "daily";
  return "other";
}
const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);
function isSummaryHeaderName(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  if (/^daily/i.test(clean)) return true;
  if (
    /^(homework|short\s*quiz|chapter\s*quiz|mock(\s*exam)?|1st\s*tt|2nd\s*tt|t\da\d|annual|overall)\b/i.test(
      clean,
    )
  ) {
    return bracketMarks(clean) !== null;
  }
  return WEIGHT_HEADER.test(clean);
}
/** A weighted coursework column such as "Homework (30%)" or "Daily (10%)". */
function isWeightHeader(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  return /^daily/i.test(clean) || WEIGHT_HEADER.test(clean);
}
/**
 * formulas: the tab read with formulas kept (tells typed marks apart from calculated columns).
 * values: the same tab read as calculated values.
 */
export function parseSetTab(set: MathSet, formulas: Cell[][], values: Cell[][]): ParsedStudent[] {
  const gridF = formulas.length ? formulas : values;
  const gridV = values.length ? values : formulas;
  // Only trust "is this cell a formula?" when the source really kept formulas.
  const hasFormulaInfo = gridF.some((r) => r?.some((c) => isFormula(c)));
  let itemRow = gridF.findIndex((r) => HLC_HEADING.test(text(r?.[0])));
  if (itemRow < 0) {
    itemRow = gridF.findIndex((r) => r?.some((c) => HLC_HEADING.test(text(c))));
  }
  if (itemRow < 0) {
    const firstStudentIdx = gridF.findIndex((r) => HLC_NO.test(text(r?.[0])));
    if (firstStudentIdx > 0) itemRow = firstStudentIdx - 1;
  }
  if (itemRow < 0) {
    throw new Error(`${set}: could not find the "HLC no." heading in column A`);
  }
  const groupRow = itemRow > 0 ? itemRow - 1 : itemRow;
  const fullRow = gridF.findIndex(
    (r, idx) => idx !== itemRow && r?.some((c) => FULL_MARKS_HEADING.test(text(c))),
  );
  const studentRows = gridF
    .map((r, i) => ({ r, i }))
    .filter((x) => x.i > itemRow && HLC_NO.test(text(x.r?.[0])));
  const width = Math.max(
    0,
    ...gridF.map((r) => r?.length ?? 0),
    ...gridV.map((r) => r?.length ?? 0),
  );
  const header = (row: number, c: number) => (row >= 0 ? text(gridF[row]?.[c]) : "");
  const emailCol =
    [groupRow, itemRow]
      .map((row) => (gridF[row] ?? []).findIndex((c) => /e-?mail/i.test(text(c))))
      .find((i) => i >= 0) ?? -1;
  type Col = Omit<ParsedScore, "score" | "absent"> & { col: number };
  const cols: Col[] = [];
  const usedLabels = new Map<string, number>();
  let term: 1 | 2 = 1;
  let activeGroup = "";
  for (let c = FIRST_SCORE_COLUMN; c < width; c++) {
    if (c === emailCol) continue;
    const rawGroup = header(groupRow, c);
    const name = header(itemRow, c);
    // Merged group headings only fill their first cell, so carry them to the right.
    if (rawGroup) activeGroup = isSummaryHeaderName(rawGroup) ? "" : rawGroup;
    const group = rawGroup || activeGroup;
    let formulaCells = 0;
    let typedCells = 0;
    for (const s of studentRows) {
      const cell = s.r?.[c];
      if (isFormula(cell)) formulaCells++;
      else if (text(cell) !== "") typedCells++;
    }
    const computedByFormula = formulaCells > 0 && formulaCells >= typedCells;
    const computed = hasFormulaInfo
      ? computedByFormula || isWeightHeader(name) || (!name && isWeightHeader(rawGroup))
      : isSummaryHeaderName(name) || (!name && isSummaryHeaderName(rawGroup));
    if (/^t2|2nd/i.test(name) || /^t2|2nd/i.test(rawGroup)) term = 2;
    if (name && !computed && !name.includes("_%") && !name.startsWith("#")) {
      const fullFromRow = fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null;
      const full = fullFromRow ?? bracketMarks(name);
      // Two columns with the same heading are both kept instead of one silently disappearing.
      const key = `${term}|item|${name}`;
      const seen = (usedLabels.get(key) ?? 0) + 1;
      usedLabels.set(key, seen);
      cols.push({
        col: c,
        term,
        kind: "item",
        category: itemCategory(name, group),
        label: seen === 1 ? name : `${name} (${seen})`,
        full_marks: full,
        position: c,
      });
    } else {
      const label = name && bracketMarks(name) !== null ? name : rawGroup || name;
      const full = bracketMarks(label) ?? (fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null);
      const key = `${term}|summary|${label}`;
      if (label && full !== null && !label.startsWith("#") && !usedLabels.has(key)) {
        usedLabels.set(key, 1);
        cols.push({
          col: c,
          term,
          kind: "summary",
          category: summaryCategory(label),
          label,
          full_marks: full,
          position: c,
        });
      }
    }
    if (/^t1a3/i.test(rawGroup) || /^t1a3/i.test(name)) term = 2;
  }
  return studentRows.map(({ r, i }) => {
    const hlcNo = text(r[0]).toUpperCase();
    const typedEmail = emailCol >= 0 ? text(r[emailCol]).toLowerCase() : "";
    return {
      hlcNo,
      set,
      email: typedEmail.includes("@") ? typedEmail : `${hlcNo.toLowerCase()}@hlc.edu.hk`,
      name: text(r[3]) || hlcNo,
      className: text(r[1]),
      classNo: text(r[2]),
      scores: cols.flatMap(({ col, ...meta }) => {
        const raw = gridV[i]?.[col];
        const absent = isAbsent(raw);
        const score = round1(toNumber(raw));
        if (meta.kind === "summary" && score === null) return [];
        if (meta.category === "other" && score === null && !absent) return [];
        return [{ ...meta, score, absent }];
      }),
    };
  });
}
```

## File: src/lib/lovable-error-reporting.ts
```typescript
export function reportLovableError(_error: unknown, _context: Record<string, unknown> = {}) {
    // No-op: Lovable error reporting has been removed.
  }
```

## File: src/lib/assessments.ts
```typescript
import type { Category } from "./sheet-parse";
export interface Assessment {
  term: number;
  kind: "item" | "summary";
  category: Category;
  label: string;
  score: number | null;
  absent: boolean;
  full_marks: number | null;
  position: number;
}
export const ITEM_CATEGORIES: { id: Category; label: string }[] = [
  { id: "homework", label: "Homework" },
  { id: "short_quiz", label: "Short Quiz" },
  { id: "chapter_quiz", label: "Chapter Quiz" },
  { id: "term_test", label: "Term Test" },
  { id: "mock", label: "Mock Exam" },
  { id: "exam", label: "Exam" },
];
/** Coursework weights from the teacher's sheet: total out of 100, doubled to /200 (T1A2). */
export const WEIGHTS = [
  { id: "homework", label: "Homework", weight: 30 },
  { id: "short_quiz", label: "Short Quiz", weight: 20 },
  { id: "chapter_quiz", label: "Chapter Quiz", weight: 30 },
  { id: "mock", label: "Mock Exam", weight: 10 },
  { id: "daily", label: "Daily", weight: 10 },
] as const satisfies readonly { id: Category; label: string; weight: number }[];
const round1 = (n: number) => Math.round(n * 10) / 10;
const QUIZ_CATEGORIES: Category[] = ["short_quiz", "chapter_quiz"];
/** Ways a column heading can name its chapter. The first pattern that matches wins. */
const CHAPTER_PATTERNS: RegExp[] = [
  /\bch(?:apter)?\s*\.?\s*(\d{1,2})(?!\d)/i, // "Ch1", "Ch.1", "Chapter 1", "SQ Ch2"
  /^(?:SQ|CQ|HW|Q|QUIZ|WS|EX)\s*[-_.]?\s*(\d{1,2})\s*[.\-_]\s*\d+/i, // "SQ1.1", "CQ 2-1", "HW3.2"
  /^(?:SQ|CQ|QUIZ|Q)\s*[-_.]?\s*(\d{1,2})$/i, // "SQ1", "CQ 2", "Quiz 3"
  /^(\d{1,2})\s*\.\s*\d+$/, // "1.1" under an SQ / CQ group heading
];
export function percent(a: Pick<Assessment, "score" | "full_marks">) {
  if (a.score === null) return null;
  if (a.full_marks && a.full_marks > 0) {
    return Math.round((a.score / a.full_marks) * 100);
  }
  return a.score >= 0 && a.score <= 100 ? Math.round(a.score) : null;
}
export function termsOf(list: Assessment[]) {
  return [...new Set(list.map((a) => a.term))].sort();
}
export function chapterOfLabel(label: string, maxChapter = 7): number | null {
  const t = label.trim();
  for (const re of CHAPTER_PATTERNS) {
    const n = Number(re.exec(t)?.[1]);
    if (Number.isInteger(n) && n >= 1 && n <= maxChapter) return n;
  }
  return null;
}
function markedPercent(a: Assessment): number | null {
  if (a.absent || a.score === null || a.full_marks === null || a.full_marks <= 0) return null;
  return (a.score / a.full_marks) * 100;
}
function chapterAverage(
  list: Assessment[],
  categories: Category[],
  chapter: number,
  maxChapter: number,
): number | null {
  const values = list
    .filter(
      (a) =>
        a.kind === "item" &&
        categories.includes(a.category) &&
        chapterOfLabel(a.label, maxChapter) === chapter,
    )
    .map(markedPercent)
    .filter((p): p is number => p !== null);
  return values.length ? Math.round(values.reduce((x, y) => x + y, 0) / values.length) : null;
}
/**
 * Chapter score from the Google Sheet: the average percentage of that chapter's short quizzes
 * and chapter quizzes; if a chapter has no quiz yet, its homework average is used instead.
 */
export function chapterScoresFromAssessments(list: Assessment[], chapters = 7): (number | null)[] {
  return Array.from(
    { length: chapters },
    (_, i) =>
      chapterAverage(list, QUIZ_CATEGORIES, i + 1, chapters) ??
      chapterAverage(list, ["homework"], i + 1, chapters),
  );
}
/** Quiz columns whose heading does not name a chapter, so they cannot count towards Ch1–Ch7. */
export function unmatchedChapterLabels(list: Assessment[], chapters = 7): string[] {
  return [
    ...new Set(
      list
        .filter(
          (a) =>
            a.kind === "item" &&
            QUIZ_CATEGORIES.includes(a.category) &&
            chapterOfLabel(a.label, chapters) === null,
        )
        .map((a) => a.label),
    ),
  ].sort();
}
/** Average of marked items (absent and blank ignored, like the sheet's AVERAGE) times the category weight. */
export function contribution(
  list: Assessment[],
  term: number,
  category: Category,
  weight: number,
): number | null {
  if (category === "daily") {
    const d = list.find((a) => a.term === term && a.kind === "summary" && a.category === "daily");
    return d?.score ?? null;
  }
  const withFull = list.filter(
    (a) =>
      a.term === term &&
      a.kind === "item" &&
      a.category === category &&
      !a.absent &&
      a.score !== null &&
      a.full_marks &&
      a.full_marks > 0,
  );
  if (withFull.length > 0) {
    const ratios = withFull.map((a) => (a.score as number) / (a.full_marks as number));
    return round1((ratios.reduce((x, y) => x + y, 0) / ratios.length) * weight);
  }
  const summaryItem = list.find(
    (a) => a.term === term && a.kind === "summary" && a.category === category && a.score !== null,
  );
  if (summaryItem && summaryItem.score !== null) {
    return round1(summaryItem.score);
  }
  return null;
}
export function termSummary(list: Assessment[], term: number) {
  const parts = WEIGHTS.map((w) => ({ ...w, value: contribution(list, term, w.id, w.weight) }));
  const sum = parts.reduce((t, p) => t + (p.value ?? 0), 0);
  return { parts, coursework200: round1(sum * 2) };
}
```

## File: src/lib/sheets.functions.ts
```typescript
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { publishGame, type PublishReport } from "./gamification/publish";
import { parseSetTab, type MathSet, type ParsedStudent } from "./sheet-parse";
const SPREADSHEET_ID = "1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8";
const GOOGLE_SHEETS_API_URL = "https://sheets.googleapis.com/v4";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
// The xlsx export keeps every tab, the real cell values and the formulas. The gviz CSV endpoint
// does not: it blanks out text in mostly-numeric columns, which wipes the "SQ1.1" heading row.
const PUBLIC_XLSX_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`;
const TABS: MathSet[] = ["S2M3", "S2M5"];
const MAX_ROWS = 1000;
const MAX_COLS = 400;
const WRITE_CHUNK = 500;
const DELETE_CHUNK = 100;
type Cell = string | number | boolean | null;
type Grid = Cell[][];
export type SheetSource = "service_account" | "api_key" | "public_xlsx";
export interface TabReport {
  set: MathSet;
  students: number;
  term1Items: number;
  term2Items: number;
  scores: number;
}
export interface SyncReport {
  source: SheetSource;
  students: number;
  scores: number;
  syncedAt: string;
  tabs: TabReport[];
  duplicates: string[];
  /** Ranks, charts and leaderboards published for students after the sync. */
  game: PublishReport | null;
  /** Why publishing game data failed; the marks themselves were still saved. */
  gameError: string | null;
}
interface SheetGrids {
  formulas: Grid[];
  values: Grid[];
  source: SheetSource;
}
interface XlsxCell {
  t?: string;
  v?: unknown;
  w?: string;
  f?: string;
}
type XlsxSheet = Record<string, unknown>;
interface XlsxRange {
  s: { r: number; c: number };
  e: { r: number; c: number };
}
interface XlsxModule {
  read: (
    data: Uint8Array,
    opts: Record<string, unknown>,
  ) => { SheetNames: string[]; Sheets: Record<string, XlsxSheet | undefined> };
  utils: {
    decode_range: (ref: string) => XlsxRange;
    encode_cell: (cell: { r: number; c: number }) => string;
  };
}
let cachedAccessToken: { token: string; expiresAt: number } | null = null;
function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
function cleanEnv(raw: string | undefined): string {
  return (raw ?? "").trim().replace(/^['"]|['"]$/g, "");
}
function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}
function normalizePrivateKey(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("{")) {
    try {
      const parsed = JSON.parse(cleaned) as { private_key?: string };
      if (parsed.private_key) cleaned = parsed.private_key;
    } catch {
      // Not JSON: treat the value as the key itself.
    }
  }
  return cleaned.replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n");
}
function extractClientEmail(emailRaw: string | undefined, keyRaw: string | undefined): string {
  if (keyRaw && keyRaw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(keyRaw.trim()) as { client_email?: string };
      if (parsed.client_email) return parsed.client_email.trim();
    } catch {
      // Not JSON: fall back to the separate email variable.
    }
  }
  return cleanEnv(emailRaw);
}
async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 60 > now) {
    return cachedAccessToken.token;
  }
  const { createSign } = await import("node:crypto");
  const privateKey = normalizePrivateKey(privateKeyRaw);
  const cleanEmail = extractClientEmail(clientEmail, privateKeyRaw);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: cleanEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  ).toString("base64url");
  const unsignedJwt = `${header}.${claimSet}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${unsignedJwt}.${signature}`;
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `Service account (${cleanEmail}) could not sign in [${res.status}]: ${errText.slice(0, 200)}`,
    );
  }
  const tokenData = (await res.json()) as { access_token: string; expires_in?: number };
  cachedAccessToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in ?? 3600),
  };
  return tokenData.access_token;
}
async function readTabsViaApi(
  render: "FORMULA" | "UNFORMATTED_VALUE",
  headers: Record<string, string>,
  extraQuery = "",
): Promise<Grid[]> {
  const ranges = TABS.map((t) => `ranges=${encodeURIComponent(`'${t}'!A1:ZZ${MAX_ROWS}`)}`).join(
    "&",
  );
  const url = `${GOOGLE_SHEETS_API_URL}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges}&valueRenderOption=${render}&majorDimension=ROWS${extraQuery}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API read failed [${res.status}]: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { valueRanges?: { values?: Grid }[] };
  return TABS.map((_, i) => json.valueRanges?.[i]?.values ?? []);
}
async function loadXlsx(): Promise<XlsxModule> {
  const mod = (await import("xlsx")) as unknown as Partial<XlsxModule> & { default?: XlsxModule };
  if (typeof mod.read === "function" && mod.utils) return mod as XlsxModule;
  if (mod.default && typeof mod.default.read === "function") return mod.default;
  throw new Error("The xlsx reader could not be loaded. Run npm install and try again.");
}
function cellValue(cell: XlsxCell | undefined): Cell {
  if (!cell) return null;
  if (cell.t === "e") return typeof cell.w === "string" ? cell.w : "#ERROR";
  const v = cell.v;
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  return null;
}
function sheetToGrids(XLSX: XlsxModule, sheet: XlsxSheet): { formulas: Grid; values: Grid } {
  const ref = sheet["!ref"];
  if (typeof ref !== "string" || ref === "") return { formulas: [], values: [] };
  const range = XLSX.utils.decode_range(ref);
  const lastRow = Math.min(range.e.r, MAX_ROWS - 1);
  const lastCol = Math.min(range.e.c, MAX_COLS - 1);
  const formulas: Grid = [];
  const values: Grid = [];
  // Always start from A1 so row and column numbers line up with the sheet.
  for (let r = 0; r <= lastRow; r++) {
    const formulaRow: Cell[] = [];
    const valueRow: Cell[] = [];
    for (let c = 0; c <= lastCol; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })] as XlsxCell | undefined;
      const value = cellValue(cell);
      valueRow.push(value);
      formulaRow.push(cell && typeof cell.f === "string" && cell.f !== "" ? `=${cell.f}` : value);
    }
    formulas.push(formulaRow);
    values.push(valueRow);
  }
  return { formulas, values };
}
async function readPublicWorkbook(): Promise<{ formulas: Grid[]; values: Grid[] }> {
  const res = await fetch(PUBLIC_XLSX_URL, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Could not download the spreadsheet (HTTP ${res.status})`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  // A real .xlsx file is a zip archive and starts with "PK"; a Google login page is HTML.
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(
      'Google did not allow the spreadsheet to be downloaded. Set sharing to "Anyone with the link: Viewer" and make sure viewers are allowed to download.',
    );
  }
  const XLSX = await loadXlsx();
  const workbook = XLSX.read(bytes, {
    type: "array",
    cellFormula: true,
    cellText: true,
    cellDates: false,
  });
  const formulas: Grid[] = [];
  const values: Grid[] = [];
  for (const tab of TABS) {
    const sheetName = workbook.SheetNames.find((n) => n.trim().toUpperCase() === tab.toUpperCase());
    const sheet = sheetName === undefined ? undefined : workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`The spreadsheet has no tab called "${tab}"`);
    const grids = sheetToGrids(XLSX, sheet);
    formulas.push(grids.formulas);
    values.push(grids.values);
  }
  return { formulas, values };
}
async function loadAllSheetGrids(): Promise<SheetGrids> {
  const failures: string[] = [];
  const serviceEmail =
    process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] || process.env["VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const privateKey = process.env["GOOGLE_PRIVATE_KEY"] || process.env["VITE_GOOGLE_PRIVATE_KEY"];
  const sheetsApiKey = cleanEnv(
    process.env["GOOGLE_SHEETS_API_KEY"] || process.env["VITE_GOOGLE_SHEETS_API_KEY"],
  );
  if (serviceEmail && privateKey) {
    try {
      const accessToken = await getServiceAccountAccessToken(serviceEmail, privateKey);
      const headers = { Authorization: `Bearer ${accessToken}` };
      const [formulas, values] = await Promise.all([
        readTabsViaApi("FORMULA", headers),
        readTabsViaApi("UNFORMATTED_VALUE", headers),
      ]);
      return { formulas, values, source: "service_account" };
    } catch (err) {
      failures.push(`Service account: ${errorMessage(err)}`);
    }
  }
  if (sheetsApiKey) {
    try {
      const query = `&key=${encodeURIComponent(sheetsApiKey)}`;
      const [formulas, values] = await Promise.all([
        readTabsViaApi("FORMULA", {}, query),
        readTabsViaApi("UNFORMATTED_VALUE", {}, query),
      ]);
      return { formulas, values, source: "api_key" };
    } catch (err) {
      failures.push(`API key: ${errorMessage(err)}`);
    }
  }
  try {
    const grids = await readPublicWorkbook();
    return { ...grids, source: "public_xlsx" };
  } catch (err) {
    failures.push(`Public link: ${errorMessage(err)}`);
  }
  throw new Error(`Could not read the Google Sheet. ${failures.join("; ")}`);
}
export const syncGoogleSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SyncReport> => {
    const { supabase, userId } = context;
    const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "teacher",
    });
    if (roleError) throw new Error(`Could not check teacher access: ${roleError.message}`);
    if (!allowed) throw new Error("Only teacher accounts can sync marks");
    const { formulas, values, source } = await loadAllSheetGrids();
    const perTab = TABS.map((set, i) => ({
      set,
      students: parseSetTab(set, formulas[i] ?? [], values[i] ?? []),
    }));
    // The same email twice in one upsert makes Postgres reject the whole batch.
    const byEmail = new Map<string, ParsedStudent>();
    const duplicates: string[] = [];
    for (const { students } of perTab) {
      for (const p of students) {
        if (byEmail.has(p.email)) duplicates.push(`${p.set} ${p.hlcNo}`);
        else byEmail.set(p.email, p);
      }
    }
    const parsed = [...byEmail.values()];
    if (!parsed.length) {
      throw new Error("No students with an HLC no. were found in the S2M3 or S2M5 tabs");
    }
    const tabs: TabReport[] = perTab.map(({ set, students }) => {
      const term1 = new Set<string>();
      const term2 = new Set<string>();
      let filled = 0;
      for (const p of students) {
        for (const s of p.scores) {
          if (s.kind === "item") (s.term === 1 ? term1 : term2).add(s.label);
          if (s.score !== null || s.absent) filled++;
        }
      }
      return {
        set,
        students: students.length,
        term1Items: term1.size,
        term2Items: term2.size,
        scores: filled,
      };
    });
    // Never wipe the saved marks because of a sheet that could not be read properly.
    if (tabs.every((t) => t.scores === 0)) {
      throw new Error(
        'The class list was read but no marks were found, so the sync stopped to keep the saved marks. Check that each tab has an "HLC no." heading row and that marks start in column G.',
      );
    }
    const { data: roster, error: rosterError } = await supabase
      .from("students")
      .upsert(
        parsed.map((p) => ({
          email: p.email,
          name: p.name,
          math_set: p.set,
          hlc_no: p.hlcNo,
          class_name: p.className,
          class_no: p.classNo,
        })),
        { onConflict: "email" },
      )
      .select("id, email");
    if (rosterError) throw new Error(`Could not save the class list: ${rosterError.message}`);
    const idByEmail = new Map((roster ?? []).map((r) => [r.email, r.id]));
    const syncedAt = new Date().toISOString();
    const rows = parsed.flatMap((p) => {
      const studentId = idByEmail.get(p.email);
      if (!studentId) return [];
      return p.scores.map((s) => ({ ...s, student_id: studentId, synced_at: syncedAt }));
    });
    for (const part of chunk(rows, WRITE_CHUNK)) {
      const { error } = await supabase
        .from("assessment_scores")
        .upsert(part, { onConflict: "student_id,term,kind,label" });
      if (error) throw new Error(`Could not save marks: ${error.message}`);
    }
    for (const ids of chunk([...idByEmail.values()], DELETE_CHUNK)) {
      const { error } = await supabase
        .from("assessment_scores")
        .delete()
        .in("student_id", ids)
        .lt("synced_at", syncedAt);
      if (error) throw new Error(`Could not remove old marks: ${error.message}`);
    }
    const { error: logError } = await supabase.from("sheet_syncs").insert({
      synced_by: userId,
      students: parsed.length,
      scores: rows.length,
    });
    if (logError) console.warn("[Google Sheets] Could not record the sync time:", logError.message);
    // New marks change ranks and rewards, so publish the game straight away. A failure here
    // does not undo the sync; the teacher can publish again from the teacher bar.
    let game: PublishReport | null = null;
    let gameError: string | null = null;
    try {
      game = await publishGame(supabase);
    } catch (err) {
      gameError = errorMessage(err);
      console.warn("[Game] Could not publish game data:", gameError);
    }
    return {
      source,
      students: parsed.length,
      scores: rows.length,
      syncedAt,
      tabs,
      duplicates,
      game,
      gameError,
    };
  });
```

## File: src/routes/_authenticated/teacher.tsx
```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Eraser, FileUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { parseScoreCsv, scoreSchema } from "@/lib/grade-rules";
import { Button } from "@/components/ui/button";
import { SheetGradebook } from "@/components/SheetGradebook";
import { AppShell, TeacherOnly, scoreTone } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { unmatchedChapterLabels } from "@/lib/assessments";
import {
  CHAPTERS,
  average,
  completion,
  formRank,
  improvement,
  type MathSet,
  weakTopics,
} from "@/lib/data";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/_authenticated/teacher")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Analytics — HLC Math" },
      {
        name: "description",
        content: "Compare S2M3 and S2M5 marks, completion and weaker topics.",
      },
      { property: "og:title", content: "Analytics — HLC Math" },
      { property: "og:description", content: "Class analytics and the master score table." },
    ],
  }),
  component: Teacher,
});
const SETS: MathSet[] = ["S2M3", "S2M5"];
const control =
  "rounded-md border border-input bg-card px-3 py-1.5 text-sm outline-none focus:border-primary";
function Teacher() {
  const { students, refresh } = useApp();
  const [q, setQ] = useState("");
  const [setF, setSetF] = useState<"All" | MathSet>("All");
  const [editing, setEditing] = useState<{ id: string; ch: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stats = SETS.map((set) => {
    const list = students.filter((s) => s.set === set);
    const chAvg = CHAPTERS.map((_, i) => {
      const v = list
        .map((s) => s.scores[i])
        .filter((x) => x !== null && x !== undefined) as number[];
      return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
    });
    const weakest = chAvg
      .map((v, i) => ({ v, c: CHAPTERS[i] }))
      .filter((x): x is { v: number; c: (typeof CHAPTERS)[number] } => x.v !== null && Boolean(x.c))
      .sort((a, b) => a.v - b.v)
      .slice(0, 2);
    return {
      set,
      n: list.length,
      avg: Math.round(list.reduce((a, s) => a + average(s), 0) / (list.length || 1)),
      comp: Math.round(list.reduce((a, s) => a + completion(s), 0) / (list.length || 1)),
      chAvg,
      weakest,
    };
  });
  const rows = useMemo(
    () =>
      students
        .filter((s) => setF === "All" || s.set === setF)
        .filter((s) => (s.name + s.email).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => formRank(a, students) - formRank(b, students)),
    [students, q, setF],
  );
  const manualStudents = students.filter((s) => (s.scoreSources ?? []).includes("manual"));
  const manualCount = students.reduce(
    (n, s) => n + (s.scoreSources ?? []).filter((x) => x === "manual").length,
    0,
  );
  const unmatched = useMemo(
    () => unmatchedChapterLabels(students.flatMap((s) => s.assessments ?? [])),
    [students],
  );
  const updateScore = async (id: string, ch: number, val: string) => {
    try {
      const parsedScore = scoreSchema.parse(val.trim() === "" ? null : Number(val));
      const { error } = await supabase
        .from("chapter_scores")
        .upsert([{ student_id: id, chapter: ch + 1, score: parsedScore }]);
      if (error) throw error;
      await refresh();
      setEditing(null);
      toast.success(
        parsedScore === null ? "Cleared. Showing the Google Sheet score." : "Score saved",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the score");
    }
  };
  const clearManual = async () => {
    const ids = manualStudents.map((s) => s.id);
    if (!ids.length) return;
    if (
      !window.confirm(
        `Delete the chapter scores typed in the app for ${ids.length} student${ids.length === 1 ? "" : "s"}? The scores worked out from the Google Sheet will be shown instead.`,
      )
    ) {
      return;
    }
    try {
      for (let i = 0; i < ids.length; i += 100) {
        const { error } = await supabase
          .from("chapter_scores")
          .delete()
          .in("student_id", ids.slice(i, i + 100));
        if (error) throw error;
      }
      await refresh();
      toast.success("Now showing Google Sheet scores");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear the scores");
    }
  };
  const importCsv = async (file: File) => {
    try {
      const map = parseScoreCsv(await file.text());
      const unknown = [...map.keys()].filter((email) => !students.some((s) => s.email === email));
      if (unknown.length) {
        throw new Error(
          `${unknown.length} email(s) are not on the class list. Add the students first.`,
        );
      }
      const data = students.flatMap((s) => {
        const scores = map.get(s.email);
        return scores
          ? scores.map((score, i) => ({ student_id: s.id, chapter: i + 1, score }))
          : [];
      });
      if (!data.length) throw new Error("No student scores were found in the file");
      const { error } = await supabase.from("chapter_scores").upsert(data);
      if (error) throw error;
      await refresh();
      toast.success(`Saved scores for ${map.size} students`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    }
  };
  return (
    <AppShell>
      <TeacherOnly>
        <PageHeader
          title="Analytics"
          description="Marks from the class Google Sheet, chapter averages and the master score table."
        />
        <SheetGradebook />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {stats.map((st) => (
            <Panel key={st.set} title={st.set} description={`${st.n} students`}>
              <div className="grid grid-cols-2 gap-3">
                <Figure label="Average chapter score" value={`${st.avg}%`} />
                <Figure label="Chapters completed" value={`${st.comp}%`} />
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {st.chAvg.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {v ?? "—"}
                    </span>
                    <div
                      className={cn(
                        "w-full rounded-t",
                        v !== null && v < 70 ? "bg-destructive/70" : "bg-primary",
                      )}
                      style={{ height: `${(v ?? 0) * 0.8}px` }}
                    />
                    <span className="text-[10px] font-semibold">Ch{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Weaker topics:</span>
                {st.weakest.length === 0 && (
                  <span className="text-xs text-muted-foreground">none yet</span>
                )}
                {st.weakest.map((w) => (
                  <span
                    key={w.c.id}
                    className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive"
                  >
                    Ch{w.c.id} {w.c.short} ({w.v}%)
                  </span>
                ))}
              </div>
            </Panel>
          ))}
        </div>
        <button
          type="button"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void importCsv(f);
          }}
          onClick={() => fileRef.current?.click()}
          className="mt-6 flex w-full items-center gap-4 rounded-lg border border-dashed border-primary/40 bg-card px-5 py-4 text-left transition-colors hover:bg-primary/5"
        >
          <FileUp className="h-6 w-6 shrink-0 text-primary" />
          <span>
            <span className="block font-semibold">Import chapter scores from a CSV file</span>
            <span className="block text-sm text-muted-foreground">
              Drop a file here or click to choose one. Format: email,ch1,ch2,ch3,ch4,ch5,ch6,ch7
            </span>
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importCsv(f);
            e.target.value = "";
          }}
        />
        <Panel
          className="mt-6"
          title="Master score table"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {manualCount > 0 && (
                <Button variant="outline" size="sm" onClick={() => void clearManual()}>
                  <Eraser /> Use Google Sheet scores ({manualCount} typed)
                </Button>
              )}
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  aria-label="Search students"
                  className="w-32 bg-transparent text-sm outline-none"
                />
              </div>
              <select
                aria-label="Set"
                value={setF}
                onChange={(e) => setSetF(e.target.value as "All" | MathSet)}
                className={control}
              >
                <option>All</option>
                <option>S2M3</option>
                <option>S2M5</option>
              </select>
            </div>
          }
        >
          <p className="text-xs text-muted-foreground">
            A dashed box is worked out from the Google Sheet (the average percentage of that
            chapter&apos;s short and chapter quizzes, or homework if there is no quiz yet). A plain
            box was typed here. Click a score to type over it; clear it to go back to the Google
            Sheet score.
          </p>
          {unmatched.length > 0 && (
            <div className="mt-3">
              <Notice>
                These quiz columns do not say which chapter they belong to, so they are not counted
                in Ch1 to Ch7: {unmatched.slice(0, 20).join(", ")}
                {unmatched.length > 20 ? " …" : ""}. Name them like SQ1.1, CQ1 or Ch1 Quiz in the
                Google Sheet, then sync again.
              </Notice>
            </div>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                  <th className="p-2">Rank</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Set</th>
                  {CHAPTERS.map((c) => (
                    <th key={c.id} className="p-2 text-center">
                      Ch{c.id}
                    </th>
                  ))}
                  <th className="p-2 text-center">Avg</th>
                  <th className="p-2 text-center">Change</th>
                  <th className="p-2">Weaker topics</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const imp = improvement(s);
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="p-2 font-semibold tabular-nums">{formRank(s, students)}</td>
                      <td className="p-2">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="p-2">{s.set}</td>
                      {s.scores.map((sc, i) => {
                        const src = s.scoreSources?.[i] ?? null;
                        return (
                          <td key={i} className="p-1 text-center">
                            {editing?.id === s.id && editing.ch === i ? (
                              <input
                                autoFocus
                                type="number"
                                aria-label={`Chapter ${i + 1} score for ${s.name}`}
                                defaultValue={src === "manual" ? (sc ?? "") : ""}
                                placeholder={sc === null ? "" : String(sc)}
                                onBlur={(e) => void updateScore(s.id, i, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                  if (e.key === "Escape") setEditing(null);
                                }}
                                className="w-14 rounded-md border-2 border-primary px-1 text-center font-semibold"
                              />
                            ) : (
                              <button
                                type="button"
                                title={
                                  src === "sheet"
                                    ? "From Google Sheet. Click to type over it."
                                    : src === "manual"
                                      ? "Typed in the app"
                                      : "No score yet"
                                }
                                onClick={() => setEditing({ id: s.id, ch: i })}
                                className={cn(
                                  "w-12 rounded py-1 text-sm font-semibold tabular-nums",
                                  scoreTone(sc),
                                  src === "sheet" && "border border-dashed border-current",
                                )}
                              >
                                {sc ?? "—"}
                              </button>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-semibold tabular-nums">{average(s)}%</td>
                      <td
                        className={cn(
                          "p-2 text-center font-semibold tabular-nums",
                          imp >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {imp >= 0 ? "+" : ""}
                        {imp}%
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {weakTopics(s).map((c) => (
                            <span
                              key={c.id}
                              className="rounded bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive"
                            >
                              Ch{c.id} {c.short}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <AddStudentForm />
      </TeacherOnly>
    </AppShell>
  );
}
function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
function AddStudentForm() {
  const { refresh } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Panel
      className="mt-6"
      title="Add a student"
      description="Most students are added automatically by the Google Sheet sync."
    >
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const { error } = await supabase
              .from("students")
              .insert({ name: name.trim(), email: email.trim().toLowerCase(), math_set: set });
            if (error) throw error;
            await refresh();
            setName("");
            setEmail("");
            toast.success("Student added");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add the student");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="text-sm font-medium">
          Class set
          <select
            aria-label="Class set"
            value={set}
            onChange={(e) => setSet(e.target.value as MathSet)}
            className={cn(control, "mt-1 block py-2")}
          >
            <option>S2M3</option>
            <option>S2M5</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Student name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(control, "mt-1 block py-2")}
          />
        </label>
        <label className="text-sm font-medium">
          School email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(control, "mt-1 block py-2")}
          />
        </label>
        <Button disabled={busy} type="submit">
          <Plus />
          Add student
        </Button>
      </form>
    </Panel>
  );
}
```

## File: src/components/SheetGradebook.tsx
```typescript
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { scoreTone } from "@/components/AppShell";
import { Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { syncGoogleSheet, type SheetSource, type SyncReport } from "@/lib/sheets.functions";
import { ITEM_CATEGORIES, percent, termSummary, termsOf, WEIGHTS } from "@/lib/assessments";
import { termResult } from "@/lib/gamification/rules";
import type { Category, MathSet } from "@/lib/sheet-parse";
import { cn } from "@/lib/utils";
const SPREADSHEET_ID = "1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
const TERM_OPTIONS = [1, 2] as const;
const SOURCE_LABEL: Record<SheetSource, string> = {
  service_account: "Google service account",
  api_key: "Google Sheets API key",
  public_xlsx: "public link (full workbook)",
};
const control =
  "rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium outline-none focus:border-primary";
export function SheetGradebook() {
  const { students, refresh, lastSync } = useApp();
  const serverSync = useServerFn(syncGoogleSheet);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<SyncReport | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [set, setSet] = useState<MathSet>("S2M3");
  const [term, setTerm] = useState<number>(1);
  const [view, setView] = useState<Category | "summary">("summary");
  const list = useMemo(
    () =>
      students
        .filter((s) => s.set === set)
        .sort((a, b) =>
          `${a.className ?? ""}${(a.classNo ?? "").padStart(3, "0")}`.localeCompare(
            `${b.className ?? ""}${(b.classNo ?? "").padStart(3, "0")}`,
          ),
        ),
    [students, set],
  );
  const termsWithScores = useMemo(
    () =>
      termsOf(
        list.flatMap((s) =>
          (s.assessments ?? []).filter((a) => a.kind === "item" && (a.score !== null || a.absent)),
        ),
      ),
    [list],
  );
  // If the chosen term has no marks yet, show the first term that does.
  const activeTerm =
    termsWithScores.length === 0 || termsWithScores.includes(term)
      ? term
      : (termsWithScores[0] ?? term);
  const categoryCounts = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const c of ITEM_CATEGORIES) {
      const labels = new Set<string>();
      for (const s of list) {
        for (const a of s.assessments ?? []) {
          if (a.kind === "item" && a.term === activeTerm && a.category === c.id) {
            labels.add(a.label);
          }
        }
      }
      counts.set(c.id, labels.size);
    }
    return counts;
  }, [list, activeTerm]);
  const columns = useMemo(() => {
    const seen = new Map<string, { label: string; full: number | null; position: number }>();
    for (const s of list) {
      for (const a of s.assessments ?? []) {
        if (
          a.kind === "item" &&
          a.term === activeTerm &&
          a.category === view &&
          !seen.has(a.label)
        ) {
          seen.set(a.label, { label: a.label, full: a.full_marks, position: a.position });
        }
      }
    }
    return [...seen.values()].sort((a, b) => a.position - b.position);
  }, [list, activeTerm, view]);
  const missingFull = useMemo(
    () => [
      ...new Set(
        students.flatMap((s) =>
          (s.assessments ?? [])
            .filter((a) => a.kind === "item" && a.score !== null && !a.full_marks)
            .map((a) => `${s.set} ${a.label}`),
        ),
      ),
    ],
    [students],
  );
  const runSync = async () => {
    setBusy(true);
    setSyncError(null);
    try {
      const result = await serverSync();
      setReport(result);
      await refresh();
      toast.success(`Synced ${result.students} students and ${result.scores} marks`);
      if (result.gameError)
        toast.error(`Marks saved, but game data was not published: ${result.gameError}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sync failed";
      setSyncError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };
  const termNo: 1 | 2 = activeTerm === 2 ? 2 : 1;
  return (
    <Panel
      className="mt-6"
      title="Assessment gradebook"
      description={
        <>
          From{" "}
          <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-primary underline">
            2627 Name list (For LMS)
          </a>
          {", "}
          {lastSync
            ? `last synced ${new Date(lastSync).toLocaleString("en-HK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}`
            : "not synced yet"}
        </>
      }
      actions={
        <Button onClick={() => void runSync()} disabled={busy}>
          <RefreshCw className={cn(busy && "animate-spin")} />
          {busy ? "Syncing…" : "Sync from Google Sheet"}
        </Button>
      }
    >
      {syncError && (
        <div
          role="alert"
          className="mb-3 flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="whitespace-pre-wrap">{syncError}</p>
        </div>
      )}
      {report && !syncError && (
        <div className="mb-3 rounded-md border border-success/30 bg-success/5 p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            Synced from the {SOURCE_LABEL[report.source]}: {report.students} students,{" "}
            {report.scores} marks
          </p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            {report.tabs.map((t) => (
              <li key={t.set}>
                {t.set}: {t.students} students, {t.term1Items} Term 1 items, {t.term2Items} Term 2
                items, {t.scores} marks filled in
              </li>
            ))}
            <li>
              {report.game
                ? `Ranks, charts and leaderboards published for ${report.game.students} students${
                    report.game.newRewards ? `, ${report.game.newRewards} new rewards given` : ""
                  }.`
                : `Game data not published: ${report.gameError ?? "unknown error"}`}
            </li>
          </ul>
          {report.duplicates.length > 0 && (
            <p className="mt-1 text-gold-deep">
              Listed more than once (only the first row was kept): {report.duplicates.join(", ")}
            </p>
          )}
        </div>
      )}
      {missingFull.length > 0 && (
        <p className="mb-3 rounded-md border border-gold/50 bg-gold/10 p-2 text-sm">
          Full marks are missing in the sheet for: {missingFull.join(", ")}. Percentages for these
          items will appear once the &quot;Full marks&quot; row is filled in.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Set"
          value={set}
          onChange={(e) => setSet(e.target.value as MathSet)}
          className={control}
        >
          <option>S2M3</option>
          <option>S2M5</option>
        </select>
        <select
          aria-label="Term"
          value={activeTerm}
          onChange={(e) => setTerm(Number(e.target.value))}
          className={control}
        >
          {TERM_OPTIONS.map((t) => (
            <option key={t} value={t}>
              Term {t}
              {termsWithScores.includes(t) ? "" : " (no marks yet)"}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-0.5 rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => setView("summary")}
            className={cn(
              "rounded px-3 py-1 text-xs font-semibold transition-colors",
              view === "summary"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            CA and term score
          </button>
          {ITEM_CATEGORIES.map((c) => {
            const count = categoryCounts.get(c.id) ?? 0;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setView(c.id)}
                className={cn(
                  "rounded px-3 py-1 text-xs font-semibold transition-colors",
                  view === c.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
                {count > 0 ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students in {set} yet. Press Sync from Google Sheet to import the class list and
            marks.
          </p>
        ) : view !== "summary" && columns.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No {ITEM_CATEGORIES.find((c) => c.id === view)?.label ?? ""} marks for Term {activeTerm}{" "}
            yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                <th className="p-2">Class</th>
                <th className="p-2">Student</th>
                {view === "summary" ? (
                  <>
                    {WEIGHTS.map((w) => (
                      <th key={w.id} className="p-2 text-center">
                        {w.label} ({w.weight})
                      </th>
                    ))}
                    <th className="p-2 text-center">CA (T{termNo}A2) /200</th>
                    <th className="p-2 text-center">TT /200</th>
                    <th className="p-2 text-center">Exam (T{termNo}A3) /200</th>
                    <th className="p-2 text-center">Term total /200</th>
                  </>
                ) : (
                  columns.map((c) => (
                    <th key={c.label} className="p-2 text-center">
                      {c.label}
                      {c.full ? ` (${c.full})` : ""}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const sum = termSummary(s.assessments ?? [], activeTerm);
                const result = termResult(s.assessments ?? [], termNo);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap p-2 text-muted-foreground">
                      {s.className} {s.classNo}
                    </td>
                    <td className="p-2">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.hlcNo ?? s.email}</p>
                    </td>
                    {view === "summary" ? (
                      <>
                        {sum.parts.map((p) => (
                          <td key={p.id} className="p-2 text-center tabular-nums">
                            {p.value ?? "—"}
                          </td>
                        ))}
                        <td className="p-2 text-center font-semibold tabular-nums">
                          {result.ca ?? "—"}
                        </td>
                        <td className="p-2 text-center tabular-nums">{result.tt ?? "—"}</td>
                        <td className="p-2 text-center tabular-nums">{result.exam ?? "—"}</td>
                        <td className="p-2 text-center font-semibold tabular-nums">
                          {result.total ?? "—"}
                        </td>
                      </>
                    ) : (
                      columns.map((c) => {
                        const a = s.assessments?.find(
                          (x) => x.kind === "item" && x.term === activeTerm && x.label === c.label,
                        );
                        const pct = a ? percent(a) : null;
                        return (
                          <td key={c.label} className="p-1 text-center">
                            <span
                              title={pct === null ? "" : `${pct}%`}
                              className={cn(
                                "inline-block min-w-12 rounded px-1 py-0.5 text-xs font-semibold tabular-nums",
                                a?.absent ? "bg-muted text-muted-foreground" : scoreTone(pct),
                              )}
                            >
                              {!a || (a.score === null && !a.absent)
                                ? "—"
                                : a.absent
                                  ? "ABS"
                                  : a.score}
                            </span>
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Term total = 20% Term Test + 40% CA + 40% Exam. It stays empty until all three have a mark.
      </p>
    </Panel>
  );
}
```

## File: src/components/AppShell.tsx
```typescript
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CheckCircle2, Circle, GraduationCap, LogOut, PlayCircle } from "lucide-react";
import { GlobalBars } from "@/components/GlobalBars";
import { AvatarBadge, FrameStyles, TitleTag } from "@/components/game/AvatarBadge";
import { useApp } from "@/lib/app-store";
import { displayCoins } from "@/lib/gamification/rules";
import { STUDENT_NAV, TEACHER_NAV, navKey, visibleNav, type NavItem } from "@/lib/nav";
import { TONES, toneForPath } from "@/lib/tones";
import { cn } from "@/lib/utils";
/** The student's Math Coins balance, shown in the top bar. */
function CoinChip({ amount }: { amount: number }) {
  return (
    <Link
      to="/shop"
      title="Math Coins: open the Shop"
      className="flex items-center gap-1.5 rounded-full bg-gold/30 py-1 pl-1 pr-3 text-sm font-bold text-gold-deep transition-transform hover:-translate-y-0.5"
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground shadow-coin"
      >
        M
      </span>
      <span className="tabular-nums">{amount}</span>
      <span className="sr-only">Math Coins</span>
    </Link>
  );
}
/** The student's avatar, name and title in the top bar; opens the profile page. */
function ProfileChip({ compact = false }: { compact?: boolean }) {
  const { me, cosmeticsOf } = useApp();
  const c = cosmeticsOf(me.id);
  const firstName = me.name.split(" ")[0] ?? me.name;
  return (
    <Link
      to="/profile"
      title="My profile"
      className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-transform hover:-translate-y-0.5"
    >
      <AvatarBadge avatarId={c.avatarId} frameId={c.equippedFrameId} size="sm" />
      {compact ? null : (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-bold">{firstName}</span>
          <TitleTag titleId={c.equippedTitle} className="px-1.5 py-0 text-[10px]" />
        </span>
      )}
    </Link>
  );
}
/** One entry in the desktop navigation rail. */
function RailItem({ item }: { item: NavItem }) {
  if (item.status === "soon") {
    return (
      <span
        aria-disabled="true"
        title={`${item.label} is coming soon`}
        className="flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center text-[11px] font-bold leading-tight text-nav-foreground/45"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-dashed border-nav-foreground/25">
          <item.icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>{item.label}</span>
        <span className="rounded-full bg-nav-foreground/10 px-1.5 text-[10px] font-semibold">
          Soon
        </span>
      </span>
    );
  }
  const tone = TONES[toneForPath(item.to)];
  return (
    <Link
      to={item.to}
      className="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center text-[11px] font-bold leading-tight"
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:-translate-y-0.5",
              isActive ? tone.solid : cn(tone.dim, "text-nav-foreground"),
            )}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span
            className={
              isActive
                ? "text-nav-foreground"
                : "text-nav-foreground/70 group-hover:text-nav-foreground"
            }
          >
            {item.label}
          </span>
        </>
      )}
    </Link>
  );
}
/** One pill in the mobile navigation strip. */
function PillItem({ item }: { item: NavItem }) {
  if (item.status === "soon") {
    return (
      <span
        aria-disabled="true"
        title={`${item.label} is coming soon`}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-nav-foreground/30 px-3.5 py-1.5 text-sm font-bold text-nav-foreground/45"
      >
        <item.icon className="h-4 w-4" aria-hidden="true" />
        {item.label}
      </span>
    );
  }
  const tone = TONES[toneForPath(item.to)];
  return (
    <Link to={item.to} className="shrink-0">
      {({ isActive }) => (
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold",
            isActive ? tone.flat : "bg-white/10 text-nav-foreground/85",
          )}
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </span>
      )}
    </Link>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, logout, ready, error, me, isPreview } = useApp();
  const navigate = useNavigate();
  const items = visibleNav(role === "student" ? STUDENT_NAV : TEACHER_NAV, isPreview);
  const home = role === "teacher" ? "/teacher" : "/dashboard";
  const context = isPreview
    ? `${me.set} student preview`
    : role === "teacher"
      ? "Teacher"
      : me.id
        ? me.set
        : "Student";
  const showCoins = role === "student" && Boolean(me.id);
  const coins = displayCoins(me);
  const signOut = async () => {
    await logout();
    await navigate({ to: "/", replace: true });
  };
  return (
    <div className="min-h-screen bg-background md:pl-[88px]">
      <FrameStyles />
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col bg-nav text-nav-foreground md:flex">
        <Link
          to={home}
          aria-label="HLC Math home"
          className="flex h-[72px] shrink-0 items-center justify-center"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-accent-foreground shadow-chunky-gold">
            <GraduationCap className="h-6 w-6" />
          </span>
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-1">
          {items.map((item) => (
            <RailItem key={navKey(item)} item={item} />
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="group mx-2 mb-3 flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold text-nav-foreground/70 transition-colors hover:text-nav-foreground"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 group-hover:bg-white/20">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </span>
          Sign out
        </button>
      </aside>
      <GlobalBars />
      <header className="sticky top-0 z-30 bg-nav text-nav-foreground md:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Link to={home} className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-accent-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            HLC Mathematics
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {showCoins ? <ProfileChip compact /> : null}
            {showCoins ? <CoinChip amount={coins} /> : null}
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Sign out"
              className="rounded-lg p-2 text-nav-foreground/80 hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav aria-label="Main" className="flex gap-1.5 overflow-x-auto px-3 pb-3">
          {items.map((item) => (
            <PillItem key={navKey(item)} item={item} />
          ))}
        </nav>
      </header>
      <div className="hidden h-14 items-center gap-3 border-b-2 border-border bg-card px-8 md:flex">
        <p className="flex items-center gap-2 text-sm">
          <span className="font-bold">HLC Mathematics</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary-deep">
            {context}
          </span>
        </p>
        <div className="ml-auto flex items-center gap-3">
          {showCoins ? <CoinChip amount={coins} /> : null}
          {showCoins ? <ProfileChip /> : null}
          <p className="truncate text-sm text-muted-foreground">{session?.email}</p>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading your records…</p>
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : !session ? (
          <Link to="/" className="text-primary underline">
            Sign in
          </Link>
        ) : role === "student" && !me.id ? (
          <p className="text-sm">
            Your school account is not linked to a student record yet. Please contact your
            Mathematics teacher.
          </p>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
export function TeacherOnly({ children }: { children: ReactNode }) {
  const { role } = useApp();
  return role === "teacher" ? children : <p>Teacher access required.</p>;
}
export function scoreTone(s: number | null) {
  return s === null
    ? "bg-muted text-muted-foreground"
    : s >= 85
      ? "bg-success/15 text-success-deep"
      : s >= 60
        ? "bg-primary/10 text-primary-deep"
        : "bg-destructive/12 text-destructive";
}
export const CHAPTER_STATUS = {
  Completed: { cls: "bg-success/15 text-success-deep", icon: CheckCircle2 },
  "In Progress": { cls: "bg-gold/30 text-gold-deep", icon: PlayCircle },
  "Not Started": { cls: "bg-muted text-muted-foreground", icon: Circle },
};
```

## File: src/integrations/supabase/types.ts
```typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      assessment_scores: {
        Row: {
          absent: boolean;
          category: string;
          full_marks: number | null;
          kind: string;
          label: string;
          position: number;
          score: number | null;
          student_id: string;
          synced_at: string;
          term: number;
        };
        Insert: {
          absent?: boolean;
          category: string;
          full_marks?: number | null;
          kind: string;
          label: string;
          position?: number;
          score?: number | null;
          student_id: string;
          synced_at?: string;
          term: number;
        };
        Update: {
          absent?: boolean;
          category?: string;
          full_marks?: number | null;
          kind?: string;
          label?: string;
          position?: number;
          score?: number | null;
          student_id?: string;
          synced_at?: string;
          term?: number;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_scores_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_content: {
        Row: {
          chapter: number;
          notes: string;
          quiz: string;
          updated_at: string;
          video: string;
        };
        Insert: {
          chapter: number;
          notes?: string;
          quiz?: string;
          updated_at?: string;
          video?: string;
        };
        Update: {
          chapter?: number;
          notes?: string;
          quiz?: string;
          updated_at?: string;
          video?: string;
        };
        Relationships: [];
      };
      chapter_scores: {
        Row: {
          chapter: number;
          score: number | null;
          student_id: string;
        };
        Insert: {
          chapter: number;
          score?: number | null;
          student_id: string;
        };
        Update: {
          chapter?: number;
          score?: number | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_scores_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_self_checks: {
        Row: {
          chapter: number;
          checked_at: string;
          objective_id: string;
          student_id: string;
        };
        Insert: {
          chapter: number;
          checked_at?: string;
          objective_id: string;
          student_id: string;
        };
        Update: {
          chapter?: number;
          checked_at?: string;
          objective_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_self_checks_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_video_completions: {
        Row: {
          chapter: number;
          completed_at: string;
          id: string;
          marks: number;
          student_id: string;
          video_id: string | null;
          video_title: string;
        };
        Insert: {
          chapter: number;
          completed_at?: string;
          id?: string;
          marks?: number;
          student_id: string;
          video_id?: string | null;
          video_title: string;
        };
        Update: {
          chapter?: number;
          completed_at?: string;
          id?: string;
          marks?: number;
          student_id?: string;
          video_id?: string | null;
          video_title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_video_completions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_video_completions_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "chapter_videos";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_videos: {
        Row: {
          chapter: number;
          created_at: string;
          id: string;
          position: number;
          title: string;
          url: string;
        };
        Insert: {
          chapter: number;
          created_at?: string;
          id?: string;
          position?: number;
          title: string;
          url: string;
        };
        Update: {
          chapter?: number;
          created_at?: string;
          id?: string;
          position?: number;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      daily_checkins: {
        Row: {
          checkin_date: string;
          correct: boolean;
          created_at: string;
          question_id: string;
          student_id: string;
        };
        Insert: {
          checkin_date: string;
          correct: boolean;
          created_at?: string;
          question_id: string;
          student_id: string;
        };
        Update: {
          checkin_date?: string;
          correct?: boolean;
          created_at?: string;
          question_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_checkins_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_marks: {
        Row: {
          awarded_by: string;
          batch_id: string | null;
          created_at: string;
          id: string;
          lesson_date: string;
          marks: number;
          note: string;
          reason: string;
          student_id: string;
        };
        Insert: {
          awarded_by: string;
          batch_id?: string | null;
          created_at?: string;
          id?: string;
          lesson_date?: string;
          marks: number;
          note?: string;
          reason: string;
          student_id: string;
        };
        Update: {
          awarded_by?: string;
          batch_id?: string | null;
          created_at?: string;
          id?: string;
          lesson_date?: string;
          marks?: number;
          note?: string;
          reason?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_marks_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      exam_dates: {
        Row: {
          created_at: string;
          id: string;
          kind: string;
          math_set: string;
          starts_at: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind?: string;
          math_set?: string;
          starts_at: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: string;
          math_set?: string;
          starts_at?: string;
          title?: string;
        };
        Relationships: [];
      };
      game_leaderboards: {
        Row: {
          generated_at: string;
          id: string;
          metric: string;
          payload: Json;
          scope: string;
          term: number | null;
        };
        Insert: {
          generated_at?: string;
          id: string;
          metric: string;
          payload: Json;
          scope: string;
          term?: number | null;
        };
        Update: {
          generated_at?: string;
          id?: string;
          metric?: string;
          payload?: Json;
          scope?: string;
          term?: number | null;
        };
        Relationships: [];
      };
      game_rewards: {
        Row: {
          awarded_at: string;
          base_mc: number;
          description: string;
          exp: number;
          mc: number;
          multiplier: number;
          quiz_id: string | null;
          reason: string;
          source_key: string;
          student_id: string;
        };
        Insert: {
          awarded_at?: string;
          base_mc: number;
          description?: string;
          exp?: number;
          mc: number;
          multiplier?: number;
          quiz_id?: string | null;
          reason: string;
          source_key: string;
          student_id: string;
        };
        Update: {
          awarded_at?: string;
          base_mc?: number;
          description?: string;
          exp?: number;
          mc?: number;
          multiplier?: number;
          quiz_id?: string | null;
          reason?: string;
          source_key?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_rewards_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      game_snapshots: {
        Row: {
          generated_at: string;
          math_set: string;
          payload: Json;
          student_id: string;
        };
        Insert: {
          generated_at?: string;
          math_set: string;
          payload: Json;
          student_id: string;
        };
        Update: {
          generated_at?: string;
          math_set?: string;
          payload?: Json;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_snapshots_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          chapter: number | null;
          created_at: string;
          created_by: string;
          details: string;
          due_at: string;
          id: string;
          link: string;
          math_set: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          chapter?: number | null;
          created_at?: string;
          created_by?: string;
          details?: string;
          due_at: string;
          id?: string;
          link?: string;
          math_set: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          chapter?: number | null;
          created_at?: string;
          created_by?: string;
          details?: string;
          due_at?: string;
          id?: string;
          link?: string;
          math_set?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mistakes: {
        Row: {
          chapter: number;
          created_at: string;
          error_type: string;
          id: string;
          image_path: string | null;
          question: string;
          solution: string;
          status: string;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          chapter: number;
          created_at?: string;
          error_type: string;
          id?: string;
          image_path?: string | null;
          question?: string;
          solution?: string;
          status?: string;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          chapter?: number;
          created_at?: string;
          error_type?: string;
          id?: string;
          image_path?: string | null;
          question?: string;
          solution?: string;
          status?: string;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mistakes_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          display_name: string;
          id: string;
          preferences: Json;
        };
        Insert: {
          display_name?: string;
          id: string;
          preferences?: Json;
        };
        Update: {
          display_name?: string;
          id?: string;
          preferences?: Json;
        };
        Relationships: [];
      };
      reward_redemptions: {
        Row: {
          cost: number;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          id: string;
          reward_id: string | null;
          reward_name: string;
          status: string;
          student_id: string;
        };
        Insert: {
          cost: number;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          reward_id?: string | null;
          reward_name: string;
          status?: string;
          student_id: string;
        };
        Update: {
          cost?: number;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          reward_id?: string | null;
          reward_name?: string;
          status?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey";
            columns: ["reward_id"];
            isOneToOne: false;
            referencedRelation: "rewards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reward_redemptions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      rewards: {
        Row: {
          active: boolean;
          cooldown_days: number | null;
          cost: number;
          created_at: string;
          description: string;
          emoji: string;
          id: string;
          name: string;
          position: number;
        };
        Insert: {
          active?: boolean;
          cooldown_days?: number | null;
          cost: number;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          name: string;
          position?: number;
        };
        Update: {
          active?: boolean;
          cooldown_days?: number | null;
          cost?: number;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          name?: string;
          position?: number;
        };
        Relationships: [];
      };
      sheet_syncs: {
        Row: {
          created_at: string;
          id: string;
          scores: number;
          students: number;
          synced_by: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          scores?: number;
          students?: number;
          synced_by: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          scores?: number;
          students?: number;
          synced_by?: string;
        };
        Relationships: [];
      };
      shop_items: {
        Row: {
          active: boolean;
          description: string;
          grants: string[];
          id: string;
          name: string;
          position: number;
          price: number;
        };
        Insert: {
          active?: boolean;
          description?: string;
          grants: string[];
          id: string;
          name: string;
          position?: number;
          price: number;
        };
        Update: {
          active?: boolean;
          description?: string;
          grants?: string[];
          id?: string;
          name?: string;
          position?: number;
          price?: number;
        };
        Relationships: [];
      };
      shop_purchases: {
        Row: {
          item_id: string;
          price: number;
          purchased_at: string;
          student_id: string;
        };
        Insert: {
          item_id: string;
          price: number;
          purchased_at?: string;
          student_id: string;
        };
        Update: {
          item_id?: string;
          price?: number;
          purchased_at?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_purchases_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "shop_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_purchases_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      student_cosmetics: {
        Row: {
          avatar_id: string;
          frame_id: string | null;
          student_id: string;
          title_id: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_id?: string;
          frame_id?: string | null;
          student_id: string;
          title_id?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_id?: string;
          frame_id?: string | null;
          student_id?: string;
          title_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_cosmetics_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          class_name: string;
          class_no: string;
          email: string;
          hlc_no: string | null;
          id: string;
          last_month_avg: number;
          last_month_form_rank: number;
          math_set: string;
          name: string;
          streak: number;
          user_id: string | null;
          xp: number;
        };
        Insert: {
          class_name?: string;
          class_no?: string;
          email: string;
          hlc_no?: string | null;
          id?: string;
          last_month_avg?: number;
          last_month_form_rank?: number;
          math_set: string;
          name: string;
          streak?: number;
          user_id?: string | null;
          xp?: number;
        };
        Update: {
          class_name?: string;
          class_no?: string;
          email?: string;
          hlc_no?: string | null;
          id?: string;
          last_month_avg?: number;
          last_month_form_rank?: number;
          math_set?: string;
          name?: string;
          streak?: number;
          user_id?: string | null;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      system_config: {
        Row: {
          double_mc_event_active: boolean;
          id: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          double_mc_event_active?: boolean;
          id?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          double_mc_event_active?: boolean;
          id?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      video_completions: {
        Row: {
          chapter: number;
          completed_at: string;
          marks: number;
          student_id: string;
          video_url: string;
        };
        Insert: {
          chapter: number;
          completed_at?: string;
          marks?: number;
          student_id: string;
          video_url: string;
        };
        Update: {
          chapter?: number;
          completed_at?: string;
          marks?: number;
          student_id?: string;
          video_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_completions_chapter_fkey";
            columns: ["chapter"];
            isOneToOne: false;
            referencedRelation: "chapter_content";
            referencedColumns: ["chapter"];
          },
          {
            foreignKeyName: "video_completions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      student_coin_totals: {
        Row: {
          checkin_earned: number | null;
          daily_earned: number | null;
          reward_earned: number | null;
          shop_spent: number | null;
          spent: number | null;
          student_id: string | null;
          video_earned: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      buy_shop_item: { Args: { _item_id: string }; Returns: undefined };
      claim_student: { Args: never; Returns: undefined };
      complete_chapter_video: { Args: { _video_id: string }; Returns: boolean };
      complete_video: { Args: { _chapter: number }; Returns: undefined };
      equip_cosmetics: {
        Args: { _avatar: string; _frame: string | null; _title: string | null };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_demo_user: { Args: never; Returns: boolean };
      redeem_reward: { Args: { _reward_id: string }; Returns: string };
      submit_daily_checkin: { Args: { _question_id: string; _correct: boolean }; Returns: number };
    };
    Enums: {
      app_role: "teacher" | "student";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
export const Constants = {
  public: {
    Enums: {
      app_role: ["teacher", "student"],
    },
  },
} as const;
```

## File: src/lib/data.ts
```typescript
import type { Assessment } from "./assessments";
import type { GameProfile } from "./gamification/types";
export const CHAPTERS = [
  { id: 1, title: "Approximation and Errors", short: "Approx. & Errors", emoji: "🎯" },
  {
    id: 2,
    title: "Operations and Factorization of Polynomials",
    short: "Polynomials",
    emoji: "🧩",
  },
  { id: 3, title: "Identities", short: "Identities", emoji: "🟰" },
  { id: 4, title: "Algebraic Fractions and Formulae", short: "Algebraic Fractions", emoji: "➗" },
  { id: 5, title: "Linear Equations in Two Unknowns", short: "Linear Equations", emoji: "📈" },
  { id: 6, title: "Angles and Parallel Lines (II)", short: "Angles & Parallels", emoji: "📐" },
  { id: 7, title: "Organization and Presentation of Data (II)", short: "Data (II)", emoji: "📊" },
] as const;
export type MathSet = "S2M3" | "S2M5";
/** The shared demo login. Teachers never see this account in class lists or rankings. */
export const DEMO_EMAIL = "demo.student@hlc.edu.hk";
/** Where a chapter score came from: typed in the app, or worked out from the Google Sheet. */
export type ScoreSource = "manual" | "sheet" | null;
export interface Student {
  id: string;
  userId?: string | null;
  /** Math Coins earned from lesson marks (can include deductions). */
  dailyMarks?: number;
  /** Math Coins earned from watching chapter videos to the end. */
  videoMarks?: number;
  /** Math Coins spent on reward tickets (rejected requests are not counted). */
  coinsSpent?: number;
  /** Math Coins from saved game rewards (quiz ranks, most improved, homework streaks). */
  rewardCoins?: number;
  /** Math Coins from daily check-ins (1 for every 5). */
  checkinCoins?: number;
  /** Math Coins spent on Shop items such as frames and title packs. */
  shopSpent?: number;
  /** Ids of chapter videos this student has watched to the end. */
  completedVideos?: string[];
  assessments?: Assessment[];
  hlcNo?: string | null;
  className?: string;
  classNo?: string;
  name: string;
  email: string;
  set: MathSet;
  scores: (number | null)[]; // 7 chapters, null = not yet attempted
  scoreSources?: ScoreSource[];
  lastMonthAvg: number;
  lastMonthFormRank: number;
  xp: number;
  streak: number;
  /**
   * Game layer: term totals, rewards, EXP, ranks and cosmetics, worked out by
   * src/lib/gamification/rules.ts. Only filled in where the whole set can be read.
   */
  game?: GameProfile;
}
export function average(s: Student) {
  const done = s.scores.filter((x) => x !== null) as number[];
  return done.length ? Math.round(done.reduce((a, b) => a + b, 0) / done.length) : 0;
}
export function completion(s: Student) {
  return Math.round((s.scores.filter((x) => x !== null).length / CHAPTERS.length) * 100);
}
export function weakTopics(s: Student) {
  return s.scores
    .map((sc, i) => ({ sc, ch: CHAPTERS[i] }))
    .filter(
      (x): x is { sc: number; ch: (typeof CHAPTERS)[number] } =>
        x.sc !== null && x.sc < 60 && Boolean(x.ch),
    )
    .sort((a, b) => (a.sc as number) - (b.sc as number))
    .slice(0, 2)
    .map((x) => x.ch);
}
export function ranked(list: Student[]) {
  return [...list].sort((a, b) => average(b) - average(a));
}
export function formRank(s: Student, all: Student[]) {
  return ranked(all).findIndex((x) => x.id === s.id) + 1;
}
export function setRank(s: Student, all: Student[]) {
  return ranked(all.filter((x) => x.set === s.set)).findIndex((x) => x.id === s.id) + 1;
}
export function improvement(s: Student) {
  return s.lastMonthAvg ? Math.round(((average(s) - s.lastMonthAvg) / s.lastMonthAvg) * 100) : 0;
}
export function level(xp: number) {
  return Math.floor(xp / 1000) + 1;
}
export function chapterStatus(score: number | null, idx: number, scores: (number | null)[]) {
  if (score !== null) return "Completed" as const;
  const firstOpen = scores.findIndex((x) => x === null);
  return idx === firstOpen ? ("In Progress" as const) : ("Not Started" as const);
}
/** Sort by class, then class number, then name (e.g. 2A 1, 2A 2, 2B 1). */
export function sortByClass<T extends Pick<Student, "className" | "classNo" | "name">>(
  list: T[],
): T[] {
  const key = (s: T) => `${s.className ?? ""}${(s.classNo ?? "").padStart(3, "0")}${s.name}`;
  return [...list].sort((a, b) => key(a).localeCompare(key(b)));
}
```

## File: src/lib/app-store.tsx
```typescript
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { DEMO_EMAIL, type ScoreSource, type Student } from "./data";
import { chapterScoresFromAssessments, type Assessment } from "./assessments";
import type { Homework } from "./homework";
import {
  MOCK_COSMETICS,
  MOCK_STUDENTS,
  MOCK_VOICE_COUNTS,
  isMockStudentId,
  mockSeedLedger,
} from "./gamification/mock-data";
import { mockSelfChecks } from "./gamification/mock-activity";
import { cosmeticsFromRow, ledgerFromRow } from "./gamification/publish";
import { mergeUnlocks } from "./gamification/catalog";
import { attachGame, countVoiceMarks } from "./gamification/rules";
import type { ExamDate, ExamKind } from "./gamification/vault";
import {
  DEFAULT_COSMETICS,
  DEFAULT_SYSTEM_CONFIG,
  type Cosmetics,
  type LedgerEntry,
  type Leaderboard,
  type StudentSnapshot,
  type SystemConfig,
  type Unlocks,
} from "./gamification/types";
import { buildGameWorld, parseLeaderboard, parseSnapshot } from "./gamification/world";
type PublicTables = Database["public"]["Tables"];
type AssessmentRow = PublicTables["assessment_scores"]["Row"];
type VideoCompletionRow = PublicTables["chapter_video_completions"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];
type Content = PublicTables["chapter_content"]["Row"];
export type ChapterVideo = PublicTables["chapter_videos"]["Row"];
export type MarkRow = PublicTables["daily_marks"]["Row"];
export type Reward = PublicTables["rewards"]["Row"];
export type Redemption = PublicTables["reward_redemptions"]["Row"];
type RewardRow = PublicTables["game_rewards"]["Row"];
type CosmeticsRow = PublicTables["student_cosmetics"]["Row"];
type SnapshotRow = PublicTables["game_snapshots"]["Row"];
type BoardRow = PublicTables["game_leaderboards"]["Row"];
type SelfCheckRow = Pick<PublicTables["chapter_self_checks"]["Row"], "student_id" | "objective_id">;
export type ShopItem = PublicTables["shop_items"]["Row"];
type PurchaseRow = PublicTables["shop_purchases"]["Row"];
const CHAPTER_COUNT = 7;
const PAGE_SIZE = 1000;
const MARK_LOG_LIMIT = 300;
const REDEMPTION_LIMIT = 500;
/** Keeps the previewed student while the teacher moves between pages or refreshes the tab. */
const PREVIEW_STORAGE_KEY = "hlc-preview-student";
/** Supabase caps how many rows one request returns, so keep paging until a page comes back empty. */
async function fetchAllAssessments(): Promise<AssessmentRow[]> {
  const rows: AssessmentRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("assessment_scores")
      .select("*")
      .order("student_id")
      .order("term")
      .order("kind")
      .order("label")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}
async function fetchAllVideoCompletions(): Promise<VideoCompletionRow[]> {
  const rows: VideoCompletionRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("chapter_video_completions")
      .select("*")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}
interface CoinData {
  error: string | null;
  totals: CoinTotalRow[];
  rewards: Reward[];
  redemptions: Redemption[];
}
/** Coins and awards are optional: if their tables are not set up yet, the rest of the app still works. */
async function loadCoinData(): Promise<CoinData> {
  const [totals, rewards, redemptions] = await Promise.all([
    supabase.from("student_coin_totals").select("*"),
    supabase.from("rewards").select("*").order("position").order("cost"),
    supabase
      .from("reward_redemptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(REDEMPTION_LIMIT),
  ]);
  const error = totals.error ?? rewards.error ?? redemptions.error;
  if (error) {
    return {
      error: `Math Coins and Awards are not set up yet (${error.message}). Run supabase/sql/0005_coins_activity_awards.sql in the Supabase SQL Editor.`,
      totals: [],
      rewards: [],
      redemptions: [],
    };
  }
  return {
    error: null,
    totals: totals.data ?? [],
    rewards: rewards.data ?? [],
    redemptions: redemptions.data ?? [],
  };
}
interface HomeworkData {
  error: string | null;
  rows: Homework[];
}
/** Homework is optional too: before 0007 is run, every other page keeps working. */
async function loadHomework(): Promise<HomeworkData> {
  const { data, error } = await supabase
    .from("homework")
    .select("*")
    .order("due_at", { ascending: true });
  if (error) {
    return {
      error: `Homework is not set up yet (${error.message}). Run supabase/sql/0007_homework.sql in the Supabase SQL Editor.`,
      rows: [],
    };
  }
  return { error: null, rows: data ?? [] };
}
interface ConfigData {
  config: SystemConfig;
  error: string | null;
}
/** The 2x event switch is optional too: before 0009 is run, the event simply stays off. */
async function loadSystemConfig(): Promise<ConfigData> {
  const { data, error } = await supabase
    .from("system_config")
    .select("double_mc_event_active")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    return {
      config: DEFAULT_SYSTEM_CONFIG,
      error: `The 2x Math Coins event switch is not set up yet (${error.message}). Run supabase/sql/0009_system_config.sql in the Supabase SQL Editor.`,
    };
  }
  return { config: { isDoubleMCEventActive: data?.double_mc_event_active === true }, error: null };
}
interface GameData {
  error: string | null;
  ledger: LedgerEntry[];
  cosmetics: CosmeticsRow[];
  /** Students: their own published snapshot. Teachers work everything out locally. */
  snapshots: SnapshotRow[];
  /** Students: the published leaderboards. */
  boards: BoardRow[];
  selfChecks: SelfCheckRow[];
  publishedAt: string | null;
}
const EMPTY_GAME: Omit<GameData, "error"> = {
  ledger: [],
  cosmetics: [],
  snapshots: [],
  boards: [],
  selfChecks: [],
  publishedAt: null,
};
async function fetchAllRewards(): Promise<RewardRow[]> {
  const rows: RewardRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("game_rewards")
      .select("*")
      .order("student_id")
      .order("source_key")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}
async function fetchAllSelfChecks(): Promise<SelfCheckRow[]> {
  const rows: SelfCheckRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("chapter_self_checks")
      .select("student_id, objective_id")
      .order("student_id")
      .order("objective_id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}
/** Game data is optional too: before 0010 is run, every other page keeps working. */
async function loadGameData(role: "student" | "teacher"): Promise<GameData> {
  try {
    const [ledger, cosmetics, selfChecks, snapshots, boards] = await Promise.all([
      fetchAllRewards(),
      supabase.from("student_cosmetics").select("*"),
      fetchAllSelfChecks(),
      role === "student"
        ? supabase.from("game_snapshots").select("*")
        : Promise.resolve({ data: [] as SnapshotRow[], error: null }),
      role === "student"
        ? supabase.from("game_leaderboards").select("*")
        : supabase
            .from("game_leaderboards")
            .select("*")
            .order("generated_at", { ascending: false })
            .limit(1),
    ]);
    const error = cosmetics.error ?? snapshots.error ?? boards.error;
    if (error) throw error;
    const boardRows = boards.data ?? [];
    const snapshotRows = snapshots.data ?? [];
    return {
      error: null,
      ledger: ledger.flatMap((r) => {
        const e = ledgerFromRow(r);
        return e ? [e] : [];
      }),
      cosmetics: cosmetics.data ?? [],
      snapshots: snapshotRows,
      boards: role === "student" ? boardRows : [],
      selfChecks,
      publishedAt: snapshotRows[0]?.generated_at ?? boardRows[0]?.generated_at ?? null,
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : String((e as { message?: unknown })?.message ?? e);
    return {
      ...EMPTY_GAME,
      error: `Game features are not set up yet (${message}). Run supabase/sql/0010_game_data.sql in the Supabase SQL Editor.`,
    };
  }
}
interface ExtrasData {
  error: string | null;
  shopItems: ShopItem[];
  purchases: PurchaseRow[];
  examDates: ExamDate[];
}
/** Shop and exam dates are optional too: before 0011 is run, every other page keeps working. */
async function loadExtras(): Promise<ExtrasData> {
  const [items, purchases, exams] = await Promise.all([
    supabase.from("shop_items").select("*").order("position"),
    supabase.from("shop_purchases").select("*"),
    supabase.from("exam_dates").select("*").order("starts_at"),
  ]);
  const error = items.error ?? purchases.error ?? exams.error;
  if (error) {
    return {
      error: `The Shop, check-ins and Mistake Vault are not set up yet (${error.message}). Run supabase/sql/0011_shop_badges_vault.sql in the Supabase SQL Editor.`,
      shopItems: [],
      purchases: [],
      examDates: [],
    };
  }
  return {
    error: null,
    shopItems: items.data ?? [],
    purchases: purchases.data ?? [],
    examDates: (exams.data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      kind: e.kind as ExamKind,
      set: e.math_set === "S2M3" || e.math_set === "S2M5" ? e.math_set : "ALL",
      startsAt: e.starts_at,
    })),
  };
}
function toAssessment(row: AssessmentRow): Assessment {
  return {
    term: row.term,
    kind: row.kind === "summary" ? "summary" : "item",
    category: row.category as Assessment["category"],
    label: row.label,
    score: row.score,
    absent: row.absent,
    full_marks: row.full_marks,
    position: row.position,
  };
}
interface Store {
  session: { email: string; name: string } | null;
  /** The role the pages should render for. While a teacher previews, this is "student". */
  role: "student" | "teacher";
  /** The signed-in account's own role, which does not change during a preview. */
  actualRole: "student" | "teacher";
  students: Student[];
  me: Student;
  ready: boolean;
  error: string | null;
  content: Content[];
  videos: ChapterVideo[];
  lastSync: string | null;
  /** Latest lesson-mark entries (teachers see everyone's, students only their own). */
  markLog: MarkRow[];
  rewards: Reward[];
  redemptions: Redemption[];
  coinsError: string | null;
  homework: Homework[];
  homeworkError: string | null;
  /** True while a teacher is viewing the site as a student. */
  isPreview: boolean;
  /** True while previewing: student pages must not save anything. */
  readOnly: boolean;
  /** Whether the previewed student is from the class list or the sandbox. */
  previewSource: "live" | "mock" | null;
  startPreview: (studentId: string) => void;
  exitPreview: () => void;
  /** Sandbox students for previews (teachers only; never saved). */
  mockStudents: Student[];
  systemConfig: SystemConfig;
  configError: string | null;
  /** The game data the current view should show for `me` (own, previewed or sandbox). */
  gameSnapshot: StudentSnapshot | null;
  /** Leaderboards for the current view. Teachers (not previewing) get full rankings. */
  boards: Leaderboard[];
  gameError: string | null;
  /** When game data was last published for students. */
  gamePublishedAt: string | null;
  cosmeticsOf: (studentId: string) => Cosmetics;
  /** Self-check statements ticked by `me`. */
  selfChecks: string[];
  /** True for the public demo login, which only ever sees sandbox classmates. */
  isDemo: boolean;
  shopItems: ShopItem[];
  /** Shop item ids that `me` has bought. */
  ownedItems: string[];
  /** Frames and titles `me` may equip: earned plus bought. */
  myUnlocks: Unlocks;
  examDates: ExamDate[];
  extrasError: string | null;
  setDoubleMcEvent: (active: boolean) => Promise<void>;
  refresh: () => Promise<unknown>;
  logout: () => Promise<void>;
}
const g = globalThis as unknown as {
  __hlcCloudCtx?: ReturnType<typeof createContext<Store | null>>;
};
const Ctx = (g.__hlcCloudCtx ??= createContext<Store | null>(null));
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const qc = useQueryClient();
  const rememberPreview = useCallback((id: string | null) => {
    setPreviewId(id);
    try {
      if (id === null) window.sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
      else window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, id);
    } catch {
      // Storage can be blocked; the preview then only lasts until the tab is refreshed.
    }
  }, []);
  useEffect(() => {
    try {
      setPreviewId(window.sessionStorage.getItem(PREVIEW_STORAGE_KEY));
    } catch {
      // Storage can be blocked; start without a preview.
    }
  }, []);
  useEffect(() => {
    let active = true;
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) {
        setUser(data.user);
        setHydrated(true);
      }
    };
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      if (event === "SIGNED_OUT") {
        setUser(null);
        qc.clear();
      } else {
        setHydrated(false);
        setTimeout(() => {
          void verify();
        }, 0);
      }
    });
    void verify();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [qc]);
  const query = useQuery({
    queryKey: ["math-records", user?.id],
    enabled: Boolean(user),
    retry: false,
    queryFn: async () => {
      const claim = await supabase.rpc("claim_student");
      if (claim.error) throw claim.error;
      const [
        roles,
        roster,
        scores,
        markLog,
        videoRows,
        content,
        assessmentRows,
        syncs,
        chapterVideos,
        coins,
        homeworkData,
        configData,
        extras,
      ] = await Promise.all([
        supabase.from("user_roles").select("role"),
        supabase.from("students").select("*"),
        supabase.from("chapter_scores").select("*"),
        supabase
          .from("daily_marks")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MARK_LOG_LIMIT),
        fetchAllVideoCompletions(),
        supabase.from("chapter_content").select("*"),
        fetchAllAssessments(),
        supabase
          .from("sheet_syncs")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase.from("chapter_videos").select("*").order("chapter").order("position"),
        loadCoinData(),
        loadHomework(),
        loadSystemConfig(),
        loadExtras(),
      ]);
      for (const r of [roles, roster, scores, markLog, content, syncs, chapterVideos]) {
        if (r.error) throw r.error;
      }
      const assessmentsByStudent = new Map<string, Assessment[]>();
      for (const row of assessmentRows) {
        const item = toAssessment(row);
        const existing = assessmentsByStudent.get(row.student_id);
        if (existing) existing.push(item);
        else assessmentsByStudent.set(row.student_id, [item]);
      }
      const videosByStudent = new Map<string, VideoCompletionRow[]>();
      for (const row of videoRows) {
        const existing = videosByStudent.get(row.student_id);
        if (existing) existing.push(row);
        else videosByStudent.set(row.student_id, [row]);
      }
      const savedScores = new Map<string, number | null>();
      for (const row of scores.data ?? [])
        savedScores.set(`${row.student_id}|${row.chapter}`, row.score);
      const totals = new Map<string, CoinTotalRow>();
      for (const t of coins.totals) if (t.student_id) totals.set(t.student_id, t);
      // Only used if the coin totals view is not set up yet.
      const dailyFromLog = new Map<string, number>();
      for (const m of markLog.data ?? []) {
        dailyFromLog.set(m.student_id, (dailyFromLog.get(m.student_id) ?? 0) + m.marks);
      }
      const students: Student[] = (roster.data ?? []).map((s) => {
        const own = assessmentsByStudent.get(s.id) ?? [];
        const fromSheet = chapterScoresFromAssessments(own, CHAPTER_COUNT);
        const ownVideos = videosByStudent.get(s.id) ?? [];
        const total = totals.get(s.id);
        // A score the teacher typed in the app wins; otherwise use the Google Sheet's score.
        const chapterScores: (number | null)[] = [];
        const scoreSources: ScoreSource[] = [];
        for (let ch = 1; ch <= CHAPTER_COUNT; ch++) {
          const saved = savedScores.get(`${s.id}|${ch}`);
          if (saved !== undefined && saved !== null) {
            chapterScores.push(saved);
            scoreSources.push("manual");
          } else {
            const sheet = fromSheet[ch - 1] ?? null;
            chapterScores.push(sheet);
            scoreSources.push(sheet === null ? null : "sheet");
          }
        }
        return {
          id: s.id,
          userId: s.user_id,
          name: s.name,
          email: s.email,
          set: s.math_set as Student["set"],
          scores: chapterScores,
          scoreSources,
          lastMonthAvg: s.last_month_avg,
          lastMonthFormRank: s.last_month_form_rank,
          xp: s.xp,
          streak: s.streak,
          dailyMarks: total?.daily_earned ?? dailyFromLog.get(s.id) ?? 0,
          videoMarks: ownVideos.length,
          coinsSpent: total?.spent ?? 0,
          rewardCoins: total?.reward_earned ?? 0,
          checkinCoins: total?.checkin_earned ?? 0,
          shopSpent: total?.shop_spent ?? 0,
          completedVideos: ownVideos.flatMap((v) => (v.video_id ? [v.video_id] : [])),
          assessments: own,
          hlcNo: s.hlc_no,
          className: s.class_name,
          classNo: s.class_no,
        };
      });
      const role: Store["role"] = roles.data?.some((r) => r.role === "teacher")
        ? "teacher"
        : "student";
      // The demo login is for trying the student view only; keep it out of every teacher list.
      const demoIds = new Set(students.filter((s) => s.email === DEMO_EMAIL).map((s) => s.id));
      const hideDemo = role === "teacher" && demoIds.size > 0;
      const allMarks = markLog.data ?? [];
      const game = await loadGameData(role);
      return {
        lastSync: syncs.data?.[0]?.created_at ?? null,
        students: hideDemo ? students.filter((s) => !demoIds.has(s.id)) : students,
        role,
        content: content.data ?? [],
        videos: chapterVideos.data ?? [],
        markLog: hideDemo ? allMarks.filter((m) => !demoIds.has(m.student_id)) : allMarks,
        rewards: coins.rewards,
        redemptions: hideDemo
          ? coins.redemptions.filter((r) => !demoIds.has(r.student_id))
          : coins.redemptions,
        coinsError: coins.error,
        homework: homeworkData.rows,
        homeworkError: homeworkData.error,
        systemConfig: configData.config,
        configError: configData.error,
        game,
        extras,
      };
    },
  });
  const data = query.data;
  const actualRole: Store["role"] = data?.role ?? "student";
  const doubleEvent = data?.systemConfig.isDoubleMCEventActive ?? false;
  const systemConfig = useMemo<SystemConfig>(
    () => ({ isDoubleMCEventActive: doubleEvent }),
    [doubleEvent],
  );
  const game = data?.game;
  // Without a saved ledger every reward would be new, so keep everything at 1x until 0010 is run.
  const gameConfig = game && game.error === null ? systemConfig : DEFAULT_SYSTEM_CONFIG;
  const liveCosmetics = useMemo(
    () =>
      new Map<string, Cosmetics>(
        (game?.cosmetics ?? []).map((r) => [r.student_id, cosmeticsFromRow(r)]),
      ),
    [game],
  );
  const cosmeticsOf = useCallback(
    (studentId: string): Cosmetics =>
      liveCosmetics.get(studentId) ?? MOCK_COSMETICS.get(studentId) ?? DEFAULT_COSMETICS,
    [liveCosmetics],
  );
  const ownRecord = data?.students.find((s) => s.userId === user?.id) ?? null;
  const isDemo = actualRole === "student" && ownRecord?.email === DEMO_EMAIL;
  // Ranks need the whole set, which only a teacher's account can read. Teachers work the game
  // out in the browser; students read what the teacher last published.
  const teacherWorld = useMemo(() => {
    if (!data || data.role !== "teacher" || data.students.length === 0) return null;
    return buildGameWorld({
      students: data.students,
      config: gameConfig,
      ledger: data.game.ledger,
      cosmetics: liveCosmetics,
      voiceCounts: countVoiceMarks(data.markLog),
      rewardsSpendable: false,
    });
  }, [data, gameConfig, liveCosmetics]);
  // The sandbox: teachers preview it, and the public demo login plays in it so it never sees
  // real classmates.
  const sandboxWorld = useMemo(() => {
    if (actualRole !== "teacher" && !isDemo) return null;
    // The demo account's saved rewards are already in its database balance, so they are
    // taken out here and counted once, from the sandbox ledger.
    const demo = isDemo && ownRecord ? [{ ...ownRecord, rewardCoins: 0 }] : [];
    const demoVoice = countVoiceMarks(data?.markLog ?? []);
    return buildGameWorld({
      students: [...MOCK_STUDENTS, ...demo],
      config: gameConfig,
      ledger: [...mockSeedLedger(), ...(isDemo ? (game?.ledger ?? []) : [])],
      cosmetics: new Map<string, Cosmetics>([...MOCK_COSMETICS, ...liveCosmetics]),
      voiceCounts: new Map<string, number>([...MOCK_VOICE_COUNTS, ...demoVoice]),
      // Sandbox rewards live only here, so they count towards the sandbox balance.
      rewardsSpendable: true,
    });
  }, [actualRole, isDemo, ownRecord, data?.markLog, game, gameConfig, liveCosmetics]);
  const liveStudents = useMemo(() => {
    const rows = data?.students ?? [];
    return teacherWorld ? rows.map((s) => attachGame(s, teacherWorld.profiles)) : rows;
  }, [data, teacherWorld]);
  const mockStudents = useMemo(
    () =>
      actualRole === "teacher" && sandboxWorld
        ? MOCK_STUDENTS.map((s) => attachGame(s, sandboxWorld.profiles))
        : [],
    [actualRole, sandboxWorld],
  );
  const previewStudent =
    actualRole === "teacher" && previewId !== null
      ? (liveStudents.find((s) => s.id === previewId) ??
        mockStudents.find((s) => s.id === previewId) ??
        null)
      : null;
  const previewSource: Store["previewSource"] = previewStudent
    ? isMockStudentId(previewStudent.id)
      ? "mock"
      : "live"
    : null;
  // Forget a preview that no longer matches anyone (for example after signing in as a student).
  useEffect(() => {
    if (data && previewId !== null && previewStudent === null) rememberPreview(null);
  }, [data, previewId, previewStudent, rememberPreview]);
  const loadedSnapshot = useMemo(() => {
    if (actualRole !== "student" || isDemo || !ownRecord) return null;
    const row = game?.snapshots.find((r) => r.student_id === ownRecord.id);
    return row ? parseSnapshot(row.payload) : null;
  }, [actualRole, isDemo, ownRecord, game]);
  const loadedBoards = useMemo(
    () =>
      (game?.boards ?? []).flatMap((r) => {
        const b = parseLeaderboard(r.payload);
        return b ? [b] : [];
      }),
    [game],
  );
  let gameSnapshot: StudentSnapshot | null = null;
  let boards: Leaderboard[] = [];
  if (previewStudent) {
    const world = previewSource === "mock" ? sandboxWorld : teacherWorld;
    gameSnapshot = world?.snapshots.get(previewStudent.id) ?? null;
    boards = world?.boards ?? [];
  } else if (actualRole === "teacher") {
    boards = teacherWorld?.fullBoards ?? [];
  } else if (isDemo && ownRecord) {
    gameSnapshot = sandboxWorld?.snapshots.get(ownRecord.id) ?? null;
    boards = sandboxWorld?.boards ?? [];
  } else {
    gameSnapshot = loadedSnapshot;
    boards = loadedBoards;
  }
  const students = user ? liveStudents : [];
  const metaName: unknown = user?.user_metadata?.["full_name"];
  const fallbackMe: Student = {
    id: "",
    name: typeof metaName === "string" && metaName ? metaName : "Student",
    email: user?.email ?? "",
    set: "S2M3",
    scores: Array.from({ length: CHAPTER_COUNT }, () => null),
    scoreSources: [],
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks: 0,
    videoMarks: 0,
    coinsSpent: 0,
    completedVideos: [],
  };
  const baseMe = previewStudent ?? (user ? ownRecord : null) ?? fallbackMe;
  const me: Student =
    gameSnapshot && !baseMe.game ? { ...baseMe, game: gameSnapshot.profile } : baseMe;
  const isPreview = previewStudent !== null;
  const extras = data?.extras;
  const ownedItems = (extras?.purchases ?? [])
    .filter((p) => p.student_id === me.id)
    .map((p) => p.item_id);
  const boughtGrants = (extras?.shopItems ?? [])
    .filter((i) => ownedItems.includes(i.id))
    .flatMap((i) => i.grants);
  const myUnlocks = mergeUnlocks(gameSnapshot?.unlocks ?? null, boughtGrants);
  const selfChecks = isMockStudentId(me.id)
    ? mockSelfChecks(me.id)
    : (game?.selfChecks ?? []).filter((r) => r.student_id === me.id).map((r) => r.objective_id);
  const setDoubleMcEvent = async (active: boolean) => {
    if (actualRole !== "teacher") {
      throw new Error("Only teacher accounts can change the 2x Math Coins event");
    }
    const { data: rows, error } = await supabase
      .from("system_config")
      .update({
        double_mc_event_active: active,
        updated_at: new Date().toISOString(),
        updated_by: user?.id ?? null,
      })
      .eq("id", true)
      .select("id");
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      throw new Error(
        "The 2x Math Coins event switch was not found. Run supabase/sql/0009_system_config.sql in the Supabase SQL Editor.",
      );
    }
    await query.refetch();
  };
  return (
    <Ctx.Provider
      value={{
        session: user ? { email: user.email ?? "", name: me.name } : null,
        role: isPreview ? "student" : actualRole,
        actualRole,
        students,
        me,
        ready: hydrated && (!user || !query.isPending),
        error: query.error?.message ?? null,
        content: data?.content ?? [],
        videos: data?.videos ?? [],
        lastSync: data?.lastSync ?? null,
        markLog: data?.markLog ?? [],
        rewards: data?.rewards ?? [],
        redemptions: data?.redemptions ?? [],
        coinsError: data?.coinsError ?? null,
        homework: data?.homework ?? [],
        homeworkError: data?.homeworkError ?? null,
        isPreview,
        readOnly: isPreview,
        previewSource,
        startPreview: (studentId) => {
          if (actualRole === "teacher") rememberPreview(studentId);
        },
        exitPreview: () => rememberPreview(null),
        mockStudents,
        systemConfig,
        configError: data?.configError ?? null,
        setDoubleMcEvent,
        gameSnapshot,
        boards,
        gameError: game?.error ?? null,
        gamePublishedAt: isDemo ? (gameSnapshot?.generatedAt ?? null) : (game?.publishedAt ?? null),
        cosmeticsOf,
        selfChecks,
        isDemo,
        shopItems: extras?.shopItems ?? [],
        ownedItems,
        myUnlocks,
        examDates: extras?.examDates ?? [],
        extrasError: extras?.error ?? null,
        refresh: () => query.refetch(),
        logout: async () => {
          rememberPreview(null);
          await supabase.auth.signOut();
          qc.clear();
          setUser(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
```
