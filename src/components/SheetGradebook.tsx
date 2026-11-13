import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { scoreTone } from "@/components/AppShell";
import { Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { syncGoogleSheet, type SheetSource, type SyncReport } from "@/lib/sheets.functions";
import { ITEM_CATEGORIES, percent, termSummary, termsOf, WEIGHTS } from "@/lib/assessments";
import type { Category, MathSet } from "@/lib/sheet-parse";
import { cn } from "@/lib/utils";

const SPREADSHEET_ID = "1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
const TERM_OPTIONS = [1, 2] as const;
const SOURCE_LABEL: Record<SheetSource, string> = {
  service_account: "Google service account",
  api_key: "Google Sheets API key",
  public_xlsx: "public link (full workbook)",
};
const control =
  "rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium outline-none focus:border-primary";

export function SheetGradebook() {
  const { students, refresh, lastSync } = useApp();
  const serverSync = useServerFn(syncGoogleSheet);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<SyncReport | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [set, setSet] = useState<MathSet>("S2M3");
  const [term, setTerm] = useState<number>(1);
  const [view, setView] = useState<Category | "summary">("summary");

  const list = useMemo(
    () =>
      students
        .filter((s) => s.set === set)
        .sort((a, b) =>
          `${a.className ?? ""}${(a.classNo ?? "").padStart(3, "0")}`.localeCompare(
            `${b.className ?? ""}${(b.classNo ?? "").padStart(3, "0")}`,
          ),
        ),
    [students, set],
  );

  const termsWithScores = useMemo(
    () =>
      termsOf(
        list.flatMap((s) =>
          (s.assessments ?? []).filter((a) => a.kind === "item" && (a.score !== null || a.absent)),
        ),
      ),
    [list],
  );
  // If the chosen term has no marks yet, show the first term that does.
  const activeTerm =
    termsWithScores.length === 0 || termsWithScores.includes(term)
      ? term
      : (termsWithScores[0] ?? term);

  const categoryCounts = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const c of ITEM_CATEGORIES) {
      const labels = new Set<string>();
      for (const s of list) {
        for (const a of s.assessments ?? []) {
          if (a.kind === "item" && a.term === activeTerm && a.category === c.id) {
            labels.add(a.label);
          }
        }
      }
      counts.set(c.id, labels.size);
    }
    return counts;
  }, [list, activeTerm]);

  const columns = useMemo(() => {
    const seen = new Map<string, { label: string; full: number | null; position: number }>();
    for (const s of list) {
      for (const a of s.assessments ?? []) {
        if (
          a.kind === "item" &&
          a.term === activeTerm &&
          a.category === view &&
          !seen.has(a.label)
        ) {
          seen.set(a.label, { label: a.label, full: a.full_marks, position: a.position });
        }
      }
    }
    return [...seen.values()].sort((a, b) => a.position - b.position);
  }, [list, activeTerm, view]);

  const missingFull = useMemo(
    () => [
      ...new Set(
        students.flatMap((s) =>
          (s.assessments ?? [])
            .filter((a) => a.kind === "item" && a.score !== null && !a.full_marks)
            .map((a) => `${s.set} ${a.label}`),
        ),
      ),
    ],
    [students],
  );

  const runSync = async () => {
    setBusy(true);
    setSyncError(null);
    try {
      const result = await serverSync();
      setReport(result);
      await refresh();
      toast.success(`Synced ${result.students} students and ${result.scores} marks`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sync failed";
      setSyncError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      className="mt-6"
      title="Assessment gradebook"
      description={
        <>
          From{" "}
          <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-primary underline">
            2627 Name list (For LMS)
          </a>
          {", "}
          {lastSync
            ? `last synced ${new Date(lastSync).toLocaleString("en-HK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}`
            : "not synced yet"}
        </>
      }
      actions={
        <Button onClick={() => void runSync()} disabled={busy}>
          <RefreshCw className={cn(busy && "animate-spin")} />
          {busy ? "Syncing…" : "Sync from Google Sheet"}
        </Button>
      }
    >
      {syncError && (
        <div
          role="alert"
          className="mb-3 flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="whitespace-pre-wrap">{syncError}</p>
        </div>
      )}

      {report && !syncError && (
        <div className="mb-3 rounded-md border border-success/30 bg-success/5 p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            Synced from the {SOURCE_LABEL[report.source]}: {report.students} students,{" "}
            {report.scores} marks
          </p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            {report.tabs.map((t) => (
              <li key={t.set}>
                {t.set}: {t.students} students, {t.term1Items} Term 1 items, {t.term2Items} Term 2
                items, {t.scores} marks filled in
              </li>
            ))}
          </ul>
          {report.duplicates.length > 0 && (
            <p className="mt-1 text-gold-deep">
              Listed more than once (only the first row was kept): {report.duplicates.join(", ")}
            </p>
          )}
        </div>
      )}

      {missingFull.length > 0 && (
        <p className="mb-3 rounded-md border border-gold/50 bg-gold/10 p-2 text-sm">
          Full marks are missing in the sheet for: {missingFull.join(", ")}. Percentages for these
          items will appear once the &quot;Full marks&quot; row is filled in.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Set"
          value={set}
          onChange={(e) => setSet(e.target.value as MathSet)}
          className={control}
        >
          <option>S2M3</option>
          <option>S2M5</option>
        </select>
        <select
          aria-label="Term"
          value={activeTerm}
          onChange={(e) => setTerm(Number(e.target.value))}
          className={control}
        >
          {TERM_OPTIONS.map((t) => (
            <option key={t} value={t}>
              Term {t}
              {termsWithScores.includes(t) ? "" : " (no marks yet)"}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-0.5 rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => setView("summary")}
            className={cn(
              "rounded px-3 py-1 text-xs font-semibold transition-colors",
              view === "summary"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Weighted summary
          </button>
          {ITEM_CATEGORIES.map((c) => {
            const count = categoryCounts.get(c.id) ?? 0;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setView(c.id)}
                className={cn(
                  "rounded px-3 py-1 text-xs font-semibold transition-colors",
                  view === c.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
                {count > 0 ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students in {set} yet. Press Sync from Google Sheet to import the class list and
            marks.
          </p>
        ) : view !== "summary" && columns.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No {ITEM_CATEGORIES.find((c) => c.id === view)?.label ?? ""} marks for Term {activeTerm}{" "}
            yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                <th className="p-2">Class</th>
                <th className="p-2">Student</th>
                {view === "summary" ? (
                  <>
                    {WEIGHTS.map((w) => (
                      <th key={w.id} className="p-2 text-center">
                        {w.label} ({w.weight})
                      </th>
                    ))}
                    <th className="p-2 text-center">Total /200</th>
                  </>
                ) : (
                  columns.map((c) => (
                    <th key={c.label} className="p-2 text-center">
                      {c.label}
                      {c.full ? ` (${c.full})` : ""}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const sum = termSummary(s.assessments ?? [], activeTerm);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap p-2 text-muted-foreground">
                      {s.className} {s.classNo}
                    </td>
                    <td className="p-2">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.hlcNo ?? s.email}</p>
                    </td>
                    {view === "summary" ? (
                      <>
                        {sum.parts.map((p) => (
                          <td key={p.id} className="p-2 text-center tabular-nums">
                            {p.value ?? "—"}
                          </td>
                        ))}
                        <td className="p-2 text-center font-semibold tabular-nums">
                          {sum.coursework200}
                        </td>
                      </>
                    ) : (
                      columns.map((c) => {
                        const a = s.assessments?.find(
                          (x) => x.kind === "item" && x.term === activeTerm && x.label === c.label,
                        );
                        const pct = a ? percent(a) : null;
                        return (
                          <td key={c.label} className="p-1 text-center">
                            <span
                              title={pct === null ? "" : `${pct}%`}
                              className={cn(
                                "inline-block min-w-12 rounded px-1 py-0.5 text-xs font-semibold tabular-nums",
                                a?.absent ? "bg-muted text-muted-foreground" : scoreTone(pct),
                              )}
                            >
                              {!a || (a.score === null && !a.absent)
                                ? "—"
                                : a.absent
                                  ? "ABS"
                                  : a.score}
                            </span>
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}
