import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Eraser, FileUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { parseScoreCsv, scoreSchema } from "@/lib/grade-rules";
import { Button } from "@/components/ui/button";
import { SheetGradebook } from "@/components/SheetGradebook";
import { AppShell, TeacherOnly, scoreTone } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { useApp } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { unmatchedChapterLabels } from "@/lib/assessments";
import {
  CHAPTERS,
  average,
  completion,
  formRank,
  improvement,
  type MathSet,
  weakTopics,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/teacher")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Analytics — HLC Math" },
      {
        name: "description",
        content: "Compare S2M3 and S2M5 marks, completion and weaker topics.",
      },
      { property: "og:title", content: "Analytics — HLC Math" },
      { property: "og:description", content: "Class analytics and the master score table." },
    ],
  }),
  component: Teacher,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];
const control =
  "rounded-md border border-input bg-card px-3 py-1.5 text-sm outline-none focus:border-primary";

function Teacher() {
  const { students, refresh } = useApp();
  const [q, setQ] = useState("");
  const [setF, setSetF] = useState<"All" | MathSet>("All");
  const [editing, setEditing] = useState<{ id: string; ch: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stats = SETS.map((set) => {
    const list = students.filter((s) => s.set === set);
    const chAvg = CHAPTERS.map((_, i) => {
      const v = list
        .map((s) => s.scores[i])
        .filter((x) => x !== null && x !== undefined) as number[];
      return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
    });
    const weakest = chAvg
      .map((v, i) => ({ v, c: CHAPTERS[i] }))
      .filter((x): x is { v: number; c: (typeof CHAPTERS)[number] } => x.v !== null && Boolean(x.c))
      .sort((a, b) => a.v - b.v)
      .slice(0, 2);
    return {
      set,
      n: list.length,
      avg: Math.round(list.reduce((a, s) => a + average(s), 0) / (list.length || 1)),
      comp: Math.round(list.reduce((a, s) => a + completion(s), 0) / (list.length || 1)),
      chAvg,
      weakest,
    };
  });

  const rows = useMemo(
    () =>
      students
        .filter((s) => setF === "All" || s.set === setF)
        .filter((s) => (s.name + s.email).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => formRank(a, students) - formRank(b, students)),
    [students, q, setF],
  );

  const manualStudents = students.filter((s) => (s.scoreSources ?? []).includes("manual"));
  const manualCount = students.reduce(
    (n, s) => n + (s.scoreSources ?? []).filter((x) => x === "manual").length,
    0,
  );
  const unmatched = useMemo(
    () => unmatchedChapterLabels(students.flatMap((s) => s.assessments ?? [])),
    [students],
  );

  const updateScore = async (id: string, ch: number, val: string) => {
    try {
      const parsedScore = scoreSchema.parse(val.trim() === "" ? null : Number(val));
      const { error } = await supabase
        .from("chapter_scores")
        .upsert([{ student_id: id, chapter: ch + 1, score: parsedScore }]);
      if (error) throw error;
      await refresh();
      setEditing(null);
      toast.success(
        parsedScore === null ? "Cleared. Showing the Google Sheet score." : "Score saved",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the score");
    }
  };

  const clearManual = async () => {
    const ids = manualStudents.map((s) => s.id);
    if (!ids.length) return;
    if (
      !window.confirm(
        `Delete the chapter scores typed in the app for ${ids.length} student${ids.length === 1 ? "" : "s"}? The scores worked out from the Google Sheet will be shown instead.`,
      )
    ) {
      return;
    }
    try {
      for (let i = 0; i < ids.length; i += 100) {
        const { error } = await supabase
          .from("chapter_scores")
          .delete()
          .in("student_id", ids.slice(i, i + 100));
        if (error) throw error;
      }
      await refresh();
      toast.success("Now showing Google Sheet scores");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear the scores");
    }
  };

  const importCsv = async (file: File) => {
    try {
      const map = parseScoreCsv(await file.text());
      const unknown = [...map.keys()].filter((email) => !students.some((s) => s.email === email));
      if (unknown.length) {
        throw new Error(
          `${unknown.length} email(s) are not on the class list. Add the students first.`,
        );
      }
      const data = students.flatMap((s) => {
        const scores = map.get(s.email);
        return scores
          ? scores.map((score, i) => ({ student_id: s.id, chapter: i + 1, score }))
          : [];
      });
      if (!data.length) throw new Error("No student scores were found in the file");
      const { error } = await supabase.from("chapter_scores").upsert(data);
      if (error) throw error;
      await refresh();
      toast.success(`Saved scores for ${map.size} students`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    }
  };

  return (
    <AppShell>
      <TeacherOnly>
        <PageHeader
          title="Analytics"
          description="Marks from the class Google Sheet, chapter averages and the master score table."
        />
        <SheetGradebook />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {stats.map((st) => (
            <Panel key={st.set} title={st.set} description={`${st.n} students`}>
              <div className="grid grid-cols-2 gap-3">
                <Figure label="Average chapter score" value={`${st.avg}%`} />
                <Figure label="Chapters completed" value={`${st.comp}%`} />
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {st.chAvg.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {v ?? "—"}
                    </span>
                    <div
                      className={cn(
                        "w-full rounded-t",
                        v !== null && v < 70 ? "bg-destructive/70" : "bg-primary",
                      )}
                      style={{ height: `${(v ?? 0) * 0.8}px` }}
                    />
                    <span className="text-[10px] font-semibold">Ch{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Weaker topics:</span>
                {st.weakest.length === 0 && (
                  <span className="text-xs text-muted-foreground">none yet</span>
                )}
                {st.weakest.map((w) => (
                  <span
                    key={w.c.id}
                    className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive"
                  >
                    Ch{w.c.id} {w.c.short} ({w.v}%)
                  </span>
                ))}
              </div>
            </Panel>
          ))}
        </div>

        <button
          type="button"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void importCsv(f);
          }}
          onClick={() => fileRef.current?.click()}
          className="mt-6 flex w-full items-center gap-4 rounded-lg border border-dashed border-primary/40 bg-card px-5 py-4 text-left transition-colors hover:bg-primary/5"
        >
          <FileUp className="h-6 w-6 shrink-0 text-primary" />
          <span>
            <span className="block font-semibold">Import chapter scores from a CSV file</span>
            <span className="block text-sm text-muted-foreground">
              Drop a file here or click to choose one. Format: email,ch1,ch2,ch3,ch4,ch5,ch6,ch7
            </span>
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importCsv(f);
            e.target.value = "";
          }}
        />

        <Panel
          className="mt-6"
          title="Master score table"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {manualCount > 0 && (
                <Button variant="outline" size="sm" onClick={() => void clearManual()}>
                  <Eraser /> Use Google Sheet scores ({manualCount} typed)
                </Button>
              )}
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search"
                  aria-label="Search students"
                  className="w-32 bg-transparent text-sm outline-none"
                />
              </div>
              <select
                aria-label="Set"
                value={setF}
                onChange={(e) => setSetF(e.target.value as "All" | MathSet)}
                className={control}
              >
                <option>All</option>
                <option>S2M3</option>
                <option>S2M5</option>
              </select>
            </div>
          }
        >
          <p className="text-xs text-muted-foreground">
            A dashed box is worked out from the Google Sheet (the average percentage of that
            chapter&apos;s short and chapter quizzes, or homework if there is no quiz yet). A plain
            box was typed here. Click a score to type over it; clear it to go back to the Google
            Sheet score.
          </p>
          {unmatched.length > 0 && (
            <div className="mt-3">
              <Notice>
                These quiz columns do not say which chapter they belong to, so they are not counted
                in Ch1 to Ch7: {unmatched.slice(0, 20).join(", ")}
                {unmatched.length > 20 ? " …" : ""}. Name them like SQ1.1, CQ1 or Ch1 Quiz in the
                Google Sheet, then sync again.
              </Notice>
            </div>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
                  <th className="p-2">Rank</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Set</th>
                  {CHAPTERS.map((c) => (
                    <th key={c.id} className="p-2 text-center">
                      Ch{c.id}
                    </th>
                  ))}
                  <th className="p-2 text-center">Avg</th>
                  <th className="p-2 text-center">Change</th>
                  <th className="p-2">Weaker topics</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const imp = improvement(s);
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="p-2 font-semibold tabular-nums">{formRank(s, students)}</td>
                      <td className="p-2">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="p-2">{s.set}</td>
                      {s.scores.map((sc, i) => {
                        const src = s.scoreSources?.[i] ?? null;
                        return (
                          <td key={i} className="p-1 text-center">
                            {editing?.id === s.id && editing.ch === i ? (
                              <input
                                autoFocus
                                type="number"
                                aria-label={`Chapter ${i + 1} score for ${s.name}`}
                                defaultValue={src === "manual" ? (sc ?? "") : ""}
                                placeholder={sc === null ? "" : String(sc)}
                                onBlur={(e) => void updateScore(s.id, i, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                  if (e.key === "Escape") setEditing(null);
                                }}
                                className="w-14 rounded-md border-2 border-primary px-1 text-center font-semibold"
                              />
                            ) : (
                              <button
                                type="button"
                                title={
                                  src === "sheet"
                                    ? "From Google Sheet. Click to type over it."
                                    : src === "manual"
                                      ? "Typed in the app"
                                      : "No score yet"
                                }
                                onClick={() => setEditing({ id: s.id, ch: i })}
                                className={cn(
                                  "w-12 rounded py-1 text-sm font-semibold tabular-nums",
                                  scoreTone(sc),
                                  src === "sheet" && "border border-dashed border-current",
                                )}
                              >
                                {sc ?? "—"}
                              </button>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-semibold tabular-nums">{average(s)}%</td>
                      <td
                        className={cn(
                          "p-2 text-center font-semibold tabular-nums",
                          imp >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {imp >= 0 ? "+" : ""}
                        {imp}%
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {weakTopics(s).map((c) => (
                            <span
                              key={c.id}
                              className="rounded bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive"
                            >
                              Ch{c.id} {c.short}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <AddStudentForm />
      </TeacherOnly>
    </AppShell>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function AddStudentForm() {
  const { refresh } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Panel
      className="mt-6"
      title="Add a student"
      description="Most students are added automatically by the Google Sheet sync."
    >
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const { error } = await supabase
              .from("students")
              .insert({ name: name.trim(), email: email.trim().toLowerCase(), math_set: set });
            if (error) throw error;
            await refresh();
            setName("");
            setEmail("");
            toast.success("Student added");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add the student");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="text-sm font-medium">
          Class set
          <select
            aria-label="Class set"
            value={set}
            onChange={(e) => setSet(e.target.value as MathSet)}
            className={cn(control, "mt-1 block py-2")}
          >
            <option>S2M3</option>
            <option>S2M5</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Student name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(control, "mt-1 block py-2")}
          />
        </label>
        <label className="text-sm font-medium">
          School email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(control, "mt-1 block py-2")}
          />
        </label>
        <Button disabled={busy} type="submit">
          <Plus />
          Add student
        </Button>
      </form>
    </Panel>
  );
}
