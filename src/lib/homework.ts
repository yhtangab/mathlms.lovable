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
