import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { PageHeader } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapters — HLC Math" },
      {
        name: "description",
        content: "S2 Mathematics chapters 1–7 with videos, notes and exercises.",
      },
      { property: "og:title", content: "Chapters — HLC Math" },
      { property: "og:description", content: "S2 Mathematics chapters 1–7." },
    ],
  }),
  component: Courses,
});

function Courses() {
  const { me, videos } = useApp();
  return (
    <AppShell>
      <PageHeader
        title="Chapters"
        description="S2 Mathematics. Each chapter has lesson videos, notes and an exercise."
      />
      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card shadow-chunky">
        {CHAPTERS.map((c, i) => {
          const list = videos.filter((v) => v.chapter === c.id);
          const watched = list.filter((v) => me.completedVideos?.includes(v.id)).length;
          const s = me.scores[i] ?? null;
          const st = chapterStatus(s, i, me.scores);
          const S = STATUS[st];
          return (
            <li key={c.id}>
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(c.id) }}
                className="flex flex-wrap items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50 sm:flex-nowrap"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                  {c.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{c.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {list.length
                        ? `${watched} of ${list.length} video${list.length === 1 ? "" : "s"} watched`
                        : "No videos yet"}
                    </span>
                    {list.length > 0 && (
                      <span className="hidden h-1 w-24 overflow-hidden rounded-full bg-muted sm:block">
                        <span
                          className="block h-full rounded-full bg-success"
                          style={{ width: `${(watched / list.length) * 100}%` }}
                        />
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold",
                    S.cls,
                  )}
                >
                  <S.icon className="h-3.5 w-3.5" aria-hidden="true" /> {st}
                </span>
                <span
                  className={cn(
                    "w-16 shrink-0 rounded px-2 py-0.5 text-center text-xs font-semibold tabular-nums",
                    scoreTone(s),
                  )}
                >
                  {s === null ? "No mark" : `${s}%`}
                </span>
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              </Link>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
