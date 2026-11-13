/**
 * Colour tones shared by the navigation rail, page banners, panels and chapter tiles.
 * Class names are written out in full so Tailwind can find them.
 */
export type Tone = "blue" | "green" | "gold" | "flame" | "berry" | "grape" | "sky";

export interface ToneStyle {
  /** Solid fill with readable text and a chunky bottom edge. */
  solid: string;
  /** The same fill without the edge, for small tiles. */
  flat: string;
  /** Pale fill with coloured text, for badges. */
  soft: string;
  /** Coloured text on a white surface. */
  text: string;
  /** Plain fill, for progress bars and small markers. */
  bar: string;
  /** Dimmed fill, for inactive items on the dark navigation rail. */
  dim: string;
}

export const TONES: Record<Tone, ToneStyle> = {
  blue: {
    solid: "bg-primary text-primary-foreground shadow-chunky-primary",
    flat: "bg-primary text-primary-foreground",
    soft: "bg-primary/10 text-primary-deep",
    text: "text-primary",
    bar: "bg-primary",
    dim: "bg-primary/40",
  },
  green: {
    solid: "bg-success text-primary-foreground shadow-chunky-success",
    flat: "bg-success text-primary-foreground",
    soft: "bg-success/15 text-success-deep",
    text: "text-success",
    bar: "bg-success",
    dim: "bg-success/40",
  },
  gold: {
    solid: "bg-gold text-accent-foreground shadow-chunky-gold",
    flat: "bg-gold text-accent-foreground",
    soft: "bg-gold/30 text-gold-deep",
    text: "text-gold-deep",
    bar: "bg-gold",
    dim: "bg-gold/40",
  },
  flame: {
    solid: "bg-flame text-white shadow-chunky-flame",
    flat: "bg-flame text-white",
    soft: "bg-flame/15 text-flame-deep",
    text: "text-flame-deep",
    bar: "bg-flame",
    dim: "bg-flame/40",
  },
  berry: {
    solid: "bg-berry text-white shadow-chunky-berry",
    flat: "bg-berry text-white",
    soft: "bg-berry/15 text-berry-deep",
    text: "text-berry-deep",
    bar: "bg-berry",
    dim: "bg-berry/40",
  },
  grape: {
    solid: "bg-grape text-white shadow-chunky-grape",
    flat: "bg-grape text-white",
    soft: "bg-grape/15 text-grape-deep",
    text: "text-grape-deep",
    bar: "bg-grape",
    dim: "bg-grape/40",
  },
  sky: {
    solid: "bg-sky text-white shadow-chunky-sky",
    flat: "bg-sky text-white",
    soft: "bg-sky/15 text-sky-deep",
    text: "text-sky-deep",
    bar: "bg-sky",
    dim: "bg-sky/40",
  },
};

/** One tone for each of the seven chapters. */
const CHAPTER_TONES: readonly Tone[] = ["blue", "green", "gold", "flame", "berry", "grape", "sky"];

export function chapterTone(chapter: number): Tone {
  const n = CHAPTER_TONES.length;
  const index = (((Math.trunc(chapter) - 1) % n) + n) % n;
  return CHAPTER_TONES[index] ?? "blue";
}

/** Each page has one colour, shared by its link in the navigation and its banner. */
const ROUTE_TONES: readonly (readonly [string, Tone])[] = [
  ["/dashboard", "blue"],
  ["/courses", "green"],
  ["/homework", "flame"],
  ["/awards", "gold"],
  ["/teacher", "grape"],
  ["/activity", "berry"],
  ["/upload", "sky"],
  ["/leaderboard", "blue"],
];

export function toneForPath(pathname: string): Tone {
  for (const [prefix, tone] of ROUTE_TONES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return tone;
  }
  return "blue";
}
