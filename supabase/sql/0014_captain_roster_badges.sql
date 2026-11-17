-- Subject captains can read the names in their own set, and badge coins can be saved.
-- Run after 0011 and 0013. Safe to run more than once.

DROP POLICY IF EXISTS students_captain_roster ON public.students;
CREATE POLICY students_captain_roster ON public.students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students me
      JOIN public.subject_captains cap ON cap.student_id = me.id
      WHERE me.user_id = auth.uid()
        AND me.math_set = students.math_set
    )
  );

CREATE OR REPLACE FUNCTION public.captain_classmates()
RETURNS TABLE (id uuid, name text, class_name text, class_no text, math_set text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT s.id, s.name, s.class_name, s.class_no, s.math_set
  FROM public.students s
  WHERE s.math_set = (
    SELECT me.math_set
    FROM public.students me
    JOIN public.subject_captains cap ON cap.student_id = me.id
    WHERE me.user_id = auth.uid()
    LIMIT 1
  );
$$;
REVOKE ALL ON FUNCTION public.captain_classmates() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.captain_classmates() TO authenticated;

ALTER TABLE public.game_rewards DROP CONSTRAINT IF EXISTS game_rewards_reason_check;
ALTER TABLE public.game_rewards
  ADD CONSTRAINT game_rewards_reason_check
  CHECK (reason IN ('quiz_top3', 'quiz_top10', 'most_improved', 'homework_streak', 'badge'));

NOTIFY pgrst, 'reload schema';
