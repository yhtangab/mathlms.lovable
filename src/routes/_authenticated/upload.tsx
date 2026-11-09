import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { FileText, ListChecks, Video } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { CHAPTERS } from "@/lib/data";
import { useApp } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Content Upload Room — HLC Math" },
      { name: "description", content: "Add videos, notes and quiz sets for each S2 Math chapter." },
      { property: "og:title", content: "Content Upload Room — HLC Math" },
      { property: "og:description", content: "Prepare S2 chapter content for students." },
    ],
  }),
  component: Upload,
});

interface Content {
  video: string;
  notes: string;
  quiz: string;
}

function Upload() {
  const { content, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [ch, setCh] = useState(1);
  const [data, setData] = useState<Record<number, Content>>({});
  const cur = data[ch] ?? content.find(c => c.chapter === ch) ?? { video: "", notes: "", quiz: "" };
  const set = (k: keyof Content, v: string) => setData({ ...data, [ch]: { ...cur, [k]: v } });

  return (
    <AppShell><TeacherOnly>
      <h1 className="text-3xl font-bold">📤 Content Upload Room</h1>
      <p className="font-semibold text-muted-foreground">Prepare videos, notes and quizzes for each chapter.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          {CHAPTERS.map((c) => {
            const d = data[c.id];
            const n = d ? [d.video, d.notes, d.quiz].filter(Boolean).length : 0;
            return (
              <Button variant="ghost"
                key={c.id}
                onClick={() => setCh(c.id)}
                className={cn(
                  "flex min-w-48 items-center gap-3 rounded-2xl border-2 p-3 text-left",
                  ch === c.id ? "border-primary bg-primary/10" : "border-border bg-card",
                )}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold text-primary">Chapter {c.id}</span>
                  <span className="block truncate text-sm font-bold">{c.short}</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground">{n}/3</span>
              </Button>
            );
          })}
        </div>
        <div className="space-y-4 rounded-3xl border-2 border-border bg-card p-6 shadow-chunky">
          <h2 className="text-xl font-bold">Ch {ch}: {CHAPTERS[ch - 1]?.title}</h2>
          <Field icon={<Video className="h-5 w-5 text-primary" />} label="Video URL">
            <input value={cur.video} onChange={(e) => set("video", e.target.value)} placeholder="https://youtube.com/..." className="w-full rounded-2xl border-2 border-input bg-background px-4 py-2.5 font-semibold outline-none focus:border-primary" />
          </Field>
          <Field icon={<FileText className="h-5 w-5 text-success" />} label="Chapter Notes (PDF)">
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background px-4 py-6 text-sm font-bold text-muted-foreground hover:border-primary">
              {cur.notes || "Click to choose a PDF"}
              <input type="file" accept="application/pdf" hidden onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); try { const path = `${ch}/${crypto.randomUUID()}.pdf`; const { error } = await supabase.storage.from('chapter-notes').upload(path, file, { contentType: 'application/pdf' }); if (error) throw error; set('notes', path); } catch (err) { toast.error(err instanceof Error ? err.message : 'Upload failed'); } finally { setBusy(false); } }} />
            </label>
          </Field>
          <Field icon={<ListChecks className="h-5 w-5 text-gold-deep" />} label="Quiz Question Set">
            <textarea value={cur.quiz} onChange={(e) => set("quiz", e.target.value)} rows={5} placeholder={"Q1. Round 3.14159 to 2 d.p.\nA) 3.14  B) 3.15 ..."} className="w-full rounded-2xl border-2 border-input bg-background px-4 py-2.5 font-semibold outline-none focus:border-primary" />
          </Field>
          <Button variant="ghost"
            disabled={busy} onClick={async () => { setBusy(true); try { if (cur.video) { const url = new URL(cur.video); if (url.protocol !== 'https:') throw new Error('Video URL must use HTTPS'); } const { error } = await supabase.from('chapter_content').upsert({ chapter: ch, video: cur.video, notes: cur.notes, quiz: cur.quiz }); if (error) throw error; await refresh(); toast.success(`Chapter ${ch} content saved`); } catch (err) { toast.error(err instanceof Error ? err.message : 'Could not save'); } finally { setBusy(false); } }}
            className="rounded-2xl bg-success px-6 py-3 font-display font-bold text-primary-foreground shadow-chunky-success active:translate-y-1 active:shadow-none"
          >
            Save chapter content
          </Button>
        </div>
      </div>
    </TeacherOnly></AppShell>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm font-extrabold">{icon} {label}</p>
      {children}
    </div>
  );
}
