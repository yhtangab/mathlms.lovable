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
