// Pure rules for turning the teacher's Google Sheet tab into student records.
export type Category = 'homework' | 'short_quiz' | 'chapter_quiz' | 'term_test' | 'mock' | 'exam' | 'daily' | 'overall' | 'other';
export type MathSet = 'S2M3' | 'S2M5';
export interface ParsedScore { term: 1 | 2; kind: 'item' | 'summary'; category: Category; label: string; score: number | null; absent: boolean; full_marks: number | null; position: number }
export interface ParsedStudent { hlcNo: string; email: string; name: string; className: string; classNo: string; set: MathSet; scores: ParsedScore[] }
type Cell = string | number | boolean | null | undefined;

const text = (c: Cell) => (c === null || c === undefined ? '' : String(c)).trim();
const isFormula = (c: Cell) => typeof c === 'string' && c.startsWith('=');
const HLC_NO = /^HLC\d+$/i;

export function toNumber(c: Cell): number | null {
  if (typeof c === 'number') return Number.isFinite(c) ? c : null;
  const t = text(c).replace(/%$/, '');
  if (!t || t.startsWith('#')) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
export function isAbsent(c: Cell) { return text(c).toUpperCase() === 'ABS'; }

/** "Homework (30%)" -> 30, "1st TT (200)" -> 200, "HW(30)" -> 30. */
export function bracketMarks(header: string): number | null {
  const m = header.match(/\(\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/);
  return m ? Number(m[1]) : null;
}

export function itemCategory(label: string, group = ''): Category {
  const l = label.toLowerCase(), g = group.toLowerCase();
  if (/^hw/.test(l) || g === 'hw') return 'homework';
  if (/^sq/.test(l) || g === 'sq') return 'short_quiz';
  if (/^cq|post-summer/.test(l) || g === 'cq') return 'chapter_quiz';
  if (/\btt\b|term test/.test(l) || g === 'tt') return 'term_test';
  if (/mock/.test(l) || g === 'mock') return 'mock';
  if (/exam/.test(l) || g === 'exam') return 'exam';
  return 'other';
}

export function summaryCategory(header: string): Category {
  const h = header.toLowerCase();
  if (/^t\da2|annual/.test(h)) return 'overall';
  if (/^t\da1|\btt\b/.test(h)) return 'term_test';
  if (/^t\da3|exam/.test(h) && !/mock/.test(h)) return 'exam';
  if (/homework|^hw/.test(h)) return 'homework';
  if (/short quiz|^sq/.test(h)) return 'short_quiz';
  if (/chapter quiz|^cq/.test(h)) return 'chapter_quiz';
  if (/mock/.test(h)) return 'mock';
  if (/daily/.test(h)) return 'daily';
  return 'other';
}

const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

/**
 * formulas: the tab read with FORMULA rendering (tells typed marks apart from calculated columns).
 * values: the same tab read with UNFORMATTED_VALUE rendering (calculated results).
 */
export function parseSetTab(set: MathSet, formulas: Cell[][], values: Cell[][]): ParsedStudent[] {
  const itemRow = formulas.findIndex(r => text(r?.[0]).toLowerCase() === 'hlc no.');
  if (itemRow < 1) throw new Error(`${set}: could not find the "HLC no." heading in column A`);
  const groupRow = itemRow - 1;
  const fullRow = formulas.findIndex(r => r?.some(c => text(c).toLowerCase() === 'full marks'));
  const studentRows = formulas.map((r, i) => ({ r, i })).filter(x => x.i > itemRow && HLC_NO.test(text(x.r?.[0])));
  const width = Math.max(...formulas.map(r => r?.length ?? 0));
  const header = (row: number, c: number) => text(formulas[row]?.[c]);
  const emailCol = [groupRow, itemRow].map(row => (formulas[row] ?? []).findIndex(c => /e-?mail/i.test(text(c)))).find(i => i >= 0) ?? -1;

  type Col = Omit<ParsedScore, 'score' | 'absent'> & { col: number };
  const cols: Col[] = [];
  let term: 1 | 2 = 1;
  for (let c = 6; c < width; c++) {
    if (c === emailCol) continue;
    const group = header(groupRow, c), name = header(itemRow, c);
    const computed = studentRows.some(s => isFormula(s.r[c]));
    if (/^t2|2nd/i.test(name) || /^t2/i.test(group)) term = 2;
    if (name && !computed && !name.includes('_%') && !name.startsWith('#')) {
      const full = fullRow >= 0 ? toNumber(values[fullRow]?.[c]) : null;
      cols.push({ col: c, term, kind: 'item', category: itemCategory(name, group), label: name, full_marks: full, position: c });
    } else {
      const label = name && bracketMarks(name) !== null ? name : group;
      const full = bracketMarks(label);
      if (full !== null && !label.startsWith('#')) cols.push({ col: c, term, kind: 'summary', category: summaryCategory(label), label, full_marks: full, position: c });
    }
    if (/^t1a3/i.test(group) || /^t1a3/i.test(name)) term = 2;
  }
  // Keep the first column of any repeated heading within a term.
  const seen = new Set<string>();
  const unique = cols.filter(c => { const k = `${c.term}|${c.kind}|${c.label}`; if (seen.has(k)) return false; seen.add(k); return true; });

  return studentRows.map(({ r, i }) => {
    const hlcNo = text(r[0]).toUpperCase();
    const typedEmail = emailCol >= 0 ? text(r[emailCol]).toLowerCase() : '';
    return {
      hlcNo, set,
      email: typedEmail.includes('@') ? typedEmail : `${hlcNo.toLowerCase()}@hlc.edu.hk`,
      name: text(r[3]) || hlcNo, className: text(r[1]), classNo: text(r[2]),
      scores: unique.flatMap(({ col, ...meta }) => {
        const raw = values[i]?.[col];
        const absent = isAbsent(raw);
        const score = round1(toNumber(raw));
        if (meta.kind === 'summary' && score === null) return [];
        return [{ ...meta, score, absent }];
      }),
    };
  });
}
