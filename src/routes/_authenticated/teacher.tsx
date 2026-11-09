import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { FileUp, Search } from "lucide-react";
import { toast } from "sonner";
import { AppShell, scoreTone } from "@/components/AppShell";
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
      { property: "og:description", content: "S2 Math class analytics and master score table." },
    ],
  }),
  component: Teacher,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];

function Teacher() {
  const { students, setStudents } = useApp();
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
      .map((v, i) => ({ v, c: CHAPTERS[i]! }))
      .filter((x) => x.v !== null)
      .sort((a, b) => (a.v as number) - (b.v as number))
      .slice(0, 2);
    return {
      set,
      n: list.length,
      avg: Math.round(list.reduce((a, s) => a + average(s), 0) / list.length),
      comp: Math.round(list.reduce((a, s) => a + completion(s), 0) / list.length),
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

  const updateScore = (id: string, ch: number, val: string) => {
    const n = val === "" ? null : Math.max(0, Math.min(100, Number(val)));
    setStudents(students.map((s) => (s.id === id ? { ...s, scores: s.scores.map((x, i) => (i === ch ? n : x)) } : s)));
    setEditing(null);
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    // Expected: email,ch1,ch2,...,ch7
    let count = 0;
    const map = new Map<string, (number | null)[]>();
    text.split(/\r?\n/).forEach((line) => {
      const [email, ...sc] = line.split(",").map((x) => x.trim());
      if (!email?.includes("@")) return;
      map.set(email.toLowerCase(), CHAPTERS.map((_, i) => (sc[i] ? Number(sc[i]) : null)));
    });
    const next: Student[] = students.map((s) => {
      const r = map.get(s.email);
      if (!r) return s;
      count++;
      return { ...s, scores: r };
    });
    setStudents(next);
    toast.success(`Updated scores for ${count} student${count === 1 ? "" : "s"}`);
  };

  return (
    <AppShell>
      <h1 className="text-3xl font-bold">📊 Class Analytics</h1>

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
                          <button onClick={() => setEditing({ id: s.id, ch: i })} className={cn("w-12 rounded-lg py-1 font-extrabold", scoreTone(sc))}>
                            {sc ?? "—"}
                          </button>
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
    </AppShell>
  );
}
