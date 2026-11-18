import type { Tone } from "@/lib/tones";
import type { GameProfile, RadarAxis, Strand, Unlocks } from "./types";

/* ------------------------------------------------------------------ Avatars */

export interface AvatarDef {
  id: string;
  name: string;
  emoji: string;
  tone: Tone;
}

/** Every avatar is free. Avatars sold in the Shop can be added here later with an unlock rule. */
export const AVATARS: AvatarDef[] = [
  { id: "avatar-owl", name: "Math Wizard Owl", emoji: "🦉", tone: "grape" },
  { id: "avatar-shiba", name: "Cyber Shiba", emoji: "🐕", tone: "sky" },
  { id: "avatar-fox", name: "Geometry Fox", emoji: "🦊", tone: "flame" },
  { id: "avatar-cat", name: "Einstein Cat", emoji: "🐱", tone: "gold" },
  { id: "avatar-robot", name: "Pi Robot", emoji: "🤖", tone: "blue" },
  { id: "avatar-astronaut", name: "Calculus Astronaut", emoji: "🧑‍🚀", tone: "grape" },
  { id: "avatar-panda", name: "Prime Panda", emoji: "🐼", tone: "green" },
  { id: "avatar-penguin", name: "Proof Penguin", emoji: "🐧", tone: "sky" },
  { id: "avatar-dragon", name: "Fractal Dragon", emoji: "🐉", tone: "green" },
  { id: "avatar-octopus", name: "Octagon Octopus", emoji: "🐙", tone: "berry" },
];

export const DEFAULT_AVATAR_ID = "avatar-owl";

export function avatarById(id: string | null | undefined): AvatarDef {
  return (
    AVATARS.find((a) => a.id === id) ??
    AVATARS[0] ?? {
      id: DEFAULT_AVATAR_ID,
      name: "Math Wizard Owl",
      emoji: "🦉",
      tone: "grape",
    }
  );
}

/* ------------------------------------------------------------- Unlock rules */

/** What the unlock rules look at. Worked out from the student's own game profile. */
export interface UnlockContext {
  profile: GameProfile;
  radar: readonly RadarAxis[];
  /** Average quiz percentage for each chapter (index 0 = Chapter 1); null when no quiz yet. */
  chapterAverages: readonly (number | null)[];
}

function strand(ctx: UnlockContext, s: Strand): number | null {
  return ctx.radar.find((a) => a.strand === s)?.mine ?? null;
}

function bestSettledRank(ctx: UnlockContext): number | null {
  const ranks = ctx.profile.standings
    .filter((s) => !s.provisional && s.rank !== null)
    .map((s) => s.rank ?? 99);
  return ranks.length ? Math.min(...ranks) : null;
}

const hasMostImproved = (ctx: UnlockContext) =>
  ctx.profile.quizHistory.some((q) => q.isMostImproved);

/* -------------------------------------------------------------------- Frames */

export type FrameStyle =
  | "default"
  | "gold"
  | "neon"
  | "prism"
  | "poly"
  | "orbit"
  | "spark"
  | "wave"
  | "comet"
  | "aurora"
  | "halo";

export const FRAME_STYLES: readonly FrameStyle[] = ["default", "gold", "neon", "prism", "poly"];

export function isFrameStyle(value: string | null | undefined): value is FrameStyle {
  return FRAME_STYLES.some((style) => style === value);
}

export interface FrameDef {
  id: string;
  name: string;
  style: FrameStyle;
  /** How to unlock it, shown to the student. */
  requirement: string;
  isUnlocked: (ctx: UnlockContext) => boolean;
}

export const DEFAULT_FRAME_ID = "frame-default";

