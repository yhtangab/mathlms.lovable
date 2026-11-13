// Pure rules for turning the teacher's Google Sheet tab into student records.
export type Category =
  | "homework"
  | "short_quiz"
  | "chapter_quiz"
  | "term_test"
  | "mock"
  | "exam"
  | "daily"
  | "overall"
  | "other";
export type MathSet = "S2M3" | "S2M5";

export interface ParsedScore {
  term: 1 | 2;
  kind: "item" | "summary";
  category: Category;
  label: string;
  score: number | null;
  absent: boolean;
  full_marks: number | null;
  position: number;
}

export interface ParsedStudent {
  hlcNo: string;
  email: string;
  name: string;
  className: string;
  classNo: string;
  set: MathSet;
  scores: ParsedScore[];
}

type Cell = string | number | boolean | null | undefined;

const text = (c: Cell) => (c === null || c === undefined ? "" : String(c)).trim();
const isFormula = (c: Cell) => typeof c === "string" && c.trim().startsWith("=");
const HLC_NO = /^HLC\d+$/i;
const HLC_HEADING = /^hlc\s*no\.?$/i;
const FULL_MARKS_HEADING = /^(full\s*marks?|max\.?\s*marks?|滿分)$/i;
const WEIGHT_HEADER = /\(\s*\d+(?:\.\d+)?\s*%\s*\)\s*$/;
// Column G. A = HLC no., B = Class, C = No., D = Name in English, E = 姓名, F = Sex.
const FIRST_SCORE_COLUMN = 6;

