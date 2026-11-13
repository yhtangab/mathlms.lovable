import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { CalendarClock, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import { CHAPTERS } from "@/lib/data";
import { isWebLink } from "@/lib/drive-link";
import {
  DUE_LABEL,
  DUE_TONE,
  HOMEWORK_SETS,
  defaultDue,
  dueStatus,
  formatDue,
  fromLocalInput,
  homeworkForSet,
  setLabel,
  splitByDue,
  toLocalInput,
  type Homework,
  type HomeworkSet,
} from "@/lib/homework";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/homework")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Homework — HLC Math" },
      { name: "description", content: "Homework and deadlines for S2 Mathematics." },
      { property: "og:title", content: "Homework — HLC Math" },
      { property: "og:description", content: "Homework and deadlines." },
    ],
  }),
  component: HomeworkPage,
});

const PAST_LIMIT = 20;
const field =
  "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function HomeworkPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherHomework /> : <StudentHomework />}</AppShell>;
}

function HomeworkRow({
  item,
  showSet,
  actions,
}: {
  item: Homework;
  showSet: boolean;
  actions?: ReactNode;
}) {
  const status = dueStatus(item.due_at);
  const meta = [
    `Due ${formatDue(item.due_at)}`,
    showSet ? setLabel(item.math_set) : "",
    item.chapter === null ? "" : `Chapter ${item.chapter}`,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <li className="flex flex-wrap items-start gap-3 py-3">
      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
        {item.details !== "" && (
          <p className="mt-1.5 whitespace-pre-wrap text-sm">{item.details}</p>
        )}
        {(item.link !== "" || item.chapter !== null) && (
          <div className="mt-1.5 flex flex-wrap gap-4 text-sm">
            {item.link !== "" && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Open link <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {item.chapter !== null && (
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(item.chapter) }}
                className="font-medium text-primary hover:underline"
              >
                Chapter {item.chapter} materials
              </Link>
            )}
          </div>
        )}
      </div>
      <span className={cn("shrink-0 rounded px-2 py-0.5 text-xs font-semibold", DUE_TONE[status])}>
        {DUE_LABEL[status]}
      </span>
      {actions}
    </li>
  );
}

