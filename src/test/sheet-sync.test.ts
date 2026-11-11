import { describe, expect, it } from 'vitest';
import { parseSetTab } from '@/lib/sheet-parse';
import { contribution, termSummary, type Assessment } from '@/lib/assessments';

// Mirrors the layout of the "2627 Name list (For LMS)" tabs.
const formulas = [
  ['', '', '2026-27 Set'],
  ['', 'Class', 'No.', 'Name in English', '姓名', 'Sex', 'HW', 'Homework (30%)', 'SQ', 'SQ', 'Daily (10%)', 'T1A3 (200)'],
  ['HLC no.', '', '', '', '', '', 'HWB1', '', 'SQ1.1', 'SQ1.2', '', ''],
  ['HLC250015', '2B', '1', 'Chan Ying Tung (Percy)', '陳映彤', 'F', 4, '=G4/G$6*30', 10, 'ABS', 8, '=0'],
  ['', '', '', 'Mean'],
  ['', '', '', 'Full marks', '', '', 10, '', 14, 13, '', ''],
];
const values = formulas.map(r => r.map(c => (typeof c === 'string' && c.startsWith('=') ? 12 : c)));

const item = (category: Assessment['category'], score: number | null, full: number | null, absent = false): Assessment =>
  ({ term: 1, kind: 'item', category, label: `${category}${score}`, score, full_marks: full, absent, position: 0 });

describe('Google Sheet sync', () => {
  const [s] = parseSetTab('S2M3', formulas, values);
  it('signs students in with their HLC no. school email', () => expect(s?.email).toBe('hlc250015@hlc.edu.hk'));
  it('reads typed marks with full marks from the Full marks row', () =>
    expect(s?.scores.find(x => x.label === 'SQ1.1')).toMatchObject({ kind: 'item', category: 'short_quiz', score: 10, full_marks: 14 }));
  it('keeps ABS as absent, not zero', () => expect(s?.scores.find(x => x.label === 'SQ1.2')).toMatchObject({ absent: true, score: null }));
  it('reads the Daily (10%) column as a mark out of 10', () => expect(s?.scores.find(x => x.category === 'daily')).toMatchObject({ score: 8, full_marks: 10 }));
});

describe('Weighted coursework', () => {
  it('Homework is 30% of the average homework percentage', () => expect(contribution([item('homework', 4, 10), item('homework', 8, 10)], 1, 'homework', 30)).toBe(18));
  it('absent quizzes are left out of the average', () => expect(contribution([item('short_quiz', 7, 14), item('short_quiz', null, 13, true)], 1, 'short_quiz', 20)).toBe(10));
  it('coursework total is out of 200 (HW 30 + SQ 20 + CQ 30 + Mock 10 + Daily 10, doubled)', () => {
    const all = [item('homework', 10, 10), item('short_quiz', 10, 10), item('chapter_quiz', 10, 10), item('mock', 20, 20),
      { term: 1, kind: 'summary', category: 'daily', label: 'Daily (10%)', score: 10, full_marks: 10, absent: false, position: 0 } as Assessment];
    expect(termSummary(all, 1).coursework200).toBe(200);
  });
});
