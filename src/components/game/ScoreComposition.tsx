import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { termSummary, type Assessment } from "@/lib/assessments";

/** One colour per coursework part, from the theme tokens. */
const PART_COLORS: Record<string, string> = {
  homework: "var(--primary)",
  short_quiz: "var(--success)",
  chapter_quiz: "var(--grape)",
  mock: "var(--sky)",
  daily: "var(--flame)",
};

/** Donut of how the coursework mark out of 200 is made up, part by part. */
export function ScoreComposition({
  assessments,
  term,
}: {
  assessments: Assessment[];
  term: 1 | 2;
}) {
  const { parts, coursework200 } = termSummary(assessments, term);
  const hasMarks = parts.some((p) => p.value !== null);
  const earned = parts.map((p) => ({
    id: p.id,
    label: p.label,
    value: Math.round((p.value ?? 0) * 2 * 10) / 10,
    max: p.weight * 2,
  }));
  const missing = Math.max(0, Math.round((200 - coursework200) * 10) / 10);
  const data = [
    ...earned
      .filter((p) => p.value > 0)
      .map((p) => ({
        name: p.label,
        value: p.value,
        color: PART_COLORS[p.id] ?? "var(--primary)",
      })),
    ...(missing > 0 ? [{ name: "Not earned yet", value: missing, color: "var(--muted)" }] : []),
  ];

  if (!hasMarks) {
    return <p className="text-sm text-muted-foreground">No Term {term} coursework marks yet.</p>;
  }

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
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
            <p className="text-2xl font-bold tabular-nums">{coursework200}</p>
            <p className="text-xs font-semibold text-muted-foreground">/ 200</p>
          </div>
        </div>
      </div>
      <ul className="space-y-2">
        {earned.map((p) => (
          <li key={p.id} className="text-sm">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ background: PART_COLORS[p.id] ?? "var(--primary)" }}
              />
              <span className="flex-1 font-semibold">{p.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {p.value} / {p.max}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (p.value / p.max) * 100)}%`,
                  background: PART_COLORS[p.id] ?? "var(--primary)",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
