import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { MathText } from "@/components/game/MathText";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import { CHAPTERS } from "@/lib/data";
import {
  CHECKINS_PER_COIN,
  checkinById,
  checkinStreak,
  hkDateKey,
  questionForDay,
} from "@/lib/gamification/checkin";
import {
  studentProgressKey,
  todaysCheckin,
  useStudentProgress,
  type StudentProgress,
} from "@/lib/gamification/student-data";
import {
  ERROR_TYPES,
  EXAM_KINDS,
  MISTAKE_STATUS,
  countdownParts,
  errorTypeLabel,
  nextExam,
  nextStatus,
  type ErrorType,
  type ExamDate,
  type ExamKind,
  type Mistake,
  type MistakeStatus,
} from "@/lib/gamification/vault";
import { fromLocalInput } from "@/lib/homework";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/mistake-vault")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Mistake Vault — HLC Math" },
      {
        name: "description",
        content: "Log mistakes, revise them and count down to the next test.",
      },
      { property: "og:title", content: "Mistake Vault — HLC Math" },
      {
        property: "og:description",
        content: "Log mistakes, revise them and count down to the next test.",
      },
    ],
  }),
  component: VaultPage,
});

const field =
  "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function VaultPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <ExamDatesManager /> : <StudentVault />}</AppShell>;
}

/* ------------------------------------------------------------- Countdown */

