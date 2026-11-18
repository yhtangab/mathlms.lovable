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

export const DATE_KIND_CHIP: Record<ExamKind, string> = {
  quiz: "bg-gold/25 text-gold-deep",
  exam: "bg-destructive/10 text-destructive",
  term_test: "bg-destructive/10 text-destructive",
  other: "bg-sky/20 text-sky-deep",
};

export const DATE_KIND_EDGE: Record<ExamKind, string> = {
  quiz: "border-gold",
  exam: "border-destructive",
  term_test: "border-destructive",
  other: "border-sky",
};

export function dateKindLabel(kind: ExamKind): string {
  return EXAM_KINDS.find((item) => item.id === kind)?.label ?? "Date";
}

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
