import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { badgeStatsFromRows, type BadgeStats } from "./badges";

type Client = SupabaseClient<Database>;

async function pages<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{
    data: T[] | null;
    error: { message: string } | null;
  }>,
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await fetchPage(from, from + 999);
    if (error || !data || data.length === 0) return rows;
    rows.push(...data);
    if (data.length < 1000) return rows;
    from += data.length;
  }
}

/** Class-wide badge inputs. A missing table counts as zero so the rest of the app still loads. */
export async function loadBadgeStats(supabase: Client): Promise<BadgeStats> {
  const [selfChecks, mistakes, checkins, luckyDraws] = await Promise.all([
    pages((from, to) =>
      supabase
        .from("chapter_self_checks")
        .select("student_id, objective_id")
        .order("student_id")
        .range(from, to),
    ),
    pages((from, to) =>
      supabase.from("mistakes").select("student_id, status").order("student_id").range(from, to),
    ),
    pages((from, to) =>
      supabase
        .from("daily_checkins")
        .select("student_id, checkin_date")
        .order("student_id")
        .range(from, to),
    ),
    pages((from, to) =>
      supabase
        .from("daily_marks")
        .select("student_id")
        .eq("reason", "correct_answer")
        .eq("note", "Lucky draw")
        .order("student_id")
        .range(from, to),
    ),
  ]);
  return badgeStatsFromRows({ selfChecks, mistakes, checkins, luckyDraws });
}
