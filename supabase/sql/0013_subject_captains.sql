-- Subject captains can collect homework for their own set. Teachers appoint them.
-- Run 0007 and 0012 first. Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.subject_captains (
  student_id uuid PRIMARY KEY REFERENCES public.students(id) ON DELETE CASCADE,
  appointed_by uuid,
  appointed_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.subject_captains TO authenticated;
GRANT ALL ON public.subject_captains TO service_role;
ALTER TABLE public.subject_captains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS subject_captains_read ON public.subject_captains;
CREATE POLICY subject_captains_read ON public.subject_captains
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher')
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_id AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS subject_captains_teacher_write ON public.subject_captains;
CREATE POLICY subject_captains_teacher_write ON public.subject_captains
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- A captain may read and update checks for students in the same set.
DROP POLICY IF EXISTS homework_checks_captain ON public.homework_checks;
CREATE POLICY homework_checks_captain ON public.homework_checks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students me
      JOIN public.subject_captains cap ON cap.student_id = me.id
      JOIN public.students target ON target.math_set = me.math_set AND target.id = student_id
      WHERE me.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.students me
      JOIN public.subject_captains cap ON cap.student_id = me.id
      JOIN public.students target ON target.math_set = me.math_set AND target.id = student_id
      WHERE me.user_id = auth.uid()
    )
  );

-- Names and class only, for the captain's own set. No marks or emails.
CREATE OR REPLACE FUNCTION public.captain_classmates()
RETURNS TABLE (id uuid, name text, class_name text, class_no text, math_set text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT s.id, s.name, s.class_name, s.class_no, s.math_set
  FROM public.students s
  WHERE EXISTS (
    SELECT 1
    FROM public.students me
    JOIN public.subject_captains cap ON cap.student_id = me.id
    WHERE me.user_id = auth.uid() AND me.math_set = s.math_set
  )
$$;
REVOKE ALL ON FUNCTION public.captain_classmates() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.captain_classmates() TO authenticated;

-- One streak reward per homework. Captains and teachers may call it; repeats do nothing.
CREATE OR REPLACE FUNCTION public.grant_homework_streak(
  _student_id uuid,
  _homework_id uuid,
  _description text,
  _multiplier integer
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed boolean;
BEGIN
  IF _multiplier NOT IN (1, 2) THEN
    RAISE EXCEPTION 'Invalid multiplier';
  END IF;
  IF _description IS NULL OR length(_description) > 300 THEN
    RAISE EXCEPTION 'Invalid description';
  END IF;
  allowed := public.has_role(auth.uid(), 'teacher') OR EXISTS (
    SELECT 1
    FROM public.students me
    JOIN public.subject_captains cap ON cap.student_id = me.id
    JOIN public.students target ON target.id = _student_id AND target.math_set = me.math_set
    JOIN public.homework h ON h.id = _homework_id
      AND (h.math_set = 'ALL' OR h.math_set = me.math_set)
    WHERE me.user_id = auth.uid()
  );
  IF NOT allowed THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  INSERT INTO public.game_rewards (
    student_id, source_key, reason, description, base_mc, multiplier, mc, exp
  ) VALUES (
    _student_id,
    'hw-streak:' || _homework_id::text,
    'homework_streak',
    _description,
    3,
    _multiplier,
    3 * _multiplier,
    0
  )
  ON CONFLICT (student_id, source_key) DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.grant_homework_streak(uuid, uuid, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_homework_streak(uuid, uuid, text, integer) TO authenticated;

NOTIFY pgrst, 'reload schema';
