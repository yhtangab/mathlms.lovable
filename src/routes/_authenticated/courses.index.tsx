import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Divide,
  Equal,
  Puzzle,
  Star,
  Table,
  Target,
  TrendingUp,
  Triangle,
  type LucideIcon,
} from "lucide-react";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { PageHeader } from "@/components/PageParts";
import { chapterOfLabel } from "@/lib/assessments";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import {
  chapterCompletion,
  chapterStars,
  objectivesFor,
  strandOfChapter,
} from "@/lib/gamification/catalog";
import { TONES, chapterTone } from "@/lib/tones";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapters — HLC Math" },
      {
        name: "description",
        content: "S2 Mathematics chapters 1–7 with videos, notes, self-checks and progress.",
      },
      { property: "og:title", content: "Chapters — HLC Math" },
      { property: "og:description", content: "S2 Mathematics chapters 1–7." },
    ],
  }),
  component: Courses,
});

/** A picture for each chapter's topic. */
const CHAPTER_ICONS: Record<number, LucideIcon> = {
  1: Target,
  2: Puzzle,
  3: Equal,
  4: Divide,
  5: TrendingUp,
  6: Triangle,
  7: Table,
};

function Stars({ count }: { count: 0 | 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${count} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("h-5 w-5", i <= count ? "fill-gold text-gold-deep" : "text-border")}
        />
      ))}
    </span>
  );
}

function Courses() {
  const { me, videos, selfChecks } = useApp();
  const cards = CHAPTERS.map((c, i) => {
    const list = videos.filter((v) => v.chapter === c.id);
    const watched = list.filter((v) => me.completedVideos?.includes(v.id)).length;
    const objectives = objectivesFor(c.id);
    const checked = objectives.filter((o) => selfChecks.includes(o.id)).length;
    const cqDone = (me.assessments ?? []).some(
      (a) =>
        a.kind === "item" &&
        a.category === "chapter_quiz" &&
        a.score !== null &&
        chapterOfLabel(a.label) === c.id,
    );
    const score = me.scores[i] ?? null;
    return {
      chapter: c,
      score,
      status: chapterStatus(score, i, me.scores),
      stars: chapterStars(score),
      completion: chapterCompletion({
        videosTotal: list.length,
        videosWatched: watched,
        objectivesTotal: objectives.length,
        objectivesChecked: checked,
        chapterQuizDone: cqDone,
      }),
    };
  });
  const starTotal = cards.reduce((t, c) => t + c.stars, 0);
  const average = Math.round(cards.reduce((t, c) => t + c.completion.percent, 0) / cards.length);

  return (
    <AppShell>
      <PageHeader
        title="Chapters"
        description="Watch the videos, tick your self-check and sit the chapter quiz to fill each bar."
        actions={
          <div className="flex gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              ⭐ {starTotal} / 21
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              {average}% done
            </span>
          </div>
        }
      />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ chapter: c, score, status, stars, completion }) => {
          const tone = TONES[chapterTone(c.id)];
          const Icon = CHAPTER_ICONS[c.id] ?? Target;
          const S = STATUS[status];
          return (
            <li key={c.id}>
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(c.id) }}
                className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-border bg-card shadow-chunky transition-transform hover:-translate-y-1"
              >
                <div className={cn("relative flex items-center gap-3 px-4 py-4", tone.flat)}>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-2xl font-bold">
                    {c.id}
                  </span>
                  <span className="text-sm font-bold opacity-90">Chapter {c.id}</span>
                  <Icon
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 h-20 w-20 opacity-20"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-bold leading-snug">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {strandOfChapter(c.id)?.label ?? "Mathematics"}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Stars count={stars} />
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                        scoreTone(score),
                      )}
                    >
                      {score === null ? "No mark" : `${score}%`}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>Progress</span>
                      <span className="tabular-nums">{completion.percent}%</span>
                    </div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", tone.bar)}
                        style={{ width: `${completion.percent}%` }}
                      />
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    {completion.parts.map((p) => (
                      <li
                        key={p.id}
                        className={cn(
                          "rounded-full px-2 py-0.5",
                          p.done >= p.total
                            ? "bg-success/15 text-success-deep"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {p.label}{" "}
                        {p.id === "chapterQuiz"
                          ? p.done
                            ? "done"
                            : "not yet"
                          : `${p.done}/${p.total}`}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-3">
                    <span
                      className={cn(
                        "flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
                        S.cls,
                      )}
                    >
                      <S.icon className="h-3.5 w-3.5" aria-hidden="true" /> {status}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">
        Progress: videos 40%, self-check 40%, chapter quiz 20%. Stars come from your chapter score:
        50% for one star, 70% for two, 85% for three.
      </p>
    </AppShell>
  );
}
