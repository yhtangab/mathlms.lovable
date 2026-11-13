import { describe, expect, it } from "vitest";
import {
  dueStatus,
  fromLocalInput,
  homeworkForSet,
  splitByDue,
  toLocalInput,
} from "@/lib/homework";

const now = new Date(2026, 10, 13, 10, 0);
const at = (days: number, hour: number, minute = 0) =>
  new Date(2026, 10, 13 + days, hour, minute).toISOString();

describe("homework deadlines", () => {
  it("treats a deadline earlier today as passed", () => {
    expect(dueStatus(at(0, 9), now)).toBe("past");
  });
  it("labels a deadline later today", () => {
    expect(dueStatus(at(0, 23, 59), now)).toBe("today");
  });
  it("labels tomorrow, this week and later", () => {
    expect(dueStatus(at(1, 8), now)).toBe("tomorrow");
    expect(dueStatus(at(5, 8), now)).toBe("week");
    expect(dueStatus(at(10, 8), now)).toBe("later");
  });
  it("shows a set its own homework plus homework for all sets", () => {
    const list = [{ math_set: "ALL" }, { math_set: "S2M3" }, { math_set: "S2M5" }];
    expect(homeworkForSet(list, "S2M3").map((h) => h.math_set)).toEqual(["ALL", "S2M3"]);
  });
  it("sorts upcoming by nearest deadline and past by most recent", () => {
    const list = [
      { due_at: at(3, 8) },
      { due_at: at(-2, 8) },
      { due_at: at(1, 8) },
      { due_at: at(-1, 8) },
    ];
    const { upcoming, past } = splitByDue(list, now);
    expect(upcoming.map((h) => h.due_at)).toEqual([at(1, 8), at(3, 8)]);
    expect(past.map((h) => h.due_at)).toEqual([at(-1, 8), at(-2, 8)]);
  });
  it("round-trips the date picker value", () => {
    const d = new Date(2026, 10, 14, 8, 30);
    expect(toLocalInput(d)).toBe("2026-11-14T08:30");
    expect(fromLocalInput("2026-11-14T08:30")).toBe(d.toISOString());
    expect(fromLocalInput("")).toBeNull();
  });
});
