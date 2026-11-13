import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ScoreSource, Student } from "./data";
import { chapterScoresFromAssessments, type Assessment } from "./assessments";

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
      error: `Math Coins / Awards 未設定好：${error.message}（請先喺 Supabase SQL Editor 執行 0005 SQL）`,
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
  role: "student" | "teacher";
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
  const qc = useQueryClient();

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

      return {
        lastSync: syncs.data?.[0]?.created_at ?? null,
        students,
        role: roles.data?.some((r) => r.role === "teacher")
          ? ("teacher" as const)
          : ("student" as const),
        content: content.data ?? [],
        videos: chapterVideos.data ?? [],
        markLog: markLog.data ?? [],
        rewards: coins.rewards,
        redemptions: coins.redemptions,
        coinsError: coins.error,
      };
    },
  });

  const students = user ? (query.data?.students ?? []) : [];
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
  const me = students.find((s) => s.userId === user?.id) ?? fallbackMe;

  return (
    <Ctx.Provider
      value={{
        session: user ? { email: user.email ?? "", name: me.name } : null,
        role: query.data?.role ?? "student",
        students,
        me,
        ready: hydrated && (!user || !query.isPending),
        error: query.error?.message ?? null,
        content: query.data?.content ?? [],
        videos: query.data?.videos ?? [],
        lastSync: query.data?.lastSync ?? null,
        markLog: query.data?.markLog ?? [],
        rewards: query.data?.rewards ?? [],
        redemptions: query.data?.redemptions ?? [],
        coinsError: query.data?.coinsError ?? null,
        refresh: () => query.refetch(),
        logout: async () => {
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
