import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/integrations/supabase/types";
import type { Assessment } from "@/lib/assessments";
import { DEMO_EMAIL, type MathSet, type Student } from "@/lib/data";
import { MOCK_COSMETICS, MOCK_STUDENTS, MOCK_VOICE_COUNTS, mockSeedLedger } from "./mock-data";
import { countVoiceMarks } from "./rules";
import {
  DEFAULT_SYSTEM_CONFIG,
  type Cosmetics,
  type LedgerEntry,
  type RewardReason,
  type SystemConfig,
} from "./types";
import { loadBadgeStats } from "./badge-stats";
import { hkDateKey } from "./checkin";
import { buildGameWorld, buildGameWorldWithBoardDays } from "./world";

type Client = SupabaseClient<Database>;
type Tables = Database["public"]["Tables"];
type StudentRow = Tables["students"]["Row"];
type AssessmentRow = Tables["assessment_scores"]["Row"];
type MarkRow = Pick<Tables["daily_marks"]["Row"], "student_id" | "reason">;
type RewardRow = Tables["game_rewards"]["Row"];
type CosmeticsRow = Tables["student_cosmetics"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];

const PAGE = 1000;
const WRITE_CHUNK = 500;
const REASONS: RewardReason[] = [
  "quiz_top3",
  "quiz_top10",
  "most_improved",
  "homework_streak",
  "badge",
];

export interface PublishReport {
  students: number;
  snapshots: number;
  boards: number;
  newRewards: number;
  publishedAt: string;
  /** Set when badge coins could not be saved, usually because 0014 has not been run. */
  badgeWarning?: string;
}

interface Page<T> {
  data: T[] | null;
  error: { message: string } | null;
}

