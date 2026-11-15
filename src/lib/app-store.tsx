import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { DEMO_EMAIL, type ScoreSource, type Student } from "./data";
import { chapterScoresFromAssessments, type Assessment } from "./assessments";
import type { Homework } from "./homework";
import {
  MOCK_COSMETICS,
  MOCK_STUDENTS,
  MOCK_VOICE_COUNTS,
  isMockStudentId,
  mockSeedLedger,
} from "./gamification/mock-data";
import { mockSelfChecks } from "./gamification/mock-activity";
import { cosmeticsFromRow, ledgerFromRow } from "./gamification/publish";
import { mergeUnlocks } from "./gamification/catalog";
import { attachGame, countVoiceMarks } from "./gamification/rules";
import type { ExamDate, ExamKind } from "./gamification/vault";
import {
  DEFAULT_COSMETICS,
  DEFAULT_SYSTEM_CONFIG,
  type Cosmetics,
  type LedgerEntry,
  type Leaderboard,
  type StudentSnapshot,
  type SystemConfig,
  type Unlocks,
} from "./gamification/types";
import { buildGameWorld, parseLeaderboard, parseSnapshot } from "./gamification/world";

type PublicTables = Database["public"]["Tables"];
type AssessmentRow = PublicTables["assessment_scores"]["Row"];
type VideoCompletionRow = PublicTables["chapter_video_completions"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];
type Content = PublicTables["chapter_content"]["Row"];
export type ChapterVideo = PublicTables["chapter_videos"]["Row"];
export type MarkRow = PublicTables["daily_marks"]["Row"];
export type Reward = PublicTables["rewards"]["Row"];
export type Redemption = PublicTables["reward_redemptions"]["Row"];
type RewardRow = PublicTables["game_rewards"]["Row"];
type CosmeticsRow = PublicTables["student_cosmetics"]["Row"];
type SnapshotRow = PublicTables["game_snapshots"]["Row"];
type BoardRow = PublicTables["game_leaderboards"]["Row"];
type SelfCheckRow = Pick<PublicTables["chapter_self_checks"]["Row"], "student_id" | "objective_id">;
export type ShopItem = PublicTables["shop_items"]["Row"];
type PurchaseRow = PublicTables["shop_purchases"]["Row"];

const CHAPTER_COUNT = 7;
const PAGE_SIZE = 1000;
const MARK_LOG_LIMIT = 300;
const REDEMPTION_LIMIT = 500;
/** Keeps the previewed student while the teacher moves between pages or refreshes the tab. */
const PREVIEW_STORAGE_KEY = "hlc-preview-student";

