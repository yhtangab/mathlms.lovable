import { TIER_NAMES, type Tier } from "@/lib/gamification/badges";
import { cn } from "@/lib/utils";

/** Fill and edge for each tier, from the theme tokens. */
const TIER_COLORS: Record<Tier, { fill: string; edge: string; shine: string }> = {
  0: { fill: "var(--muted)", edge: "var(--border)", shine: "var(--card)" },
  1: { fill: "var(--bronze)", edge: "var(--flame-deep)", shine: "var(--gold)" },
  2: { fill: "var(--silver)", edge: "var(--muted-foreground)", shine: "var(--card)" },
  3: { fill: "var(--gold)", edge: "var(--gold-deep)", shine: "var(--card)" },
  4: { fill: "var(--sky)", edge: "var(--grape)", shine: "var(--card)" },
};

/** A shield-shaped badge in its tier colour, with the badge emoji in the middle. */
export function BadgeIcon({
  emoji,
  tier,
  size = 96,
  label,
}: {
  emoji: string;
  tier: Tier;
  size?: number;
  /** Shown on hover. Defaults to the tier name. */
  label?: string;
}) {
  const c = TIER_COLORS[tier];
  const id = `badge-shine-${tier}`;
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        tier === 4 && "motion-safe:animate-pulse",
      )}
      style={{ width: size, height: size }}
      title={label ?? TIER_NAMES[tier]}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden="true"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c.shine} stopOpacity="0.7" />
            <stop offset="0.45" stopColor={c.shine} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M50 4 L88 18 L88 50 C88 72 72 88 50 96 C28 88 12 72 12 50 L12 18 Z"
          fill={c.fill}
          stroke={c.edge}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M50 12 L80 23 L80 50 C80 67 68 80 50 87 C32 80 20 67 20 50 L20 23 Z"
          fill={`url(#${id})`}
        />
        {tier === 4 ? (
          <g fill="var(--card)">
            <path d="M22 26 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 z" opacity="0.9" />
            <path d="M74 66 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 z" opacity="0.8" />
          </g>
        ) : null}
      </svg>
      <span
        className={cn("relative leading-none", tier === 0 && "opacity-40 grayscale")}
        style={{ fontSize: size * 0.38 }}
      >
        {emoji}
      </span>
    </span>
  );
}
