import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarAxis } from "@/lib/gamification/types";

/** Six-area competency radar: the student against the set average. */
export function CompetencyRadar({ axes }: { axes: RadarAxis[] }) {
  if (axes.length === 0) {
    return <p className="text-sm text-muted-foreground">No quiz marks yet.</p>;
  }
  const data = axes.map((a) => ({
    label: a.label,
    you: a.mine ?? 0,
    set: a.setAverage ?? 0,
  }));
  const empty = axes.filter((a) => a.mine === null).map((a) => a.label);
  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Set average"
              dataKey="set"
              stroke="var(--muted-foreground)"
              fill="var(--muted-foreground)"
              fillOpacity={0.12}
              strokeDasharray="4 3"
            />
            <Radar
              name="You"
              dataKey="you"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Tooltip formatter={(value) => `${value}%`} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {empty.length > 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">
          No marks yet for {empty.join(", ")}, so {empty.length === 1 ? "it shows" : "they show"} 0.
        </p>
      ) : null}
    </div>
  );
}
