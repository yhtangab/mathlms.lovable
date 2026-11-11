import type { Category } from './sheet-parse';
export interface Assessment { term: number; kind: 'item' | 'summary'; category: Category; label: string; score: number | null; absent: boolean; full_marks: number | null; position: number }
export const ITEM_CATEGORIES: { id: Category; label: string }[] = [
  { id: 'homework', label: 'Homework' },
  { id: 'short_quiz', label: 'Short Quiz' },
  { id: 'chapter_quiz', label: 'Chapter Quiz' },
  { id: 'term_test', label: 'Term Test' },
  { id: 'mock', label: 'Mock Exam' },
  { id: 'exam', label: 'Exam' },
];
export function percent(a: Pick<Assessment, 'score' | 'full_marks'>) {
  return a.score === null || !a.full_marks ? null : Math.round((a.score / a.full_marks) * 100);
}
export function termsOf(list: Assessment[]) { return [...new Set(list.map(a => a.term))].sort(); }
