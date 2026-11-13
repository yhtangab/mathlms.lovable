import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { FileUp, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { saveScores } from "@/lib/math.functions";
import { parseScoreCsv, scoreSchema } from "@/lib/grade-rules";
import { Button } from "@/components/ui/button";
import { LessonMarks } from "@/components/LessonMarks";
import { SheetGradebook } from "@/components/SheetGradebook";
import { toast } from "sonner";
import { AppShell, TeacherOnly, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, average, completion, formRank, improvement, type MathSet, type Student, weakTopics } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/teacher")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Teacher Analytics — HLC Math" },
      { name: "description", content: "Compare S2M3 and S2M5 scores, completion and weaker topics." },
      { property: "og:title", content: "Teacher Analytics — HLC Math" },
      { property: "og:description", content: "Math class analytics and master score table." },
    ],
  }),
  component: Teacher,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];

function Teacher() {
  const { students, refresh } = useApp();
  const save = useServerFn(saveScores);
  const [q, setQ] = useState("");
  const [setF, setSetF] = useState<"All" | MathSet>("All");
  const [editing, setEditing] = useState<{ id: string; ch: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stats = SETS.map((set) => {
    const list = students.filter((s) => s.set === set);
    const chAvg = CHAPTERS.map((_, i) => {
      const v = list.map((s) => s.scores[i]).filter((x) => x !== null) as number[];
      return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
    });
    const weakest = chAvg
      .map((v, i) => ({ v, c: CHAPTERS[i] }))
      .filter((x): x is { v: number; c: (typeof CHAPTERS)[number] } => x.v !== null && Boolean(x.c))
      .sort((a, b) => (a.v as number) - (b.v as number))
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

  const updateScore = async (id: string, ch: number, val: string) => {
    try { await save({ data: [{ student_id: id, chapter: ch + 1, score: scoreSchema.parse(val === '' ? null : Number(val)) }] }); await refresh(); setEditing(null); toast.success('Score saved'); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save score'); }
  };
  const importCsv = async (file: File) => {
    try {
      const map = parseScoreCsv(await file.text());
      const unknown = [...map.keys()].filter(email => !students.some(s => s.email === email));
      if (unknown.length) throw new Error(`${unknown.length} email(s) are not in the roster. Add students first.`);
      const data = students.flatMap(s => { const scores = map.get(s.email); return scores ? scores.map((score, i) => ({ student_id: s.id, chapter: i + 1, score })) : []; });
      if (!data.length) throw new Error('No student scores found');
      await save({ data }); await refresh(); toast.success(`Saved scores for ${map.size} students`);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Import failed'); }
  };

  return (
    <AppShell><TeacherOnly>
      <h1 className="text-3xl font-bold">Class Analytics</h1>
      <SheetGradebook />
      <LessonMarks />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {stats.map((st, k) => (
          <div key={st.set} className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{st.set}</h2>
              <span className="text-sm font-bold text-muted-foreground">{st.n} students</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className={cn("rounded-2xl p-3", k === 0 ? "bg-primary text-primary-foreground" : "bg-success text-primary-foreground")}>
                <p className="text-xs font-bold opacity-90">Average score</p>
                <p className="font-display text-3xl font-bold">{st.avg}%</p>
              </div>
              <div className="rounded-2xl bg-gold p-3 text-accent-foreground">
                <p className="text-xs font-bold">Completion</p>
                <p className="font-display text-3xl font-bold">{st.comp}%</p>
              </div>
            </div>
            <div className="mt-4 flex h-28 items-end gap-2">
              {st.chAvg.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground">{v ?? "—"}</span>
                  <div
                    className={cn("w-full rounded-t-lg", v !== null && v < 70 ? "bg-destructive/70" : k === 0 ? "bg-primary" : "bg-success")}
                    style={{ height: `${(v ?? 0) * 0.8}px` }}
                  />
                  <span className="text-[10px] font-bold">Ch{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-muted-foreground">Weaker topics:</span>
              {st.weakest.map((w) => (
                <span key={w.c.id} className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-extrabold text-destructive">
                  Ch{w.c.id} {w.c.short} ({w.v}%)
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) importCsv(f);
        }}
        onClick={() => fileRef.current?.click()}
        className="mt-6 flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center hover:bg-primary/10"
      >
        <FileUp className="h-8 w-8 text-primary" />
        <p className="mt-2 font-display text-lg font-bold">Drop a score CSV here or click to browse</p>
        <p className="text-sm font-semibold text-muted-foreground">Format: email,ch1,ch2,ch3,ch4,ch5,ch6,ch7 · or click any score below to edit</p>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
      </div>

      <div className="mt-6 rounded-3xl border-2 border-border bg-card p-4 shadow-chunky">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-xl font-bold">Student Master Score Table</h2>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-input px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-32 bg-transparent text-sm font-semibold outline-none" />
          </div>
          <select
            value={setF}
            onChange={(e) => setSetF(e.target.value as "All" | MathSet)}
            className="rounded-2xl border-2 border-input bg-card px-3 py-1.5 text-sm font-bold"
          >
            <option>All</option>
            <option>S2M3</option>
            <option>S2M5</option>
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="text-left text-xs font-extrabold uppercase text-muted-foreground">
                <th className="p-2">Rank</th>
                <th className="p-2">Student</th>
                <th className="p-2">Set</th>
                {CHAPTERS.map((c) => (
                  <th key={c.id} className="p-2 text-center">Ch{c.id}</th>
                ))}
                <th className="p-2 text-center">Avg</th>
                <th className="p-2 text-center">Improve</th>
                <th className="p-2">Weaker topics</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const imp = improvement(s);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-2 font-display font-bold">#{formRank(s, students)}</td>
                    <td className="p-2">
                      <p className="font-bold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="p-2 font-bold">{s.set}</td>
                    {s.scores.map((sc, i) => (
                      <td key={i} className="p-1 text-center">
                        {editing?.id === s.id && editing.ch === i ? (
                          <input
                            autoFocus
                            type="number"
                            defaultValue={sc ?? ""}
                            onBlur={(e) => updateScore(s.id, i, e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                            className="w-14 rounded-lg border-2 border-primary px-1 text-center font-bold"
                          />
                        ) : (
                          <Button variant="ghost" onClick={() => setEditing({ id: s.id, ch: i })} className={cn("w-12 rounded-lg py-1 font-extrabold", scoreTone(sc))}>
                            {sc ?? "—"}
                          </Button>
                        )}
                      </td>
                    ))}
                    <td className="p-2 text-center font-display font-bold">{average(s)}%</td>
                    <td className={cn("p-2 text-center font-extrabold", imp >= 0 ? "text-success" : "text-destructive")}>
                      {imp >= 0 ? "+" : ""}
                      {imp}%
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {weakTopics(s).map((c) => (
                          <span key={c.id} className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-extrabold text-destructive">
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
      </div>
    </TeacherOnly></AppShell>
  );
}
