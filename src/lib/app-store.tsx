import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Student } from "./data";
import { chapterScoresFromAssessments, type Assessment } from "./assessments";

type AssessmentRow = Database["public"]["Tables"]["assessment_scores"]["Row"];
type Content = Database["public"]["Tables"]["chapter_content"]["Row"];
export type ChapterVideo = Database["public"]["Tables"]["chapter_videos"]["Row"];

const CHAPTER_COUNT = 7;
const PAGE_SIZE = 1000;

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
      const [roles, roster, scores, marks, videos, content, assessmentRows, syncs, chapterVideos] =
        await Promise.all([
          supabase.from("user_roles").select("role"),
          supabase.from("students").select("*"),
          supabase.from("chapter_scores").select("*"),
          supabase.from("daily_marks").select("*"),
          supabase.from("chapter_video_completions").select("*"),
          supabase.from("chapter_content").select("*"),
          fetchAllAssessments(),
          supabase
            .from("sheet_syncs")
            .select("created_at")
            .order("created_at", { ascending: false })
            .limit(1),
          supabase.from("chapter_videos").select("*").order("chapter").order("position"),
        ]);
      for (const r of [roles, roster, scores, marks, videos, content, syncs, chapterVideos]) {
        if (r.error) throw r.error;
      }

      const assessmentsByStudent = new Map<string, Assessment[]>();
      for (const row of assessmentRows) {
        const item = toAssessment(row);
        const existing = assessmentsByStudent.get(row.student_id);
        if (existing) existing.push(item);
        else assessmentsByStudent.set(row.student_id, [item]);
      }

      const students: Student[] = (roster.data ?? []).map((s) => {
        const own = assessmentsByStudent.get(s.id) ?? [];
        const fromSheet = chapterScoresFromAssessments(own, CHAPTER_COUNT);
        const ownVideos = (videos.data ?? []).filter((v) => v.student_id === s.id);
        return {
          id: s.id,
          userId: s.user_id,
          name: s.name,
          email: s.email,
          set: s.math_set as Student["set"],
          // A score the teacher typed in the app wins; otherwise use the sheet's SQ/CQ average.
          scores: Array.from({ length: CHAPTER_COUNT }, (_, i) => {
            const saved = scores.data?.find(
              (v) => v.student_id === s.id && v.chapter === i + 1,
            )?.score;
            return saved ?? fromSheet[i] ?? null;
          }),
          lastMonthAvg: s.last_month_avg,
          lastMonthFormRank: s.last_month_form_rank,
          xp: s.xp,
          streak: s.streak,
          dailyMarks: (marks.data ?? [])
            .filter((m) => m.student_id === s.id)
            .reduce((a, m) => a + m.marks, 0),
          videoMarks: ownVideos.length,
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
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks: 0,
    videoMarks: 0,
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
