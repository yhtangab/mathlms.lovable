import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Mail } from "lucide-react";
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
  CHASE_EMAIL_BODY,
  CHASE_EMAIL_SUBJECT,
  chaseEmail,
  checkKey,
  homeworkPenalty,
  missingByStudent,
  streakRewardMc,
  nextCheckStatus,
  summarizeChecks,
  type CheckAssignment,
  type CheckStatus,
} from "@/lib/teacher-portal";
import { cn } from "@/lib/utils";

const SETS: MathSet[] = ["S2M3", "S2M5"];
const SETUP =
  "The homework matrix is not set up yet. Run supabase/sql/0007_homework.sql in the Supabase SQL Editor.";

export interface MatrixStudent {
  id: string;
  name: string;
  className?: string;
  classNo?: string;
  email?: string;
  set: MathSet;
}

const EMAIL_KEY = "hlc.chaseEmail.v1";

function savedEmailTemplate(): { subject: string; body: string } {
  try {
    const raw = localStorage.getItem(EMAIL_KEY);
    const parsed = raw ? (JSON.parse(raw) as { subject?: unknown; body?: unknown }) : null;
    if (parsed && typeof parsed.subject === "string" && typeof parsed.body === "string") {
      return { subject: parsed.subject, body: parsed.body };
    }
  } catch {
    // Keep the built-in draft.
  }
  return { subject: CHASE_EMAIL_SUBJECT, body: CHASE_EMAIL_BODY };
}

type Brush = "cycle" | CheckStatus | "clear";

const PAGE_SIZE = 10;

const BRUSHES: { id: Brush; label: string }[] = [
  { id: "cycle", label: "Cycle" },
  { id: "submitted", label: "✅ Tick" },
  { id: "missing", label: "❌ Missing" },
  { id: "late", label: "⚠️ Late" },
  { id: "absent", label: "ABS" },
  { id: "redo", label: "🔄 Redo" },
  { id: "clear", label: "Clear" },
];

function dueLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-HK", { day: "numeric", month: "short" });
}

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
  const [brush, setBrush] = useState<Brush>("cycle");
  const [page, setPage] = useState(0);
  const [focus, setFocus] = useState<{ row: number; col: number } | null>(null);
  const [captainIds, setCaptainIds] = useState<Set<string>>(new Set());
  const [captainsReady, setCaptainsReady] = useState<boolean | null>(null);
  const [captainBusy, setCaptainBusy] = useState<string | null>(null);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailSubject, setMailSubject] = useState(CHASE_EMAIL_SUBJECT);
  const [mailBody, setMailBody] = useState(CHASE_EMAIL_BODY);

  const activeSet = fixedSet ?? set;
  const showCaptains = role === "teacher";

  useEffect(() => {
    setPage(0);
  }, [activeSet]);

  useEffect(() => {
    if (!showCaptains) return;
    let active = true;
    void supabase
      .from("subject_captains")
      .select("student_id")
      .then(({ data, error }) => {
        if (!active) return;
        setCaptainsReady(!error);
        setCaptainIds(new Set((data ?? []).map((row) => row.student_id)));
      });
    return () => {
      active = false;
    };
  }, [showCaptains]);

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
          ...(s.email ? { email: s.email } : {}),
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
    const next = brush === "cycle" ? nextCheckStatus(previous) : brush === "clear" ? null : brush;
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
              "Saved. Streak coins are added once 0007_homework.sql has been run.",
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

  const missingGroups = useMemo(
    () => missingByStudent({ assignments, students: rows, statusOf }),
    [assignments, rows, statusOf],
  );

  const openMail = () => {
    const saved = savedEmailTemplate();
    setMailSubject(saved.subject);
    setMailBody(saved.body);
    setMailOpen(true);
  };

  const sendMail = () => {
    const ready = missingGroups.filter((g) => g.student.email);
    if (!ready.length) {
      toast.error("None of these students have a Google sign-in email.");
      return;
    }
    localStorage.setItem(EMAIL_KEY, JSON.stringify({ subject: mailSubject, body: mailBody }));
    for (const group of ready) {
      const email = group.student.email;
      if (!email) continue;
      const mail = chaseEmail({
        subject: mailSubject,
        body: mailBody,
        student: group.student,
        titles: group.titles,
      });
      const url =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        `&to=${encodeURIComponent(email)}` +
        `&su=${encodeURIComponent(mail.subject)}` +
        `&body=${encodeURIComponent(mail.body)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
    const skipped = missingGroups.length - ready.length;
    toast.success(
      `Opened ${ready.length} Gmail draft${ready.length === 1 ? "" : "s"} from your Google account.${
        skipped ? ` ${skipped} student${skipped === 1 ? "" : "s"} had no email.` : ""
      }`,
    );
    setMailOpen(false);
  };

  const toggleCaptain = async (studentId: string, on: boolean) => {
    setCaptainBusy(studentId);
    const previous = new Set(captainIds);
    setCaptainIds((current) => {
      const next = new Set(current);
      if (on) next.add(studentId);
      else next.delete(studentId);
      return next;
    });
    try {
      if (on) {
        const { data: auth } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("subject_captains")
          .insert({ student_id: studentId, appointed_by: auth.user?.id ?? null });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("subject_captains")
          .delete()
          .eq("student_id", studentId);
        if (error) throw new Error(error.message);
      }
      toast.success(on ? "Subject captain added" : "Subject captain removed");
    } catch (e) {
      setCaptainIds(previous);
      toast.error(e instanceof Error ? e.message : "Could not update subject captains");
    } finally {
      setCaptainBusy(null);
    }
  };

  const pageCount = Math.max(1, Math.ceil(assignments.length / PAGE_SIZE));
  const pageIndex = Math.min(page, pageCount - 1);
  const pageStart = pageIndex * PAGE_SIZE;
  const visibleAssignments = assignments.slice(pageStart, pageStart + PAGE_SIZE);
  const columns = Array.from(
    { length: PAGE_SIZE },
    (_, index) => visibleAssignments[index] ?? null,
  );

  const showPage = (next: number) => {
    const clamped = Math.min(pageCount - 1, Math.max(0, next));
    setPage(clamped);
    setFocus((current) => {
      if (!current) return current;
      const start = clamped * PAGE_SIZE;
      const end = Math.min(assignments.length - 1, start + PAGE_SIZE - 1);
      if (current.col >= start && current.col <= end) return current;
      return { row: current.row, col: start };
    });
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
    const nextCol = Math.min(assignments.length - 1, Math.max(0, col + delta[1]));
    setFocus({
      row: Math.min(rows.length - 1, Math.max(0, row + delta[0])),
      col: nextCol,
    });
    setPage(Math.floor(nextCol / PAGE_SIZE));
  };

  return (
    <Panel
      className="mt-6"
      title="Homework tracker"
      description="Click a cell to cycle Tick, Missing, Late, ABS, Redo, then clear. Pick a mark above to stamp that mark instead. Ten homework columns show on each page."
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
          {assignments.length > 0 ? (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Previous homework"
                disabled={pageIndex === 0}
                onClick={() => showPage(pageIndex - 1)}
              >
                &lt;
              </Button>
              <span className="min-w-12 text-center text-xs font-semibold tabular-nums">
                {pageIndex + 1}/{pageCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label="Next homework"
                disabled={pageIndex >= pageCount - 1}
                onClick={() => showPage(pageIndex + 1)}
              >
                &gt;
              </Button>
            </div>
          ) : null}
          {role === "teacher" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openMail}
              disabled={!missingGroups.length}
            >
              <Mail /> Send emails
            </Button>
          ) : null}
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
          Arrows move · Enter{" "}
          {brush === "cycle"
            ? "cycles the cell"
            : `applies ${brush === "clear" ? "Clear" : CHECK_LABEL[brush]}`}
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

      {roster && rows.length < 2 ? (
        <div className="mb-3">
          <Notice tone="info">
            The full class list is not available to this account yet. Run
            supabase/sql/0007_homework.sql in the Supabase SQL Editor, then sign in
            again.
          </Notice>
        </div>
      ) : null}
      {assignments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No homework for {activeSet} yet. Add assignments on this page first.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No students in {activeSet} yet.</p>
      ) : (
        <>
          {showCaptains && captainsReady === false ? (
            <div className="mb-3">
              <Notice tone="info">
                Subject captains are not set up yet. Run supabase/sql/0007_homework.sql in the
                Supabase SQL Editor.
              </Notice>
            </div>
          ) : null}
          <div tabIndex={0} onKeyDown={onKeyDown} className="overflow-x-auto outline-none">
            <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-0 text-xs">
              <colgroup>
                {showCaptains ? <col className="w-16" /> : null}
                <col className="w-28" />
                <col className="w-16" />
                <col className="w-14" />
                {columns.map((_, index) => (
                  <col key={index} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {showCaptains ? <th className="sticky left-0 z-20 bg-card" /> : null}
                  <th className={cn("sticky z-20 bg-card", showCaptains ? "left-16" : "left-0")} />
                  <th className="bg-card" />
                  <th className="bg-card" />
                  {columns.map((hw, index) => (
                    <th
                      key={hw?.id ?? `date-${index}`}
                      className="bg-card px-0.5 py-1 text-center font-medium"
                    >
                      {hw ? dueLabel(hw.dueAt) : ""}
                    </th>
                  ))}
                </tr>
                <tr>
                  {showCaptains ? (
                    <th className="sticky left-0 z-20 bg-card px-0.5 py-1 text-center text-[11px] font-semibold leading-tight">
                      Captain
                    </th>
                  ) : null}
                  <th
                    className={cn(
                      "sticky z-20 bg-card px-1.5 py-1 text-left",
                      showCaptains ? "left-16" : "left-0",
                    )}
                  >
                    Student
                  </th>
                  <th className="bg-card px-0.5 py-1 text-center">Streak</th>
                  <th className="bg-card px-0.5 py-1 text-center">Missing</th>
                  {columns.map((hw, index) => (
                    <th
                      key={hw?.id ?? `title-${index}`}
                      className="bg-card px-0.5 py-1 text-center font-medium"
                    >
                      {hw ? <span className="line-clamp-2">{hw.title}</span> : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((student, rowIndex) => {
                  const summary = summaryOf(student.id);
                  const alert = summary.missing >= MISSING_ALERT;
                  const stickyBg = alert ? "bg-destructive/10" : "bg-card";
                  return (
                    <tr key={student.id} className={cn(alert && "bg-destructive/5")}>
                      {showCaptains ? (
                        <td className={cn("sticky left-0 z-10 px-0.5 py-1 text-center", stickyBg)}>
                          <input
                            type="checkbox"
                            checked={captainIds.has(student.id)}
                            disabled={captainsReady !== true || captainBusy === student.id}
                            aria-label={`Subject captain, ${student.name}`}
                            onChange={(e) => void toggleCaptain(student.id, e.target.checked)}
                            className="h-3.5 w-3.5 accent-[var(--primary)]"
                          />
                        </td>
                      ) : null}
                      <th
                        className={cn(
                          "sticky z-10 px-1.5 py-1 text-left font-medium",
                          showCaptains ? "left-16" : "left-0",
                          stickyBg,
                        )}
                      >
                        <span className="block truncate" title={student.name}>
                          {student.name}
                        </span>
                        <span className="block truncate text-[11px] font-normal text-muted-foreground">
                          {student.className} {student.classNo}
                        </span>
                      </th>
                      <td className="px-0.5 py-1 text-center font-semibold tabular-nums">
                        🔥 {summary.streak}
                      </td>
                      <td
                        className={cn(
                          "px-0.5 py-1 text-center font-semibold tabular-nums",
                          alert && "text-destructive",
                        )}
                      >
                        {summary.missing}
                      </td>
                      {columns.map((hw, index) => {
                        if (!hw) {
                          return (
                            <td key={`empty-${index}`} className="px-0.5 py-1 text-center">
                              <span className="mx-auto grid h-8 w-8 place-items-center rounded-md border border-dashed border-border text-muted-foreground">
                                ·
                              </span>
                            </td>
                          );
                        }
                        const colIndex = pageStart + index;
                        const status = statusOf(student.id, hw.id);
                        const key = checkKey(student.id, hw.id);
                        const focused = focus?.row === rowIndex && focus?.col === colIndex;
                        return (
                          <td key={hw.id} className="px-0.5 py-1 text-center">
                            <button
                              type="button"
                              disabled={busy === key}
                              aria-label={`${student.name}, ${hw.title}: ${status ? CHECK_LABEL[status] : "Not marked"}`}
                              onFocus={() => setFocus({ row: rowIndex, col: colIndex })}
                              onClick={() => void paint(student, hw.id)}
                              className={cn(
                                "mx-auto grid h-8 w-8 place-items-center rounded-md border text-[11px] font-bold",
                                status === "missing" && "border-destructive/50 bg-destructive/10",
                                status === "late" && "border-gold bg-gold/20",
                                status === "absent" && "border-sky/50 bg-sky/15",
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
        </>
      )}
      {mailOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-labelledby="chase-email-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-card p-5 shadow-xl"
          >
            <h2 id="chase-email-title" className="text-lg font-semibold">
              Send missing-homework emails
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One email per student. If they missed more than one piece of homework, it is listed in
              that same email. Gmail opens from your Google sign-in account. You can edit the draft
              here; {"{name}"}, {"{class}"}, {"{count}"} and {"{homework}"} are filled in for each
              student.
            </p>
            <label className="mt-4 block text-sm font-medium">
              Subject
              <input
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="mt-3 block text-sm font-medium">
              Message
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={10}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal"
              />
            </label>
            <ul className="mt-4 space-y-2 text-sm">
              {missingGroups.map((group) => (
                <li key={group.student.id} className="rounded-md border border-border px-3 py-2">
                  <p className="font-medium">
                    {group.student.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {group.student.email ?? "No Google email on the class list"}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{group.titles.join(", ")}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setMailOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={sendMail}>
                <Mail /> Send {missingGroups.length}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function isStatus(value: string): value is CheckStatus {
  return (
    value === "submitted" ||
    value === "missing" ||
    value === "late" ||
    value === "absent" ||
    value === "redo"
  );
}