export const FRAMES: FrameDef[] = [
  {
    id: DEFAULT_FRAME_ID,
    name: "Classic",
    style: "default",
    requirement: "Everyone has this frame.",
    isUnlocked: () => true,
  },
  {
    id: "frame-gold",
    name: "Golden Compass",
    style: "gold",
    requirement: "Reach Level 2 (1,000 EXP), or buy it in the Shop.",
    isUnlocked: (ctx) => ctx.profile.level >= 2,
  },
  {
    id: "frame-neon",
    name: "Calculus Master Neon",
    style: "neon",
    requirement: "Finish in the top 3 of any quiz in your set, or buy it in the Shop.",
    isUnlocked: (ctx) => (bestSettledRank(ctx) ?? 99) <= 3,
  },
  {
    id: "frame-prism",
    name: "Prism Rainbow",
    style: "prism",
    requirement: "Win a Most Improved award (+15 points on a chapter quiz).",
    isUnlocked: hasMostImproved,
  },
  {
    id: "frame-poly",
    name: "3D Polyhedron",
    style: "poly",
    requirement: "Hand in 20 pieces of homework in a row.",
    isUnlocked: (ctx) => ctx.profile.bestHomeworkStreak >= 20,
  },
  {
    id: "frame-orbit",
    name: "Orbit Ring",
    style: "orbit",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "frame-spark",
    name: "Spark Ring",
    style: "spark",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "frame-wave",
    name: "Wave Ring",
    style: "wave",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "frame-comet",
    name: "Comet Ring",
    style: "comet",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "frame-aurora",
    name: "Aurora Ring",
    style: "aurora",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
  {
    id: "frame-halo",
    name: "Halo Ring",
    style: "halo",
    requirement: "Buy it in the Shop.",
    isUnlocked: () => false,
  },
];

export function frameById(id: string | null | undefined): FrameDef {
  return (
    FRAMES.find((f) => f.id === id) ??
    FRAMES[0] ?? {
      id: DEFAULT_FRAME_ID,
      name: "Classic",
      style: "default",
      requirement: "",
      isUnlocked: () => true,
    }
  );
}

/* -------------------------------------------------------------------- Titles */

export type TitleMotion = "none" | "shimmer" | "glow" | "bounce" | "float" | "flash";

export interface TitleDef {
  id: string;
  label: string;
  requirement: string;
  motion: TitleMotion;
  isUnlocked: (ctx: UnlockContext) => boolean;
}

export const TITLES: TitleDef[] = [
  {
    id: "title-pythagoras",
    label: "Pythagoras' Heir",
    requirement: "Come 1st in any quiz in your set.",
    motion: "none",
    isUnlocked: (ctx) => bestSettledRank(ctx) === 1,
  },
  {
    id: "title-algebra-ace",
    label: "Algebra Ace",
    requirement: "Average 80% or more in Number & Algebra quizzes.",
    motion: "none",
    isUnlocked: (ctx) => (strand(ctx, "number_algebra") ?? 0) >= 80,
  },
  {
    id: "title-factor-finder",
    label: "Factor Finder",
    requirement: "Average 80% or more in Chapter 2 quizzes.",
    motion: "none",
    isUnlocked: (ctx) => (ctx.chapterAverages[1] ?? 0) >= 80,
  },
  {
    id: "title-angle-hunter",
    label: "Angle Hunter",
    requirement: "Average 80% or more in Geometry quizzes.",
    motion: "none",
    isUnlocked: (ctx) => (strand(ctx, "geometry") ?? 0) >= 80,
  },
  {
    id: "title-data-detective",
    label: "Data Detective",
    requirement: "Average 80% or more in Data Handling quizzes.",
    motion: "none",
    isUnlocked: (ctx) => (strand(ctx, "data_handling") ?? 0) >= 80,
  },
  {
    id: "title-homework-hero",
    label: "Homework Hero",
    requirement: "Hand in 10 pieces of homework in a row.",
    motion: "none",
    isUnlocked: (ctx) => ctx.profile.bestHomeworkStreak >= 10,
  },
  {
    id: "title-comeback-kid",
    label: "Comeback Kid",
    requirement: "Win a Most Improved award.",
    motion: "none",
    isUnlocked: hasMostImproved,
  },
  {
    id: "title-curious-mind",
    label: "Curious Mind",
    requirement: "Answer or take part in class 10 times.",
    motion: "none",
    isUnlocked: (ctx) => ctx.profile.activeVoiceCount >= 10,
  },
  {
    id: "title-rising-star",
    label: "Rising Star",
    requirement: "Reach Level 2 (1,000 EXP).",
    motion: "none",
    isUnlocked: (ctx) => ctx.profile.level >= 2,
  },
  {
    id: "title-formula-fan",
    label: "Formula Fanatic",
    requirement: "Buy it in the Shop.",
    motion: "shimmer",
    isUnlocked: () => false,
  },
  {
    id: "title-graph-guru",
    label: "Graph Guru",
    requirement: "Buy it in the Shop.",
    motion: "glow",
    isUnlocked: () => false,
  },
  {
    id: "title-sigma-scholar",
    label: "Sigma Scholar",
    requirement: "Buy it in the Shop.",
    motion: "bounce",
    isUnlocked: () => false,
  },
  {
    id: "title-equation-explorer",
    label: "Equation Explorer",
    requirement: "Buy it in the Shop.",
    motion: "float",
    isUnlocked: () => false,
  },
  {
    id: "title-pi-pioneer",
    label: "Pi Pioneer",
    requirement: "Buy it in the Shop.",
    motion: "flash",
    isUnlocked: () => false,
  },
  {
    id: "title-vector-voyager",
    label: "Vector Voyager",
    requirement: "Buy it in the Shop.",
    motion: "shimmer",
    isUnlocked: () => false,
  },
  {
    id: "title-proof-pilot",
    label: "Proof Pilot",
    requirement: "Buy it in the Shop.",
    motion: "glow",
    isUnlocked: () => false,
  },
  {
    id: "title-radian-ranger",
    label: "Radian Ranger",
    requirement: "Buy it in the Shop.",
    motion: "float",
    isUnlocked: () => false,
  },
];

/** Finds a title by its id, or by its label (older sandbox data stores the label). */
export function titleById(id: string | null | undefined): TitleDef | null {
  if (!id) return null;
  return TITLES.find((t) => t.id === id || t.label === id) ?? null;
}

/** A Shop row the look helpers can read. Extra columns are missing until 0015 is run. */
export interface ShopLook {
  id?: string;
  name: string;
  grants: readonly string[];
  kind?: string;
  style?: string | null;
  ink?: string;
  paper?: string;
  emoji?: string;
  active?: boolean;
}

export function itemKind(item: ShopLook): "frame" | "title" {
  if (item.kind === "title" || item.kind === "frame") return item.kind;
  return item.grants.some((g) => g.startsWith("title-")) ? "title" : "frame";
}

export function lookForGrant(items: readonly ShopLook[], grantId: string): ShopLook | null {
  return items.find((item) => item.grants.includes(grantId)) ?? null;
}

/** A Shop frame uses the style the teacher picked. Other frames use the built-in look. */
export function frameFromLooks(
  id: string | null | undefined,
  items: readonly ShopLook[],
): FrameDef {
  const look = id ? lookForGrant(items, id) : null;
  if (look && itemKind(look) === "frame" && isFrameStyle(look.style)) {
    return {
      id: id ?? DEFAULT_FRAME_ID,
      name: look.name,
      style: look.style,
      requirement: "Buy it in the Shop.",
      isUnlocked: () => false,
    };
  }
  const built = FRAMES.find((f) => f.id === id);
  if (built) return built;
  return (
    FRAMES[0] ?? {
      id: DEFAULT_FRAME_ID,
      name: "Classic",
      style: "default",
      requirement: "",
      isUnlocked: () => true,
    }
  );
}

export function titleAppearance(
  id: string | null | undefined,
  items: readonly ShopLook[],
): { label: string; motion: TitleMotion; ink?: string; paper?: string } | null {
  if (!id) return null;
  const motion = titleById(id)?.motion ?? "none";
  const look = lookForGrant(items, id);
  if (look && itemKind(look) === "title") {
    return {
      label: look.name,
      motion,
      ...(look.ink ? { ink: look.ink } : {}),
      ...(look.paper ? { paper: look.paper } : {}),
    };
  }
  const title = titleById(id);
  return title ? { label: title.label, motion: title.motion } : null;
}

/** Achievement unlocks plus everything the student has bought in the Shop. */
export function mergeUnlocks(earned: Unlocks | null, boughtGrants: readonly string[]): Unlocks {
  const frames = new Set([DEFAULT_FRAME_ID, ...(earned?.frames ?? [])]);
  const titles = new Set(earned?.titles ?? []);
  for (const g of boughtGrants) {
    if (g.startsWith("frame-")) frames.add(g);
    if (g.startsWith("title-")) titles.add(g);
  }
  return { frames: [...frames], titles: [...titles] };
}

export function computeUnlocks(ctx: UnlockContext): Unlocks {
  return {
    frames: FRAMES.filter((f) => f.isUnlocked(ctx)).map((f) => f.id),
    titles: TITLES.filter((t) => t.isUnlocked(ctx)).map((t) => t.id),
  };
}

/* ------------------------------------------------------- Strands and chapters */

export const STRANDS: { id: Strand; label: string }[] = [
  { id: "number_algebra", label: "Number & Algebra" },
  { id: "geometry", label: "Geometry" },
  { id: "mensuration", label: "Mensuration" },
  { id: "trigonometry", label: "Trigonometry" },
  { id: "data_handling", label: "Data Handling" },
  { id: "attitude", label: "Learning Attitude" },
];

/**
 * Which radar area each chapter's quizzes count towards (OUP S2, Chapters 1–7).
 * Mensuration and Trigonometry have no S2 chapter in this list yet, so they stay empty
 * until those chapters are added.
 */
export function strandOfChapter(chapter: number): { id: Strand; label: string } | null {
  const id = CHAPTER_STRANDS[chapter];
  if (!id) return null;
  return STRANDS.find((s) => s.id === id) ?? null;
}

export const CHAPTER_STRANDS: Record<number, Strand> = {
  1: "number_algebra",
  2: "number_algebra",
  3: "number_algebra",
  4: "number_algebra",
  5: "number_algebra",
  6: "geometry",
  7: "data_handling",
};

export interface Objective {
  id: string;
  chapter: number;
  text: string;
}

/** "I can…" statements for each chapter's self-check. */
export const CHAPTER_OBJECTIVES: Objective[] = [
  {
    id: "ch1-round",
    chapter: 1,
    text: "I can round numbers to decimal places and significant figures.",
  },
  { id: "ch1-scientific", chapter: 1, text: "I can write numbers in scientific notation." },
  { id: "ch1-estimate", chapter: 1, text: "I can estimate answers by rounding." },
  { id: "ch1-limits", chapter: 1, text: "I can find the upper and lower limits of a measurement." },
  { id: "ch1-errors", chapter: 1, text: "I can find absolute, relative and percentage errors." },
  {
    id: "ch2-terms",
    chapter: 2,
    text: "I can name the terms, degree and coefficients of a polynomial.",
  },
  { id: "ch2-add", chapter: 2, text: "I can add and subtract polynomials." },
  { id: "ch2-multiply", chapter: 2, text: "I can multiply polynomials." },
  { id: "ch2-common", chapter: 2, text: "I can factorize by taking out common factors." },
  { id: "ch2-grouping", chapter: 2, text: "I can factorize by grouping terms." },
  { id: "ch3-tell", chapter: 3, text: "I can tell an identity from an equation." },
  {
    id: "ch3-expand",
    chapter: 3,
    text: "I can expand using the difference of squares and perfect square identities.",
  },
  { id: "ch3-factorize", chapter: 3, text: "I can factorize using identities." },
  { id: "ch3-calculate", chapter: 3, text: "I can use identities to make calculations easier." },
  { id: "ch4-simplify", chapter: 4, text: "I can simplify algebraic fractions." },
  { id: "ch4-multiply", chapter: 4, text: "I can multiply and divide algebraic fractions." },
  {
    id: "ch4-add",
    chapter: 4,
    text: "I can add and subtract algebraic fractions with different denominators.",
  },
  { id: "ch4-substitute", chapter: 4, text: "I can substitute values into a formula." },
  { id: "ch4-subject", chapter: 4, text: "I can change the subject of a formula." },
  {
    id: "ch5-graph",
    chapter: 5,
    text: "I can draw the graph of a linear equation in two unknowns.",
  },
  { id: "ch5-graphical", chapter: 5, text: "I can solve simultaneous equations with graphs." },
  {
    id: "ch5-substitution",
    chapter: 5,
    text: "I can solve simultaneous equations by substitution.",
  },
  { id: "ch5-elimination", chapter: 5, text: "I can solve simultaneous equations by elimination." },
  {
    id: "ch5-problems",
    chapter: 5,
    text: "I can set up and solve word problems with two unknowns.",
  },
  { id: "ch6-angles", chapter: 6, text: "I can use corresponding, alternate and interior angles." },
  { id: "ch6-parallel", chapter: 6, text: "I can prove that two lines are parallel." },
  { id: "ch6-polygon", chapter: 6, text: "I can find interior and exterior angles of polygons." },
  {
    id: "ch6-reasons",
    chapter: 6,
    text: "I can give reasons for each step in a geometry problem.",
  },
  { id: "ch7-stem", chapter: 7, text: "I can draw and read stem-and-leaf diagrams." },
  { id: "ch7-polygon", chapter: 7, text: "I can draw frequency polygons and frequency curves." },
  { id: "ch7-cumulative", chapter: 7, text: "I can draw and read cumulative frequency polygons." },
  { id: "ch7-choose", chapter: 7, text: "I can choose a suitable diagram for a set of data." },
  { id: "ch7-misleading", chapter: 7, text: "I can spot misleading graphs." },
];

export function objectivesFor(chapter: number): Objective[] {
  return CHAPTER_OBJECTIVES.filter((o) => o.chapter === chapter);
}

/* ------------------------------------------------------ Chapter completion */

export const COMPLETION_WEIGHTS = { videos: 40, selfCheck: 40, chapterQuiz: 20 } as const;

export interface CompletionInput {
  videosTotal: number;
  videosWatched: number;
  objectivesTotal: number;
  objectivesChecked: number;
  chapterQuizDone: boolean;
}

export interface Completion {
  /** 0 to 100. */
  percent: number;
  parts: {
    id: "videos" | "selfCheck" | "chapterQuiz";
    label: string;
    done: number;
    total: number;
    weight: number;
  }[];
}

/**
 * Videos 40%, self-check 40%, chapter quiz 20%. When a chapter has no videos yet, the other
 * two parts share the whole 100% so the bar can still reach the end.
 */
export function chapterCompletion(input: CompletionInput): Completion {
  const parts = [
    {
      id: "videos" as const,
      label: "Videos",
      done: Math.min(input.videosWatched, input.videosTotal),
      total: input.videosTotal,
      weight: COMPLETION_WEIGHTS.videos,
    },
    {
      id: "selfCheck" as const,
      label: "Self-check",
      done: Math.min(input.objectivesChecked, input.objectivesTotal),
      total: input.objectivesTotal,
      weight: COMPLETION_WEIGHTS.selfCheck,
    },
    {
      id: "chapterQuiz" as const,
      label: "Chapter quiz",
      done: input.chapterQuizDone ? 1 : 0,
      total: 1,
      weight: COMPLETION_WEIGHTS.chapterQuiz,
    },
  ].filter((p) => p.total > 0);
  const totalWeight = parts.reduce((t, p) => t + p.weight, 0);
  const earned = parts.reduce((t, p) => t + (p.done / p.total) * p.weight, 0);
  return { percent: totalWeight ? Math.round((earned / totalWeight) * 100) : 0, parts };
}

/** Mastery stars from the chapter score: 50% one star, 70% two, 85% three. */
export function chapterStars(score: number | null): 0 | 1 | 2 | 3 {
  if (score === null) return 0;
  if (score >= 85) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}
