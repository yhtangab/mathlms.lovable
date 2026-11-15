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
