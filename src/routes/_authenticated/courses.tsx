import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapter — HLC Math" },
      { name: "description", content: "S2 Mathematics chapters 1–7." },
      { property: "og:title", content: "Chapter — HLC Math" },
      { property: "og:description", content: "Seven S2 Math chapters to master." },
    ],
  }),
  component: Courses,
});

const STATUS = {
  Completed: { cls: "bg-success/15 text-success", icon: CheckCircle2 },
  "In Progress": { cls: "bg-gold/25 text-gold-deep", icon: PlayCircle },
  "Not Started": { cls: "bg-muted text-muted-foreground", icon: Circle },
};

function Courses() {
  const { me } = useApp();
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">📚 Chapter</h1>
      <p className="font-semibold text-muted-foreground">S2 Mathematics</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c, i) => {
          const s = me.scores[i] ?? null;
          const st = chapterStatus(s, i, me.scores);
          const S = STATUS[st];
          return (
            <div key={c.id} className="flex flex-col rounded-3xl border-2 border-border bg-card p-5 shadow-chunky transition hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-3xl">{c.emoji}</span>
                <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold", S.cls)}>
                  <S.icon className="h-3.5 w-3.5" /> {st}
                </span>
              </div>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-primary">Chapter {c.id}</p>
              <h2 className="text-lg font-bold leading-tight">{c.title}</h2>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className={cn("rounded-full px-3 py-1 text-sm font-extrabold", scoreTone(s))}>
                  {s === null ? "No score yet" : `Score ${s}%`}
                </span>
                <span className="text-xs font-bold text-muted-foreground">Videos · Notes · Quiz soon</span>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