/** Supabase caps rows per request, so keep paging until a page comes back empty. */
async function readAll<T>(
  what: string,
  fetchPage: (from: number, to: number) => PromiseLike<Page<T>>,
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await fetchPage(from, from + PAGE - 1);
    if (error) throw new Error(`Could not read ${what}: ${error.message}`);
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

function chunk<T>(list: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function ledgerFromRow(row: RewardRow): LedgerEntry | null {
  const reason = REASONS.find((r) => r === row.reason);
  if (!reason) return null;
  return {
    sourceKey: row.source_key,
    studentId: row.student_id,
    reason,
    baseMc: row.base_mc,
    exp: row.exp,
    description: row.description,
    quizId: row.quiz_id,
    multiplier: row.multiplier,
    mc: row.mc,
    awardedAt: row.awarded_at,
  };
}

function ledgerToRow(e: LedgerEntry): Tables["game_rewards"]["Insert"] {
  return {
    student_id: e.studentId,
    source_key: e.sourceKey,
    reason: e.reason,
    quiz_id: e.quizId,
    description: e.description.slice(0, 300),
    base_mc: e.baseMc,
    multiplier: e.multiplier,
    mc: e.mc,
    exp: e.exp,
    awarded_at: e.awardedAt,
  };
}

export function cosmeticsFromRow(row: CosmeticsRow): Cosmetics {
  return {
    avatarId: row.avatar_id,
    equippedFrameId: row.frame_id,
    equippedTitle: row.title_id,
    equippedTitle2: row.title_id_2,
  };
}

function toAssessment(row: AssessmentRow): Assessment {
  return {
    term: row.term,
    kind: row.kind === "summary" ? "summary" : "item",
    category: row.category as Assessment["category"],
    label: row.label,
    score: row.score,
    absent: row.absent,
    full_marks: row.full_marks,
    position: row.position,
  };
}

function toStudent(s: StudentRow, assessments: Assessment[], totals?: CoinTotalRow): Student {
  return {
    id: s.id,
    userId: s.user_id,
    name: s.name,
    email: s.email,
    set: s.math_set as MathSet,
    scores: [],
    lastMonthAvg: s.last_month_avg,
    lastMonthFormRank: s.last_month_form_rank,
    xp: s.xp,
    streak: s.streak,
    dailyMarks: totals?.daily_earned ?? 0,
    videoMarks: totals?.video_earned ?? 0,
    coinsSpent: totals?.spent ?? 0,
    rewardCoins: totals?.reward_earned ?? 0,
    checkinCoins: totals?.checkin_earned ?? 0,
    shopSpent: totals?.shop_spent ?? 0,
    assessments,
    hlcNo: s.hlc_no,
    className: s.class_name,
    classNo: s.class_no,
  };
}

/**
 * Works out the game for every student with the teacher's own access, then saves new rewards,
 * each student's private snapshot and the public leaderboards. Run after every Google Sheet
 * sync, or from the teacher bar.
 */
export async function publishGame(
  supabase: Client,
  now: Date = new Date(),
): Promise<PublishReport> {
  const [configResult, totalsResult, cosmeticsResult] = await Promise.all([
    supabase.from("system_config").select("double_mc_event_active").eq("id", true).maybeSingle(),
    supabase.from("student_coin_totals").select("*"),
    supabase.from("student_cosmetics").select("*"),
  ]);
  if (cosmeticsResult.error) {
    throw new Error(
      `Game tables are not set up yet (${cosmeticsResult.error.message}). Run supabase/sql/0010_game_data.sql in the Supabase SQL Editor.`,
    );
  }
  const config: SystemConfig = configResult.error
    ? DEFAULT_SYSTEM_CONFIG
    : { isDoubleMCEventActive: configResult.data?.double_mc_event_active === true };

  const [studentRows, assessmentRows, markRows, rewardRows] = await Promise.all([
    readAll<StudentRow>("the class list", (from, to) =>
      supabase.from("students").select("*").order("id").range(from, to),
    ),
    readAll<AssessmentRow>("assessment marks", (from, to) =>
      supabase
        .from("assessment_scores")
        .select("*")
        .order("student_id")
        .order("term")
        .order("kind")
        .order("label")
        .range(from, to),
    ),
    readAll<MarkRow>("lesson marks", (from, to) =>
      supabase.from("daily_marks").select("student_id, reason").order("id").range(from, to),
    ),
    readAll<RewardRow>("game rewards", (from, to) =>
      supabase
        .from("game_rewards")
        .select("*")
        .order("student_id")
        .order("source_key")
        .range(from, to),
    ),
  ]);

  const assessmentsByStudent = new Map<string, Assessment[]>();
  for (const row of assessmentRows) {
    const list = assessmentsByStudent.get(row.student_id);
    if (list) list.push(toAssessment(row));
    else assessmentsByStudent.set(row.student_id, [toAssessment(row)]);
  }
  const totals = new Map<string, CoinTotalRow>();
  for (const t of totalsResult.data ?? []) if (t.student_id) totals.set(t.student_id, t);

  const students = studentRows
    .filter((s) => s.math_set === "S2M3" || s.math_set === "S2M5")
    .map((s) => toStudent(s, assessmentsByStudent.get(s.id) ?? [], totals.get(s.id)));
  const ledger = rewardRows.flatMap((r) => {
    const e = ledgerFromRow(r);
    return e ? [e] : [];
  });
  const cosmetics = new Map<string, Cosmetics>(
    (cosmeticsResult.data ?? []).map((r) => [r.student_id, cosmeticsFromRow(r)]),
  );
  const voiceCounts = countVoiceMarks(markRows);

  // The public demo account must never see real students, so it is placed in the sandbox.
  const real = students.filter((s) => s.email !== DEMO_EMAIL);
  const demo = students.find((s) => s.email === DEMO_EMAIL);
  const realIds = new Set(real.map((s) => s.id));

  const badgeStats = await loadBadgeStats(supabase);
  const today = hkDateKey(now);
  const recorded = buildGameWorldWithBoardDays(
    {
      students: real,
      config,
      ledger: ledger.filter((e) => realIds.has(e.studentId)),
      cosmetics,
      voiceCounts,
      badgeStats,
      rewardsSpendable: false,
      now,
    },
    badgeStats.recordedToday,
    today,
  );
  const world = recorded.world;

  const newRewards: LedgerEntry[] = [...world.added];
  const snapshots = [...world.snapshots.values()];

  if (demo) {
    const demoCosmetics = cosmetics.get(demo.id);
    const sandbox = buildGameWorld({
      students: [...MOCK_STUDENTS, demo],
      config,
      ledger: [...mockSeedLedger(), ...ledger.filter((e) => e.studentId === demo.id)],
      cosmetics: new Map<string, Cosmetics>([
        ...MOCK_COSMETICS,
        ...(demoCosmetics ? [[demo.id, demoCosmetics] as [string, Cosmetics]] : []),
      ]),
      voiceCounts: new Map<string, number>([
        ...MOCK_VOICE_COUNTS,
        [demo.id, voiceCounts.get(demo.id) ?? 0],
      ]),
      badgeStats,
      rewardsSpendable: false,
      now,
    });
    newRewards.push(...sandbox.added.filter((e) => e.studentId === demo.id));
    const demoSnapshot = sandbox.snapshots.get(demo.id);
    if (demoSnapshot) snapshots.push(demoSnapshot);
  }

  const saveRewards = async (rows: ReturnType<typeof ledgerToRow>[]) => {
    for (const part of chunk(rows, WRITE_CHUNK)) {
      const { error } = await supabase
        .from("game_rewards")
        .upsert(part, { onConflict: "student_id,source_key", ignoreDuplicates: true });
      if (error) throw new Error(error.message);
    }
  };
  const badgeRewards = newRewards.filter((e) => e.reason === "badge");
  try {
    await saveRewards(newRewards.filter((e) => e.reason !== "badge").map(ledgerToRow));
  } catch (e) {
    throw new Error(
      `Could not save game rewards: ${e instanceof Error ? e.message : "unknown error"}`,
    );
  }
  let badgeWarning: string | undefined;
  if (badgeRewards.length) {
    try {
      await saveRewards(badgeRewards.map(ledgerToRow));
    } catch (e) {
      const message = e instanceof Error ? e.message : "unknown error";
      badgeWarning = message.includes("check")
        ? "Badge coins were not saved. Run supabase/sql/0014_captain_roster_badges.sql in the Supabase SQL Editor, then publish again."
        : `Badge coins were not saved: ${message}`;
    }
  }
  if (recorded.newDays.length) {
    const { error } = await supabase.from("badge_days").upsert(recorded.newDays, {
      onConflict: "student_id,badge_id,day",
      ignoreDuplicates: true,
    });
    if (error) {
      const message = error.message.includes("badge_days")
        ? "Leaderboard day badges were not saved. Run supabase/sql/0015_looks_badges.sql, then publish again."
        : `Leaderboard day badges were not saved: ${error.message}`;
      badgeWarning = badgeWarning ? `${badgeWarning} ${message}` : message;
    }
  }

  const publishedAt = now.toISOString();
  for (const part of chunk(snapshots, WRITE_CHUNK)) {
    const { error } = await supabase.from("game_snapshots").upsert(
      part.map((s) => ({
        student_id: s.studentId,
        math_set: s.set,
        payload: s as unknown as Json,
        generated_at: publishedAt,
      })),
      { onConflict: "student_id" },
    );
    if (error) throw new Error(`Could not save student game data: ${error.message}`);
  }

  const { error: boardError } = await supabase.from("game_leaderboards").upsert(
    world.boards.map((b) => ({
      id: b.id,
      scope: b.scope,
      metric: b.metric,
      term: b.term,
      payload: b as unknown as Json,
      generated_at: publishedAt,
    })),
    { onConflict: "id" },
  );
  if (boardError) throw new Error(`Could not save leaderboards: ${boardError.message}`);

  return {
    students: real.length,
    snapshots: snapshots.length,
    boards: world.boards.length,
    newRewards: newRewards.length,
    publishedAt,
    ...(badgeWarning ? { badgeWarning } : {}),
  };
}
