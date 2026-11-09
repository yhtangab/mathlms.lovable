import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Flame, Medal, Sparkles, TrendingUp, Zap } from "lucide-react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, average, completion, formRank, improvement, level, setRank, weakTopics } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My Dashboard — HLC Math" },
      { name: "description", content: "Your S2 Math scores, ranks, streak and weaker topics." },
      { property: "og:title", content: "My Dashboard — HLC Math" },
      { property: "og:description", content: "Track S2 chapter scores and rank progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { me, students } = useApp();
  const avg = average(me);
  const fr = 0;
  const sr = 0;
  const imp = improvement(me);
  const rankUp = me.lastMonthFormRank - fr;
  const weak = weakTopics(me);
  const lvl = level(me.xp);
  const lvlPct = (me.xp % 1000) / 10;

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Student card */}
        <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-chunky lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
              {me.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{me.name}</h1>
              <p className="truncate text-sm font-semibold text-muted-foreground">{me.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">
                {me.set}
              </span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat icon={<Flame className="h-5 w-5 text-flame" />} value={me.streak} label="Day streak" />
            <Stat icon={<Zap className="h-5 w-5 text-gold" />} value={me.xp.toLocaleString()} label="XP" />
            <Stat icon={<Sparkles className="h-5 w-5 text-primary" />} value={`Lv ${lvl}`} label="Level" />
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
              <span>Level {lvl}</span>
              <span>{1000 - (me.xp % 1000)} XP to Lv {lvl + 1}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold" style={{ width: `${lvlPct}%` }} />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Pill className="bg-gold/20 text-gold-deep" icon={<Medal className="h-4 w-4" />}>
              {me.set} · Private student record
            </Pill>
            <Pill
              className={imp >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}
              icon={<TrendingUp className="h-4 w-4" />}
            >
              {imp >= 0 ? "+" : ""}
              {imp}% score this month
            </Pill>
            {weak.length > 0 && (
              <Pill className="bg-destructive/10 text-destructive" icon={<AlertTriangle className="h-4 w-4" />}>
                Needs Practice: Ch {weak[0]?.id} {weak[0]?.short}
              </Pill>
            )}
          </div>
        </section>

        <section className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Big label="Overall average" value={`${avg}%`} tone="bg-primary text-primary-foreground shadow-chunky-primary" />
            <Big label="Chapters done" value={`${completion(me)}%`} tone="bg-success text-primary-foreground shadow-chunky-success" />
            <Big label="Activity marks" value={`${(me.dailyMarks ?? 0) + (me.videoMarks ?? 0)}`} tone="col-span-2 md:col-span-1 bg-gold text-accent-foreground shadow-chunky-gold" />
          </div>

          {weak.length > 0 && (
            <div className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-destructive">
                <AlertTriangle className="h-5 w-5" /> Weaker Topics Alert
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {weak.map((c) => (
                  <Link
                    to="/courses"
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-chunky"
                  >
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Chapter {c.id}</p>
                      <p className="font-bold">{c.short}</p>
                      <p className="text-sm font-extrabold text-destructive">{me.scores[c.id - 1]}%</p>
                    </div>
                    <span className="rounded-full bg-gold/25 px-3 py-1 text-xs font-extrabold text-gold-deep">
                      Recommended Review
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
            <h2 className="text-lg font-bold">Progress timeline · Chapters 1–7</h2>
            <ol className="mt-4 space-y-3">
              {CHAPTERS.map((c, i) => {
                const s = me.scores[i] ?? null;
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg",
                        s === null ? "bg-muted" : s >= 60 ? "bg-success/20" : "bg-destructive/15",
                      )}
                    >
                      {c.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm font-bold">
                        <span className="truncate">Ch {c.id} · {c.short}</span>
                        <span className={cn("rounded-full px-2 text-xs leading-5", scoreTone(s))}>
                          {s === null ? "—" : `${s}%`}
                        </span>
                      </div>
                      <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full", s !== null && s < 60 ? "bg-destructive" : "bg-success")}
                          style={{ width: `${s ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="flex justify-center">{icon}</div>
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
    </div>
  );
}
function Pill({ children, icon, className }: { children: React.ReactNode; icon: React.ReactNode; className: string }) {
  return (
    <div className={cn("flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold", className)}>
      {icon}
      {children}
    </div>
  );
}
function Big({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={cn("rounded-3xl p-5", tone)}>
      <p className="text-sm font-bold opacity-90">{label}</p>
      <p className="font-display text-4xl font-bold">{value}</p>
    </div>
  );
}
