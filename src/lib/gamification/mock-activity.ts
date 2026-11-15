import { CHAPTER_OBJECTIVES } from "./catalog";
import type { ActivityEvent } from "./types";

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