/** Supabase caps how many rows one request returns, so keep paging until a page comes back empty. */
async function fetchAllAssessments(): Promise<AssessmentRow[]> {
  const rows: AssessmentRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("assessment_scores")
      .select("*")
      .order("student_id")
      .order("term")
      .order("kind")
      .order("label")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

async function fetchAllVideoCompletions(): Promise<VideoCompletionRow[]> {
  const rows: VideoCompletionRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("chapter_video_completions")
      .select("*")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

interface CoinData {
  error: string | null;
  totals: CoinTotalRow[];
  rewards: Reward[];
  redemptions: Redemption[];
}

/** Coins and awards are optional: if their tables are not set up yet, the rest of the app still works. */
async function loadCoinData(): Promise<CoinData> {
  const [totals, rewards, redemptions] = await Promise.all([
    supabase.from("student_coin_totals").select("*"),
    supabase.from("rewards").select("*").order("position").order("cost"),
    supabase
      .from("reward_redemptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(REDEMPTION_LIMIT),
  ]);
  const error = totals.error ?? rewards.error ?? redemptions.error;
  if (error) {
    return {
      error: `Math Coins and Awards are not set up yet (${error.message}). Run supabase/sql/0005_coins_activity_awards.sql in the Supabase SQL Editor.`,
      totals: [],
      rewards: [],
      redemptions: [],
    };
  }
  return {
    error: null,
    totals: totals.data ?? [],
    rewards: rewards.data ?? [],
    redemptions: redemptions.data ?? [],
  };
}

interface HomeworkData {
  error: string | null;
  rows: Homework[];
}

/** Homework is optional too: before 0007 is run, every other page keeps working. */
async function loadHomework(): Promise<HomeworkData> {
  const { data, error } = await supabase
    .from("homework")
    .select("*")
    .order("due_at", { ascending: true });
  if (error) {
    return {
      error: `Homework is not set up yet (${error.message}). Run supabase/sql/0007_homework.sql in the Supabase SQL Editor.`,
      rows: [],
    };
  }
  return { error: null, rows: data ?? [] };
}

interface ConfigData {
  config: SystemConfig;
  error: string | null;
}

/** The 2x event switch is optional too: before 0009 is run, the event simply stays off. */
async function loadSystemConfig(): Promise<ConfigData> {
  const { data, error } = await supabase
    .from("system_config")
    .select("double_mc_event_active")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    return {
      config: DEFAULT_SYSTEM_CONFIG,
      error: `The 2x Math Coins event switch is not set up yet (${error.message}). Run supabase/sql/0009_system_config.sql in the Supabase SQL Editor.`,
    };
  }
  return { config: { isDoubleMCEventActive: data?.double_mc_event_active === true }, error: null };
}

interface GameData {
  error: string | null;
  ledger: LedgerEntry[];
  cosmetics: CosmeticsRow[];
  /** Students: their own published snapshot. Teachers work everything out locally. */
  snapshots: SnapshotRow[];
  /** Students: the published leaderboards. */
  boards: BoardRow[];
  selfChecks: SelfCheckRow[];
  publishedAt: string | null;
}

const EMPTY_GAME: Omit<GameData, "error"> = {
  ledger: [],
  cosmetics: [],
  snapshots: [],
  boards: [],
  selfChecks: [],
  publishedAt: null,
};

async function fetchAllRewards(): Promise<RewardRow[]> {
  const rows: RewardRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("game_rewards")
      .select("*")
      .order("student_id")
      .order("source_key")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

async function fetchAllSelfChecks(): Promise<SelfCheckRow[]> {
  const rows: SelfCheckRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("chapter_self_checks")
      .select("student_id, objective_id")
      .order("student_id")
      .order("objective_id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

/** Game data is optional too: before 0010 is run, every other page keeps working. */
async function loadGameData(role: "student" | "teacher"): Promise<GameData> {
  try {
    const [ledger, cosmetics, selfChecks, snapshots, boards] = await Promise.all([
      fetchAllRewards(),
      supabase.from("student_cosmetics").select("*"),
      fetchAllSelfChecks(),
      role === "student"
        ? supabase.from("game_snapshots").select("*")
        : Promise.resolve({ data: [] as SnapshotRow[], error: null }),
      role === "student"
        ? supabase.from("game_leaderboards").select("*")
        : supabase
            .from("game_leaderboards")
            .select("*")
            .order("generated_at", { ascending: false })
            .limit(1),
    ]);
    const error = cosmetics.error ?? snapshots.error ?? boards.error;
    if (error) throw error;
    const boardRows = boards.data ?? [];
    const snapshotRows = snapshots.data ?? [];
    return {
      error: null,
      ledger: ledger.flatMap((r) => {
        const e = ledgerFromRow(r);
        return e ? [e] : [];
      }),
      cosmetics: cosmetics.data ?? [],
      snapshots: snapshotRows,
      boards: role === "student" ? boardRows : [],
      selfChecks,
      publishedAt: snapshotRows[0]?.generated_at ?? boardRows[0]?.generated_at ?? null,
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : String((e as { message?: unknown })?.message ?? e);
    return {
      ...EMPTY_GAME,
      error: `Game features are not set up yet (${message}). Run supabase/sql/0010_game_data.sql in the Supabase SQL Editor.`,
    };
  }
}

interface ExtrasData {
  error: string | null;
  shopItems: ShopItem[];
  purchases: PurchaseRow[];
  examDates: ExamDate[];
}

/** Shop and exam dates are optional too: before 0011 is run, every other page keeps working. */
async function loadExtras(): Promise<ExtrasData> {
  const [items, purchases, exams] = await Promise.all([
    supabase.from("shop_items").select("*").order("position"),
    supabase.from("shop_purchases").select("*"),
    supabase.from("exam_dates").select("*").order("starts_at"),
  ]);
  const error = items.error ?? purchases.error ?? exams.error;
  if (error) {
    return {
      error: `The Shop, check-ins and Mistake Vault are not set up yet (${error.message}). Run supabase/sql/0011_shop_badges_vault.sql in the Supabase SQL Editor.`,
      shopItems: [],
      purchases: [],
      examDates: [],
    };
  }
  return {
    error: null,
    shopItems: items.data ?? [],
    purchases: purchases.data ?? [],
    examDates: (exams.data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      kind: e.kind as ExamKind,
      set: e.math_set === "S2M3" || e.math_set === "S2M5" ? e.math_set : "ALL",
      startsAt: e.starts_at,
    })),
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

interface Store {
  session: { email: string; name: string } | null;
  /** The role the pages should render for. While a teacher previews, this is "student". */
  role: "student" | "teacher";
  /** The signed-in account's own role, which does not change during a preview. */
  actualRole: "student" | "teacher";
  students: Student[];
  me: Student;
  ready: boolean;
  error: string | null;
  content: Content[];
  videos: ChapterVideo[];
  lastSync: string | null;
  /** Latest lesson-mark entries (teachers see everyone's, students only their own). */
  markLog: MarkRow[];
  rewards: Reward[];
  redemptions: Redemption[];
  coinsError: string | null;
  homework: Homework[];
  homeworkError: string | null;
  /** True while a teacher is viewing the site as a student. */
  isPreview: boolean;
  /** True while previewing: student pages must not save anything. */
  readOnly: boolean;
  /** Whether the previewed student is from the class list or the sandbox. */
  previewSource: "live" | "mock" | null;
  startPreview: (studentId: string) => void;
  exitPreview: () => void;
  /** Sandbox students for previews (teachers only; never saved). */
  mockStudents: Student[];
  systemConfig: SystemConfig;
  configError: string | null;
  /** The game data the current view should show for `me` (own, previewed or sandbox). */
  gameSnapshot: StudentSnapshot | null;
  /** Leaderboards for the current view. Teachers (not previewing) get full rankings. */
  boards: Leaderboard[];
  gameError: string | null;
  /** When game data was last published for students. */
  gamePublishedAt: string | null;
  cosmeticsOf: (studentId: string) => Cosmetics;
  /** Self-check statements ticked by `me`. */
  selfChecks: string[];
  /** True for the public demo login, which only ever sees sandbox classmates. */
  isDemo: boolean;
  shopItems: ShopItem[];
  /** Shop item ids that `me` has bought. */
  ownedItems: string[];
  /** Frames and titles `me` may equip: earned plus bought. */
  myUnlocks: Unlocks;
  examDates: ExamDate[];
  extrasError: string | null;
  setDoubleMcEvent: (active: boolean) => Promise<void>;
  refresh: () => Promise<unknown>;
  logout: () => Promise<void>;
}

const g = globalThis as unknown as {
  __hlcCloudCtx?: ReturnType<typeof createContext<Store | null>>;
};
const Ctx = (g.__hlcCloudCtx ??= createContext<Store | null>(null));

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const qc = useQueryClient();

  const rememberPreview = useCallback((id: string | null) => {
    setPreviewId(id);
    try {
      if (id === null) window.sessionStorage.removeItem(PREVIEW_STORAGE_KEY);
      else window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, id);
    } catch {
      // Storage can be blocked; the preview then only lasts until the tab is refreshed.
    }
  }, []);

  useEffect(() => {
    try {
      setPreviewId(window.sessionStorage.getItem(PREVIEW_STORAGE_KEY));
    } catch {
      // Storage can be blocked; start without a preview.
    }
  }, []);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) {
        setUser(data.user);
        setHydrated(true);
      }
    };
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      if (event === "SIGNED_OUT") {
        setUser(null);
        qc.clear();
      } else {
        setHydrated(false);
        setTimeout(() => {
          void verify();
        }, 0);
      }
    });
    void verify();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [qc]);

  const query = useQuery({
    queryKey: ["math-records", user?.id],
    enabled: Boolean(user),
    retry: false,
    queryFn: async () => {
      const claim = await supabase.rpc("claim_student");
      if (claim.error) throw claim.error;
      const [
        roles,
        roster,
        scores,
        markLog,
        videoRows,
        content,
        assessmentRows,
        syncs,
        chapterVideos,
        coins,
        homeworkData,
        configData,
        extras,
      ] = await Promise.all([
        supabase.from("user_roles").select("role"),
        supabase.from("students").select("*"),
        supabase.from("chapter_scores").select("*"),
        supabase
          .from("daily_marks")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MARK_LOG_LIMIT),
        fetchAllVideoCompletions(),
        supabase.from("chapter_content").select("*"),
        fetchAllAssessments(),
        supabase
          .from("sheet_syncs")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase.from("chapter_videos").select("*").order("chapter").order("position"),
        loadCoinData(),
        loadHomework(),
        loadSystemConfig(),
        loadExtras(),
      ]);
      for (const r of [roles, roster, scores, markLog, content, syncs, chapterVideos]) {
        if (r.error) throw r.error;
      }

      const assessmentsByStudent = new Map<string, Assessment[]>();
      for (const row of assessmentRows) {
        const item = toAssessment(row);
        const existing = assessmentsByStudent.get(row.student_id);
        if (existing) existing.push(item);
        else assessmentsByStudent.set(row.student_id, [item]);
      }

      const videosByStudent = new Map<string, VideoCompletionRow[]>();
      for (const row of videoRows) {
        const existing = videosByStudent.get(row.student_id);
        if (existing) existing.push(row);
        else videosByStudent.set(row.student_id, [row]);
      }

      const savedScores = new Map<string, number | null>();
      for (const row of scores.data ?? [])
        savedScores.set(`${row.student_id}|${row.chapter}`, row.score);

      const totals = new Map<string, CoinTotalRow>();
      for (const t of coins.totals) if (t.student_id) totals.set(t.student_id, t);

      // Only used if the coin totals view is not set up yet.
      const dailyFromLog = new Map<string, number>();
      for (const m of markLog.data ?? []) {
        dailyFromLog.set(m.student_id, (dailyFromLog.get(m.student_id) ?? 0) + m.marks);
      }

      const students: Student[] = (roster.data ?? []).map((s) => {
        const own = assessmentsByStudent.get(s.id) ?? [];
        const fromSheet = chapterScoresFromAssessments(own, CHAPTER_COUNT);
        const ownVideos = videosByStudent.get(s.id) ?? [];
        const total = totals.get(s.id);

        // A score the teacher typed in the app wins; otherwise use the Google Sheet's score.
        const chapterScores: (number | null)[] = [];
        const scoreSources: ScoreSource[] = [];
        for (let ch = 1; ch <= CHAPTER_COUNT; ch++) {
          const saved = savedScores.get(`${s.id}|${ch}`);
          if (saved !== undefined && saved !== null) {
            chapterScores.push(saved);
            scoreSources.push("manual");
          } else {
            const sheet = fromSheet[ch - 1] ?? null;
            chapterScores.push(sheet);
            scoreSources.push(sheet === null ? null : "sheet");
          }
        }

        return {
          id: s.id,
          userId: s.user_id,
          name: s.name,
          email: s.email,
          set: s.math_set as Student["set"],
          scores: chapterScores,
          scoreSources,
          lastMonthAvg: s.last_month_avg,
          lastMonthFormRank: s.last_month_form_rank,
          xp: s.xp,
          streak: s.streak,
          dailyMarks: total?.daily_earned ?? dailyFromLog.get(s.id) ?? 0,
          videoMarks: ownVideos.length,
          coinsSpent: total?.spent ?? 0,
          rewardCoins: total?.reward_earned ?? 0,
          checkinCoins: total?.checkin_earned ?? 0,
          shopSpent: total?.shop_spent ?? 0,
          completedVideos: ownVideos.flatMap((v) => (v.video_id ? [v.video_id] : [])),
          assessments: own,
          hlcNo: s.hlc_no,
          className: s.class_name,
          classNo: s.class_no,
        };
      });

      const role: Store["role"] = roles.data?.some((r) => r.role === "teacher")
        ? "teacher"
        : "student";

      // The demo login is for trying the student view only; keep it out of every teacher list.
      const demoIds = new Set(students.filter((s) => s.email === DEMO_EMAIL).map((s) => s.id));
      const hideDemo = role === "teacher" && demoIds.size > 0;
      const allMarks = markLog.data ?? [];
      const game = await loadGameData(role);

      return {
        lastSync: syncs.data?.[0]?.created_at ?? null,
        students: hideDemo ? students.filter((s) => !demoIds.has(s.id)) : students,
        role,
        content: content.data ?? [],
        videos: chapterVideos.data ?? [],
        markLog: hideDemo ? allMarks.filter((m) => !demoIds.has(m.student_id)) : allMarks,
        rewards: coins.rewards,
        redemptions: hideDemo
          ? coins.redemptions.filter((r) => !demoIds.has(r.student_id))
          : coins.redemptions,
        coinsError: coins.error,
        homework: homeworkData.rows,
        homeworkError: homeworkData.error,
        systemConfig: configData.config,
        configError: configData.error,
        game,
        extras,
      };
    },
  });

  const data = query.data;
  const actualRole: Store["role"] = data?.role ?? "student";
  const doubleEvent = data?.systemConfig.isDoubleMCEventActive ?? false;
  const systemConfig = useMemo<SystemConfig>(
    () => ({ isDoubleMCEventActive: doubleEvent }),
    [doubleEvent],
  );

  const game = data?.game;
  // Without a saved ledger every reward would be new, so keep everything at 1x until 0010 is run.
  const gameConfig = game && game.error === null ? systemConfig : DEFAULT_SYSTEM_CONFIG;

  const liveCosmetics = useMemo(
    () =>
      new Map<string, Cosmetics>(
        (game?.cosmetics ?? []).map((r) => [r.student_id, cosmeticsFromRow(r)]),
      ),
    [game],
  );
  const cosmeticsOf = useCallback(
    (studentId: string): Cosmetics =>
      liveCosmetics.get(studentId) ?? MOCK_COSMETICS.get(studentId) ?? DEFAULT_COSMETICS,
    [liveCosmetics],
  );

  const ownRecord = data?.students.find((s) => s.userId === user?.id) ?? null;
  const isDemo = actualRole === "student" && ownRecord?.email === DEMO_EMAIL;

  // Ranks need the whole set, which only a teacher's account can read. Teachers work the game
  // out in the browser; students read what the teacher last published.
  const teacherWorld = useMemo(() => {
    if (!data || data.role !== "teacher" || data.students.length === 0) return null;
    return buildGameWorld({
      students: data.students,
      config: gameConfig,
      ledger: data.game.ledger,
      cosmetics: liveCosmetics,
      voiceCounts: countVoiceMarks(data.markLog),
      rewardsSpendable: false,
    });
  }, [data, gameConfig, liveCosmetics]);

  // The sandbox: teachers preview it, and the public demo login plays in it so it never sees
  // real classmates.
  const sandboxWorld = useMemo(() => {
    if (actualRole !== "teacher" && !isDemo) return null;
    // The demo account's saved rewards are already in its database balance, so they are
    // taken out here and counted once, from the sandbox ledger.
    const demo = isDemo && ownRecord ? [{ ...ownRecord, rewardCoins: 0 }] : [];
    const demoVoice = countVoiceMarks(data?.markLog ?? []);
    return buildGameWorld({
      students: [...MOCK_STUDENTS, ...demo],
      config: gameConfig,
      ledger: [...mockSeedLedger(), ...(isDemo ? (game?.ledger ?? []) : [])],
      cosmetics: new Map<string, Cosmetics>([...MOCK_COSMETICS, ...liveCosmetics]),
      voiceCounts: new Map<string, number>([...MOCK_VOICE_COUNTS, ...demoVoice]),
      // Sandbox rewards live only here, so they count towards the sandbox balance.
      rewardsSpendable: true,
    });
  }, [actualRole, isDemo, ownRecord, data?.markLog, game, gameConfig, liveCosmetics]);

  const liveStudents = useMemo(() => {
    const rows = data?.students ?? [];
    return teacherWorld ? rows.map((s) => attachGame(s, teacherWorld.profiles)) : rows;
  }, [data, teacherWorld]);

  const mockStudents = useMemo(
    () =>
      actualRole === "teacher" && sandboxWorld
        ? MOCK_STUDENTS.map((s) => attachGame(s, sandboxWorld.profiles))
        : [],
    [actualRole, sandboxWorld],
  );

  const previewStudent =
    actualRole === "teacher" && previewId !== null
      ? (liveStudents.find((s) => s.id === previewId) ??
        mockStudents.find((s) => s.id === previewId) ??
        null)
      : null;
  const previewSource: Store["previewSource"] = previewStudent
    ? isMockStudentId(previewStudent.id)
      ? "mock"
      : "live"
    : null;

  // Forget a preview that no longer matches anyone (for example after signing in as a student).
  useEffect(() => {
    if (data && previewId !== null && previewStudent === null) rememberPreview(null);
  }, [data, previewId, previewStudent, rememberPreview]);

  const loadedSnapshot = useMemo(() => {
    if (actualRole !== "student" || isDemo || !ownRecord) return null;
    const row = game?.snapshots.find((r) => r.student_id === ownRecord.id);
    return row ? parseSnapshot(row.payload) : null;
  }, [actualRole, isDemo, ownRecord, game]);

  const loadedBoards = useMemo(
    () =>
      (game?.boards ?? []).flatMap((r) => {
        const b = parseLeaderboard(r.payload);
        return b ? [b] : [];
      }),
    [game],
  );

  let gameSnapshot: StudentSnapshot | null = null;
  let boards: Leaderboard[] = [];
  if (previewStudent) {
    const world = previewSource === "mock" ? sandboxWorld : teacherWorld;
    gameSnapshot = world?.snapshots.get(previewStudent.id) ?? null;
    boards = world?.boards ?? [];
  } else if (actualRole === "teacher") {
    boards = teacherWorld?.fullBoards ?? [];
  } else if (isDemo && ownRecord) {
    gameSnapshot = sandboxWorld?.snapshots.get(ownRecord.id) ?? null;
    boards = sandboxWorld?.boards ?? [];
  } else {
    gameSnapshot = loadedSnapshot;
    boards = loadedBoards;
  }

  const students = user ? liveStudents : [];
  const metaName: unknown = user?.user_metadata?.["full_name"];
  const fallbackMe: Student = {
    id: "",
    name: typeof metaName === "string" && metaName ? metaName : "Student",
    email: user?.email ?? "",
    set: "S2M3",
    scores: Array.from({ length: CHAPTER_COUNT }, () => null),
    scoreSources: [],
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks: 0,
    videoMarks: 0,
    coinsSpent: 0,
    completedVideos: [],
  };
  const baseMe = previewStudent ?? (user ? ownRecord : null) ?? fallbackMe;
  const me: Student =
    gameSnapshot && !baseMe.game ? { ...baseMe, game: gameSnapshot.profile } : baseMe;
  const isPreview = previewStudent !== null;
  const extras = data?.extras;
  const ownedItems = (extras?.purchases ?? [])
    .filter((p) => p.student_id === me.id)
    .map((p) => p.item_id);
  const boughtGrants = (extras?.shopItems ?? [])
    .filter((i) => ownedItems.includes(i.id))
    .flatMap((i) => i.grants);
  const myUnlocks = mergeUnlocks(gameSnapshot?.unlocks ?? null, boughtGrants);
  const selfChecks = isMockStudentId(me.id)
    ? mockSelfChecks(me.id)
    : (game?.selfChecks ?? []).filter((r) => r.student_id === me.id).map((r) => r.objective_id);

  const setDoubleMcEvent = async (active: boolean) => {
    if (actualRole !== "teacher") {
      throw new Error("Only teacher accounts can change the 2x Math Coins event");
    }
    const { data: rows, error } = await supabase
      .from("system_config")
      .update({
        double_mc_event_active: active,
        updated_at: new Date().toISOString(),
        updated_by: user?.id ?? null,
      })
      .eq("id", true)
      .select("id");
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) {
      throw new Error(
        "The 2x Math Coins event switch was not found. Run supabase/sql/0009_system_config.sql in the Supabase SQL Editor.",
      );
    }
    await query.refetch();
  };

  return (
    <Ctx.Provider
      value={{
        session: user ? { email: user.email ?? "", name: me.name } : null,
        role: isPreview ? "student" : actualRole,
        actualRole,
        students,
        me,
        ready: hydrated && (!user || !query.isPending),
        error: query.error?.message ?? null,
        content: data?.content ?? [],
        videos: data?.videos ?? [],
        lastSync: data?.lastSync ?? null,
        markLog: data?.markLog ?? [],
        rewards: data?.rewards ?? [],
        redemptions: data?.redemptions ?? [],
        coinsError: data?.coinsError ?? null,
        homework: data?.homework ?? [],
        homeworkError: data?.homeworkError ?? null,
        isPreview,
        readOnly: isPreview,
        previewSource,
        startPreview: (studentId) => {
          if (actualRole === "teacher") rememberPreview(studentId);
        },
        exitPreview: () => rememberPreview(null),
        mockStudents,
        systemConfig,
        configError: data?.configError ?? null,
        setDoubleMcEvent,
        gameSnapshot,
        boards,
        gameError: game?.error ?? null,
        gamePublishedAt: isDemo ? (gameSnapshot?.generatedAt ?? null) : (game?.publishedAt ?? null),
        cosmeticsOf,
        selfChecks,
        isDemo,
        shopItems: extras?.shopItems ?? [],
        ownedItems,
        myUnlocks,
        examDates: extras?.examDates ?? [],
        extrasError: extras?.error ?? null,
        refresh: () => query.refetch(),
        logout: async () => {
          rememberPreview(null);
          await supabase.auth.signOut();
          qc.clear();
          setUser(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
