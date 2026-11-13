import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  FileText,
  ListChecks,
  PlayCircle,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { ChapterVideoPlayer } from "@/components/ChapterVideoPlayer";
import { Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { percent } from "@/lib/assessments";
import { isWebLink, notesPreviewUrl } from "@/lib/drive-link";
import {
  DUE_LABEL,
  DUE_TONE,
  dueStatus,
  formatDue,
  homeworkForSet,
  splitByDue,
} from "@/lib/homework";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/$chapter")({
  head: ({ params }) => {
    const c = CHAPTERS.find((x) => String(x.id) === params.chapter);
    const title = c ? `Chapter ${c.id}: ${c.title} — HLC Math` : "Chapter — HLC Math";
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        {
          name: "description",
          content: c
            ? `Videos, notes, exercise and progress for ${c.title}.`
            : "Mathematics chapter.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Lesson videos, notes and practice." },
      ],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter } = Route.useParams();
  const { me, role, videos, content, homework, refresh } = useApp();
  const c = CHAPTERS.find((x) => String(x.id) === chapter);
  const list = videos.filter((v) => v.chapter === c?.id);
  const done = (id: string) => Boolean(me.completedVideos?.includes(id));
  const [activeId, setActiveId] = useState<string | null>(null);
  if (!c) {
    return (
      <AppShell>
        <p>Chapter not found.</p>
        <Link to="/courses" className="text-primary underline">
          Back to chapters
        </Link>
      </AppShell>
    );
  }

  const active = list.find((v) => v.id === activeId) ?? list.find((v) => !done(v.id)) ?? list[0];
  const materials = content.find((m) => m.chapter === c.id);
  const notes = materials?.notes.trim() ?? "";
  const preview = notesPreviewUrl(notes);
  const idx = c.id - 1;
  const score = me.scores[idx] ?? null;
  const st = chapterStatus(score, idx, me.scores);
  const S = STATUS[st];
  const watched = list.filter((v) => done(v.id)).length;
  const canEarn = role === "student" && Boolean(me.id);
  const quizzes = (me.assessments ?? []).filter(
    (a) =>
      a.kind === "item" && new RegExp(`^(SQ|CQ)\\s*${c.id}(\\.\\d+)?$`, "i").test(a.label.trim()),
  );
  const { upcoming: dueHomework } = splitByDue(
    (role === "teacher" ? homework : homeworkForSet(homework, me.set)).filter(
      (h) => h.chapter === c.id,
    ),
  );

  const complete = async (videoId: string) => {
    const { data, error } = await supabase.rpc("complete_chapter_video", { _video_id: videoId });
    if (error) throw error;
    await refresh();
    if (data) toast.success("Video completed. 1 Math Coin added.");
  };

  const openOldPdf = async (path: string) => {
    const { data, error } = await supabase.storage.from("chapter-notes").createSignedUrl(path, 300);
    if (error) toast.error(error.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All chapters
      </Link>
      <div className="mt-3 flex flex-wrap items-start gap-4 border-b border-border pb-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary text-lg font-semibold text-primary-foreground">
          {c.id}
        </span>
        <div className="mr-auto min-w-0">
          <p className="text-sm text-muted-foreground">Chapter {c.id}</p>
          <h1 className="text-2xl font-semibold leading-tight">{c.title}</h1>
        </div>
        <span
          className={cn("flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold", S.cls)}
        >
          <S.icon className="h-3.5 w-3.5" /> {st}
        </span>
      </div>

      <section aria-label="Progress" className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-chunky">
          <p className="text-sm text-muted-foreground">Videos watched</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {watched}
            <span className="text-base font-normal text-muted-foreground"> / {list.length}</span>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${list.length ? (watched / list.length) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-chunky">
          <p className="text-sm text-muted-foreground">Math Coins from videos</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{watched}</p>
          <p className="text-xs text-muted-foreground">One for each video watched to the end</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-chunky">
          <p className="text-sm text-muted-foreground">Chapter score</p>
          <p
            className={cn(
              "mt-2 inline-block rounded px-2 py-0.5 text-lg font-semibold tabular-nums",
              scoreTone(score),
            )}
          >
            {score === null ? "No mark yet" : `${score}%`}
          </p>
        </div>
      </section>

      {dueHomework.length > 0 && (
        <Panel
          className="mt-6"
          title="Homework for this chapter"
          actions={
            <Link to="/homework" className="text-sm font-medium text-primary hover:underline">
              All homework
            </Link>
          }
          bodyClassName="px-5 py-1"
        >
          <ul className="divide-y divide-border">
            {dueHomework.map((h) => {
              const status = dueStatus(h.due_at);
              return (
                <li key={h.id} className="flex items-start gap-3 py-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{h.title}</p>
                    <p className="text-xs text-muted-foreground">Due {formatDue(h.due_at)}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                      DUE_TONE[status],
                    )}
                  >
                    {DUE_LABEL[status]}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      <Panel
        className="mt-6"
        title={
          <span className="flex items-center gap-2">
            <Video className="h-4 w-4 text-primary" /> Videos
          </span>
        }
      >
        {!active ? (
          <p className="text-sm text-muted-foreground">
            No videos have been added for this chapter yet.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <ChapterVideoPlayer
              key={active.id}
              video={active}
              completed={done(active.id)}
              canEarn={canEarn}
              onComplete={complete}
            />
            <ol className="space-y-1.5">
              {list.map((v, i) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(v.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm transition-colors",
                      v.id === active.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {done(v.id) ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-muted-foreground">Video {i + 1}</span>
                      <span className="block font-medium">{v.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Panel>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Panel
          className={cn(preview && "md:col-span-2")}
          title={
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-success" /> Notes
            </span>
          }
        >
          {isWebLink(notes) ? (
            <>
              {preview && (
                <iframe
                  src={preview}
                  title={`Chapter ${c.id} notes`}
                  loading="lazy"
                  allow="autoplay"
                  className="h-[70vh] w-full rounded-md border border-border bg-muted"
                />
              )}
              <a
                href={notes}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline"
              >
                Open notes in Google Drive <ExternalLink className="h-4 w-4" />
              </a>
              {preview && (
                <p className="mt-1 text-xs text-muted-foreground">
                  If the notes do not appear, sign in to Google with your school account.
                </p>
              )}
            </>
          ) : notes ? (
            <Button variant="outline" onClick={() => void openOldPdf(notes)}>
              Open chapter notes (PDF)
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">No notes have been added yet.</p>
          )}
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-gold-deep" /> Exercise
            </span>
          }
        >
          {materials?.quiz ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{materials.quiz}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No exercise has been added yet.</p>
          )}
        </Panel>
      </div>

      {quizzes.length > 0 && (
        <Panel className="mt-6" title="My quiz results for this chapter">
          <ul className="divide-y divide-border">
            {quizzes.map((q) => {
              const p = percent(q);
              return (
                <li
                  key={`${q.term}-${q.label}`}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="font-medium">
                    {q.label.toUpperCase().startsWith("CQ") ? "Chapter quiz" : "Short quiz"}{" "}
                    {q.label}
                  </span>
                  <span
                    className={cn("rounded px-2 py-0.5 font-semibold tabular-nums", scoreTone(p))}
                  >
                    {q.absent
                      ? "Absent"
                      : q.score === null
                        ? "—"
                        : `${q.score}${q.full_marks ? ` / ${q.full_marks}` : ""}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </AppShell>
  );
}
