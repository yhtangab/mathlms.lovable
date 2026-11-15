import { describe, expect, it } from "vitest";
import type { Assessment } from "@/lib/assessments";
import type { MathSet, Student } from "@/lib/data";
import {
  chapterCompletion,
  chapterStars,
  computeUnlocks,
  titleById,
} from "@/lib/gamification/catalog";
import { MOCK_COSMETICS, MOCK_STUDENTS, mockSeedLedger } from "@/lib/gamification/mock-data";
import { mockActivity, mockSelfChecks } from "@/lib/gamification/mock-activity";
import {
  boardId,
  buildGameWorld,
  parseLeaderboard,
  parseSnapshot,
  quantile,
} from "@/lib/gamification/world";

function row(
  label: string,
  score: number | null,
  full: number,
  extra: Partial<Assessment> = {},
): Assessment {
  return {
    term: 1,
    kind: "item",
    category: label.startsWith("CQ") ? "chapter_quiz" : "short_quiz",
    label,
    score,
    absent: false,
    full_marks: full,
    position: 1,
    ...extra,
  };
}

function student(i: number, set: MathSet, assessments: Assessment[]): Student {
  return {
    id: `${set}-${String(i).padStart(2, "0")}`,
    name: `Student ${set} ${i}`,
    email: `s${i}@hlc.edu.hk`,
    set,
    scores: [],
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    assessments,
    className: "2A",
    classNo: String(i),
  };
}

/** 14 students; student i scores 100 - 5i on SQ1.1 and 190 - 5i in the Term Test, CA and Exam. */
function classOf14(set: MathSet = "S2M3"): Student[] {
  return Array.from({ length: 14 }, (_, k) => {
    const i = k + 1;
    return student(i, set, [
      row("SQ1.1", 100 - 5 * i, 100),
      row("1st TT (200)", 190 - 5 * i, 200, { category: "term_test", position: 50 }),
      row("T1A2 (200)", 190 - 5 * i, 200, { kind: "summary", category: "overall", position: 51 }),
      row("T1A3 (200)", 190 - 5 * i, 200, { kind: "summary", category: "exam", position: 52 }),
    ]);
  });
}

describe("published leaderboards", () => {
  const world = buildGameWorld({ students: classOf14(), config: { isDoubleMCEventActive: false } });
  const id = boardId("S2M3", "total", 1);
  const board = world.boards.find((b) => b.id === id);

  it("names only the top 10", () => {
    expect(board?.top).toHaveLength(10);
    expect(board?.top[0]).toMatchObject({ rank: 1, name: "Student S2M3 1", score: 185 });
    expect(board?.anonymousCodes).toHaveLength(4);
  });

  it("never puts the names or ids of students below 10th into the published board", () => {
    const text = JSON.stringify(board);
    for (const i of [11, 12, 13, 14]) {
      expect(text.includes(`Student S2M3 ${i}`)).toBe(false);
      expect(text.includes(`S2M3-${i}`)).toBe(false);
    }
  });

  it("gives teachers the full list", () => {
    expect(world.fullBoards.find((b) => b.id === id)?.top).toHaveLength(14);
  });

  it("tells a student below 10th how far they are from 10th, without the exact rank", () => {
    const standing = world.snapshots.get("S2M3-12")?.boards.find((b) => b.boardId === id);
    expect(standing).toMatchObject({ display: "10+", rank: null, isTop10: false, gapToTop10: 10 });
    expect(board?.anonymousCodes).toContain(standing?.anonymousCode);
  });

  it("builds a form-wide board across both sets", () => {
    const both = buildGameWorld({
      students: [...classOf14("S2M3"), ...classOf14("S2M5")],
      config: { isDoubleMCEventActive: false },
    });
    const s2 = both.boards.find((b) => b.id === boardId("S2", "total", 1));
    expect(s2?.rankedCount).toBe(28);
    expect(s2?.top[0]?.rank).toBe(1);
    expect(s2?.top[1]?.rank).toBe(1);
  });
});

