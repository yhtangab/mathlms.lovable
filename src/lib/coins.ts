import { supabase } from "@/integrations/supabase/client";
import type { Student } from "./data";

export const COIN_NAME = "Math Coins";
export const COIN_NAME_ZH = "數學幣";
export const COIN_EMOJI = "🪙";
/** Coins for watching one chapter video to the end. */
export const VIDEO_COINS = 1;

export type MarkReason =
  | "classwork"
  | "participation"
  | "correct_answer"
  | "incorrect_answer"
  | "homework"
  | "bonus"
  | "deduction";

export interface ReasonInfo {
  id: MarkReason;
  label: string;
  zh: string;
}

export const REASONS: ReasonInfo[] = [
  { id: "correct_answer", label: "Correct answer", zh: "答啱問題" },
  { id: "incorrect_answer", label: "Tried to answer", zh: "有嘗試作答（0 分紀錄）" },
  { id: "classwork", label: "Classwork completed", zh: "完成課堂練習" },
  { id: "participation", label: "Great lesson performance", zh: "課堂表現好" },
  { id: "homework", label: "Homework on time", zh: "準時交齊功課" },
  { id: "bonus", label: "Bonus", zh: "其他獎勵" },
  { id: "deduction", label: "Deduction", zh: "扣分（欠交 / 違規）" },
];

export const QUICK_REASONS: ReasonInfo[] = REASONS.filter(
  (r) => r.id !== "correct_answer" && r.id !== "incorrect_answer",
);

export const QUICK_AMOUNTS = [-5, -2, -1, 1, 2, 5];

export function reasonLabel(id: string): string {
  return REASONS.find((r) => r.id === id)?.label ?? id;
}

export function coinsEarned(s: Pick<Student, "dailyMarks" | "videoMarks">): number {
  return (s.dailyMarks ?? 0) + (s.videoMarks ?? 0) * VIDEO_COINS;
}

export function coinBalance(s: Pick<Student, "dailyMarks" | "videoMarks" | "coinsSpent">): number {
  return coinsEarned(s) - (s.coinsSpent ?? 0);
}

const STATUS = {
  pending: { label: "Waiting for teacher", cls: "bg-gold/25 text-gold-deep" },
  approved: { label: "Approved · ready to use", cls: "bg-primary/10 text-primary" },
  used: { label: "Used", cls: "bg-success/15 text-success" },
  rejected: { label: "Rejected · coins returned", cls: "bg-muted text-muted-foreground" },
} as const;

export function redemptionStatus(status: string): { label: string; cls: string } {
  return (
    STATUS[status as keyof typeof STATUS] ?? {
      label: status,
      cls: "bg-muted text-muted-foreground",
    }
  );
}

/** Saves the same marks for every chosen student in one go and returns the new row ids (for undo). */
export async function giveCoins(input: {
  studentIds: string[];
  marks: number;
  reason: MarkReason;
  note: string;
}): Promise<string[]> {
  if (!input.studentIds.length) throw new Error("Choose at least one student first");
  if (!Number.isInteger(input.marks) || input.marks < -100 || input.marks > 100) {
    throw new Error("Marks must be a whole number from -100 to 100");
  }
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Please sign in with your teacher account again");

  const batchId = crypto.randomUUID();
  const { data, error } = await supabase
    .from("daily_marks")
    .insert(
      input.studentIds.map((studentId) => ({
        student_id: studentId,
        marks: input.marks,
        reason: input.reason,
        note: input.note.trim().slice(0, 200),
        awarded_by: userId,
        batch_id: batchId,
      })),
    )
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.id);
}

export async function deleteMarks(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await supabase
      .from("daily_marks")
      .delete()
      .in("id", ids.slice(i, i + 100));
    if (error) throw new Error(error.message);
  }
}
