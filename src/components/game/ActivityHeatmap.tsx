import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isMockStudentId } from "@/lib/gamification/mock-data";
import { localDateKey, mockActivity } from "@/lib/gamification/mock-activity";
import type { ActivityEvent } from "@/lib/gamification/types";
import { cn } from "@/lib/utils";

const WEEKS = 26;
type Kind = ActivityEvent["kind"];

const KIND_LABEL: Record<Kind, string> = {
  lesson: "Lesson marks",
  homework: "Homework on time",
  video: "Videos watched",
};

/** Four strengths for each kind, written out in full so Tailwind can find them. */
const SHADES: Record<Kind, [string, string, string, string]> = {
  lesson: ["bg-success/30", "bg-success/55", "bg-success/80", "bg-success"],
  homework: ["bg-gold/40", "bg-gold/65", "bg-gold/85", "bg-gold"],
  video: ["bg-sky/30", "bg-sky/55", "bg-sky/80", "bg-sky"],
};

const WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

/** Monday of the week that contains `d`, at local midnight. */
function mondayOf(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
}

async function loadActivity(studentId: string, since: Date): Promise<ActivityEvent[]> {
  const [marks, videos] = await Promise.all([
    supabase
      .from("daily_marks")
      .select("lesson_date, reason, marks")
      .eq("student_id", studentId)
      .gte("lesson_date", localDateKey(since)),
    supabase
      .from("chapter_video_completions")
      .select("completed_at")
      .eq("student_id", studentId)
      .gte("completed_at", since.toISOString()),
  ]);
  if (marks.error) throw new Error(marks.error.message);
  if (videos.error) throw new Error(videos.error.message);
  const events: ActivityEvent[] = [];
  for (const m of marks.data ?? []) {
    if (m.reason === "deduction" || m.marks < 0) continue;
    events.push({ date: m.lesson_date, kind: m.reason === "homework" ? "homework" : "lesson" });
  }
  for (const v of videos.data ?? []) {
    events.push({ date: localDateKey(new Date(v.completed_at)), kind: "video" });
  }
  return events;
}

/** Each day of the last six months coloured by what the student did. */
export function ActivityHeatmap({ studentId }: { studentId: string }) {
  const today = new Date();
  const start = new Date(mondayOf(today).getTime());
  start.setDate(start.getDate() - (WEEKS - 1) * 7);
  const mock = isMockStudentId(studentId);

  const query = useQuery({
    queryKey: ["activity-heatmap", studentId, localDateKey(start)],
    enabled: Boolean(studentId),
    queryFn: () =>
      mock ? Promise.resolve(mockActivity(studentId, today)) : loadActivity(studentId, start),
  });

  if (query.isPending) return <p className="text-sm text-muted-foreground">Loading activity…</p>;
  if (query.isError) {
    return (
      <p className="text-sm text-destructive">Could not load activity: {query.error.message}</p>
    );
  }

  const byDay = new Map<string, Record<Kind, number>>();
  for (const e of query.data) {
    const day = byDay.get(e.date) ?? { lesson: 0, homework: 0, video: 0 };
    day[e.kind] += 1;
    byDay.set(e.date, day);
  }
  const totals: Record<Kind, number> = { lesson: 0, homework: 0, video: 0 };

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      const key = localDateKey(date);
      const counts = byDay.get(key) ?? { lesson: 0, homework: 0, video: 0 };
      const future = date.getTime() > today.getTime();
      if (!future) {
        totals.lesson += counts.lesson;
        totals.homework += counts.homework;
        totals.video += counts.video;
      }
      return { date, key, counts, future };
    }),
  );

  const monthSpans: { label: string; weeks: number }[] = [];
  for (const week of weeks) {
    const first = week[0]?.date;
    if (!first) continue;
    const label = first.toLocaleDateString("en-GB", { month: "short" });
    const last = monthSpans[monthSpans.length - 1];
    if (last && last.label === label) last.weeks += 1;
    else monthSpans.push({ label, weeks: 1 });
  }

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="inline-grid grid-cols-[28px_auto] gap-x-1.5">
          <span />
          <div className="flex gap-1 text-xs font-semibold text-muted-foreground">
            {monthSpans.map((m, i) => (
              <span
                key={`${m.label}-${i}`}
                className="truncate"
                style={{
                  width: `calc(${m.weeks} * 0.875rem + ${Math.max(0, m.weeks - 1)} * 0.25rem)`,
                }}
              >
                {m.weeks >= 3 ? m.label : m.label.slice(0, 1)}
              </span>
            ))}
          </div>
          <div className="grid grid-rows-7 gap-1 text-xs font-semibold leading-3.5 text-muted-foreground">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="h-3.5">
                {d}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, w) => (
              <div key={w} className="grid grid-rows-7 gap-1">
                {week.map(({ key, counts, future, date }) => {
                  const total = counts.lesson + counts.homework + counts.video;
                  const main: Kind =
                    counts.homework >= counts.lesson &&
                    counts.homework >= counts.video &&
                    counts.homework > 0
                      ? "homework"
                      : counts.video > counts.lesson
                        ? "video"
                        : "lesson";
                  const shade = SHADES[main][Math.min(3, Math.max(0, total - 1))];
                  const label = `${date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}: ${
                    total === 0
                      ? "no activity"
                      : (Object.keys(KIND_LABEL) as Kind[])
                          .filter((k) => counts[k] > 0)
                          .map((k) => `${counts[k]} ${KIND_LABEL[k].toLowerCase()}`)
                          .join(", ")
                  }`;
                  return (
                    <span
                      key={key}
                      title={future ? undefined : label}
                      aria-label={future ? undefined : label}
                      className={cn(
                        "h-3.5 w-3.5 rounded-[3px]",
                        future ? "bg-transparent" : total === 0 ? "bg-muted" : shade,
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("h-3 w-3 rounded-[3px]", SHADES[k][3])} />
            <span className="font-semibold">{KIND_LABEL[k]}</span>
            <span className="tabular-nums text-muted-foreground">{totals[k]}</span>
          </span>
        ))}
        <span className="flex items-center gap-1 text-muted-foreground">
          Less
          {SHADES.lesson.map((s) => (
            <span key={s} aria-hidden="true" className={cn("h-3 w-3 rounded-[3px]", s)} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
