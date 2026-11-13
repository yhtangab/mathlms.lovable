import { useState } from "react";
import { ITEM_CATEGORIES, percent, termSummary, termsOf, type Assessment } from "@/lib/assessments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { scoreTone } from "@/components/AppShell";
import { Panel } from "@/components/PageParts";
import { cn } from "@/lib/utils";

export function AssessmentReport({ assessments }: { assessments: Assessment[] }) {
  const terms = termsOf(
    assessments.filter((a) => a.kind === "item" && (a.score !== null || a.absent)),
  );
  const [term, setTerm] = useState(terms.at(-1) ?? 1);
  if (!assessments.length) {
    return (
      <Panel title="Assessment record">
        <p className="text-sm text-muted-foreground">No assessment marks have been released yet.</p>
      </Panel>
    );
  }
  const { parts, coursework200 } = termSummary(assessments, term);
  const items = assessments
    .filter((a) => a.term === term && a.kind === "item")
    .sort((a, b) => a.position - b.position);
  const cats = ITEM_CATEGORIES.filter((c) => items.some((i) => i.category === c.id));
  return (
    <Panel
      title="Assessment record"
      description="Weighted coursework from the class mark sheet"
      actions={
        terms.length > 1 ? (
          <div className="flex rounded-md border border-border p-0.5">
            {terms.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTerm(t)}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-semibold",
                  t === term
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Term {t}
              </button>
            ))}
          </div>
        ) : null
      }
    >
      <div className="grid gap-4 sm:grid-cols-[190px_minmax(0,1fr)]">
        <div className="rounded-md border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Term {term} coursework</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">
            {coursework200}
            <span className="text-base font-normal text-muted-foreground"> / 200</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Homework 30%, short quizzes 20%, chapter quizzes 30%, mock 10%, daily work 10%
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {parts.map((p) => (
            <li key={p.id} className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">{p.label}</p>
              <p className="text-lg font-semibold tabular-nums">
                {p.value ?? "—"}
                <span className="text-xs font-normal text-muted-foreground"> / {p.weight}</span>
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, ((p.value ?? 0) / p.weight) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {cats.length > 0 && (
        <Tabs defaultValue={cats[0]?.id ?? "homework"} key={term} className="mt-5">
          <TabsList className="h-auto flex-wrap">
            {cats.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {cats.map((c) => (
            <TabsContent key={c.id} value={c.id}>
              <ul className="divide-y divide-border">
                {items
                  .filter((i) => i.category === c.id)
                  .map((i) => {
                    const pct = percent(i);
                    return (
                      <li key={i.label} className="flex items-center gap-3 py-2 text-sm">
                        <span className="w-28 shrink-0 font-medium">{i.label}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              pct !== null && pct < 50 ? "bg-destructive" : "bg-success",
                            )}
                            style={{ width: `${pct ?? 0}%` }}
                          />
                        </div>
                        <span className="w-24 text-right tabular-nums text-muted-foreground">
                          {i.absent
                            ? "Absent"
                            : i.score === null
                              ? "Not yet"
                              : `${i.score}${i.full_marks ? ` / ${i.full_marks}` : ""}`}
                        </span>
                        <span
                          className={cn(
                            "w-14 rounded text-center text-xs font-semibold leading-6",
                            scoreTone(pct),
                          )}
                        >
                          {pct === null ? "—" : `${pct}%`}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Panel>
  );
}
