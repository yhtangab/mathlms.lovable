import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const { me, content, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Chapter</h1>
      <p className="font-semibold text-muted-foreground">S2 Mathematics</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c, i) => {
          const materials = content.find(v => v.chapter === c.id);
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
                <span className="text-xs font-bold text-muted-foreground">{me.completedVideos?.includes(c.id) ? 'Video mark earned' : ''}</span>
              </div>
              {materials?.video && <div className="mt-4 space-y-2">{(/\.(mp4|webm)(\?|$)/i.test(materials.video)) ? <video controls className="w-full" src={materials.video} onEnded={async () => { try { const { error } = await supabase.rpc('complete_video', { _chapter: c.id }); if (error) throw error; await refresh(); toast.success('Video completed: one mark saved'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save'); } }} /> : <a href={materials.video} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">Watch chapter video</a>}
              {!/\.(mp4|webm)(\?|$)/i.test(materials.video) && <Button variant="outline" disabled={busy || me.completedVideos?.includes(c.id)} onClick={async () => { setBusy(true); try { const { error } = await supabase.rpc('complete_video', { _chapter: c.id }); if (error) throw error; await refresh(); toast.success('One video mark saved'); } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save'); } finally { setBusy(false); } }}>Confirm video completed</Button>}</div>}
              {materials?.notes && <Button className="mt-2" variant="link" onClick={async () => { const { data, error } = await supabase.storage.from('chapter-notes').createSignedUrl(materials.notes, 60); if (error) toast.error(error.message); else if (data) window.open(data.signedUrl, '_blank', 'noopener,noreferrer'); }}>Open chapter notes</Button>}
              {materials?.quiz && <p className="mt-3 whitespace-pre-wrap text-sm">{materials.quiz}</p>}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
