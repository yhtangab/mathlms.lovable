export const CHAPTERS = [
  { id: 1, title: "Approximation and Errors", short: "Approx. & Errors", emoji: "🎯" },
  { id: 2, title: "Operations and Factorization of Polynomials", short: "Polynomials", emoji: "🧩" },
  { id: 3, title: "Identities", short: "Identities", emoji: "🟰" },
  { id: 4, title: "Algebraic Fractions and Formulae", short: "Algebraic Fractions", emoji: "➗" },
  { id: 5, title: "Linear Equations in Two Unknowns", short: "Linear Equations", emoji: "📈" },
  { id: 6, title: "Angles and Parallel Lines (II)", short: "Angles & Parallels", emoji: "📐" },
  { id: 7, title: "Organization and Presentation of Data (II)", short: "Data (II)", emoji: "📊" },
] as const;

export type MathSet = "S2M3" | "S2M5";

export interface Student {
  id: string;
  name: string;
  email: string;
  set: MathSet;
  scores: (number | null)[]; // 7 chapters, null = not yet attempted
  lastMonthAvg: number;
  lastMonthFormRank: number;
  xp: number;
  streak: number;
}

const raw: [string, MathSet, (number | null)[], number, number, number][] = [
  ["Chan Tai Man", "S2M3", [92, 88, 95, 54, 90, 87, null], 78, 7, 21],
  ["Wong Ka Yan", "S2M3", [85, 91, 89, 93, 88, 94, 90], 86, 2, 34],
  ["Lee Chun Hei", "S2M3", [72, 65, 58, 49, 70, 75, null], 60, 14, 5],
  ["Cheung Hoi Ying", "S2M3", [95, 97, 92, 90, 96, 93, 98], 94, 1, 52],
  ["Lau Wing Sze", "S2M3", [68, 74, 80, 62, 55, 71, null], 70, 11, 9],
  ["Ho Pak Long", "S2M3", [80, 78, 83, 57, 84, 79, 82], 72, 9, 14],
  ["Ng Tsz Kiu", "S2M3", [61, 59, 66, 52, 64, null, null], 58, 16, 3],
  ["Yip Hiu Tung", "S2M3", [88, 84, 90, 86, 59, 88, 85], 84, 4, 27],
  ["Tsang Man Hin", "S2M5", [55, 62, 48, 51, 60, 58, null], 50, 18, 2],
  ["Kwok Sin Yi", "S2M5", [78, 82, 75, 70, 81, 77, 80], 74, 8, 17],
  ["Fung Chi Ho", "S2M5", [90, 86, 88, 82, 92, 52, 89], 83, 5, 30],
  ["Mak Wai Lam", "S2M5", [66, 70, 58, 45, 68, 72, null], 55, 15, 6],
  ["Leung Yuen Ting", "S2M5", [83, 79, 85, 88, 80, 84, 86], 82, 6, 22],
  ["Chow Ka Lok", "S2M5", [74, 51, 69, 63, 72, 70, null], 69, 12, 8],
  ["Tam Hoi Lam", "S2M5", [87, 92, 90, 85, 89, 91, 88], 85, 3, 40],
  ["Siu Ming Yan", "S2M5", [59, 64, 57, 61, 49, null, null], 62, 13, 1],
  ["Poon Cheuk Yin", "S2M5", [70, 68, 74, 66, 73, 69, 71], 71, 10, 11],
];

export const STUDENTS: Student[] = raw.map(([name, set, scores, lastMonthAvg, lastRank, streak], i) => {
  const [last, first] = [name.split(" ")[0]!, name.split(" ").slice(1).join("")];
  const done = scores.filter((s) => s !== null) as number[];
  return {
    id: `s${i + 1}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@hlc.edu.hk`,
    set,
    scores,
    lastMonthAvg,
    lastMonthFormRank: lastRank,
    xp: done.reduce((a, b) => a + b * 12, 0) + streak * 25,
    streak,
  };
});

export function average(s: Student) {
  const done = s.scores.filter((x) => x !== null) as number[];
  return done.length ? Math.round(done.reduce((a, b) => a + b, 0) / done.length) : 0;
}

export function completion(s: Student) {
  return Math.round((s.scores.filter((x) => x !== null).length / CHAPTERS.length) * 100);
}

export function weakTopics(s: Student) {
  return s.scores
    .map((sc, i) => ({ sc, ch: CHAPTERS[i]! }))
    .filter((x) => x.sc !== null && x.sc < 60)
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
  return Math.round(((average(s) - s.lastMonthAvg) / s.lastMonthAvg) * 100);
}

export function level(xp: number) {
  return Math.floor(xp / 1000) + 1;
}

export function chapterStatus(score: number | null, idx: number, scores: (number | null)[]) {
  if (score !== null) return "Completed" as const;
  const firstOpen = scores.findIndex((x) => x === null);
  return idx === firstOpen ? ("In Progress" as const) : ("Not Started" as const);
}
