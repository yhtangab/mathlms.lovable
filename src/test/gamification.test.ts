import { describe, expect, it } from "vitest";
import type { Assessment } from "@/lib/assessments";
import type { Student } from "@/lib/data";
import {
  MOCK_FRESH_QUIZ_ID,
  MOCK_STUDENTS,
  MOCK_COSMETICS,
  mockSeedLedger,
} from "@/lib/gamification/mock-data";
import {
  REWARD_RULES,
  buildGameProfiles,
  computeSetStandings,
  homeworkFromAssessments,
  markMostImproved,
  quizResultsFromAssessments,
  rankLabel,
  rankRewardGrants,
  reconcileLedger,
  summarizeHomework,
  termTotal200,
  toPublicStanding,
  type RosterQuizzes,
} from "@/lib/gamification/rules";
import type { HomeworkRecord, HomeworkStatus } from "@/lib/gamification/types";

interface RowOptions {
  term?: number;
  absent?: boolean;
  position?: number;
}

function quiz(
  label: string,
  score: number | null,
  full: number,
  opts: RowOptions = {},
): Assessment {
  return {
    term: opts.term ?? 1,
    kind: "item",
    category: label.startsWith("CQ") ? "chapter_quiz" : "short_quiz",
    label,
    score: opts.absent ? null : score,
    absent: opts.absent ?? false,
    full_marks: full,
    position: opts.position ?? 0,
  };
}

/** One quiz column for a set: a number is a mark, "ABS" is absent, null is no entry yet. */
function roster(label: string, marks: (number | "ABS" | null)[], full = 20): RosterQuizzes[] {
  return marks.map((m, i) => ({
    studentId: `s${i + 1}`,
    quizzes:
      m === null
        ? []
        : quizResultsFromAssessments([
            quiz(label, m === "ABS" ? null : m, full, { absent: m === "ABS" }),
          ]),
  }));
}

function standingsOf(rows: RosterQuizzes[]) {
  const map = computeSetStandings(rows);
  return rows.map((r) => map.get(r.studentId)?.[0]);
}

function hw(statuses: HomeworkStatus[]): HomeworkRecord[] {
  return statuses.map((status, i) => ({
    homeworkId: `1:HW${i + 1}`,
    term: 1,
    label: `HW${i + 1}`,
    position: i,
    status,
  }));
}

function student(id: string, assessments: Assessment[]): Student {
  return {
    id,
    name: id,
    email: `${id}@hlc.edu.hk`,
    set: "S2M3",
    scores: [],
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks: 10,
    videoMarks: 2,
    coinsSpent: 5,
    assessments,
  };
}

describe("quiz ranks", () => {
  it("gives tied students the same rank and skips the next one", () => {
    const ranks = standingsOf(roster("SQ1.1", [18, 18, 17, 16])).map((s) => s?.rank);
    expect(ranks).toEqual([1, 1, 3, 4]);
  });

  it("pays +3 MC / 150 EXP to ranks 1–3 and +1 MC / 50 EXP to ranks 4–10", () => {
    const rows = roster("SQ1.1", [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9]);
    const map = computeSetStandings(rows);
    const paid = rows.map((r) => rankRewardGrants(r.studentId, map.get(r.studentId) ?? []));
    expect(paid[0]?.[0]).toMatchObject({ reason: "quiz_top3", baseMc: 3, exp: 150 });
    expect(paid[2]?.[0]).toMatchObject({ reason: "quiz_top3", baseMc: 3, exp: 150 });
    expect(paid[3]?.[0]).toMatchObject({ reason: "quiz_top10", baseMc: 1, exp: 50 });
    expect(paid[9]?.[0]).toMatchObject({ reason: "quiz_top10", baseMc: 1, exp: 50 });
    expect(paid[10]).toHaveLength(0);
    expect(paid[11]).toHaveLength(0);
  });

  it("pays everyone tied for 10th", () => {
    const rows = roster("SQ1.1", [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 11, 10]);
    const map = computeSetStandings(rows);
    expect(map.get("s11")?.[0]?.rank).toBe(10);
    expect(rankRewardGrants("s11", map.get("s11") ?? [])).toHaveLength(1);
    expect(map.get("s12")?.[0]?.rank).toBe(12);
  });

  it("does not rank absent students or count them as zero", () => {
    const [a, b] = standingsOf(roster("SQ1.1", ["ABS", 5]));
    expect(a?.status).toBe("absent");
    expect(a?.rank).toBeNull();
    expect(b?.rank).toBe(1);
  });

  it("waits until most of the set has a mark before paying rank rewards", () => {
    const rows = roster("SQ1.1", [20, 19, 18, 17, null, null, null, null, null, null]);
    const map = computeSetStandings(rows);
    expect(map.get("s1")?.[0]?.provisional).toBe(true);
    expect(rankRewardGrants("s1", map.get("s1") ?? [])).toHaveLength(0);
  });
});