describe("snapshots", () => {
  const world = buildGameWorld({ students: classOf14(), config: { isDoubleMCEventActive: false } });
  const snap = world.snapshots.get("S2M3-05");

  it("shows the set's spread for a quiz with the student's own mark", () => {
    const sq = snap?.distributions.find((d) => d.label === "SQ1.1");
    expect(sq).toMatchObject({ count: 14, min: 30, max: 95, median: 62.5, mine: 75 });
  });

  it("works out radar areas from the chapter of each quiz", () => {
    const algebra = snap?.radar.find((a) => a.strand === "number_algebra");
    expect(algebra?.mine).toBe(75);
    expect(algebra?.setAverage).toBe(62.5);
    expect(snap?.radar.find((a) => a.strand === "trigonometry")?.mine).toBeNull();
  });

  it("survives saving as JSON and reading back", () => {
    const back = parseSnapshot(JSON.parse(JSON.stringify(snap)));
    expect(back?.studentId).toBe("S2M3-05");
    expect(parseSnapshot({ version: 99 })).toBeNull();
    const board = world.boards[0];
    expect(parseLeaderboard(JSON.parse(JSON.stringify(board)))?.id).toBe(board?.id);
  });

  it("hides the spread when fewer than 5 students sat the quiz", () => {
    const small = buildGameWorld({
      students: classOf14().slice(0, 4),
      config: { isDoubleMCEventActive: false },
    });
    expect(small.snapshots.get("S2M3-01")?.distributions).toHaveLength(0);
  });
});

describe("unlocks", () => {
  const world = buildGameWorld({ students: classOf14(), config: { isDoubleMCEventActive: false } });

  it("unlocks the neon frame and Pythagoras' Heir for 1st place", () => {
    const top = world.snapshots.get("S2M3-01")?.unlocks;
    expect(top?.frames).toContain("frame-neon");
    expect(top?.titles).toContain("title-pythagoras");
    const last = world.snapshots.get("S2M3-14")?.unlocks;
    expect(last?.frames).toEqual(["frame-default"]);
  });

  it("finds titles by id or by label", () => {
    expect(titleById("title-algebra-ace")?.label).toBe("Algebra Ace");
    expect(titleById("Algebra Ace")?.id).toBe("title-algebra-ace");
    expect(titleById("No such title")).toBeNull();
  });

  it("keeps everything locked for an empty profile except the default frame", () => {
    const snap = world.snapshots.get("S2M3-14");
    if (!snap) throw new Error("missing snapshot");
    const empty = computeUnlocks({
      profile: {
        ...snap.profile,
        standings: [],
        quizHistory: [],
        level: 1,
        bestHomeworkStreak: 0,
        activeVoiceCount: 0,
      },
      radar: [],
      chapterAverages: [],
    });
    expect(empty).toEqual({ frames: ["frame-default"], titles: [] });
  });
});

describe("chapter completion and stars", () => {
  it("weights videos 40%, self-check 40% and the chapter quiz 20%", () => {
    const c = chapterCompletion({
      videosTotal: 4,
      videosWatched: 2,
      objectivesTotal: 5,
      objectivesChecked: 5,
      chapterQuizDone: false,
    });
    expect(c.percent).toBe(60);
  });

  it("shares the weight between self-check and quiz when a chapter has no videos", () => {
    const c = chapterCompletion({
      videosTotal: 0,
      videosWatched: 0,
      objectivesTotal: 4,
      objectivesChecked: 4,
      chapterQuizDone: true,
    });
    expect(c.percent).toBe(100);
  });

  it("gives 0 to 3 stars from the chapter score", () => {
    expect(chapterStars(null)).toBe(0);
    expect(chapterStars(49)).toBe(0);
    expect(chapterStars(50)).toBe(1);
    expect(chapterStars(70)).toBe(2);
    expect(chapterStars(85)).toBe(3);
  });

  it("works out quartiles like a spreadsheet", () => {
    expect(quantile([1, 2, 3, 4], 0.25)).toBe(1.75);
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2.5);
  });
});

describe("sandbox", () => {
  it("builds snapshots and boards for every sandbox student", () => {
    const world = buildGameWorld({
      students: MOCK_STUDENTS,
      config: { isDoubleMCEventActive: false },
      ledger: mockSeedLedger(),
      cosmetics: MOCK_COSMETICS,
    });
    expect(world.snapshots.size).toBe(30);
    expect(
      world.boards.find((b) => b.id === boardId("S2M5", "total", 1))?.top.length,
    ).toBeGreaterThanOrEqual(10);
  });

  it("has activity on school days only and self-checks for Chapters 1–5", () => {
    const events = mockActivity("mock-s2m3-01", new Date(2026, 10, 15));
    expect(events.length).toBeGreaterThan(50);
    expect(events.every((e) => ![0, 6].includes(new Date(`${e.date}T12:00:00`).getDay()))).toBe(
      true,
    );
    expect(mockSelfChecks("mock-s2m3-01").every((id) => /^ch[1-5]-/.test(id))).toBe(true);
  });
});
