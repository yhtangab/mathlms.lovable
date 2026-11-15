import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isMockStudentId } from "./mock-data";
import { mockCheckinDates, mockLuckyDraws, mockMistakes } from "./mock-activity";
import { hkDateKey } from "./checkin";
import type { ErrorType, Mistake, MistakeStatus } from "./vault";

export interface CheckinRecord {
  date: string;
  questionId: string;
  correct: boolean;
}

export interface StudentProgress {
  mistakes: Mistake[];
  checkins: CheckinRecord[];
  /** Correct answers after being picked in the class lucky draw. */
  luckyDrawCorrect: number;
}

export const studentProgressKey = (studentId: string) => ["student-progress", studentId] as const;

async function loadProgress(studentId: string): Promise<StudentProgress> {
  const [mistakes, checkins, lucky] = await Promise.all([
    supabase
      .from("mistakes")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
    supabase
      .from("daily_checkins")
      .select("checkin_date, question_id, correct")
      .eq("student_id", studentId)
      .order("checkin_date"),
    supabase
      .from("daily_marks")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("reason", "correct_answer")
      .eq("note", "Lucky draw"),
  ]);
  const error = mistakes.error ?? checkins.error ?? lucky.error;
  if (error) {
    throw new Error(
      `${error.message}. If this mentions a missing table, run supabase/sql/0011_shop_badges_vault.sql.`,
    );
  }
  return {
    mistakes: (mistakes.data ?? []).map((m) => ({
      id: m.id,
      studentId: m.student_id,
      chapter: m.chapter,
      errorType: m.error_type as ErrorType,
      question: m.question,
      imagePath: m.image_path,
      solution: m.solution,
      status: m.status as MistakeStatus,
      createdAt: m.created_at,
    })),
    checkins: (checkins.data ?? []).map((c) => ({
      date: c.checkin_date,
      questionId: c.question_id,
      correct: c.correct,
    })),
    luckyDrawCorrect: lucky.count ?? 0,
  };
}

function mockProgress(studentId: string): StudentProgress {
  return {
    mistakes: mockMistakes(studentId),
    checkins: mockCheckinDates(studentId).map((date) => ({
      date,
      questionId: "q1-sf",
      correct: true,
    })),
    luckyDrawCorrect: mockLuckyDraws(studentId),
  };
}

/** A student's mistakes, check-ins and lucky-draw answers (sandbox students use sample data). */
export function useStudentProgress(studentId: string) {
  return useQuery({
    queryKey: studentProgressKey(studentId),
    enabled: Boolean(studentId),
    queryFn: () =>
      isMockStudentId(studentId)
        ? Promise.resolve(mockProgress(studentId))
        : loadProgress(studentId),
  });
}

/** Today's check-in, if there is one. */
export function todaysCheckin(progress: StudentProgress | undefined): CheckinRecord | null {
  const today = hkDateKey();
  return progress?.checkins.find((c) => c.date === today) ?? null;
}
