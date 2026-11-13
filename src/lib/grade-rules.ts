import { z } from "zod";
export const scoreSchema = z.number().int().min(0).max(100).nullable();
export const awardSchema = z.object({
  studentId: z.string().uuid(),
  marks: z.number().int().min(0).max(100),
  reason: z.enum(["classwork", "participation", "correct_answer", "incorrect_answer"]),
});
export const answerMarks = (correct: boolean) => (correct ? 1 : 0);
export const VIDEO_MARKS = 1;
export function parseScoreCsv(text: string) {
  const rows = new Map<string, (number | null)[]>();
  text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .forEach((line, index) => {
      const [email, ...cells] = line.split(",").map((v) => v.trim());
      if (index === 0 && email?.toLowerCase() === "email") return;
      if (!email?.includes("@") || cells.length !== 7)
        throw new Error(`Row ${index + 1}: expected email and seven scores.`);
      const key = email.toLowerCase();
      if (rows.has(key)) throw new Error(`Row ${index + 1}: duplicate email.`);
      rows.set(
        key,
        cells.map((v) => scoreSchema.parse(v === "" ? null : Number(v))),
      );
    });
  return rows;
}
