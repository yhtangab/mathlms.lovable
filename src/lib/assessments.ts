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
