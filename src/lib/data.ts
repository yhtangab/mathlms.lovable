export const CHAPTERS = [
  { id: 1, title: "Approximation and Errors", short: "Approx. & Errors", emoji: "🎯" },
  { id: 2, title: "Operations and Factorization of Polynomials", short: "Polynomials", emoji: "🧩" },
  { id: 3, title: "Identities", short: "Identities", emoji: "🟰" },
  { id: 4, title: "Algebraic Fractions and Formulae", short: "Algebraic Fractions", emoji: "➗" },
  { id: 5, title: "Linear Equations in Two Unknowns", short: "Linear Equations", emoji: "📈" },
  { id: 6, title: "Angles and Parallel Lines (II)", short: "Angles & Parallels", emoji: "📐" },
  { id: 7, title: "Organization and Presentation of Data (II)", short: "Data (II)", emoji: "📊" },
] as const;

import type { Assessment } from "./assessments";

export type MathSet = "S2M3" | "S2M5";

export interface Student {
  id: string;
  userId?: string | null;
  dailyMarks?: number;
  videoMarks?: number;
  completedVideos?: number[];
  assessments?: Assessment[];
  hlcNo?: string | null;
  className?: string;
  classNo?: string;
  name: string;
  email: string;
  set: MathSet;
  scores: (number | null)[]; // 7 chapters, null = not yet attempted
  lastMonthAvg: number;
  lastMonthFormRank: number;
  xp: number;
  streak: number;
}

export function average(s: Student) {
  const done = s.scores.filter((x) => x !== null) as number[];
  return done.length ? Math.round(done.reduce((a, b) => a + b, 0) / done.length) : 0;
}

export function completion(s: Student) {
  return Math.round((s.scores.filter((x) => x !== null).length / CHAPTERS.length) * 100);
}

export function weakTopics(s: Student) {
  return s.scores
    .map((sc, i) => ({ sc, ch: CHAPTERS[i] }))
    .filter((x): x is { sc: number; ch: (typeof CHAPTERS)[number] } => x.sc !== null && x.sc < 60 && Boolean(x.ch))
    .sort((a, b) => (a.sc as number) - (b.sc as number))
    .slice(0, 2)
    .map((x) => x.ch);
}

export function ranked(list: Student[]) {
  return [...list].sort((a, b) => average(b) - average(a));
}

export function formRank(s: Student, all: Student[]) {
  return ranked(all).findIndex((x) => x.id === s.id) + 1;
}

export function setRank(s: Student, all: Student[]) {
  return ranked(all.filter((x) => x.set === s.set)).findIndex((x) => x.id === s.id) + 1;
}

export function improvement(s: Student) {
  return s.lastMonthAvg ? Math.round(((average(s) - s.lastMonthAvg) / s.lastMonthAvg) * 100) : 0;
}

export function level(xp: number) {
  return Math.floor(xp / 1000) + 1;
}

export function chapterStatus(score: number | null, idx: number, scores: (number | null)[]) {
  if (score !== null) return "Completed" as const;
  const firstOpen = scores.findIndex((x) => x === null);
  return idx === firstOpen ? ("In Progress" as const) : ("Not Started" as const);
}
