import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Notice, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import type { MathSet } from "@/lib/data";
import { homeworkForSet } from "@/lib/homework";
import {
  CHECK_LABEL,
  CHECK_MARK,
  MARKS_PER_MISSING,
  MISSING_ALERT,
  assignmentsForSet,
  chasingListText,
  checkKey,
  homeworkPenalty,
  streakRewardMc,
  summarizeChecks,
  type CheckAssignment,
  type CheckStatus,
} from "@/lib/teacher-portal";
import { cn } from "@/lib/utils";

const SETS: MathSet[] = ["S2M3", "S2M5"];
const SETUP =
  "The homework matrix is not set up yet. Run supabase/sql/0012_teacher_portal.sql in the Supabase SQL Editor.";

export interface MatrixStudent {
  id: string;
  name: string;
  className?: string;
  classNo?: string;
  set: MathSet;
}

type Brush = CheckStatus | "clear";

const BRUSHES: { id: Brush; label: string }[] = [
  { id: "submitted", label: "✅ Tick" },
  { id: "missing", label: "❌ Missing" },
  { id: "late", label: "⚠️ Late" },
  { id: "redo", label: "🔄 Redo" },
  { id: "clear", label: "Clear" },
];

export function HomeworkMatrix({
  roster,
  fixedSet,
}: {
  /** Class list to mark. Teachers use the full roster; a subject captain passes their set. */
  roster?: MatrixStudent[];
  fixedSet?: MathSet;
}) {
  const { students, homework, systemConfig, refresh, role } = useApp();
  const [set, setSet] = useState<MathSet>(fixedSet ?? "S2M3");
  const [checks, setChecks] = useState<Map<string, CheckStatus>>(new Map());
  const [setupError, setSetupError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [brush, setBrush] = useState<Brush>("submitted");
  const [focus, setFocus] = useState<{ row: number; col: number } | null>(null);

  const activeSet = fixedSet ?? set;

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("homework_checks")
      .select("student_id, homework_id, status");
    if (error) {
      setSetupError(SETUP);
      return;
    }
    setSetupError(null);
    const next = new Map<string, CheckStatus>();
    for (const row of data ?? []) {
      if (!isStatus(row.status)) continue;
      next.set(checkKey(row.student_id, row.homework_id), row.status);
    }
    setChecks(next);
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 15000);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const assignments = useMemo<CheckAssignment[]>(() => {
    return assignmentsForSet(homeworkForSet(homework, activeSet), activeSet)
      .map((h) => ({ id: h.id, title: h.title, dueAt: h.due_at }))
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt) || a.title.localeCompare(b.title));
  }, [homework, activeSet]);

  const rows = useMemo(() => {
    const source: MatrixStudent[] =
      roster ??
      students
        .filter((s) => s.set === "S2M3" || s.set === "S2M5")
        .map((s) => ({
          id: s.id,
          name: s.name,
          set: s.set,
          ...(s.className !== undefined ? { className: s.className } : {}),
          ...(s.classNo !== undefined ? { classNo: s.classNo } : {}),
        }));
    return source
      .filter((s) => s.set === activeSet)
      .sort((a, b) =>
        `${a.className ?? ""}${(a.classNo ?? "").padStart(3, "0")}${a.name}`.localeCompare(
          `${b.className ?? ""}${(b.classNo ?? "").padStart(3, "0")}${b.name}`,
        ),
      );
  }, [roster, students, activeSet]);

  const statusOf = useCallback(
    (studentId: string, homeworkId: string) => checks.get(checkKey(studentId, homeworkId)) ?? null,
    [checks],
  );

  const summaryOf = useCallback(
    (studentId: string) =>
      summarizeChecks(studentId, assignments, (homeworkId) => statusOf(studentId, homeworkId)),
    [assignments, statusOf],
  );

  const alerts = rows
    .map((s) => ({ student: s, summary: summaryOf(s.id) }))
    .filter((row) => row.summary.missing >= MISSING_ALERT)
    .sort(
      (a, b) =>
        b.summary.missing - a.summary.missing || a.student.name.localeCompare(b.student.name),
    );

  const paint = async (student: MatrixStudent, homeworkId: string) => {
    const key = checkKey(student.id, homeworkId);
    const previous = checks.get(key) ?? null;
    const next = brush === "clear" ? null : brush;
    if (previous === next) return;
    const before = summaryOf(student.id);
    setChecks((map) => {
      const copy = new Map(map);
      if (next === null) copy.delete(key);
      else copy.set(key, next);
      return copy;
    });
    setBusy(key);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (next === null) {
        const { error } = await supabase
          .from("homework_checks")
          .delete()
          .eq("student_id", student.id)
          .eq("homework_id", homeworkId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("homework_checks").upsert({
          student_id: student.id,
          homework_id: homeworkId,
          status: next,
          updated_at: new Date().toISOString(),
          updated_by: auth.user?.id ?? null,
        });
        if (error) throw new Error(error.message);
      }
      const after = summarizeChecks(student.id, assignments, (id) =>
        id === homeworkId ? next : (checks.get(checkKey(student.id, id)) ?? null),
      );
      const known = new Set(before.grants.map((g) => g.sourceKey));
      const fresh = after.grants.filter((g) => !known.has(g.sourceKey));
      if (fresh.length && next !== null) {
        const multiplier = systemConfig.isDoubleMCEventActive ? 2 : 1;
        const { error: rewardError } = await supabase.rpc("grant_homework_streak", {
          _student_id: student.id,
          _homework_id: homeworkId,
          _description: fresh[0]?.description ?? after.grants.at(-1)?.description ?? "",
          _multiplier: multiplier,
        });
        if (rewardError) {
          if (role === "teacher") {
            const { error: fallback } = await supabase.from("game_rewards").upsert(
              fresh.map((g) => ({
                student_id: student.id,
                source_key: g.sourceKey,
                reason: "homework_streak",
                description: g.description,
                base_mc: g.baseMc,
                multiplier,
                mc: streakRewardMc(g.baseMc, systemConfig),
                exp: 0,
              })),
              { onConflict: "student_id,source_key", ignoreDuplicates: true },
            );
            if (fallback) throw new Error(fallback.message);
          } else {
            toast.message(
              "Saved. Streak coins are added once 0013_subject_captains.sql has been run.",
            );
          }
        }
        await refresh();
        if (!rewardError || role === "teacher") {
          toast.success(
            `${student.name} reached ${after.streak} in a row: +${streakRewardMc(fresh[0]?.baseMc ?? 3, systemConfig)} MC`,
          );
        }
      }
    } catch (e) {
      setChecks((map) => {
        const copy = new Map(map);
        if (previous === null) copy.delete(key);
        else copy.set(key, previous);
        return copy;
      });
      toast.error(e instanceof Error ? e.message : "Could not save this cell");
    } finally {
      setBusy(null);
    }
  };

  const copyList = async () => {
    const text = chasingListText({
      set: activeSet,
      assignments,
      students: rows,
      statusOf,
      missingOf: (id) => summaryOf(id).missing,
    });
    try {
      await navigator.clipboard.writeText(text);
      toast.success("追功課名單已複製，可以貼去 Google Classroom 或 WhatsApp");
    } catch {
      toast.error("Could not copy. Allow clipboard access and try again.");
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!focus || rows.length === 0 || assignments.length === 0) return;
    const { row, col } = focus;
    if (event.key === "Enter") {
      event.preventDefault();
      const student = rows[row];
      const hw = assignments[col];
      if (student && hw) void paint(student, hw.id);
      return;
    }
    const move: Record<string, [number, number]> = {
      ArrowRight: [0, 1],
      ArrowLeft: [0, -1],
      ArrowDown: [1, 0],
      ArrowUp: [-1, 0],
    };
    const delta = move[event.key];
    if (!delta) return;
    event.preventDefault();
    setFocus({
      row: Math.min(rows.length - 1, Math.max(0, row + delta[0])),
      col: Math.min(assignments.length - 1, Math.max(0, col + delta[1])),
    });
  };

  return (
    <Panel
      className="mt-6"
      title="Homework tracker"
      description="Pick a mark, then click a cell or press Enter. Tick is the usual one. The grid stays in step with the teacher and subject captains."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {fixedSet ? null : (
            <div className="flex rounded-md border border-border bg-card p-0.5">
              {SETS.map((x) => (
                <button
                  type="button"
                  key={x}
                  onClick={() => setSet(x)}
                  className={cn(
                    "rounded px-3 py-1 text-sm font-semibold",
                    activeSet === x
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {x}
                </button>
              ))}
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => void copyList()}>
            <ClipboardCopy /> 一鍵複製追功課名單
          </Button>
        </div>
      }
    >
      {setupError ? <Notice tone="info">{setupError}</Notice> : null}
      <div className="mb-3 flex flex-wrap gap-1" role="toolbar" aria-label="Quick mark">
        {BRUSHES.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={brush === item.id}
            onClick={() => setBrush(item.id)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-sm font-semibold",
              brush === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="self-center text-xs text-muted-foreground">
          Arrows move · Enter applies {brush === "clear" ? "Clear" : CHECK_LABEL[brush]}
        </span>
      </div>

      {alerts.length > 0 ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-sm font-bold text-destructive">
            3-strike alert · {alerts.length} student{alerts.length === 1 ? "" : "s"} with{" "}
            {MISSING_ALERT}+ missing
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {alerts.map(({ student, summary }) => (
              <li key={student.id} className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">
                  {student.name}
                  <span className="ml-2 text-muted-foreground">
                    {student.className} {student.classNo}
                  </span>
                </span>
                <span className="font-semibold text-destructive">
                  {summary.missing} missing · homework score −{homeworkPenalty(summary.missing)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Penalty is {MARKS_PER_MISSING} marks for every missing homework once a student reaches{" "}
            {MISSING_ALERT}. It is shown here for chasing; the Google Sheet /200 table is not
            changed.
          </p>
        </div>
      ) : null}

      {assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No homework for {activeSet} yet. Add assignments on this page first.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No students in {activeSet} yet.</p>
      ) : (
        <div tabIndex={0} onKeyDown={onKeyDown} className="outline-none">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-card p-2 text-left">Student</th>
                <th className="bg-card p-2 text-center">Streak</th>
                <th className="bg-card p-2 text-center">Missing</th>
                {assignments.map((hw) => (
                  <th key={hw.id} className="bg-card p-2 text-center font-medium">
                    <span className="line-clamp-2">{hw.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((student, rowIndex) => {
                const summary = summaryOf(student.id);
                const alert = summary.missing >= MISSING_ALERT;
                return (
                  <tr key={student.id} className={cn(alert && "bg-destructive/5")}>
                    <th className="sticky left-0 bg-card p-2 text-left font-medium">
                      {student.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {student.className} {student.classNo}
                      </span>
                    </th>
                    <td className="p-2 text-center font-semibold tabular-nums">{summary.streak}</td>
                    <td
                      className={cn(
                        "p-2 text-center font-semibold tabular-nums",
                        alert && "text-destructive",
                      )}
                    >
                      {summary.missing}
                    </td>
                    {assignments.map((hw, colIndex) => {
                      const status = statusOf(student.id, hw.id);
                      const key = checkKey(student.id, hw.id);
                      const focused = focus?.row === rowIndex && focus?.col === colIndex;
                      return (
                        <td key={hw.id} className="p-1 text-center">
                          <button
                            type="button"
                            disabled={busy === key}
                            aria-label={`${student.name}, ${hw.title}: ${status ? CHECK_LABEL[status] : "Not marked"}`}
                            onFocus={() => setFocus({ row: rowIndex, col: colIndex })}
                            onClick={() => void paint(student, hw.id)}
                            className={cn(
                              "grid h-9 w-full min-w-9 place-items-center rounded-md border text-base",
                              status === "missing" && "border-destructive/50 bg-destructive/10",
                              status === "late" && "border-gold bg-gold/20",
                              status === "redo" && "border-primary/40 bg-primary/10",
                              status === "submitted" && "border-success/40 bg-success/10",
                              status === null && "border-border text-muted-foreground",
                              focused && "ring-2 ring-primary",
                            )}
                          >
                            {status ? CHECK_MARK[status] : "·"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function isStatus(value: string): value is CheckStatus {
  return value === "submitted" || value === "missing" || value === "late" || value === "redo";
}