function ExamCountdown({ exam }: { exam: ExamDate | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!exam) {
    return (
      <section className="mt-6 rounded-xl bg-nav p-5 text-nav-foreground shadow-pop">
        <p className="font-bold">No test or exam date has been set yet.</p>
        <p className="text-sm opacity-80">Your teacher will add the next one here.</p>
      </section>
    );
  }
  const left = countdownParts(new Date(exam.startsAt).getTime() - now);
  const cells: [number, string][] = [
    [left.days, "days"],
    [left.hours, "hours"],
    [left.minutes, "minutes"],
    [left.seconds, "seconds"],
  ];
  return (
    <section
      aria-label="Countdown"
      className="mt-6 rounded-xl bg-nav p-5 text-nav-foreground shadow-pop"
    >
      <p className="text-sm font-semibold opacity-80">Next up</p>
      <p className="text-xl font-bold">{exam.title}</p>
      <p className="text-sm opacity-80">
        {new Date(exam.startsAt).toLocaleString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="mt-4 grid max-w-md grid-cols-4 gap-2" aria-live="off">
        {cells.map(([value, label]) => (
          <div key={label} className="rounded-xl bg-white/10 px-2 py-3 text-center">
            <p className="text-3xl font-bold tabular-nums">{String(value).padStart(2, "0")}</p>
            <p className="text-xs font-semibold opacity-80">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Daily check-in */

function DailyCheckin({
  studentId,
  progress,
}: {
  studentId: string;
  progress: StudentProgress | undefined;
}) {
  const { readOnly, refresh } = useApp();
  const qc = useQueryClient();
  const today = hkDateKey();
  const question = questionForDay(studentId, today);
  const done = todaysCheckin(progress);
  const [choice, setChoice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const count = progress?.checkins.length ?? 0;
  const streak = checkinStreak(
    (progress?.checkins ?? []).map((c) => c.date),
    today,
  );
  const towardsCoin = count % CHECKINS_PER_COIN;
  const shown = done ? (checkinById(done.questionId) ?? question) : question;

  const submit = async (index: number) => {
    setChoice(index);
    setBusy(true);
    try {
      const correct = index === question.answer;
      const { data, error } = await supabase.rpc("submit_daily_checkin", {
        _question_id: question.id,
        _correct: correct,
      });
      if (error) throw new Error(error.message);
      await qc.invalidateQueries({ queryKey: studentProgressKey(studentId) });
      await refresh();
      const total = data ?? count + 1;
      toast.success(
        total % CHECKINS_PER_COIN === 0
          ? `${correct ? "Correct!" : "Checked in."} +1 Math Coin for ${CHECKINS_PER_COIN} check-ins!`
          : `${correct ? "Correct!" : "Checked in."} ${CHECKINS_PER_COIN - (total % CHECKINS_PER_COIN)} more for the next coin.`,
      );
    } catch (e) {
      setChoice(null);
      toast.error(e instanceof Error ? e.message : "Could not save your check-in");
    } finally {
      setBusy(false);
    }
  };

  const answered = done !== null || choice !== null;
  return (
    <Panel
      tone="gold"
      className="mt-6"
      title="Daily check-in"
      description={`One question a day. Every ${CHECKINS_PER_COIN} check-ins earn 1 Math Coin.`}
      actions={
        <span className="rounded-full bg-gold/30 px-3 py-1 text-xs font-bold text-gold-deep">
          ⚡ {streak.current} day{streak.current === 1 ? "" : "s"} in a row
        </span>
      }
    >
      <p className="text-xs font-bold text-muted-foreground">Chapter {shown.chapter}</p>
      <MathText text={shown.prompt} className="mt-1 font-semibold" />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {shown.options.map((opt, i) => {
          const picked = done ? done.correct && i === shown.answer : choice === i;
          const right = answered && i === shown.answer;
          return (
            <button
              type="button"
              key={i}
              disabled={answered || busy || readOnly}
              onClick={() => void submit(i)}
              className={cn(
                "rounded-lg border-2 px-3 py-2 text-left text-sm font-semibold transition-colors disabled:cursor-default",
                right
                  ? "border-success bg-success/15"
                  : picked
                    ? "border-destructive bg-destructive/10"
                    : "border-border hover:border-primary/50",
              )}
            >
              <MathText text={opt} />
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
          <p className="font-bold">
            {done
              ? done.correct
                ? "✅ You got it right today."
                : "You checked in today."
              : "Saved!"}{" "}
            Come back tomorrow for a new question.
          </p>
          <MathText text={shown.explanation} className="mt-1 text-muted-foreground" />
        </div>
      ) : null}
      {readOnly ? (
        <p className="mt-2 text-xs text-muted-foreground">Preview only: answers are not saved.</p>
      ) : null}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-bold">
          <span>
            {towardsCoin} / {CHECKINS_PER_COIN} towards the next coin
          </span>
          <span className="text-muted-foreground">{count} check-ins in total</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gold"
            style={{ width: `${(towardsCoin / CHECKINS_PER_COIN) * 100}%` }}
          />
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------- Mistakes */

interface Draft {
  id: string | null;
  chapter: number;
  errorType: ErrorType;
  question: string;
  solution: string;
  status: MistakeStatus;
  imagePath: string | null;
  file: File | null;
}

const emptyDraft = (): Draft => ({
  id: null,
  chapter: 1,
  errorType: "careless",
  question: "",
  solution: "",
  status: "review",
  imagePath: null,
  file: null,
});

function MistakeImage({ path }: { path: string }) {
  const url = useQuery({
    queryKey: ["mistake-image", path],
    staleTime: 9 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("mistake-images")
        .createSignedUrl(path, 600);
      if (error) throw new Error(error.message);
      return data.signedUrl;
    },
  });
  if (!url.data) return <p className="text-xs text-muted-foreground">Loading picture…</p>;
  return (
    <img
      src={url.data}
      alt="Question"
      className="mt-2 max-h-72 rounded-lg border-2 border-border object-contain"
    />
  );
}

function MistakeForm({
  draft,
  onChange,
  onSave,
  onCancel,
  busy,
}: {
  draft: Draft;
  onChange: (patch: Partial<Draft>) => void;
  onSave: () => void;
  onCancel: () => void;
  busy: boolean;
}) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-medium">
          Chapter
          <select
            value={draft.chapter}
            onChange={(e) => onChange({ chapter: Number(e.target.value) })}
            className={field}
          >
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                Ch{c.id} {c.short}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Type of mistake
          <select
            value={draft.errorType}
            onChange={(e) => onChange({ errorType: e.target.value as ErrorType })}
            className={field}
          >
            {ERROR_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Status
          <select
            value={draft.status}
            onChange={(e) => onChange({ status: e.target.value as MistakeStatus })}
            className={field}
          >
            {(Object.keys(MISTAKE_STATUS) as MistakeStatus[]).map((s) => (
              <option key={s} value={s}>
                {MISTAKE_STATUS[s].emoji} {MISTAKE_STATUS[s].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Question{" "}
        <span className="font-normal text-muted-foreground">(type it, add a photo, or both)</span>
        <textarea
          rows={3}
          maxLength={2000}
          value={draft.question}
          onChange={(e) => onChange({ question: e.target.value })}
          placeholder="e.g. Factorize $4x^2 - 9$."
          className={field}
        />
      </label>
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-input px-3 py-2 text-sm font-semibold">
        <ImagePlus className="h-4 w-4" aria-hidden="true" />
        {draft.file
          ? draft.file.name
          : draft.imagePath
            ? "Replace the photo"
            : "Add a photo of the question"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={(e) => onChange({ file: e.target.files?.[0] ?? null })}
        />
      </label>
      <label className="block text-sm font-medium">
        Step-by-step solution{" "}
        <span className="font-normal text-muted-foreground">
          (write maths between $ signs, e.g. $x^2 + 1$)
        </span>
        <textarea
          rows={5}
          maxLength={4000}
          value={draft.solution}
          onChange={(e) => onChange({ solution: e.target.value })}
          placeholder={"Step 1: $4x^2 - 9 = (2x)^2 - 3^2$\nStep 2: $= (2x + 3)(2x - 3)$"}
          className={cn(field, "font-mono")}
        />
      </label>
      {draft.solution.trim() ? (
        <div className="rounded-lg border-2 border-border bg-muted/40 p-3">
          <p className="text-xs font-bold text-muted-foreground">Preview</p>
          <MathText text={draft.solution} className="mt-1 text-sm" />
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : draft.id ? "Save changes" : "Add to vault"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function StudentVault() {
  const { me, examDates, readOnly, extrasError } = useApp();
  const qc = useQueryClient();
  const progress = useStudentProgress(me.id);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(false);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [chapterFilter, setChapterFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<MistakeStatus | null>(null);

  const mistakes = progress.data?.mistakes ?? [];
  const shown = mistakes.filter(
    (m) =>
      (chapterFilter === null || m.chapter === chapterFilter) &&
      (statusFilter === null || m.status === statusFilter),
  );
  const counts = (Object.keys(MISTAKE_STATUS) as MistakeStatus[]).map((s) => ({
    s,
    n: mistakes.filter((m) => m.status === s).length,
  }));
  const reload = () => qc.invalidateQueries({ queryKey: studentProgressKey(me.id) });

  const save = async () => {
    if (!draft) return;
    if (!draft.question.trim() && !draft.file && !draft.imagePath) {
      toast.error("Type the question or add a photo of it");
      return;
    }
    setBusy(true);
    try {
      let imagePath = draft.imagePath;
      if (draft.file) {
        const ext = IMAGE_TYPES[draft.file.type];
        if (!ext) throw new Error("The photo must be a PNG, JPG, WEBP or GIF image");
        if (draft.file.size > MAX_IMAGE_BYTES)
          throw new Error("The photo must be smaller than 5 MB");
        const path = `${me.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("mistake-images").upload(path, draft.file, {
          contentType: draft.file.type,
        });
        if (error) throw new Error(error.message);
        if (imagePath) await supabase.storage.from("mistake-images").remove([imagePath]);
        imagePath = path;
      }
      const row = {
        chapter: draft.chapter,
        error_type: draft.errorType,
        question: draft.question.trim(),
        solution: draft.solution.trim(),
        status: draft.status,
        image_path: imagePath,
        updated_at: new Date().toISOString(),
      };
      const { error } = draft.id
        ? await supabase.from("mistakes").update(row).eq("id", draft.id)
        : await supabase.from("mistakes").insert({ ...row, student_id: me.id });
      if (error) throw new Error(error.message);
      await reload();
      setDraft(null);
      toast.success(draft.id ? "Mistake updated" : "Added to your Mistake Vault");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const cycle = async (m: Mistake) => {
    const status = nextStatus(m.status);
    const { error } = await supabase
      .from("mistakes")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", m.id);
    if (error) toast.error(error.message);
    else {
      await reload();
      if (status === "mastered") toast.success("Mastered! 🟢");
    }
  };

  const remove = async (m: Mistake) => {
    if (!window.confirm("Delete this mistake from your vault?")) return;
    const { error } = await supabase.from("mistakes").delete().eq("id", m.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (m.imagePath) await supabase.storage.from("mistake-images").remove([m.imagePath]);
    await reload();
  };

  return (
    <>
      <PageHeader
        title="Mistake Vault"
        description="Every mistake you fix now is a mark you keep in the exam."
      />
      {extrasError ? (
        <div className="mt-4">
          <Notice tone="info">The Mistake Vault is not open yet.</Notice>
        </div>
      ) : null}
      <ExamCountdown exam={nextExam(examDates, me.set)} />
      <DailyCheckin studentId={me.id} progress={progress.data} />

      <Panel
        tone="berry"
        className="mt-6"
        title="My mistakes"
        description={counts.map((c) => `${MISTAKE_STATUS[c.s].emoji} ${c.n}`).join("   ")}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Switch
                checked={revision}
                onCheckedChange={setRevision}
                aria-label="Exam revision mode"
              />
              {revision ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
              Exam revision mode
            </label>
            {draft === null && !readOnly ? (
              <Button size="sm" onClick={() => setDraft(emptyDraft())}>
                <Plus /> Add a mistake
              </Button>
            ) : null}
          </div>
        }
      >
        {draft ? (
          <div className="mb-5 rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
            <MistakeForm
              draft={draft}
              busy={busy}
              onChange={(patch) => setDraft({ ...draft, ...patch })}
              onSave={() => void save()}
              onCancel={() => setDraft(null)}
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          <select
            aria-label="Filter by chapter"
            value={chapterFilter ?? ""}
            onChange={(e) => setChapterFilter(e.target.value ? Number(e.target.value) : null)}
            className="rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-bold"
          >
            <option value="">All chapters</option>
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                Chapter {c.id}
              </option>
            ))}
          </select>
          {(Object.keys(MISTAKE_STATUS) as MistakeStatus[]).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? null : s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                statusFilter === s ? MISTAKE_STATUS[s].cls : "bg-muted text-muted-foreground",
              )}
            >
              {MISTAKE_STATUS[s].emoji} {MISTAKE_STATUS[s].label}
            </button>
          ))}
        </div>
        {revision ? (
          <p className="mt-3 text-sm font-semibold text-primary">
            Revision mode: solutions are hidden. Try each question, then tap Show solution.
          </p>
        ) : null}

        {progress.isPending ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : progress.isError ? (
          <p className="mt-4 text-sm text-destructive">{progress.error.message}</p>
        ) : shown.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {mistakes.length === 0
              ? "No mistakes logged yet. Add the next one you make in a quiz!"
              : "Nothing matches these filters."}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shown.map((m) => {
              const st = MISTAKE_STATUS[m.status];
              const hidden = revision && !revealed.includes(m.id);
              return (
                <li key={m.id} className="rounded-xl border-2 border-border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary-deep">
                      Ch{m.chapter}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {errorTypeLabel(m.errorType)}
                    </span>
                    <button
                      type="button"
                      disabled={readOnly}
                      onClick={() => void cycle(m)}
                      title="Tap to change the status"
                      className={cn("rounded-full px-2 py-0.5", st.cls)}
                    >
                      {st.emoji} {st.label}
                    </button>
                    <span className="ml-auto font-normal text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {m.question ? (
                    <MathText text={m.question} className="mt-2 font-semibold" />
                  ) : null}
                  {m.imagePath ? <MistakeImage path={m.imagePath} /> : null}
                  {m.solution ? (
                    <div className="relative mt-3 rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-bold text-muted-foreground">Solution</p>
                      <div
                        className={cn(
                          "transition",
                          hidden && "pointer-events-none select-none blur-md",
                        )}
                        aria-hidden={hidden}
                      >
                        <MathText text={m.solution} className="mt-1 text-sm" />
                      </div>
                      {hidden ? (
                        <button
                          type="button"
                          onClick={() => setRevealed([...revealed, m.id])}
                          className="absolute inset-0 grid place-items-center text-sm font-bold text-primary"
                        >
                          Show solution
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                  {readOnly ? null : (
                    <div className="mt-3 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDraft({
                            id: m.id,
                            chapter: m.chapter,
                            errorType: m.errorType,
                            question: m.question,
                            solution: m.solution,
                            status: m.status,
                            imagePath: m.imagePath,
                            file: null,
                          })
                        }
                      >
                        <Pencil /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => void remove(m)}>
                        <Trash2 /> Delete
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}

/* --------------------------------------------------------- Teacher side */

function ExamDatesManager() {
  const { examDates, refresh, extrasError } = useApp();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ExamKind>("exam");
  const [set, setSet] = useState<"ALL" | "S2M3" | "S2M5">("ALL");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const upcoming = examDates.filter((e) => new Date(e.startsAt).getTime() > Date.now());

  const add = async () => {
    const startsAt = fromLocalInput(when);
    if (!title.trim() || !startsAt) {
      toast.error("Add a title and a date and time");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from("exam_dates")
        .insert({ title: title.trim(), kind, math_set: set, starts_at: startsAt });
      if (error) throw new Error(error.message);
      await refresh();
      setTitle("");
      setWhen("");
      toast.success("Date added. Students now see the countdown.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add the date");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (e: ExamDate) => {
    if (!window.confirm(`Delete "${e.title}"?`)) return;
    const { error } = await supabase.from("exam_dates").delete().eq("id", e.id);
    if (error) toast.error(error.message);
    else await refresh();
  };

  return (
    <>
      <PageHeader
        title="Exam dates"
        description="Students see a live countdown to the next date in their Mistake Vault. Their mistakes stay private to them; preview a student to see their vault."
      />
      {extrasError ? (
        <div className="mt-4">
          <Notice tone="error">{extrasError}</Notice>
        </div>
      ) : null}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title="Add a date">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void add();
            }}
          >
            <label className="block text-sm font-medium">
              Title
              <input
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1st Term Test"
                className={field}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Type
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as ExamKind)}
                  className={field}
                >
                  {EXAM_KINDS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Class set
                <select
                  value={set}
                  onChange={(e) => setSet(e.target.value as "ALL" | "S2M3" | "S2M5")}
                  className={field}
                >
                  <option value="ALL">All sets</option>
                  <option value="S2M3">S2M3</option>
                  <option value="S2M5">S2M5</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">
              Starts
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className={field}
              />
            </label>
            <Button type="submit" disabled={busy}>
              <Plus /> {busy ? "Adding…" : "Add date"}
            </Button>
          </form>
        </Panel>
        <Panel title="Upcoming" bodyClassName="px-5 py-1">
          {upcoming.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">No upcoming dates.</p>
          ) : (
            <ul className="divide-y-2 divide-border">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{e.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {e.set === "ALL" ? "All sets" : e.set},{" "}
                      {new Date(e.startsAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => void remove(e)}>
                    <Trash2 /> Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
