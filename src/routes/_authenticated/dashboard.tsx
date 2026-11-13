import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CalendarClock } from "lucide-react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { AssessmentReport } from "@/components/AssessmentReport";
import { Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, average, improvement, weakTopics } from "@/lib/data";
import { COIN_NAME, coinBalance, reasonLabel } from "@/lib/coins";
import { termSummary, termsOf } from "@/lib/assessments";
import {
  DUE_LABEL,
  DUE_TONE,
  dueStatus,
  formatDue,
  homeworkForSet,
  splitByDue,
} from "@/lib/homework";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — HLC Math" },
      { name: "description", content: "Your homework, marks and chapter progress." },
      { property: "og:title", content: "Dashboard — HLC Math" },
      { property: "og:description", content: "Homework, marks and chapter progress." },
    ],
  }),
  component: Dashboard,
});

const HOMEWORK_PREVIEW = 5;
const COIN_PREVIEW = 5;

function Dashboard() {
  const { me, homework, markLog } = useApp();
  const assessments = me.assessments ?? [];
  const terms = termsOf(
    assessments.filter((a) => a.kind === "item" && (a.score !== null || a.absent)),
  );
  const term = terms.at(-1);
  const coursework = term === undefined ? null : termSummary(assessments, term).coursework200;
  const marked = me.scores.filter((s) => s !== null).length;
  const avg = average(me);
  const imp = improvement(me);
  const weak = weakTopics(me);
  const { upcoming } = splitByDue(homeworkForSet(homework, me.set));
  const coins = markLog.filter((m) => m.student_id === me.id).slice(0, COIN_PREVIEW);
  const firstName = me.name.split(" ")[0] ?? me.name;
  const classText = me.className
    ? `, class ${me.className}${me.classNo ? ` (${me.classNo})` : ""}`
    : "";

  return (
    <AppShell>
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-semibold">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {me.set} Mathematics{classText}
        </p>
      </header>

      <section aria-label="Summary" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label={term === undefined ? "Coursework" : `Term ${term} coursework`}
          value={coursework === null ? "—" : String(coursework)}
          suffix="/ 200"
        />
        <Metric
          label="Chapter average"
          value={marked ? `${avg}%` : "—"}
          note={
            marked && me.lastMonthAvg > 0 ? (
              <span className={imp >= 0 ? "text-success" : "text-destructive"}>
                {imp >= 0 ? "+" : ""}
                {imp}% on last month
              </span>
            ) : null
          }
        />
        <Metric
          label="Chapters with marks"
          value={String(marked)}
          suffix={`/ ${CHAPTERS.length}`}
        />
        <Link to="/awards" className="block rounded-lg">
          <Metric label={COIN_NAME} value={String(coinBalance(me))} note="See rewards" />
        </Link>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel
            title="Homework"
            description={
              upcoming.length === 0
                ? "Nothing due"
                : `${upcoming.length} upcoming deadline${upcoming.length === 1 ? "" : "s"}`
            }
            actions={
              <Link to="/homework" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            }
            bodyClassName="px-5 py-1"
          >
            {upcoming.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No homework is due. New homework from your teacher will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.slice(0, HOMEWORK_PREVIEW).map((h) => {
                  const st = dueStatus(h.due_at);
                  return (
                    <li key={h.id} className="flex items-start gap-3 py-3">
                      <CalendarClock
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">{h.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDue(h.due_at)}
                          {h.chapter === null ? "" : `, Chapter ${h.chapter}`}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                          DUE_TONE[st],
                        )}
                      >
                        {DUE_LABEL[st]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <AssessmentReport assessments={assessments} />

          <Panel title="Chapter progress" bodyClassName="px-3 py-2">
            <ul>
              {CHAPTERS.map((c, i) => {
                const s = me.scores[i] ?? null;
                return (
                  <li key={c.id}>
                    <Link
                      to="/courses/$chapter"
                      params={{ chapter: String(c.id) }}
                      className="flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/60"
                    >
                      <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                        {c.id}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.title}</span>
                      <span className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:block">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            s !== null && s < 60 ? "bg-destructive" : "bg-success",
                          )}
                          style={{ width: `${s ?? 0}%` }}
                        />
                      </span>
                      <span
                        className={cn(
                          "w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums",
                          scoreTone(s),
                        )}
                      >
                        {s === null ? "—" : `${s}%`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Topics to review">
            {weak.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {marked ? "No chapter is below 60% at the moment." : "No chapter marks yet."}
              </p>
            ) : (
              <ul className="space-y-2">
                {weak.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/courses/$chapter"
                      params={{ chapter: String(c.id) }}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 hover:border-primary/50"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs text-muted-foreground">Chapter {c.id}</span>
                        <span className="block truncate text-sm font-medium">{c.title}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-destructive">
                        {me.scores[c.id - 1]}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {weak.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Rewatch the chapter videos and redo the exercise before the next quiz.
              </p>
            )}
          </Panel>

          <Panel
            title={`Recent ${COIN_NAME}`}
            actions={
              <Link to="/awards" className="text-sm font-medium text-primary hover:underline">
                History
              </Link>
            }
          >
            {coins.length === 0 ? (
              <p className="text-sm text-muted-foreground">None awarded yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {coins.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span className="min-w-0 flex-1 truncate">
                      {reasonLabel(m.reason)}
                      {m.note ? <span className="text-muted-foreground">, {m.note}</span> : null}
                    </span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        m.marks > 0
                          ? "text-success"
                          : m.marks < 0
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    >
                      {m.marks > 0 ? `+${m.marks}` : m.marks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  suffix,
  note,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: ReactNode;
}) {
  return (
    <div className="h-full rounded-lg border border-border bg-card p-4 shadow-chunky">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {value}
        {suffix ? (
          <span className="text-sm font-normal text-muted-foreground"> {suffix}</span>
        ) : null}
      </p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}