describe("rank display for students", () => {
  it("shows the exact rank in the top 10 and 10+ below", () => {
    expect(rankLabel(1)).toBe("#1");
    expect(rankLabel(10)).toBe("#10");
    expect(rankLabel(11)).toBe("10+");
    expect(rankLabel(null)).toBe("—");
  });

  it("never sends an exact rank below 10th, only the gap to 10th", () => {
    const rows = roster("SQ1.1", [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 9, 8]);
    const twelfth = standingsOf(rows)[11];
    if (!twelfth) throw new Error("missing standing");
    const shown = toPublicStanding(twelfth);
    expect(shown).toMatchObject({ display: "10+", rank: null, isTop10: false });
    expect(shown.marksToTop10).toBe(3);
    expect(shown.pointsToTop10).toBe(15);
    const fifth = standingsOf(rows)[4];
    if (!fifth) throw new Error("missing standing");
    expect(toPublicStanding(fifth)).toMatchObject({ display: "#5", rank: 5, isTop10: true });
  });
});

describe("most improved", () => {
  it("rewards a Chapter Quiz exactly 15 points above the previous one", () => {
    const q = quizResultsFromAssessments([
      quiz("CQ1", 10, 20, { position: 1 }),
      quiz("CQ2", 13, 20, { position: 2 }),
    ]);
    const { quizzes, grants } = markMostImproved("s1", q);
    expect(grants).toHaveLength(1);
    expect(grants[0]).toMatchObject({ reason: "most_improved", baseMc: 2, exp: 100 });
    expect(quizzes.find((x) => x.label === "CQ2")?.isMostImproved).toBe(true);
  });

  it("does not reward 14.9 points", () => {
    const q = quizResultsFromAssessments([
      quiz("CQ1", 50, 100, { position: 1 }),
      quiz("CQ2", 64.9, 100, { position: 2 }),
    ]);
    expect(markMostImproved("s1", q).grants).toHaveLength(0);
  });

  it("compares with the last Chapter Quiz sat, skipping absences and Short Quizzes", () => {
    const q = quizResultsFromAssessments([
      quiz("CQ1", 20, 50, { position: 1 }),
      quiz("SQ2.1", 15, 15, { position: 2 }),
      quiz("CQ2", null, 50, { position: 3, absent: true }),
      quiz("CQ3", 29, 50, { position: 4 }),
    ]);
    const { grants } = markMostImproved("s1", q);
    expect(grants).toHaveLength(1);
    expect(grants[0]?.quizId).toBe("1:CQ3");
  });
});

describe("homework streak", () => {
  it("pays +3 MC for every 10 in a row", () => {
    const ten = summarizeHomework("s1", hw(Array.from({ length: 10 }, () => "SUBMITTED")));
    expect(ten.grants).toHaveLength(1);
    expect(ten.grants[0]?.baseMc).toBe(REWARD_RULES.homeworkStreak.mc);
    const twenty = summarizeHomework("s1", hw(Array.from({ length: 20 }, () => "SUBMITTED")));
    expect(twenty.grants).toHaveLength(2);
  });

  it("starts again after missing homework", () => {
    const list: HomeworkStatus[] = [
      ...Array.from({ length: 9 }, (): HomeworkStatus => "SUBMITTED"),
      "MISSING",
      ...Array.from({ length: 10 }, (): HomeworkStatus => "SUBMITTED"),
    ];
    const result = summarizeHomework("s1", hw(list));
    expect(result.grants).toHaveLength(1);
    expect(result.grants[0]?.sourceKey).toBe("hw-streak:1:HW20");
    expect(result.missing).toBe(1);
    expect(result.current).toBe(10);
  });

  it("does not break the streak for excused homework", () => {
    const list: HomeworkStatus[] = [
      ...Array.from({ length: 5 }, (): HomeworkStatus => "SUBMITTED"),
      "EXCUSED",
      ...Array.from({ length: 5 }, (): HomeworkStatus => "SUBMITTED"),
    ];
    const result = summarizeHomework("s1", hw(list));
    expect(result.current).toBe(10);
    expect(result.grants).toHaveLength(1);
  });

  it("only counts a blank as missing once the homework has been collected", () => {
    const row: Assessment = {
      term: 1,
      kind: "item",
      category: "homework",
      label: "HW1.1",
      score: null,
      absent: false,
      full_marks: 10,
      position: 1,
    };
    expect(homeworkFromAssessments([row], new Set())).toHaveLength(0);
    expect(homeworkFromAssessments([row], new Set(["1:HW1.1"]))[0]?.status).toBe("MISSING");
  });
});

