import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, ListChecks, PlayCircle, Video } from "lucide-react";
import { toast } from "sonner";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { ChapterVideoPlayer } from "@/components/ChapterVideoPlayer";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { percent } from "@/lib/assessments";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/$chapter")({
  head: ({ params }) => {
    const c = CHAPTERS.find(x => String(x.id) === params.chapter);
    const title = c ? `Chapter ${c.id}: ${c.title} — HLC Math` : "Chapter — HLC Math";
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: c ? `Videos, notes, exercise and progress for ${c.title}.` : "S2 Math chapter." },
        { property: "og:title", content: title },
        { property: "og:description", content: "Watch the lessons, read the notes and practise." },
      ],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter } = Route.useParams();
  const { me, role, videos, content, refresh } = useApp();
  const c = CHAPTERS.find(x => String(x.id) === chapter);
  const list = videos.filter(v => v.chapter === c?.id);
  const done = (id: string) => Boolean(me.completedVideos?.includes(id));
  const [activeId, setActiveId] = useState<string | null>(null);
  if (!c) return <AppShell><p>Chapter not found.</p><Link to="/courses" className="text-primary underline">Back to chapters</Link></AppShell>;

  const active = list.find(v => v.id === activeId) ?? list.find(v => !done(v.id)) ?? list[0];
  const materials = content.find(m => m.chapter === c.id);
  const idx = c.id - 1;
  const score = me.scores[idx] ?? null;
  const st = chapterStatus(score, idx, me.scores);
  const S = STATUS[st];
  const watched = list.filter(v => done(v.id)).length;
  const canEarn = role === "student" && Boolean(me.id);
  const quizzes = (me.assessments ?? []).filter(a => a.kind === "item" && new RegExp(`^(SQ|CQ)\\s*${c.id}(\\.\\d+)?$`, "i").test(a.label.trim()));

  const complete = async (videoId: string) => {
    const { data, error } = await supabase.rpc("complete_chapter_video", { _video_id: videoId });
    if (error) throw error;
    await refresh();
    if (data) toast.success("Video completed — 1 mark saved");
  };

  return (
    <AppShell>
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> All chapters</Link>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-3xl">{c.emoji}</span>
        <div className="mr-auto min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Chapter {c.id}</p>
          <h1 className="text-2xl font-bold leading-tight md:text-3xl">{c.title}</h1>
        </div>
        <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold", S.cls)}><S.icon className="h-3.5 w-3.5" /> {st}</span>
      </div>

      <section aria-label="Progress" className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Videos watched</p>
          <p className="font-display text-3xl font-bold">{watched}<span className="text-lg text-muted-foreground"> / {list.length}</span></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${list.length ? (watched / list.length) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Video marks earned</p>
          <p className="font-display text-3xl font-bold">{watched}</p>
          <p className="text-xs text-muted-foreground">1 mark for each video watched to the end</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Chapter score</p>
          <p className={cn("mt-1 inline-block rounded-full px-3 py-1 text-lg font-extrabold", scoreTone(score))}>{score === null ? "No score yet" : `${score}%`}</p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Video className="h-5 w-5 text-primary" /> Videos</h2>
        {!active ? <p className="mt-2 text-sm text-muted-foreground">Your teacher has not added videos for this chapter yet.</p> : (
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <ChapterVideoPlayer key={active.id} video={active} completed={done(active.id)} canEarn={canEarn} onComplete={complete} />
            <ol className="space-y-2">
              {list.map((v, i) => (
                <li key={v.id}>
                  <button onClick={() => setActiveId(v.id)} className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm", v.id === active.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                    {done(v.id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />}
                    <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">Video {i + 1}</span><span className="block font-semibold">{v.title}</span></span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-success" /> Notes</h2>
          {materials?.notes ? (
            <Button className="mt-3" variant="outline" onClick={async () => { const { data, error } = await supabase.storage.from("chapter-notes").createSignedUrl(materials.notes, 300); if (error) toast.error(error.message); else window.open(data.signedUrl, "_blank", "noopener,noreferrer"); }}>Open chapter notes (PDF)</Button>
          ) : <p className="mt-2 text-sm text-muted-foreground">No notes uploaded yet.</p>}
        </section>
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="flex items-center gap-2 text-lg font-bold"><ListChecks className="h-5 w-5 text-gold-deep" /> Exercise</h2>
          {materials?.quiz ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{materials.quiz}</p> : <p className="mt-2 text-sm text-muted-foreground">No exercise added yet.</p>}
        </section>
      </div>

      {quizzes.length > 0 && (
        <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="text-lg font-bold">My quiz results for this chapter</h2>
          <ul className="mt-3 divide-y divide-border">
            {quizzes.map(q => { const p = percent(q); return (
              <li key={`${q.term}-${q.label}`} className="flex items-center justify-between py-2 text-sm">
                <span className="font-semibold">{q.label.startsWith("CQ") ? "Chapter quiz" : "Short quiz"} {q.label}</span>
                <span className={cn("rounded-full px-3 py-0.5 font-bold", scoreTone(p))}>{q.absent ? "Absent" : q.score === null ? "—" : `${q.score}${q.full_marks ? ` / ${q.full_marks}` : ""}`}</span>
              </li>
            ); })}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
