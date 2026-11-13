import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { PageHeader, Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { average, improvement, ranked } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Rankings — HLC Math" },
      { name: "description", content: "Mathematics rankings across S2M3 and S2M5." },
      { property: "og:title", content: "Rankings — HLC Math" },
      { property: "og:description", content: "Chapter average rankings for S2 Mathematics." },
    ],
  }),
  component: Leaderboard,
});

const FILTERS = ["All S2", "S2M3", "S2M5"] as const;
const PLACES = [
  { label: "1st", border: "border-l-gold" },
  { label: "2nd", border: "border-l-silver" },
  { label: "3rd", border: "border-l-bronze" },
];

function Leaderboard() {
  const { students } = useApp();
  const [f, setF] = useState<(typeof FILTERS)[number]>("All S2");
  const list = ranked(f === "All S2" ? students : students.filter((s) => s.set === f));
  const top = list.slice(0, 3);

  return (
    <AppShell>
      <TeacherOnly>
        <PageHeader
          title="Rankings"
          description="Ranked by the average of each student's chapter scores. Visible to teachers only."
          actions={
            <div className="flex rounded-md border border-border bg-card p-0.5">
              {FILTERS.map((x) => (
                <button
                  type="button"
                  key={x}
                  onClick={() => setF(x)}
                  className={cn(
                    "rounded px-4 py-1.5 text-sm font-semibold",
                    f === x
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {x}
                </button>
              ))}
            </div>
          }
        />

        {top.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {top.map((s, i) => {
              const p = PLACES[i];
              if (!p) return null;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-lg border border-border border-l-4 bg-card p-4 shadow-chunky",
                    p.border,
                  )}
                >
                  <p className="text-sm text-muted-foreground">{p.label}</p>
                  <p className="mt-1 truncate text-lg font-semibold">{s.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.set}
                    {s.className ? `, ${s.className} ${s.classNo ?? ""}` : ""}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums">{average(s)}%</p>
                </div>
              );
            })}
          </div>
        )}

        <Panel className="mt-6" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                <th className="w-14 p-3 text-center">Rank</th>
                <th className="p-3">Student</th>
                <th className="hidden p-3 sm:table-cell">Set</th>
                <th className="hidden p-3 text-right sm:table-cell">Change</th>
                <th className="p-3 text-right">Average</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, i) => {
                const imp = improvement(s);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-center font-semibold tabular-nums text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="hidden p-3 text-muted-foreground sm:table-cell">{s.set}</td>
                    <td
                      className={cn(
                        "hidden p-3 text-right font-semibold tabular-nums sm:table-cell",
                        imp >= 0 ? "text-success" : "text-destructive",
                      )}
                    >
                      {imp >= 0 ? "+" : ""}
                      {imp}%
                    </td>
                    <td className="p-3 text-right font-semibold tabular-nums">{average(s)}%</td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
      </TeacherOnly>
    </AppShell>
  );
}
