import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, ListChecks, Video } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { CHAPTERS } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Content Upload Room — HLC MathQuest" },
      { name: "description", content: "Add videos, notes and quiz sets for each S2 Math chapter." },
      { property: "og:title", content: "Content Upload Room — HLC MathQuest" },
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
  const [ch, setCh] = useState(1);
  const [data, setData] = useState<Record<number, Content>>({});
  const cur = data[ch] ?? { video: "", notes: "", quiz: "" };
  const set = (k: keyof Content, v: string) => setData({ ...data, [ch]: { ...cur, [k]: v } });

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">📤 Content Upload Room</h1>
      <p className="font-semibold text-muted-foreground">Prepare videos, notes and quizzes for each chapter.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col">
          {CHAPTERS.map((c) => {
            const d = data[c.id];
            const n = d ? [d.video, d.notes, d.quiz].filter(Boolean).length : 0;
            return (
              <button
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
              </button>
            );
          })}
        </div>
        <div className="space-y-4 rounded-3xl border-2 border-border bg-card p-6 shadow-chunky">
          <h2 className="text-xl font-bold">Ch {ch}: {CHAPTERS[ch - 1]!.title}</h2>
          <Field icon={<Video className="h-5 w-5 text-primary" />} label="Video URL">
            <input value={cur.video} onChange={(e) => set("video", e.target.value)} placeholder="https://youtube.com/..." className="w-full rounded-2xl border-2 border-input bg-background px-4 py-2.5 font-semibold outline-none focus:border-primary" />
          </Field>
          <Field icon={<FileText className="h-5 w-5 text-success" />} label="Chapter Notes (PDF)">
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-input bg-background px-4 py-6 text-sm font-bold text-muted-foreground hover:border-primary">
              {cur.notes || "Click to choose a PDF"}
              <input type="file" accept="application/pdf" hidden onChange={(e) => e.target.files?.[0] && set("notes", e.target.files[0].name)} />
            </label>
          </Field>
          <Field icon={<ListChecks className="h-5 w-5 text-gold-deep" />} label="Quiz Question Set">
            <textarea value={cur.quiz} onChange={(e) => set("quiz", e.target.value)} rows={5} placeholder={"Q1. Round 3.14159 to 2 d.p.\nA) 3.14  B) 3.15 ..."} className="w-full rounded-2xl border-2 border-input bg-background px-4 py-2.5 font-semibold outline-none focus:border-primary" />
          </Field>
          <button
            onClick={() => toast.success(`Chapter ${ch} content saved (preview only)`)}
            className="rounded-2xl bg-success px-6 py-3 font-display font-bold text-primary-foreground shadow-chunky-success active:translate-y-1 active:shadow-none"
          >
            Save chapter content
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-2 text-sm font-extrabold">{icon} {label}</p>
      {children}
    </div>
  );
}
