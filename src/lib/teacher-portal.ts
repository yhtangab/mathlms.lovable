import { REWARD_RULES, eventMultiplier } from "@/lib/gamification/rules";
import type { QuizResult, SystemConfig } from "@/lib/gamification/types";
import type { MathSet } from "@/lib/data";

/** Cell states on the homework matrix. Blank means the teacher has not marked it yet. */
export type CheckStatus = "submitted" | "missing" | "late" | "redo";

export const CHECK_CYCLE: readonly CheckStatus[] = ["submitted", "missing", "late", "redo"];

export const CHECK_MARK: Record<CheckStatus, string> = {
  submitted: "✅",
  missing: "❌",
  late: "⚠️",
  redo: "🔄",
};

export const CHECK_LABEL: Record<CheckStatus, string> = {
  submitted: "Submitted",
  missing: "Missing",
  late: "Late",
  redo: "Redo",
};

/** Missing homeworks at or above this count raise the red alert. */
export const MISSING_ALERT = 3;
/** Marks taken off the homework score for every missing homework, once the alert applies. */
export const MARKS_PER_MISSING = 2;

/** Students not picked in this many lessons, or weak on the current chapter, are drawn more often. */
export const LESSONS_WITHOUT_PICK = 3;
export const PICK_WEIGHT = 3;
export const QUIZ_PRIORITY_PERCENT = 50;

export type PickMode = "random" | "weighted";

export interface HomeworkCheck {
  studentId: string;
  homeworkId: string;
  status: CheckStatus;
}

export interface CheckAssignment {
  id: string;
  title: string;
  dueAt: string;
}

export interface CheckSummary {
  streak: number;
  best: number;
  missing: number;
  /** sourceKey values for streak rewards this record has earned. */
  grants: { sourceKey: string; description: string; baseMc: number }[];
}

export interface PickEvent {
  studentId: string;
  set: string;
  lessonDate: string;
}

export interface PickWeight {
  weight: number;
  reason: string | null;
}

export function nextCheckStatus(current: CheckStatus | null): CheckStatus {
  if (current === null) return "submitted";
  const i = CHECK_CYCLE.indexOf(current);
  return CHECK_CYCLE[(i + 1) % CHECK_CYCLE.length] ?? "submitted";
}

export function checkKey(studentId: string, homeworkId: string): string {
  return `${studentId}|${homeworkId}`;
}

/** Submitted and late both count as handed in. Redo breaks the streak without counting as missing. */
export function summarizeChecks(
  studentId: string,
  assignments: readonly CheckAssignment[],
  statusOf: (homeworkId: string) => CheckStatus | null,
): CheckSummary {
  const rule = REWARD_RULES.homeworkStreak;
  let streak = 0;
  let best = 0;
  let missing = 0;
  const grants: CheckSummary["grants"] = [];
  const ordered = [...assignments].sort(
    (a, b) => a.dueAt.localeCompare(b.dueAt) || a.title.localeCompare(b.title),
  );
  for (const hw of ordered) {
    const status = statusOf(hw.id);
    if (status === null || status === "redo") {
      if (status === "redo") streak = 0;
      continue;
    }
    if (status === "missing") {
      missing += 1;
      streak = 0;
      continue;
    }
    streak += 1;
    best = Math.max(best, streak);
    if (streak % rule.every === 0) {
      grants.push({
        sourceKey: `hw-streak:${hw.id}`,
        description: `${streak} homework handed in a row (up to ${hw.title})`,
        baseMc: rule.mc,
      });
    }
  }
  return { streak, best, missing, grants };
}

export function homeworkPenalty(missing: number): number {
  return missing >= MISSING_ALERT ? missing * MARKS_PER_MISSING : 0;
}

export function streakRewardMc(baseMc: number, config: SystemConfig): number {
  return baseMc * eventMultiplier(config);
}

export interface ChaseStudent {
  id: string;
  name: string;
  className?: string;
  classNo?: string;
}

