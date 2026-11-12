import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Eye, FileText, ListChecks, Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { CHAPTERS } from "@/lib/data";
import { useApp } from "@/lib/app-store";
import { parseVideoSource } from "@/lib/video-watch";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapter Content — HLC Math" },
      { name: "description", content: "Add named videos, notes and exercises for each S2 Math chapter." },
      { property: "og:title", content: "Chapter Content — HLC Math" },
      { property: "og:description", content: "Prepare S2 chapter content for students." },
    ],
  }),
  component: Upload,
});

interface DraftVideo { id: string; title: string; url: string }
interface Draft { notes: string; quiz: string; videos: DraftVideo[] }
const input = "w-full rounded-xl border-2 border-input bg-background px-3 py-2 font-semibold outline-none focus:border-primary";

function Upload() {
  const { content, videos, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [ch, setCh] = useState(1);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const saved = (chapter: number): Draft => {
    const c = content.find(x => x.chapter === chapter);
    return { notes: c?.notes ?? "", quiz: c?.quiz ?? "", videos: videos.filter(v => v.chapter === chapter).map(v => ({ id: v.id, title: v.title, url: v.url })) };
  };
  const cur = drafts[ch] ?? saved(ch);
  const update = (patch: Partial<Draft>) => setDrafts({ ...drafts, [ch]: { ...cur, ...patch } });
  const setVideo = (i: number, patch: Partial<DraftVideo>) => update({ videos: cur.videos.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const move = (i: number, d: number) => { const list = [...cur.videos]; const [v] = list.splice(i, 1); if (v) list.splice(i + d, 0, v); update({ videos: list }); };

  const save = async () => {
    setBusy(true);
    try {
      cur.videos.forEach((v, i) => {
        if (!v.title.trim()) throw new Error(`Give video ${i + 1} a name`);
        if (!parseVideoSource(v.url)) throw new Error(`Video ${i + 1} ("${v.title}") needs a YouTube link or an https link to an .mp4/.webm file`);
      });
      const { error } = await supabase.from("chapter_content").upsert({ chapter: ch, notes: cur.notes, quiz: cur.quiz });
      if (error) throw error;
      const keep = new Set(cur.videos.map(v => v.id));
      const removed = videos.filter(v => v.chapter === ch && !keep.has(v.id)).map(v => v.id);
      if (removed.length) { const r = await supabase.from("chapter_videos").delete().in("id", removed); if (r.error) throw r.error; }
      if (cur.videos.length) {
        const r = await supabase.from("chapter_videos").upsert(cur.videos.map((v, i) => ({ id: v.id, chapter: ch, title: v.title.trim(), url: v.url.trim(), position: i })));
        if (r.error) throw r.error;
      }
      await refresh();
      setDrafts(d => { const n = { ...d }; delete n[ch]; return n; });
      toast.success(`Chapter ${ch} content saved`);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not save"); } finally { setBusy(false); }
  };

  return (
    <AppShell><TeacherOnly>
      <h1 className="text-3xl font-bold">Chapter content</h1>
      <p className="font-semibold text-muted-foreground">Add videos, notes and an exercise for each chapter. Students earn 1 mark for each video they watch to the end.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          {CHAPTERS.map(c => {
            const n = videos.filter(v => v.chapter === c.id).length;
            return (
              <Button variant="ghost" key={c.id} onClick={() => setCh(c.id)}
                className={cn("flex h-auto min-w-48 items-center gap-3 rounded-2xl border-2 p-3 text-left", ch === c.id ? "border-primary bg-primary/10" : "border-border bg-card")}>
                <span className="text-2xl">{c.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold text-primary">Chapter {c.id}{drafts[c.id] ? " · unsaved" : ""}</span>
                  <span className="block truncate text-sm font-bold">{c.short}</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground">{n} video{n === 1 ? "" : "s"}</span>
              </Button>
            );
          })}
        </div>
        <div className="space-y-5 rounded-3xl border-2 border-border bg-card p-6 shadow-chunky">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-auto text-xl font-bold">Ch {ch}: {CHAPTERS[ch - 1]?.title}</h2>
            <Link to="/courses/$chapter" params={{ chapter: String(ch) }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><Eye className="h-4 w-4" /> Preview chapter page</Link>
          </div>

          <Field icon={<Video className="h-5 w-5 text-primary" />} label="Videos">
            <div className="space-y-3">
              {cur.videos.length === 0 && <p className="text-sm text-muted-foreground">No videos yet.</p>}
              {cur.videos.map((v, i) => {
                const ok = !v.url || parseVideoSource(v.url);
                return (
                  <div key={v.id} className="rounded-2xl border-2 border-border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">{i + 1}.</span>
                      <input aria-label={`Video ${i + 1} name`} value={v.title} onChange={e => setVideo(i, { title: e.target.value })} placeholder="Video name, e.g. 5.1 Solving by substitution" className={input} />
                      <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></Button>
                      <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === cur.videos.length - 1} onClick={() => move(i, 1)}><ArrowDown /></Button>
                      <Button size="icon" variant="ghost" aria-label={`Remove video ${i + 1}`} onClick={() => update({ videos: cur.videos.filter((_, j) => j !== i) })}><Trash2 /></Button>
                    </div>
                    <input aria-label={`Video ${i + 1} link`} value={v.url} onChange={e => setVideo(i, { url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" className={cn(input, "mt-2", !ok && "border-destructive")} />
                    {!ok && <p className="mt-1 text-xs text-destructive">Use a YouTube link or an https link to an .mp4/.webm file so it can play inside HLC Math.</p>}
                  </div>
                );
              })}
              <Button variant="outline" onClick={() => update({ videos: [...cur.videos, { id: crypto.randomUUID(), title: "", url: "" }] })}><Plus /> Add video</Button>
              <p className="text-xs text-muted-foreground">Removing a video keeps the marks students already earned from it.</p>
            </div>
          </Field>

          <Field icon={<FileText className="h-5 w-5 text-success" />} label="Chapter notes (PDF)">
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background px-4 py-6 text-sm font-bold text-muted-foreground hover:border-primary">
              {cur.notes ? "PDF attached · click to replace" : "Click to choose a PDF"}
              <input type="file" accept="application/pdf" hidden onChange={async e => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); try { const path = `${ch}/${crypto.randomUUID()}.pdf`; const { error } = await supabase.storage.from("chapter-notes").upload(path, file, { contentType: "application/pdf" }); if (error) throw error; update({ notes: path }); toast.success("PDF uploaded — remember to save"); } catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); } finally { setBusy(false); } }} />
            </label>
          </Field>

          <Field icon={<ListChecks className="h-5 w-5 text-gold-deep" />} label="Exercise">
            <textarea value={cur.quiz} onChange={e => update({ quiz: e.target.value })} rows={6} placeholder={"Q1. Solve x + y = 5 and x − y = 1.\nQ2. …"} className={input} />
          </Field>

          <Button disabled={busy} onClick={save}>{busy ? "Saving…" : "Save chapter content"}</Button>
        </div>
      </div>
    </TeacherOnly></AppShell>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-extrabold">{icon} {label}</p>
      {children}
    </div>
  );
}
