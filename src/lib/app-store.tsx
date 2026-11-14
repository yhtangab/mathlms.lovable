import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { attachGame, buildGameProfiles, countVoiceMarks, ledgerKey } from "./gamification/rules";
import { DEFAULT_SYSTEM_CONFIG, type LedgerEntry, type SystemConfig } from "./gamification/types";

type PublicTables = Database["public"]["Tables"];
type AssessmentRow = PublicTables["assessment_scores"]["Row"];
type VideoCompletionRow = PublicTables["chapter_video_completions"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];
type Content = PublicTables["chapter_content"]["Row"];
export type ChapterVideo = PublicTables["chapter_videos"]["Row"];
export type MarkRow = PublicTables["daily_marks"]["Row"];
export type Reward = PublicTables["rewards"]["Row"];
export type Redemption = PublicTables["reward_redemptions"]["Row"];

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
  // Rewards worked out in this tab so far. They keep the 2x setting they were given with,
  // so switching the event on later does not double rewards that were already shown.
  const liveLedger = useRef(new Map<string, LedgerEntry>());
  const liveLedgerSeeded = useRef(false);

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
        liveLedger.current.clear();
        liveLedgerSeeded.current = false;
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

  // Ranks need the whole set, which only a teacher's account can read, so game profiles for
  // real students are only worked out on teacher accounts. Rewards are not saved yet, so they
  // are shown but not added to the spendable balance.
  const liveStudents = useMemo(() => {
    if (!data || data.role !== "teacher" || data.students.length === 0) {
      return data?.students ?? [];
    }
    // The first run treats everything already in the sheet as history, given at 1x.
    const firstRun = !liveLedgerSeeded.current;
    const { profiles, added } = buildGameProfiles({
      students: data.students,
      config: firstRun ? DEFAULT_SYSTEM_CONFIG : systemConfig,
      ledger: [...liveLedger.current.values()],
      voiceCounts: countVoiceMarks(data.markLog),
      rewardsSpendable: false,
    });
    for (const e of added) liveLedger.current.set(ledgerKey(e), e);
    liveLedgerSeeded.current = true;
    return data.students.map((s) => attachGame(s, profiles));
  }, [data, systemConfig]);

  const mockStudents = useMemo(() => {
    if (actualRole !== "teacher") return [];
    const { profiles } = buildGameProfiles({
      students: MOCK_STUDENTS,
      config: systemConfig,
      ledger: mockSeedLedger(),
      cosmetics: MOCK_COSMETICS,
      voiceCounts: MOCK_VOICE_COUNTS,
      // Kept out of the balance like real rewards, so the coin chip and the pages agree.
      rewardsSpendable: false,
    });
    return MOCK_STUDENTS.map((s) => attachGame(s, profiles));
  }, [actualRole, systemConfig]);

  const previewStudent =
    actualRole === "teacher" && previewId !== null
      ? (liveStudents.find((s) => s.id === previewId) ??
        mockStudents.find((s) => s.id === previewId) ??
        null)
      : null;

  // Forget a preview that no longer matches anyone (for example after signing in as a student).
  useEffect(() => {
    if (data && previewId !== null && previewStudent === null) rememberPreview(null);
  }, [data, previewId, previewStudent, rememberPreview]);

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
  const me = previewStudent ?? students.find((s) => s.userId === user?.id) ?? fallbackMe;
  const isPreview = previewStudent !== null;

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
        previewSource: previewStudent
          ? isMockStudentId(previewStudent.id)
            ? "mock"
            : "live"
          : null,
        startPreview: (studentId) => {
          if (actualRole === "teacher") rememberPreview(studentId);
        },
        exitPreview: () => rememberPreview(null),
        mockStudents,
        systemConfig,
        configError: data?.configError ?? null,
        setDoubleMcEvent,
        refresh: () => query.refetch(),
        logout: async () => {
          rememberPreview(null);
          await supabase.auth.signOut();
          liveLedger.current.clear();
          liveLedgerSeeded.current = false;
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
