import { useState } from "react";
import type { Distribution, DistributionKind } from "@/lib/gamification/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: DistributionKind | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "SQ", label: "Short quizzes" },
  { id: "CQ", label: "Chapter quizzes" },
  { id: "TT", label: "Term test" },
  { id: "CA", label: "CA" },
  { id: "EXAM", label: "Exam" },
  { id: "TOTAL", label: "Term total" },
];

const pct = (n: number) => `${Math.max(0, Math.min(100, n))}%`;

/** One box-and-whisker row per assessment, with a pin for the student's own mark. */
export function ClassBoxPlot({
  distributions,
  set,
}: {
  distributions: Distribution[];
  set: string;
}) {
  const [filter, setFilter] = useState<DistributionKind | "ALL">("ALL");
  const shown = distributions.filter((d) => filter === "ALL" || d.kind === filter);
  const available = FILTERS.filter(
    (f) => f.id === "ALL" || distributions.some((d) => d.kind === f.id),
  );

  if (distributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        The class spread appears once at least 5 students in {set} have a mark.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {available.map((f) => (
          <button
            type="button"
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[104px_minmax(0,1fr)] gap-x-3 text-[10px] font-semibold text-muted-foreground">
        <span />
        <div className="relative h-4">
          {[0, 25, 50, 75, 100].map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: pct(t) }}>
              {t}%
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-1 space-y-3">
        {shown.map((d) => (
          <li key={d.itemId} className="grid grid-cols-[104px_minmax(0,1fr)] items-center gap-x-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{d.label}</p>
              <p className="text-[11px] text-muted-foreground">
                {d.mine === null ? "Not sat" : `You ${Math.round(d.mine)}%`}
              </p>
            </div>
            <div
              className="relative h-9 rounded-md bg-muted/50"
              title={`Lowest ${d.min}%, lower quarter ${d.q1}%, median ${d.median}%, upper quarter ${d.q3}%, highest ${d.max}% (${d.count} students)`}
            >
              {[25, 50, 75].map((t) => (
                <span
                  key={t}
                  aria-hidden="true"
                  className="absolute inset-y-0 w-px bg-border"
                  style={{ left: pct(t) }}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-muted-foreground/50"
                style={{ left: pct(d.min), width: pct(d.max - d.min) }}
              />
              <span
                aria-hidden="true"
                className="absolute top-2.5 bottom-2.5 w-0.5 bg-muted-foreground/70"
                style={{ left: pct(d.min) }}
              />
              <span
                aria-hidden="true"
                className="absolute top-2.5 bottom-2.5 w-0.5 bg-muted-foreground/70"
                style={{ left: pct(d.max) }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 rounded border-2 border-primary/60 bg-primary/15"
                style={{ left: pct(d.q1), width: pct(Math.max(0.5, d.q3 - d.q1)) }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 w-1 -translate-x-1/2 rounded bg-primary-deep"
                style={{ left: pct(d.median) }}
              />
              {d.mine !== null ? (
                <span
                  className="absolute -top-2.5 z-10 -translate-x-1/2"
                  style={{ left: pct(d.mine) }}
                >
                  <span className="relative flex">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-flame/50 motion-safe:animate-ping"
                    />
                    <span className="relative whitespace-nowrap rounded-full bg-flame px-1.5 py-0.5 text-[10px] font-bold text-white shadow-chunky-flame">
                      📍 You
                    </span>
                  </span>
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        The box is the middle half of {set}; the thick line is the median and the whiskers reach the
        lowest and highest marks. Names are never shown.
      </p>
    </div>
  );
}
