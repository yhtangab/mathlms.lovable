import { describe, expect, it } from "vitest";
import type { QuizResult } from "@/lib/gamification/types";
import {
  chasingListText,
  homeworkPenalty,
  lessonsSincePick,
  nextCheckStatus,
  pickWeightFor,
  summarizeChecks,
  weightedPick,
  type CheckAssignment,
} from "@/lib/teacher-portal";

const hw = (id: string, dueAt: string): CheckAssignment => ({ id, title: id, dueAt });

describe("homework matrix", () => {
  const assignments = [hw("a", "2026-01-01"), hw("b", "2026-01-02"), hw("c", "2026-01-03")];

  it("cycles Submitted, Missing, Late, Redo", () => {
    expect(nextCheckStatus(null)).toBe("submitted");
    expect(nextCheckStatus("submitted")).toBe("missing");
    expect(nextCheckStatus("missing")).toBe("late");
    expect(nextCheckStatus("late")).toBe("redo");
    expect(nextCheckStatus("redo")).toBe("submitted");
  });

  it("counts a streak through late work and pays +3 MC every 10", () => {
    const ids = Array.from({ length: 10 }, (_, i) =>
      hw(String(i), `2026-01-${String(i + 1).padStart(2, "0")}`),
    );
    const summary = summarizeChecks("s", ids, (id) => (id === "4" ? "late" : "submitted"));
    expect(summary.streak).toBe(10);
    expect(summary.missing).toBe(0);
    expect(summary.grants).toHaveLength(1);
    expect(summary.grants[0]?.baseMc).toBe(3);
  });

  it("resets the streak on missing and redo, and only missing counts towards the alert", () => {
    const summary = summarizeChecks("s", assignments, (id) =>
      id === "a" ? "submitted" : id === "b" ? "missing" : "redo",
    );
    expect(summary.streak).toBe(0);
    expect(summary.missing).toBe(1);
    expect(homeworkPenalty(2)).toBe(0);
    expect(homeworkPenalty(3)).toBe(6);
  });

  it("groups the chasing list by assignment and flags a third miss", () => {
    const text = chasingListText({
      set: "S2M3",
      assignments,
      students: [{ id: "s", name: "Ada", className: "2A", classNo: "1" }],
      statusOf: (_student, id) => (id === "b" ? "missing" : "submitted"),
      missingOf: () => 3,
    });
    expect(text).toContain("b (1 missing)");
    expect(text).toContain("Ada (2A 1) (missing 3 times)");
    expect(text).not.toContain("\na ");
  });
});

describe("weighted picker", () => {
  const quiz = (percent: number, chapter = 3): QuizResult => ({
    quizId: "q",
    term: 1,
    kind: "SQ",
    label: "SQ",
    chapter,
    score: percent,
    fullMarks: 100,
    absent: false,
    percent,
    position: 1,
    isMostImproved: false,
  });

  it("gives 3× for a chapter quiz under 50% before an absence gap", () => {
    const weight = pickWeightFor({
      studentId: "s",
      set: "S2M3",
      events: [],
      chapter: 3,
      quizzes: [quiz(40)],
    });
    expect(weight.weight).toBe(3);
    expect(weight.reason).toContain("Needs Ch.3 Practice");
  });

  it("gives 3× when the student missed the last 3 lessons", () => {
    const events = ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04"].map((lessonDate) => ({
      studentId: "other",
      set: "S2M3",
      lessonDate,
    }));
    expect(lessonsSincePick("s", "S2M3", events)).toBe(4);
    const weight = pickWeightFor({
      studentId: "s",
      set: "S2M3",
      events,
      chapter: null,
      quizzes: [],
    });
    expect(weight.reason).toBe("⏳ Not picked in 4 lessons");
  });

  it("draws a weighted student more often than an even one", () => {
    let weighted = 0;
    for (let i = 0; i < 300; i++) {
      const pick = weightedPick(
        [
          { item: "even", weight: 1 },
          { item: "priority", weight: 3 },
        ],
        i / 300,
      );
      if (pick === "priority") weighted += 1;
    }
    expect(weighted).toBeGreaterThan(200);
  });
});
