import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { LuckyDrawStage } from "@/components/teacher/LuckyDrawStage";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import {
  COIN_NAME,
  QUICK_AMOUNTS,
  QUICK_REASONS,
  coinBalance,
  deleteMarks,
  giveCoins,
  reasonLabel,
  type MarkReason,
} from "@/lib/coins";
import { sortByClass, type MathSet, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Class activity — HLC Math" },
      { name: "description", content: "3D lucky draw for the class, then give +1 Math Coin." },
      { property: "og:title", content: "Class activity — HLC Math" },
      { property: "og:description", content: "3D lucky draw and quick Math Coins." },
    ],
  }),
  component: ActivityPage,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];

function ActivityPage() {
  const { students, coinsError } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const list = useMemo(() => sortByClass(students.filter((s) => s.set === set)), [students, set]);
  return (
    <AppShell>
      <TeacherOnly>
        <PageHeader
          title="Class activity"
          description={`3D lucky draw and quick ${COIN_NAME} for ${set}`}
          actions={
            <div className="flex rounded-md border border-border bg-card p-0.5">
              {SETS.map((x) => (
                <button
                  type="button"
                  key={x}
                  onClick={() => setSet(x)}
                  className={cn(
                    "rounded px-4 py-1.5 text-sm font-semibold",
                    set === x
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {x}
                </button>
              ))}
            </div>
          }
        />
        {coinsError && (
          <div className="mt-4">
            <Notice tone="error">{coinsError}</Notice>
          </div>
        )}
        <LuckyDrawStage key={set} list={list} />
        <QuickPoints key={`points-${set}`} list={list} />
        <RecentActivity />
      </TeacherOnly>
    </AppShell>
  );
}

function QuickPoints({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState<MarkReason>("classwork");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = q
    ? list.filter((s) =>
        `${s.name} ${s.className ?? ""}${s.classNo ?? ""} ${s.hlcNo ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : list;

  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const chooseAmount = (n: number) => {
    const value = Number.isFinite(n) ? Math.max(-100, Math.min(100, Math.trunc(n))) : 0;
    setAmount(value);
    if (value < 0) setReason("deduction");
    else if (reason === "deduction") setReason("classwork");
  };

  const chooseReason = (r: MarkReason) => {
    setReason(r);
    if (r === "deduction" && amount > 0) setAmount(-amount);
    if (r !== "deduction" && amount < 0) setAmount(-amount);
  };

  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };

  const save = async () => {
    if (amount === 0) {
      toast.error("Choose an amount other than 0");
      return;
    }
    setBusy(true);
    try {
      const count = selected.length;
      const ids = await giveCoins({ studentIds: selected, marks: amount, reason, note });
      await refresh();
      setSelected([]);
      setNote("");
      toast.success(
        `${amount > 0 ? "+" : ""}${amount} ${COIN_NAME} saved for ${count} student${count === 1 ? "" : "s"}`,
        { action: { label: "Undo", onClick: () => void undo(ids) } },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      className="mt-6"
      title={`Quick ${COIN_NAME}`}
      description="Tick students, choose an amount and a reason, then save."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search students"
              className="w-32 bg-transparent text-sm outline-none"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelected([...new Set([...selected, ...shown.map((s) => s.id)])])}
          >
            Select all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected([])}
            disabled={!selected.length}
          >
            Clear
          </Button>
        </div>
      }
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">There are no students in this set yet.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s) => {
            const on = selected.includes(s.id);
            return (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-2.5 transition-colors",
                  on ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                  className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.className} {s.classNo}
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                  {coinBalance(s)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-3 mt-4 flex flex-wrap items-end gap-3 rounded-md border border-border bg-card p-3 shadow-lg">
        <div>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Amount</p>
          <div className="flex flex-wrap items-center gap-1">
            {QUICK_AMOUNTS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => chooseAmount(n)}
                className={cn(
                  "min-w-10 rounded px-2 py-1.5 text-sm font-semibold",
                  amount === n
                    ? n < 0
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-success text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {n > 0 ? `+${n}` : n}
              </button>
            ))}
            <input
              type="number"
              min={-100}
              max={100}
              value={amount}
              aria-label="Custom amount"
              onChange={(e) => chooseAmount(Number(e.target.value))}
              className="w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm"
            />
          </div>
        </div>
        <label className="text-xs font-semibold text-muted-foreground">
          Reason
          <select
            value={reason}
            onChange={(e) => chooseReason(e.target.value as MarkReason)}
            className="mt-1 block rounded-md border border-input bg-card p-2 text-sm font-normal text-foreground"
          >
            {QUICK_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-40 flex-1 text-xs font-semibold text-muted-foreground">
          Note (optional)
          <input
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ex 5B Q1–6"
            className="mt-1 block w-full rounded-md border border-input bg-card p-2 text-sm font-normal text-foreground"
          />
        </label>
        <Button
          disabled={busy || !selected.length || amount === 0}
          onClick={() => void save()}
          className={cn(
            "h-10",
            amount < 0 && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          )}
        >
          {busy
            ? "Saving…"
            : `Give ${amount > 0 ? "+" : ""}${amount} to ${selected.length} student${selected.length === 1 ? "" : "s"}`}
        </Button>
      </div>
    </Panel>
  );
}

interface LogGroup {
  key: string;
  ids: string[];
  studentIds: string[];
  marks: number;
  reason: string;
  note: string;
  at: string;
}

function RecentActivity() {
  const { markLog, students, refresh } = useApp();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const names = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const groups = useMemo(() => {
    const out: LogGroup[] = [];
    const index = new Map<string, number>();
    for (const m of markLog) {
      const key = m.batch_id ?? m.id;
      const at = index.get(key);
      const group = at === undefined ? undefined : out[at];
      if (group) {
        group.ids.push(m.id);
        group.studentIds.push(m.student_id);
      } else {
        index.set(key, out.length);
        out.push({
          key,
          ids: [m.id],
          studentIds: [m.student_id],
          marks: m.marks,
          reason: m.reason,
          note: m.note ?? "",
          at: m.created_at,
        });
      }
    }
    return out.slice(0, 12);
  }, [markLog]);

  const undo = async (g: LogGroup) => {
    const who = g.studentIds.map((id) => names.get(id) ?? "?").join(", ");
    if (
      !window.confirm(
        `Undo ${g.marks > 0 ? "+" : ""}${g.marks} (${reasonLabel(g.reason)}) for ${who}?`,
      )
    )
      return;
    setBusyKey(g.key);
    try {
      await deleteMarks(g.ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <Panel className="mt-6" title="Recent activity" bodyClassName="px-5 py-2">
      {groups.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">No {COIN_NAME} given yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {groups.map((g) => {
            const who = g.studentIds.map((id) => names.get(id) ?? "?");
            return (
              <li key={g.key} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {new Date(g.at).toLocaleString("en-HK", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={cn(
                    "w-12 rounded text-center font-semibold tabular-nums",
                    g.marks > 0
                      ? "bg-success/15 text-success"
                      : g.marks < 0
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {g.marks > 0 ? `+${g.marks}` : g.marks}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-medium">{reasonLabel(g.reason)}</span>
                  {g.note && <span className="text-muted-foreground">, {g.note}</span>}
                  <span className="block truncate text-xs text-muted-foreground">
                    {who.slice(0, 5).join(", ")}
                    {who.length > 5 ? ` and ${who.length - 5} more` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyKey === g.key}
                  onClick={() => void undo(g)}
                >
                  <Undo2 /> Undo
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
