import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapters — HLC Math" },
      { name: "description", content: "Mathematics chapters 1–7 with videos, notes and exercises." },
      { property: "og:title", content: "Chapters — HLC Math" },
      { property: "og:description", content: "Seven Math chapters to master." },
    ],
  }),
  component: Courses,
});

function Courses() {
  const { me, videos } = useApp();
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Chapter</h1>
      <p className="font-semibold text-muted-foreground">Mathematics · choose a chapter to open its videos, notes and exercise</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c, i) => {
          const list = videos.filter(v => v.chapter === c.id);
          const watched = list.filter(v => me.completedVideos?.includes(v.id)).length;
          const s = me.scores[i] ?? null;
          const st = chapterStatus(s, i, me.scores);
          const S = STATUS[st];
          return (
            <Link key={c.id} to="/courses/$chapter" params={{ chapter: String(c.id) }} className="flex flex-col rounded-3xl border-2 border-border bg-card p-5 shadow-chunky transition hover:-translate-y-1 hover:border-primary">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-3xl">{c.emoji}</span>
                <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold", S.cls)}>
                  <S.icon className="h-3.5 w-3.5" /> {st}
                </span>
              </div>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-primary">Chapter {c.id}</p>
              <h2 className="text-lg font-bold leading-tight">{c.title}</h2>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>{list.length ? `${watched}/${list.length} videos watched` : "No videos yet"}</span>
                </div>
                {list.length > 0 && <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${(watched / list.length) * 100}%` }} /></div>}
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className={cn("rounded-full px-3 py-1 text-sm font-extrabold", scoreTone(s))}>
                  {s === null ? "No score yet" : `Score ${s}%`}
                </span>
                <span className="flex items-center text-sm font-semibold text-primary">Open <ChevronRight className="h-4 w-4" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
