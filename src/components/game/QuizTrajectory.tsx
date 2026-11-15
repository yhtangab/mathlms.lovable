import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Distribution, PublicStanding, QuizResult } from "@/lib/gamification/types";
import { cn } from "@/lib/utils";

interface Point {
  label: string;
  you: number | null;
  set: number | null;
  improved: boolean;
  rank: string;
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
  payload?: Point;
}

/** Draws each point; a rocket marks a Chapter Quiz at least 15 points up on the last one. */
function renderDot(props: DotProps) {
  const { cx, cy, index = 0, payload } = props;
  if (cx === undefined || cy === undefined || Number.isNaN(cx) || Number.isNaN(cy) || !payload) {
    return <g key={`dot-${index}`} />;
  }
  return (
    <g key={`dot-${index}`}>
      <circle
        cx={cx}
        cy={cy}
        r={payload.improved ? 6 : 4}
        fill="var(--primary)"
        stroke="var(--card)"
        strokeWidth={2}
      />
      {payload.improved ? (
        <text x={cx} y={cy - 12} textAnchor="middle" fontSize={16}>
          🚀
        </text>
      ) : null}
    </g>
  );
}

/** The student's quiz percentages over time, with the set average and rank badges. */
export function QuizTrajectory({
  quizzes,
  distributions,
  standings,
}: {
  quizzes: QuizResult[];
  distributions: Distribution[];
  standings: PublicStanding[];
}) {
  const ordered = [...quizzes].sort((a, b) => a.term - b.term || a.position - b.position);
  if (ordered.length === 0) {
    return <p className="text-sm text-muted-foreground">No quiz marks yet.</p>;
  }
  const average = new Map(distributions.map((d) => [d.itemId, d.mean]));
  const rank = new Map(standings.map((s) => [s.quizId, s]));
  const data: Point[] = ordered.map((q) => ({
    label: q.label,
    you: q.percent === null ? null : Math.round(q.percent),
    set: average.get(q.quizId) ?? null,
    improved: q.isMostImproved,
    rank: rank.get(q.quizId)?.display ?? "—",
  }));
  const rockets = ordered.filter((q) => q.isMostImproved);

  return (
    <div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 24, right: 16, bottom: 4, left: -16 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Line
              type="monotone"
              name="Set average"
              dataKey="set"
              stroke="var(--muted-foreground)"
              strokeDasharray="5 4"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              name="You"
              dataKey="you"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={renderDot}
              activeDot={{ r: 7 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {rockets.length > 0 ? (
        <p className="mt-2 text-sm font-semibold">
          🚀 Most improved: {rockets.map((q) => q.label).join(", ")}
        </p>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-bold text-muted-foreground">Your rank in each quiz</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {data.map((p) => (
            <li
              key={p.label}
              className={cn(
                "flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-xs font-bold",
                p.rank.startsWith("#")
                  ? "border-primary/40 bg-primary/10 text-primary-deep"
                  : "border-border text-muted-foreground",
              )}
            >
              {p.label}
              <span className={cn(p.rank.startsWith("#") && "text-foreground")}>{p.rank}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Ranks 1 to 10 are shown in full. Below 10th you see 10+.
        </p>
      </div>
    </div>
  );
}
