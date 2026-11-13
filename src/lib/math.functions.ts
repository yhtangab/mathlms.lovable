import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { awardSchema, scoreSchema } from "./grade-rules";

export const saveScores = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .array(
        z.object({
          student_id: z.string().uuid(),
          chapter: z.number().int().min(1).max(7),
          score: scoreSchema,
        }),
      )
      .min(1)
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (!allowed) throw new Error("Teacher access required");
    const { error } = await context.supabase.from("chapter_scores").upsert(data);
    if (error) throw new Error(error.message);
    return { saved: data.length };
  });
export const awardMarks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => awardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (!allowed) throw new Error("Teacher access required");
    const { error } = await context.supabase
      .from("daily_marks")
      .insert({
        student_id: data.studentId,
        marks: data.marks,
        reason: data.reason,
        awarded_by: context.userId,
      });
    if (error) throw new Error(error.message);
    return { saved: true };
  });
