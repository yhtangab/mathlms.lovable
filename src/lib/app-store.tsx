import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Student } from './data';
import type { Database } from '@/integrations/supabase/types';
import type { Assessment } from './assessments';
type AssessmentRow = Database['public']['Tables']['assessment_scores']['Row'];
/** The database returns at most 1000 rows per request, so page through every assessment row. */
async function fetchAllAssessments() {
  const rows: AssessmentRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('assessment_scores').select('*').order('student_id').order('position').range(from, from + 999);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) return rows;
  }
}
type Content = Database['public']['Tables']['chapter_content']['Row'];
interface Store {
  session: { email: string; name: string } | null;
  role: 'student' | 'teacher';
  students: Student[];
  me: Student;
  ready: boolean;
  error: string | null;
  content: Content[];
  lastSync: string | null;
  refresh: () => Promise<unknown>;
  logout: () => Promise<void>;
}
const g = globalThis as unknown as { __hlcCloudCtx?: ReturnType<typeof createContext<Store | null>> };
const Ctx = (g.__hlcCloudCtx ??= createContext<Store | null>(null));
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const qc = useQueryClient();
  useEffect(() => {
    let active = true;
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) { setUser(data.user); setHydrated(true); }
    };
    const { data: listener } = supabase.auth.onAuthStateChange(event => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      if (event === 'SIGNED_OUT') { setUser(null); qc.clear(); }
      else { setHydrated(false); setTimeout(() => { void verify(); }, 0); }
    });
    void verify();
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [qc]);
  const query = useQuery({
    queryKey: ['math-records', user?.id], enabled: Boolean(user),
    queryFn: async () => {
      const claim = await supabase.rpc('claim_student');
      if (claim.error) throw claim.error;
      const [roles, roster, scores, marks, videos, content, assessments, syncs] = await Promise.all([
        supabase.from('user_roles').select('role'), supabase.from('students').select('*'),
        supabase.from('chapter_scores').select('*'), supabase.from('daily_marks').select('*'),
        supabase.from('video_completions').select('*'), supabase.from('chapter_content').select('*'),
        fetchAllAssessments(), supabase.from('sheet_syncs').select('created_at').order('created_at', { ascending: false }).limit(1),
      ]);
      for (const r of [roles, roster, scores, marks, videos, content, syncs]) if (r.error) throw r.error;
      const students: Student[] = (roster.data ?? []).map(s => ({
        id: s.id, userId: s.user_id, name: s.name, email: s.email, set: s.math_set as Student['set'],
        scores: Array.from({ length: 7 }, (_, i) => scores.data?.find(v => v.student_id === s.id && v.chapter === i + 1)?.score ?? null),
        lastMonthAvg: s.last_month_avg, lastMonthFormRank: s.last_month_form_rank, xp: s.xp, streak: s.streak,
        dailyMarks: marks.data?.filter(m => m.student_id === s.id).reduce((a, m) => a + m.marks, 0) ?? 0,
        videoMarks: videos.data?.filter(v => v.student_id === s.id).length ?? 0,
        completedVideos: videos.data?.filter(v => v.student_id === s.id).map(v => v.chapter) ?? [],
        assessments: assessments.filter(a => a.student_id === s.id) as Assessment[],
        hlcNo: s.hlc_no, className: s.class_name, classNo: s.class_no,
      }));
      return { lastSync: syncs.data?.[0]?.created_at ?? null, students, role: roles.data?.some(r => r.role === 'teacher') ? 'teacher' as const : 'student' as const, content: content.data ?? [] };
    }, retry: false,
  });
  const students = user ? query.data?.students ?? [] : [];
  const me = students.find(s => s.userId === user?.id) ?? { id: '', name: user?.user_metadata?.['full_name'] ?? 'Student', email: user?.email ?? '', set: 'S2M3' as const, scores: Array(7).fill(null), lastMonthAvg: 0, lastMonthFormRank: 0, xp: 0, streak: 0, dailyMarks: 0, videoMarks: 0, completedVideos: [] };
  return <Ctx.Provider value={{ session: user ? { email: user.email ?? '', name: me.name } : null, role: query.data?.role ?? 'student', students, me, ready: hydrated && (!user || !query.isPending), error: query.error?.message ?? null, content: query.data?.content ?? [], lastSync: query.data?.lastSync ?? null, refresh: () => query.refetch(), logout: async () => { await supabase.auth.signOut(); qc.clear(); setUser(null); } }}>{children}</Ctx.Provider>;
}
export function useApp() { const c = useContext(Ctx); if (!c) throw new Error('useApp outside provider'); return c; }
