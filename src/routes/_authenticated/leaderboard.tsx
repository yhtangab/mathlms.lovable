import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Flame } from "lucide-react";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { average, improvement, ranked } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Leaderboard — HLC Math" },
      { name: "description", content: "S2 Math rankings across S2M3 and S2M5." },
      { property: "og:title", content: "Leaderboard — HLC Math" },
      { property: "og:description", content: "Who's topping S2 Math this month?" },
    ],
  }),
  component: Leaderboard,
});

const FILTERS = ["Overall S2", "S2M3", "S2M5"] as const;
const PODIUM = [
  { ring: "border-gold bg-gold/15", badge: "bg-gold text-accent-foreground", h: "md:mt-0", trophy: "🥇" },
  { ring: "border-silver bg-silver/20", badge: "bg-silver text-foreground", h: "md:mt-8", trophy: "🥈" },
  { ring: "border-bronze bg-bronze/15", badge: "bg-bronze text-primary-foreground", h: "md:mt-12", trophy: "🥉" },
];

function Leaderboard() {
  const { students, me } = useApp();
  const [f, setF] = useState<(typeof FILTERS)[number]>("Overall S2");
  const list = ranked(f === "Overall S2" ? students : students.filter((s) => s.set === f));
  const top = list.slice(0, 3);
  const order = [1, 0, 2];

  return (
    <AppShell><TeacherOnly>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
        <div className="flex rounded-2xl bg-muted p-1">
          {FILTERS.map((x) => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-extrabold",
                f === x ? "bg-primary text-primary-foreground shadow-chunky-primary" : "text-muted-foreground",
              )}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {order.map((i) => {
          const s = top[i];
          if (!s) return null;
          const p = PODIUM[i];
          if (!p) return null;
          return (
            <div key={s.id} className={cn("rounded-3xl border-4 p-6 text-center", p.ring, p.h)}>
              {i === 0 && <Crown className="mx-auto h-8 w-8 text-gold" />}
              <div className="text-5xl">{p.trophy}</div>
              <p className="mt-2 font-display text-xl font-bold">{s.name}</p>
              <p className="text-sm font-bold text-muted-foreground">{s.set}</p>
              <span className={cn("mt-3 inline-block rounded-full px-4 py-1 font-display text-lg font-bold", p.badge)}>
                {average(s)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky">
        {list.map((s, i) => {
          const imp = improvement(s);
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-3 border-b border-border px-4 py-3 last:border-0",
                s.id === me.id && "bg-primary/10",
              )}
            >
              <span className="w-8 text-center font-display text-lg font-bold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {s.name} {s.id === me.id && <span className="text-primary">(You)</span>}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">{s.set}</p>
              </div>
              <span className="hidden items-center gap-1 text-sm font-bold text-flame sm:flex">
                <Flame className="h-4 w-4" /> {s.streak}
              </span>
              <span className={cn("hidden w-14 text-right text-sm font-extrabold sm:block", imp >= 0 ? "text-success" : "text-destructive")}>
                {imp >= 0 ? "+" : ""}
                {imp}%
              </span>
              <span className="w-14 text-right font-display text-lg font-bold">{average(s)}%</span>
            </div>
          );
        })}
      </div>
    </TeacherOnly></AppShell>
  );
}