function StudentHomework() {
  const { me, homework, homeworkError } = useApp();
  const { upcoming, past } = useMemo(
    () => splitByDue(homeworkForSet(homework, me.set)),
    [homework, me.set],
  );
  return (
    <>
      <PageHeader
        title="Homework"
        description={`${me.set} Mathematics. Deadlines are set by your teacher.`}
      />
      {homeworkError && (
        <div className="mt-4">
          <Notice tone="info">Homework is not available yet.</Notice>
        </div>
      )}
      <div className="mt-6 space-y-6">
        <Panel
          title="Upcoming"
          description={upcoming.length === 1 ? "1 item" : `${upcoming.length} items`}
          bodyClassName="px-5 py-1"
        >
          {upcoming.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">Nothing is due at the moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((h) => (
                <HomeworkRow key={h.id} item={h} showSet={false} />
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Past deadlines" bodyClassName="px-5 py-1">
          {past.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">No past homework.</p>
          ) : (
            <ul className="divide-y divide-border">
              {past.slice(0, PAST_LIMIT).map((h) => (
                <HomeworkRow key={h.id} item={h} showSet={false} />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

interface Draft {
  id: string | null;
  mathSet: HomeworkSet;
  chapter: string;
  title: string;
  details: string;
  link: string;
  due: string;
}

function emptyDraft(): Draft {
  return {
    id: null,
    mathSet: "ALL",
    chapter: "",
    title: "",
    details: "",
    link: "",
    due: defaultDue(),
  };
}

function asSet(value: string): HomeworkSet {
  return value === "S2M3" || value === "S2M5" ? value : "ALL";
}

function TeacherHomework() {
  const { homework, homeworkError, refresh } = useApp();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<HomeworkSet>("ALL");
  const { upcoming, past } = useMemo(
    () => splitByDue(filter === "ALL" ? homework : homeworkForSet(homework, filter)),
    [homework, filter],
  );

  const change = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const save = async () => {
    const title = draft.title.trim();
    const link = draft.link.trim();
    const details = draft.details.trim();
    const due = fromLocalInput(draft.due);
    if (!title) {
      toast.error("Add a title");
      return;
    }
    if (title.length > 200) {
      toast.error("Keep the title under 200 characters");
      return;
    }
    if (!due) {
      toast.error("Choose a due date and time");
      return;
    }
    if (link !== "" && !(link.startsWith("https://") && isWebLink(link))) {
      toast.error("The link must start with https://");
      return;
    }
    if (details.length > 2000) {
      toast.error("Keep the instructions under 2000 characters");
      return;
    }
    const row = {
      math_set: draft.mathSet,
      chapter: draft.chapter === "" ? null : Number(draft.chapter),
      title,
      details,
      link,
      due_at: due,
    };
    setBusy(true);
    try {
      const { error } = draft.id
        ? await supabase
            .from("homework")
            .update({ ...row, updated_at: new Date().toISOString() })
            .eq("id", draft.id)
        : await supabase.from("homework").insert(row);
      if (error) throw new Error(error.message);
      await refresh();
      toast.success(draft.id ? "Homework updated" : "Homework posted");
      setDraft(emptyDraft());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the homework");
    } finally {
      setBusy(false);
    }
  };

  const edit = (h: Homework) => {
    setDraft({
      id: h.id,
      mathSet: asSet(h.math_set),
      chapter: h.chapter === null ? "" : String(h.chapter),
      title: h.title,
      details: h.details,
      link: h.link,
      due: toLocalInput(new Date(h.due_at)),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (h: Homework) => {
    if (!window.confirm(`Delete "${h.title}"? Students will no longer see it.`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("homework").delete().eq("id", h.id);
      if (error) throw new Error(error.message);
      await refresh();
      if (draft.id === h.id) setDraft(emptyDraft());
      toast.success("Homework deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the homework");
    } finally {
      setBusy(false);
    }
  };

  const actionsFor = (h: Homework) => (
    <div className="flex shrink-0 gap-1">
      <Button variant="ghost" size="sm" onClick={() => edit(h)} aria-label={`Edit ${h.title}`}>
        <Pencil /> Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={() => void remove(h)}
        aria-label={`Delete ${h.title}`}
      >
        <Trash2 /> Delete
      </Button>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Homework"
        description="Post homework with a deadline. Students see it on their dashboard and on this page."
      />
      {homeworkError && (
        <div className="mt-4">
          <Notice tone="error">{homeworkError}</Notice>
        </div>
      )}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Panel title={draft.id ? "Edit homework" : "New homework"}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <label className="block text-sm font-medium">
              Title
              <input
                required
                maxLength={200}
                value={draft.title}
                onChange={(e) => change({ title: e.target.value })}
                placeholder="e.g. Ex 5B Q1–12"
                className={field}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Class set
                <select
                  value={draft.mathSet}
                  onChange={(e) => change({ mathSet: asSet(e.target.value) })}
                  className={field}
                >
                  {HOMEWORK_SETS.map((s) => (
                    <option key={s} value={s}>
                      {setLabel(s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Chapter
                <select
                  value={draft.chapter}
                  onChange={(e) => change({ chapter: e.target.value })}
                  className={field}
                >
                  <option value="">None</option>
                  {CHAPTERS.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      Chapter {c.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">
              Due
              <input
                type="datetime-local"
                required
                value={draft.due}
                onChange={(e) => change({ due: e.target.value })}
                className={field}
              />
            </label>
            <label className="block text-sm font-medium">
              Link <span className="font-normal text-muted-foreground">(optional)</span>
              <input
                type="url"
                value={draft.link}
                onChange={(e) => change({ link: e.target.value })}
                placeholder="https://drive.google.com/…"
                className={field}
              />
            </label>
            <label className="block text-sm font-medium">
              Instructions <span className="font-normal text-muted-foreground">(optional)</span>
              <textarea
                rows={4}
                maxLength={2000}
                value={draft.details}
                onChange={(e) => change({ details: e.target.value })}
                placeholder="Show all working. Hand in at the start of the lesson."
                className={field}
              />
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : draft.id ? "Save changes" : "Post homework"}
              </Button>
              {draft.id !== null && (
                <Button type="button" variant="outline" onClick={() => setDraft(emptyDraft())}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Panel>

        <div className="space-y-6">
          <div className="flex w-fit rounded-md border border-border bg-card p-0.5">
            {HOMEWORK_SETS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded px-3 py-1 text-sm font-medium",
                  filter === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>
          <Panel
            title="Upcoming"
            description={upcoming.length === 1 ? "1 item" : `${upcoming.length} items`}
            bodyClassName="px-5 py-1"
          >
            {upcoming.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">
                No upcoming homework. Use the form to post some.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.map((h) => (
                  <HomeworkRow key={h.id} item={h} showSet actions={actionsFor(h)} />
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Past deadlines" bodyClassName="px-5 py-1">
            {past.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">No past homework.</p>
            ) : (
              <ul className="divide-y divide-border">
                {past.slice(0, PAST_LIMIT).map((h) => (
                  <HomeworkRow key={h.id} item={h} showSet actions={actionsFor(h)} />
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
