import { describe, expect, it } from "vitest";
import { coinBalance } from "@/lib/coins";
import { BADGES, badgeProgress, tierFor, topicMasterCount } from "@/lib/gamification/badges";
import { mergeUnlocks, objectivesFor } from "@/lib/gamification/catalog";
import {
  CHECKIN_QUESTIONS,
  checkinStreak,
  hkDateKey,
  questionForDay,
} from "@/lib/gamification/checkin";
import { splitMath } from "@/lib/gamification/math-text";
import type { QuizResult } from "@/lib/gamification/types";
import { countdownParts, nextExam, nextStatus, type ExamDate } from "@/lib/gamification/vault";

function cq(chapter: number, percent: number, improved = false): QuizResult {
  return {
    quizId: `1:CQ${chapter}`,
    term: 1,
    kind: "CQ",
    label: `CQ${chapter}`,
    chapter,
    score: percent,
    fullMarks: 100,
    absent: false,
    percent,
    position: chapter,
    isMostImproved: improved,
  };
}

describe("coin balance", () => {
  it("adds lessons, videos, quiz rewards and check-ins, minus tickets and Shop items", () => {
    expect(
      coinBalance({
        dailyMarks: 10,
        videoMarks: 3,
        rewardCoins: 8,
        checkinCoins: 2,
        coinsSpent: 6,
        shopSpent: 5,
      }),
    ).toBe(12);
  });
});

describe("shop unlocks", () => {
  it("adds bought frames and titles to what was earned", () => {
    const u = mergeUnlocks({ frames: ["frame-default"], titles: ["title-rising-star"] }, [
      "frame-gold",
      "title-graph-guru",
    ]);
    expect(u.frames).toContain("frame-gold");
    expect(u.titles).toEqual(["title-rising-star", "title-graph-guru"]);
  });
});

describe("badges", () => {
  it("has the seven badges with four tiers each", () => {
    expect(BADGES).toHaveLength(7);
    expect(BADGES.every((b) => b.thresholds.length === 4)).toBe(true);
  });

  it("finds the tier from the thresholds", () => {
    expect(tierFor(0, [1, 3, 6, 10])).toBe(0);
    expect(tierFor(3, [1, 3, 6, 10])).toBe(2);
    expect(tierFor(99, [1, 3, 6, 10])).toBe(4);
  });

  it("needs 85% in both the self-check and the chapter quiz for Topic Master", () => {
    const allCh1 = objectivesFor(1).map((o) => o.id);
    expect(topicMasterCount([cq(1, 90)], allCh1)).toBe(1);
    expect(topicMasterCount([cq(1, 80)], allCh1)).toBe(0);
    expect(topicMasterCount([cq(1, 90)], allCh1.slice(0, 2))).toBe(0);
  });

  it("counts full marks, comebacks, mistakes and streaks", () => {
    const list = badgeProgress({
      quizzes: [cq(1, 100), cq(2, 100, true)],
      bestHomeworkStreak: 12,
      selfChecks: [],
      luckyDrawCorrect: 10,
      masteredMistakes: 3,
      bestCheckinStreak: 7,
    });
    const by = (id: string) => list.find((b) => b.def.id === id);
    expect(by("full-marks")).toMatchObject({ value: 2, tier: 1, next: 3 });
    expect(by("homework-hero")?.tier).toBe(1);
    expect(by("active-voice")?.tier).toBe(1);
    expect(by("comeback-kid")?.value).toBe(1);
    expect(by("mistake-conqueror")?.tier).toBe(1);
    expect(by("daily-streak")?.tier).toBe(2);
  });
});

describe("daily check-in", () => {
  it("has four questions for every chapter, each with a valid answer", () => {
    for (let ch = 1; ch <= 7; ch++) {
      expect(CHECKIN_QUESTIONS.filter((q) => q.chapter === ch)).toHaveLength(4);
    }
    expect(CHECKIN_QUESTIONS.every((q) => /^q[0-9]-[a-z0-9-]{1,30}$/.test(q.id))).toBe(true);
  });

  it("gives each student the same question all day", () => {
    expect(questionForDay("s1", "2026-11-16").id).toBe(questionForDay("s1", "2026-11-16").id);
  });

  it("uses the Hong Kong date", () => {
    expect(hkDateKey(new Date("2026-11-15T17:30:00Z"))).toBe("2026-11-16");
  });

  it("counts days in a row, and keeps the streak alive until today is over", () => {
    const dates = ["2026-11-10", "2026-11-11", "2026-11-12", "2026-11-14", "2026-11-15"];
    expect(checkinStreak(dates, "2026-11-16")).toEqual({ current: 2, best: 3 });
    expect(checkinStreak(dates, "2026-11-18")).toEqual({ current: 0, best: 3 });
  });
});

describe("Mistake Vault", () => {
  it("splits text and maths", () => {
    expect(splitMath("Solve $x+1=2$ then $$y^2$$ done")).toEqual([
      { kind: "text", value: "Solve " },
      { kind: "math", value: "x+1=2", display: false },
      { kind: "text", value: " then " },
      { kind: "math", value: "y^2", display: true },
      { kind: "text", value: " done" },
    ]);
    expect(splitMath("No maths here")).toEqual([{ kind: "text", value: "No maths here" }]);
  });

  it("moves a mistake from Needs review to Practiced to Mastered", () => {
    expect(nextStatus("review")).toBe("practiced");
    expect(nextStatus("practiced")).toBe("mastered");
    expect(nextStatus("mastered")).toBe("review");
  });

  it("counts down to the next exam for the student's set", () => {
    const now = new Date("2026-11-16T00:00:00Z");
    const list: ExamDate[] = [
      { id: "a", title: "Past", kind: "quiz", set: "ALL", startsAt: "2026-11-01T00:00:00Z" },
      {
        id: "b",
        title: "S2M5 test",
        kind: "term_test",
        set: "S2M5",
        startsAt: "2026-11-20T00:00:00Z",
      },
      { id: "c", title: "Exam", kind: "exam", set: "ALL", startsAt: "2026-12-01T00:00:00Z" },
    ];
    expect(nextExam(list, "S2M3", now)?.id).toBe("c");
    expect(nextExam(list, "S2M5", now)?.id).toBe("b");
    expect(countdownParts(90_061_000)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });
});
