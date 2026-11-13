import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  FileText,
  ListChecks,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { PageHeader } from "@/components/PageParts";
import { CHAPTERS } from "@/lib/data";
import { useApp } from "@/lib/app-store";
import { parseVideoSource } from "@/lib/video-watch";
import { isStoragePath, isWebLink, notesPreviewUrl } from "@/lib/drive-link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapter content — HLC Math" },
      {
        name: "description",
        content: "Add videos, notes and exercises for each Mathematics chapter.",
      },
      { property: "og:title", content: "Chapter content — HLC Math" },
      { property: "og:description", content: "Prepare S2 chapter content for students." },
    ],
  }),
  component: Upload,
});

interface DraftVideo {
  id: string;
  title: string;
  url: string;
}
interface Draft {
  notes: string;
  quiz: string;
  videos: DraftVideo[];
}
const input =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Upload() {
  const { content, videos, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [ch, setCh] = useState(1);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const saved = (chapter: number): Draft => {
    const c = content.find((x) => x.chapter === chapter);
    return {
      notes: c?.notes ?? "",
      quiz: c?.quiz ?? "",
      videos: videos
        .filter((v) => v.chapter === chapter)
        .map((v) => ({ id: v.id, title: v.title, url: v.url })),
    };
  };
  const cur = drafts[ch] ?? saved(ch);
  const update = (patch: Partial<Draft>) => setDrafts({ ...drafts, [ch]: { ...cur, ...patch } });
  const setVideo = (i: number, patch: Partial<DraftVideo>) =>
    update({ videos: cur.videos.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const move = (i: number, d: number) => {
    const list = [...cur.videos];
    const [v] = list.splice(i, 1);
    if (v) list.splice(i + d, 0, v);
    update({ videos: list });
  };

  const notes = cur.notes.trim();
  const oldPdf = isStoragePath(notes);
  const notesInvalid = notes !== "" && !oldPdf && !isWebLink(notes);
  const preview = isWebLink(notes) ? notesPreviewUrl(notes) : null;

  const save = async () => {
    setBusy(true);
    try {
      if (notesInvalid)
        throw new Error("Chapter notes: paste the full Google Drive link, starting with https://");
      cur.videos.forEach((v, i) => {
        if (!v.title.trim()) throw new Error(`Give video ${i + 1} a name`);
        if (!parseVideoSource(v.url)) {
          throw new Error(
            `Video ${i + 1} ("${v.title}") needs a YouTube link or an https link to an .mp4 or .webm file`,
          );
        }
      });
      const { error } = await supabase
        .from("chapter_content")
        .upsert({ chapter: ch, notes, quiz: cur.quiz });
      if (error) throw error;
      const keep = new Set(cur.videos.map((v) => v.id));
      const removed = videos.filter((v) => v.chapter === ch && !keep.has(v.id)).map((v) => v.id);
      if (removed.length) {
        const r = await supabase.from("chapter_videos").delete().in("id", removed);
        if (r.error) throw r.error;
      }
      if (cur.videos.length) {
        const r = await supabase.from("chapter_videos").upsert(
          cur.videos.map((v, i) => ({
            id: v.id,
            chapter: ch,
            title: v.title.trim(),
            url: v.url.trim(),
            position: i,
          })),
        );
        if (r.error) throw r.error;
      }
      await refresh();
      setDrafts((d) => {
        const n = { ...d };
        delete n[ch];
        return n;
      });
      toast.success(`Chapter ${ch} saved`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <TeacherOnly>
        <PageHeader
          title="Chapter content"
          description="Videos, notes and an exercise for each chapter. Students earn 1 Math Coin for each video they watch to the end."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav
            aria-label="Chapters"
            className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-hidden lg:rounded-lg lg:border lg:border-border lg:bg-card"
          >
            {CHAPTERS.map((c) => {
              const n = videos.filter((v) => v.chapter === c.id).length;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCh(c.id)}
                  className={cn(
                    "flex min-w-48 items-center gap-3 rounded-md border px-3 py-2.5 text-left lg:min-w-0 lg:rounded-none lg:border-0 lg:border-b lg:last:border-b-0",
                    ch === c.id
                      ? "border-primary bg-primary/5 lg:border-l-4 lg:border-l-primary"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <span className="w-5 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                    {c.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.short}</span>
                    <span className="block text-xs text-muted-foreground">
                      {n} video{n === 1 ? "" : "s"}
                      {drafts[c.id] ? ", unsaved changes" : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-chunky">
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
              <h2 className="mr-auto text-lg font-semibold">
                Chapter {ch}: {CHAPTERS[ch - 1]?.title}
              </h2>
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(ch) }}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Eye className="h-4 w-4" /> Preview as student
              </Link>
            </div>

            <Field icon={<Video className="h-4 w-4 text-primary" />} label="Videos">
              <div className="space-y-3">
                {cur.videos.length === 0 && (
                  <p className="text-sm text-muted-foreground">No videos yet.</p>
                )}
                {cur.videos.map((v, i) => {
                  const ok = !v.url || parseVideoSource(v.url);
                  return (
                    <div key={v.id} className="rounded-md border border-border p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {i + 1}.
                        </span>
                        <input
                          aria-label={`Video ${i + 1} name`}
                          value={v.title}
                          onChange={(e) => setVideo(i, { title: e.target.value })}
                          placeholder="Video name, e.g. 5.1 Solving by substitution"
                          className={input}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move up"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move down"
                          disabled={i === cur.videos.length - 1}
                          onClick={() => move(i, 1)}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove video ${i + 1}`}
                          onClick={() => update({ videos: cur.videos.filter((_, j) => j !== i) })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <input
                        aria-label={`Video ${i + 1} link`}
                        value={v.url}
                        onChange={(e) => setVideo(i, { url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=…"
                        className={cn(input, "mt-2", !ok && "border-destructive")}
                      />
                      {!ok && (
                        <p className="mt-1 text-xs text-destructive">
                          Use a YouTube link or an https link to an .mp4 or .webm file so it can
                          play inside HLC Math.
                        </p>
                      )}
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  onClick={() =>
                    update({
                      videos: [...cur.videos, { id: crypto.randomUUID(), title: "", url: "" }],
                    })
                  }
                >
                  <Plus /> Add video
                </Button>
                <p className="text-xs text-muted-foreground">
                  Removing a video keeps the coins students already earned from it.
                </p>
              </div>
            </Field>

            <Field
              icon={<FileText className="h-4 w-4 text-success" />}
              label="Chapter notes (Google Drive link)"
            >
              <input
                aria-label="Google Drive link for chapter notes"
                value={oldPdf ? "" : cur.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="https://drive.google.com/file/d/…/view"
                className={cn(input, notesInvalid && "border-destructive")}
              />
              {oldPdf && (
                <p className="mt-1 text-xs text-muted-foreground">
                  This chapter still uses a PDF uploaded to HLC Math. Paste a Google Drive link to
                  replace it.
                </p>
              )}
              {notesInvalid && (
                <p className="mt-1 text-xs text-destructive">
                  Paste the full link, starting with https://
                </p>
              )}
              {isWebLink(notes) && (
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-success">
                  {preview
                    ? "Students will see this file inside the chapter page."
                    : "Students will get a button that opens this link."}
                  <a
                    href={notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline"
                  >
                    Test link <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                In Google Drive: Share, then General access, then HLC (or Anyone with the link) as
                Viewer, then Copy link.
              </p>
            </Field>

            <Field icon={<ListChecks className="h-4 w-4 text-gold-deep" />} label="Exercise">
              <textarea
                value={cur.quiz}
                onChange={(e) => update({ quiz: e.target.value })}
                rows={6}
                placeholder={"Q1. Solve x + y = 5 and x − y = 1.\nQ2. …"}
                className={input}
              />
            </Field>

            <Button disabled={busy} onClick={() => void save()}>
              {busy ? "Saving…" : "Save chapter"}
            </Button>
          </div>
        </div>
      </TeacherOnly>
    </AppShell>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}
