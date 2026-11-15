import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { termSummary, type Assessment } from "@/lib/assessments";
import { TERM_WEIGHTS, termResult } from "@/lib/gamification/rules";

/** The three parts of a term result, each out of 200, with their share of the total. */
const PARTS = [
  { key: "tt", label: "Term Test", weight: TERM_WEIGHTS.tt, color: "var(--flame)" },
  { key: "ca", label: "Continuous Assessment", weight: TERM_WEIGHTS.ca, color: "var(--primary)" },
  { key: "exam", label: "Exam", weight: TERM_WEIGHTS.exam, color: "var(--grape)" },
] as const;

/** Colours for the parts inside CA. */
const CA_COLORS: Record<string, string> = {
  homework: "var(--primary)",
  short_quiz: "var(--success)",
  chapter_quiz: "var(--grape)",
  mock: "var(--sky)",
  daily: "var(--flame)",
};

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * How the term's academic score out of 200 is made up: 20% Term Test, 40% Continuous
 * Assessment (TnA2) and 40% Exam (TnA3), plus what makes up the CA.
 */
export function ScoreComposition({
  assessments,
  term,
}: {
  assessments: Assessment[];
  term: 1 | 2;
}) {
  const result = termResult(assessments, term);
  const ca = termSummary(assessments, term);
  const caCode = `T${term}A2`;
  const earned = PARTS.map((p) => {
    const value = result[p.key];
    return {
      ...p,
      value,
      contribution: value === null ? 0 : round1(value * p.weight),
      max: 200 * p.weight,
    };
  });
  const sum = earned.reduce((t, p) => t + p.contribution, 0);
  const data = [
    ...earned
      .filter((p) => p.contribution > 0)
      .map((p) => ({ name: p.label, value: p.contribution, color: p.color })),
    ...(sum < 200
      ? [{ name: "Not earned or not marked yet", value: round1(200 - sum), color: "var(--muted)" }]
      : []),
  ];
  const hasAny = earned.some((p) => p.value !== null);

  if (!hasAny) {
    return <p className="text-sm text-muted-foreground">No Term {term} marks yet.</p>;
  }

  return (
    <div>
      <div className="grid items-center gap-4 sm:grid-cols-[176px_minmax(0,1fr)]">
        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                stroke="var(--card)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} / 200`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-2xl font-bold tabular-nums">{result.total ?? "—"}</p>
              <p className="text-xs font-semibold text-muted-foreground">/ 200</p>
            </div>
          </div>
        </div>
        <ul className="space-y-3">
          {earned.map((p) => (
            <li key={p.key} className="text-sm">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ background: p.color }}
                />
                <span className="flex-1 font-semibold">
                  {p.label}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(p.weight * 100)}%)
                  </span>
                </span>
                <span className="tabular-nums">
                  {p.value === null ? "not yet" : `${p.value} / 200`}
                </span>
              </div>
              <p className="ml-5 text-xs text-muted-foreground">
                Adds {p.contribution} of {p.max} to the total
              </p>
            </li>
          ))}
        </ul>
      </div>
      {ca.parts.some((p) => p.value !== null) ? (
        <div className="mt-5 border-t-2 border-border pt-4">
          <p className="text-xs font-bold text-muted-foreground">Inside your CA ({caCode})</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {ca.parts.map((p) => {
              const value = round1((p.value ?? 0) * 2);
              const max = p.weight * 2;
              return (
                <li key={p.id} className="text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{p.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {p.value === null ? "—" : value} / {max}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (value / max) * 100)}%`,
                        background: CA_COLORS[p.id] ?? "var(--primary)",
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
