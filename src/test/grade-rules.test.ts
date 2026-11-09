import { describe, expect, it } from 'vitest';
import { answerMarks, VIDEO_MARKS, scoreSchema, parseScoreCsv } from '@/lib/grade-rules';
describe('School marks', () => {
 it('awards one daily mark for a correct answer', () => expect(answerMarks(true)).toBe(1));
 it('awards no marks for an incorrect answer', () => expect(answerMarks(false)).toBe(0));
 it('awards one mark per video', () => expect(VIDEO_MARKS).toBe(1));
 it('accepts a score between zero and 100 only', () => { expect(scoreSchema.parse(100)).toBe(100); expect(() => scoreSchema.parse(101)).toThrow(); expect(() => scoreSchema.parse(-1)).toThrow(); });
 it('imports blank scores as unattempted', () => expect(parseScoreCsv('email,ch1,ch2,ch3,ch4,ch5,ch6,ch7\na@hlc.edu.hk,0,100,,50,60,70,80').get('a@hlc.edu.hk')).toEqual([0,100,null,50,60,70,80]));
});