/** Text ready to paste into Google Classroom or WhatsApp. */
export function chasingListText(input: {
  set: string;
  assignments: readonly CheckAssignment[];
  students: readonly ChaseStudent[];
  statusOf: (studentId: string, homeworkId: string) => CheckStatus | null;
  missingOf: (studentId: string) => number;
}): string {
  const lines = [`追功課名單 · ${input.set}`];
  let any = false;
  for (const hw of input.assignments) {
    const missing = input.students.flatMap((s) => {
      if (input.statusOf(s.id, hw.id) !== "missing") return [];
      const count = input.missingOf(s.id);
      const who = [s.className, s.classNo].filter(Boolean).join(" ");
      const warn = count >= MISSING_ALERT ? ` ⚠️ 第${count}次欠交` : "";
      return [`- ${s.name}${who ? `（${who}）` : ""}${warn}`];
    });
    if (missing.length === 0) continue;
    any = true;
    lines.push("", `${hw.title}（欠交 ${missing.length}）`, ...missing);
  }
  if (!any) lines.push("", "目前沒有欠交。");
  return lines.join("\n");
}

export function hkLessonDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** How many recorded lessons have happened since this student was last picked. */
export function lessonsSincePick(
  studentId: string,
  set: string,
  events: readonly PickEvent[],
): number {
  const dates = [...new Set(events.filter((e) => e.set === set).map((e) => e.lessonDate))].sort();
  const last = events
    .filter((e) => e.set === set && e.studentId === studentId)
    .map((e) => e.lessonDate)
    .sort()
    .at(-1);
  if (!last) return dates.length;
  const index = dates.lastIndexOf(last);
  if (index < 0) return dates.length;
  return dates.length - 1 - index;
}

export function currentChapter(
  students: readonly { game?: { quizHistory: readonly QuizResult[] } | null }[],
): number | null {
  let chapter: number | null = null;
  for (const s of students) {
    for (const q of s.game?.quizHistory ?? []) {
      if (q.chapter !== null && (chapter === null || q.chapter > chapter)) chapter = q.chapter;
    }
  }
  return chapter;
}

export function pickWeightFor(input: {
  studentId: string;
  set: string;
  events: readonly PickEvent[];
  chapter: number | null;
  quizzes: readonly QuizResult[];
}): PickWeight {
  const quizzes = input.quizzes
    .filter((q) => input.chapter !== null && q.chapter === input.chapter && !q.absent)
    .sort((a, b) => a.position - b.position);
  const latest = quizzes.at(-1);
  if (
    input.chapter !== null &&
    latest !== undefined &&
    (latest.percent ?? 0) < QUIZ_PRIORITY_PERCENT
  ) {
    return {
      weight: PICK_WEIGHT,
      reason: `🎯 Priority Pick: Needs Ch.${input.chapter} Practice`,
    };
  }
  const gap = lessonsSincePick(input.studentId, input.set, input.events);
  if (gap >= LESSONS_WITHOUT_PICK) {
    return { weight: PICK_WEIGHT, reason: `⏳ Not picked in ${gap} lessons` };
  }
  return { weight: 1, reason: null };
}

/** `rand` is in [0, 1). Weights below 1 are treated as 1. */
export function weightedPick<T>(
  items: readonly { item: T; weight: number }[],
  rand: number,
): T | null {
  const usable = items.filter((i) => i.weight > 0);
  const total = usable.reduce((sum, i) => sum + i.weight, 0);
  if (total <= 0 || usable.length === 0) return null;
  let cursor = Math.min(Math.max(rand, 0), 0.999999) * total;
  for (const entry of usable) {
    cursor -= entry.weight;
    if (cursor < 0) return entry.item;
  }
  return usable[usable.length - 1]?.item ?? null;
}

export function randomUnit(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) / 2 ** 32;
}

export function assignmentsForSet<T extends { math_set: string }>(
  list: readonly T[],
  set: MathSet,
): T[] {
  return list.filter((h) => h.math_set === "ALL" || h.math_set === set);
}