describe("2x Math Coins event", () => {
  const grant = {
    sourceKey: "rank:1:SQ1.1",
    studentId: "s1",
    reason: "quiz_top3" as const,
    baseMc: 3,
    exp: 150,
    description: "Rank 1 in SQ1.1",
    quizId: "1:SQ1.1",
  };

  it("doubles Math Coins but not EXP while the event is on", () => {
    const [entry] = reconcileLedger([], [grant], { isDoubleMCEventActive: true });
    expect(entry).toMatchObject({ mc: 6, exp: 150, multiplier: 2 });
  });

  it("never pays twice and never changes rewards already given", () => {
    const given = reconcileLedger([], [grant], { isDoubleMCEventActive: false });
    expect(reconcileLedger(given, [grant], { isDoubleMCEventActive: true })).toHaveLength(0);
    expect(given[0]?.mc).toBe(3);
  });
});

describe("game profiles", () => {
  it("reads term totals out of 200", () => {
    const rows: Assessment[] = [
      {
        term: 1,
        kind: "summary",
        category: "other",
        label: "T1 Total (200)",
        score: 150,
        absent: false,
        full_marks: 200,
        position: 1,
      },
      {
        term: 2,
        kind: "summary",
        category: "exam",
        label: "T2A3 (100)",
        score: 80,
        absent: false,
        full_marks: 100,
        position: 2,
      },
    ];
    expect(termTotal200(rows, 1)).toBe(150);
    expect(termTotal200(rows, 2)).toBe(160);
  });

  it("only adds reward coins to the balance once they are spendable", () => {
    const set = Array.from({ length: 10 }, (_, i) =>
      student(`s${i + 1}`, [quiz("SQ1.1", 20 - i, 20, { position: 1 })]),
    );
    const live = buildGameProfiles({
      students: set,
      config: { isDoubleMCEventActive: false },
      rewardsSpendable: false,
    });
    expect(live.profiles.get("s1")?.rewardCoins).toBe(3);
    expect(live.profiles.get("s1")?.mathCoins).toBe(7);
    const saved = buildGameProfiles({ students: set, config: { isDoubleMCEventActive: false } });
    expect(saved.profiles.get("s1")?.mathCoins).toBe(10);
    expect(saved.profiles.get("s1")?.exp).toBe(150);
  });
});

describe("sandbox data", () => {
  const build = (on: boolean) =>
    buildGameProfiles({
      students: MOCK_STUDENTS,
      config: { isDoubleMCEventActive: on },
      ledger: mockSeedLedger(),
      cosmetics: MOCK_COSMETICS,
    }).profiles;

  it("has 15 students in each set", () => {
    expect(MOCK_STUDENTS.filter((s) => s.set === "S2M3")).toHaveLength(15);
    expect(MOCK_STUDENTS.filter((s) => s.set === "S2M5")).toHaveLength(15);
  });

  it("covers the top-10 privacy rule and ties", () => {
    const profiles = build(false);
    const sq = (id: string) => profiles.get(id)?.standings.find((s) => s.label === "SQ1.1");
    expect(sq("mock-s2m5-09")?.display).toBe("#9");
    expect(sq("mock-s2m5-11")?.display).toBe("#9");
    expect(sq("mock-s2m5-12")).toMatchObject({ display: "10+", rank: null, marksToTop10: 1 });
    expect(sq("mock-s2m3-03")?.display).toBe("#3");
    expect(sq("mock-s2m3-04")?.display).toBe("#3");
  });

  it("includes a most improved Chapter Quiz", () => {
    const profiles = build(false);
    const cq2 = profiles.get("mock-s2m3-13")?.quizHistory.find((q) => q.label === "CQ2");
    expect(cq2?.isMostImproved).toBe(true);
    const cq4 = profiles.get("mock-s2m5-07")?.quizHistory.find((q) => q.label === "CQ4");
    expect(cq4?.isMostImproved).toBe(false);
  });

  it("includes homework streaks and missing homework", () => {
    const profiles = build(false);
    expect(profiles.get("mock-s2m3-01")?.homeworkStreak).toBe(24);
    expect(profiles.get("mock-s2m5-15")?.missingHomeworkCount).toBeGreaterThanOrEqual(5);
  });

  it("doubles only the newest quiz's rewards when the 2x event is switched on", () => {
    expect(mockSeedLedger().some((e) => e.quizId === MOCK_FRESH_QUIZ_ID)).toBe(false);
    const off = build(false);
    const on = build(true);
    for (const s of MOCK_STUDENTS) {
      const fresh = (off.get(s.id)?.rewards ?? [])
        .filter((e) => e.quizId === MOCK_FRESH_QUIZ_ID)
        .reduce((t, e) => t + e.mc, 0);
      expect((on.get(s.id)?.rewardCoins ?? 0) - (off.get(s.id)?.rewardCoins ?? 0)).toBe(fresh);
    }
  });
});
