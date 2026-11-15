/** Daily 1-question check-in: question bank, today's question and streaks. */

export interface CheckinQuestion {
  id: string;
  chapter: number;
  /** May contain $…$ maths. */
  prompt: string;
  options: [string, string, string, string];
  /** Index of the correct option. */
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

/** Every 5 check-ins (right or wrong) earn 1 Math Coin. */
export const CHECKINS_PER_COIN = 5;

export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: "q1-sf",
    chapter: 1,
    prompt: "Round $3.14159$ to 3 significant figures.",
    options: ["$3.14$", "$3.141$", "$3.1$", "$3.142$"],
    answer: 0,
    explanation: "The 4th figure is 1, so 3.14159 rounds down to 3.14.",
  },
  {
    id: "q1-sci",
    chapter: 1,
    prompt: "Write $0.00052$ in scientific notation.",
    options: [
      "$5.2 \\times 10^{-3}$",
      "$5.2 \\times 10^{-4}$",
      "$52 \\times 10^{-5}$",
      "$0.52 \\times 10^{-3}$",
    ],
    answer: 1,
    explanation:
      "Move the decimal point 4 places right: $5.2 \\times 10^{-4}$, with $1 \\le 5.2 < 10$.",
  },
  {
    id: "q1-abs",
    chapter: 1,
    prompt: "A length is 12 cm, correct to the nearest cm. What is the maximum absolute error?",
    options: ["1 cm", "0.5 cm", "0.05 cm", "0.1 cm"],
    answer: 1,
    explanation:
      "The maximum absolute error is half of the unit used: $\\frac{1}{2} \\times 1 = 0.5$ cm.",
  },
  {
    id: "q1-pct",
    chapter: 1,
    prompt:
      "A measurement of 20 cm has a maximum absolute error of 0.5 cm. What is the percentage error?",
    options: ["$2.5\\%$", "$5\\%$", "$0.5\\%$", "$25\\%$"],
    answer: 0,
    explanation: "$\\frac{0.5}{20} \\times 100\\% = 2.5\\%$.",
  },
  {
    id: "q2-degree",
    chapter: 2,
    prompt: "What is the degree of $3x^4 - 2x^2 + 7$?",
    options: ["2", "3", "4", "7"],
    answer: 2,
    explanation: "The highest power of $x$ is 4.",
  },
  {
    id: "q2-expand",
    chapter: 2,
    prompt: "Expand $(x + 3)(x - 2)$.",
    options: ["$x^2 + x - 6$", "$x^2 - x - 6$", "$x^2 + 5x - 6$", "$x^2 + x + 6$"],
    answer: 0,
    explanation: "$x^2 - 2x + 3x - 6 = x^2 + x - 6$.",
  },
  {
    id: "q2-common",
    chapter: 2,
    prompt: "Factorize $6ab + 9a$.",
    options: ["$3a(2b + 3)$", "$3(2ab + 3a)$", "$a(6b + 9)$", "$3ab(2 + 3)$"],
    answer: 0,
    explanation: "The highest common factor is $3a$, so $6ab + 9a = 3a(2b + 3)$.",
  },
  {
    id: "q2-group",
    chapter: 2,
    prompt: "Factorize $ax + ay + bx + by$.",
    options: ["$(a + b)(x + y)$", "$(a + x)(b + y)$", "$abxy$", "$(a - b)(x - y)$"],
    answer: 0,
    explanation: "$a(x + y) + b(x + y) = (a + b)(x + y)$.",
  },
  {
    id: "q3-square",
    chapter: 3,
    prompt: "Expand $(a + b)^2$.",
    options: ["$a^2 + b^2$", "$a^2 + 2ab + b^2$", "$a^2 + ab + b^2$", "$2a + 2b$"],
    answer: 1,
    explanation: "Perfect square identity: $(a + b)^2 \\equiv a^2 + 2ab + b^2$.",
  },
  {
    id: "q3-diff",
    chapter: 3,
    prompt: "Factorize $x^2 - 25$.",
    options: ["$(x - 5)^2$", "$(x + 5)(x - 5)$", "$(x + 25)(x - 1)$", "$x(x - 25)$"],
    answer: 1,
    explanation: "Difference of two squares: $x^2 - 5^2 = (x + 5)(x - 5)$.",
  },
  {
    id: "q3-calc",
    chapter: 3,
    prompt: "Find $101^2 - 99^2$ without a calculator.",
    options: ["$4$", "$200$", "$400$", "$2$"],
    answer: 2,
    explanation: "$(101 + 99)(101 - 99) = 200 \\times 2 = 400$.",
  },
  {
    id: "q3-identity",
    chapter: 3,
    prompt: "Which of these is an identity?",
    options: ["$2(x + 1) = 2x + 2$", "$x + 1 = 3$", "$x^2 = 4$", "$2x = x + 5$"],
    answer: 0,
    explanation: "It is true for every value of $x$; the others are true for only some values.",
  },
  {
    id: "q4-simplify",
    chapter: 4,
    prompt: "Simplify $\\dfrac{6x^2}{3x}$.",
    options: ["$2x$", "$3x$", "$2x^2$", "$\\dfrac{2}{x}$"],
    answer: 0,
    explanation: "$\\frac{6}{3} = 2$ and $\\frac{x^2}{x} = x$.",
  },
  {
    id: "q4-add",
    chapter: 4,
    prompt: "Simplify $\\dfrac{1}{x} + \\dfrac{1}{2x}$.",
    options: ["$\\dfrac{2}{3x}$", "$\\dfrac{3}{2x}$", "$\\dfrac{1}{3x}$", "$\\dfrac{2}{x}$"],
    answer: 1,
    explanation: "$\\frac{2}{2x} + \\frac{1}{2x} = \\frac{3}{2x}$.",
  },
  {
    id: "q4-subject",
    chapter: 4,
    prompt: "Make $h$ the subject of $A = \\dfrac{1}{2}bh$.",
    options: ["$h = 2Ab$", "$h = \\dfrac{A}{2b}$", "$h = \\dfrac{2A}{b}$", "$h = \\dfrac{b}{2A}$"],
    answer: 2,
    explanation: "Multiply both sides by 2, then divide by $b$.",
  },
  {
    id: "q4-sub",
    chapter: 4,
    prompt: "If $v = u + at$, find $v$ when $u = 5$, $a = 2$, $t = 3$.",
    options: ["$10$", "$11$", "$21$", "$30$"],
    answer: 1,
    explanation: "$v = 5 + 2 \\times 3 = 11$.",
  },
  {
    id: "q5-solve",
    chapter: 5,
    prompt: "Solve $x + y = 10$ and $x - y = 2$.",
    options: ["$x = 4, y = 6$", "$x = 6, y = 4$", "$x = 5, y = 5$", "$x = 8, y = 2$"],
    answer: 1,
    explanation: "Adding gives $2x = 12$, so $x = 6$ and $y = 4$.",
  },
  {
    id: "q5-point",
    chapter: 5,
    prompt: "Which point lies on the graph of $y = 2x + 1$?",
    options: ["$(2, 4)$", "$(1, 2)$", "$(3, 7)$", "$(0, 2)$"],
    answer: 2,
    explanation: "$2 \\times 3 + 1 = 7$.",
  },
  {
    id: "q5-elim",
    chapter: 5,
    prompt: "Solve $2x + y = 7$ and $x + y = 4$.",
    options: ["$x = 3, y = 1$", "$x = 1, y = 3$", "$x = 2, y = 3$", "$x = 4, y = 0$"],
    answer: 0,
    explanation: "Subtracting gives $x = 3$, then $y = 4 - 3 = 1$.",
  },
  {
    id: "q5-parallel",
    chapter: 5,
    prompt:
      "The graphs of two linear equations are parallel lines. How many solutions do they have together?",
    options: ["None", "One", "Two", "Infinitely many"],
    answer: 0,
    explanation: "Parallel lines never meet, so there is no common solution.",
  },
  {
    id: "q6-hexagon",
    chapter: 6,
    prompt: "What is the sum of the interior angles of a hexagon?",
    options: ["$540^\\circ$", "$720^\\circ$", "$900^\\circ$", "$1080^\\circ$"],
    answer: 1,
    explanation: "$(6 - 2) \\times 180^\\circ = 720^\\circ$.",
  },
  {
    id: "q6-octagon",
    chapter: 6,
    prompt: "What is each exterior angle of a regular octagon?",
    options: ["$30^\\circ$", "$40^\\circ$", "$45^\\circ$", "$60^\\circ$"],
    answer: 2,
    explanation: "$360^\\circ \\div 8 = 45^\\circ$.",
  },
  {
    id: "q6-alternate",
    chapter: 6,
    prompt: "Two parallel lines are cut by a transversal. Alternate angles are…",
    options: ["equal", "supplementary", "complementary", "always $90^\\circ$"],
    answer: 0,
    explanation: "Alternate angles between parallel lines are equal (alt. ∠s, AB // CD).",
  },
  {
    id: "q6-interior",
    chapter: 6,
    prompt: "Interior angles on the same side of a transversal between parallel lines add up to…",
    options: ["$90^\\circ$", "$180^\\circ$", "$270^\\circ$", "$360^\\circ$"],
    answer: 1,
    explanation: "They are supplementary (int. ∠s, AB // CD).",
  },
  {
    id: "q7-stem",
    chapter: 7,
    prompt: "In a stem-and-leaf diagram, stem 4 with leaf 7 stands for…",
    options: ["$4.7$", "$47$", "$74$", "$11$"],
    answer: 1,
    explanation: "The stem is the tens digit and the leaf is the units digit.",
  },
  {
    id: "q7-mode",
    chapter: 7,
    prompt: "What is the mode of $3, 5, 5, 8, 9$?",
    options: ["$3$", "$5$", "$6$", "$8$"],
    answer: 1,
    explanation: "5 appears most often.",
  },
  {
    id: "q7-cumulative",
    chapter: 7,
    prompt: "Which graph shows running totals of frequencies?",
    options: [
      "Pie chart",
      "Frequency polygon",
      "Cumulative frequency polygon",
      "Stem-and-leaf diagram",
    ],
    answer: 2,
    explanation:
      "A cumulative frequency polygon plots running totals against upper class boundaries.",
  },
  {
    id: "q7-polygon",
    chapter: 7,
    prompt: "A frequency polygon is drawn by joining…",
    options: [
      "the class boundaries",
      "the class marks at the tops of the bars",
      "the corners of each bar",
      "the cumulative frequencies",
    ],
    answer: 1,
    explanation: "Join the mid-points (class marks) of the tops of the histogram bars.",
  },
];

/** "YYYY-MM-DD" for a moment in Hong Kong time, the same day the database uses. */
export function hkDateKey(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ (ch.codePointAt(0) ?? 0), 16777619) >>> 0;
  return h;
}

/** Each student gets their own question each day; the same one all day. */
export function questionForDay(studentId: string, dateKey: string): CheckinQuestion {
  const q = CHECKIN_QUESTIONS[hash(`${studentId}|${dateKey}`) % CHECKIN_QUESTIONS.length];
  if (!q) throw new Error("The check-in question bank is empty");
  return q;
}

export function checkinById(id: string): CheckinQuestion | null {
  return CHECKIN_QUESTIONS.find((q) => q.id === id) ?? null;
}

function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.round(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / 86_400_000);
}

/**
 * Days in a row with a check-in. The current streak still counts if the last check-in was
 * yesterday (today's has not been done yet).
 */
export function checkinStreak(
  dates: readonly string[],
  today: string,
): { current: number; best: number } {
  const days = [...new Set(dates.map(dayNumber))].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const d of days) {
    run = prev !== null && d === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  const t = dayNumber(today);
  const last = days[days.length - 1];
  const current = last !== undefined && (last === t || last === t - 1) ? run : 0;
  return { current, best };
}