export function toNumber(c: Cell): number | null {
  if (typeof c === "number") return Number.isFinite(c) ? c : null;
  const t = text(c).replace(/%$/, "").replace(/,/g, "");
  if (!t || t.startsWith("#") || t === "-" || t === "—" || /^n\/?a$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function isAbsent(c: Cell) {
  const t = text(c).toUpperCase().replace(/\.$/, "");
  return t === "ABS" || t === "ABSENT";
}

/** "Homework (30%)" -> 30, "1st TT (200)" -> 200, "HW(30)" -> 30. */
export function bracketMarks(header: string): number | null {
  const m = header.match(/\(\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/);
  return m ? Number(m[1]) : null;
}

export function itemCategory(label: string, group = ""): Category {
  const l = label.toLowerCase().trim();
  const g = group.toLowerCase().trim();
  const combined = `${g} ${l}`;

  if (/^hw|\bhw\b|homework|assignment|worksheet|\bws\b|\bex\b|\bch\d*\s*hw/i.test(combined)) {
    return "homework";
  }
  if (/^sq|\bsq\b|short\s*quiz|s\.?q\.?\d/i.test(combined)) {
    return "short_quiz";
  }
  if (/^cq|\bcq\b|chapter\s*quiz|ch\.?\s*quiz|c\.?q\.?\d|post-summer|quiz/i.test(combined)) {
    return "chapter_quiz";
  }
  if (/\btt\b|term\s*test|t\da1|\but\b|unit\s*test|uniform\s*test/i.test(combined)) {
    return "term_test";
  }
  if (/mock/i.test(combined)) {
    return "mock";
  }
  if (/exam|t\da3/i.test(combined)) {
    return "exam";
  }
  return "other";
}

export function summaryCategory(header: string): Category {
  const h = header.toLowerCase().trim();
  if (/^t\da2|annual|overall|coursework/i.test(h)) return "overall";
  if (/^t\da1|\btt\b|term\s*test/i.test(h)) return "term_test";
  if (/^t\da3|exam/i.test(h) && !/mock/i.test(h)) return "exam";
  if (/homework|^hw|\bhw\b/i.test(h)) return "homework";
  if (/short\s*quiz|^sq|\bsq\b/i.test(h)) return "short_quiz";
  if (/chapter\s*quiz|^cq|\bcq\b/i.test(h)) return "chapter_quiz";
  if (/mock/i.test(h)) return "mock";
  if (/daily/i.test(h)) return "daily";
  return "other";
}

const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

function isSummaryHeaderName(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  if (/^daily/i.test(clean)) return true;
  if (
    /^(homework|short\s*quiz|chapter\s*quiz|mock(\s*exam)?|1st\s*tt|2nd\s*tt|t\da\d|annual|overall)\b/i.test(
      clean,
    )
  ) {
    return bracketMarks(clean) !== null;
  }
  return WEIGHT_HEADER.test(clean);
}

/** A weighted coursework column such as "Homework (30%)" or "Daily (10%)". */
function isWeightHeader(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  return /^daily/i.test(clean) || WEIGHT_HEADER.test(clean);
}

/**
 * formulas: the tab read with formulas kept (tells typed marks apart from calculated columns).
 * values: the same tab read as calculated values.
 */
export function parseSetTab(set: MathSet, formulas: Cell[][], values: Cell[][]): ParsedStudent[] {
  const gridF = formulas.length ? formulas : values;
  const gridV = values.length ? values : formulas;
  // Only trust "is this cell a formula?" when the source really kept formulas.
  const hasFormulaInfo = gridF.some((r) => r?.some((c) => isFormula(c)));

  let itemRow = gridF.findIndex((r) => HLC_HEADING.test(text(r?.[0])));
  if (itemRow < 0) {
    itemRow = gridF.findIndex((r) => r?.some((c) => HLC_HEADING.test(text(c))));
  }
  if (itemRow < 0) {
    const firstStudentIdx = gridF.findIndex((r) => HLC_NO.test(text(r?.[0])));
    if (firstStudentIdx > 0) itemRow = firstStudentIdx - 1;
  }
  if (itemRow < 0) {
    throw new Error(`${set}: could not find the "HLC no." heading in column A`);
  }

  const groupRow = itemRow > 0 ? itemRow - 1 : itemRow;

  const fullRow = gridF.findIndex(
    (r, idx) => idx !== itemRow && r?.some((c) => FULL_MARKS_HEADING.test(text(c))),
  );

  const studentRows = gridF
    .map((r, i) => ({ r, i }))
    .filter((x) => x.i > itemRow && HLC_NO.test(text(x.r?.[0])));

  const width = Math.max(
    0,
    ...gridF.map((r) => r?.length ?? 0),
    ...gridV.map((r) => r?.length ?? 0),
  );
  const header = (row: number, c: number) => (row >= 0 ? text(gridF[row]?.[c]) : "");

  const emailCol =
    [groupRow, itemRow]
      .map((row) => (gridF[row] ?? []).findIndex((c) => /e-?mail/i.test(text(c))))
      .find((i) => i >= 0) ?? -1;

  type Col = Omit<ParsedScore, "score" | "absent"> & { col: number };
  const cols: Col[] = [];
  const usedLabels = new Map<string, number>();
  let term: 1 | 2 = 1;
  let activeGroup = "";

  for (let c = FIRST_SCORE_COLUMN; c < width; c++) {
    if (c === emailCol) continue;

    const rawGroup = header(groupRow, c);
    const name = header(itemRow, c);

    // Merged group headings only fill their first cell, so carry them to the right.
    if (rawGroup) activeGroup = isSummaryHeaderName(rawGroup) ? "" : rawGroup;
    const group = rawGroup || activeGroup;

    let formulaCells = 0;
    let typedCells = 0;
    for (const s of studentRows) {
      const cell = s.r?.[c];
      if (isFormula(cell)) formulaCells++;
      else if (text(cell) !== "") typedCells++;
    }
    const computedByFormula = formulaCells > 0 && formulaCells >= typedCells;
    const computed = hasFormulaInfo
      ? computedByFormula || isWeightHeader(name) || (!name && isWeightHeader(rawGroup))
      : isSummaryHeaderName(name) || (!name && isSummaryHeaderName(rawGroup));

    if (/^t2|2nd/i.test(name) || /^t2|2nd/i.test(rawGroup)) term = 2;

    if (name && !computed && !name.includes("_%") && !name.startsWith("#")) {
      const fullFromRow = fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null;
      const full = fullFromRow ?? bracketMarks(name);
      // Two columns with the same heading are both kept instead of one silently disappearing.
      const key = `${term}|item|${name}`;
      const seen = (usedLabels.get(key) ?? 0) + 1;
      usedLabels.set(key, seen);
      cols.push({
        col: c,
        term,
        kind: "item",
        category: itemCategory(name, group),
        label: seen === 1 ? name : `${name} (${seen})`,
        full_marks: full,
        position: c,
      });
    } else {
      const label = name && bracketMarks(name) !== null ? name : rawGroup || name;
      const full = bracketMarks(label) ?? (fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null);
      const key = `${term}|summary|${label}`;
      if (label && full !== null && !label.startsWith("#") && !usedLabels.has(key)) {
        usedLabels.set(key, 1);
        cols.push({
          col: c,
          term,
          kind: "summary",
          category: summaryCategory(label),
          label,
          full_marks: full,
          position: c,
        });
      }
    }

    if (/^t1a3/i.test(rawGroup) || /^t1a3/i.test(name)) term = 2;
  }

  return studentRows.map(({ r, i }) => {
    const hlcNo = text(r[0]).toUpperCase();
    const typedEmail = emailCol >= 0 ? text(r[emailCol]).toLowerCase() : "";
    return {
      hlcNo,
      set,
      email: typedEmail.includes("@") ? typedEmail : `${hlcNo.toLowerCase()}@hlc.edu.hk`,
      name: text(r[3]) || hlcNo,
      className: text(r[1]),
      classNo: text(r[2]),
      scores: cols.flatMap(({ col, ...meta }) => {
        const raw = gridV[i]?.[col];
        const absent = isAbsent(raw);
        const score = round1(toNumber(raw));
        if (meta.kind === "summary" && score === null) return [];
        if (meta.category === "other" && score === null && !absent) return [];
        return [{ ...meta, score, absent }];
      }),
    };
  });
}
