-- Homework deadlines, the tracker, and subject captains.
-- Safe to run more than once. Replaces the old 0012 homework section, 0013, and the captain section of 0014.

CREATE TABLE IF NOT EXISTS public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  math_set text NOT NULL CHECK (math_set IN ('ALL', 'S2M3', 'S2M5')),
  chapter integer CHECK (chapter IS NULL OR chapter BETWEEN 1 AND 7),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  details text NOT NULL DEFAULT '' CHECK (length(details) <= 2000),
  link text NOT NULL DEFAULT '' CHECK (link = '' OR link ~ '^https://'),
  due_at timestamptz NOT NULL,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework TO authenticated;
GRANT ALL ON public.homework TO service_role;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS homework_read ON public.homework;
CREATE POLICY homework_read ON public.homework
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS homework_teacher_write ON public.homework;
CREATE POLICY homework_teacher_write ON public.homework
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

CREATE INDEX IF NOT EXISTS homework_due_idx ON public.homework (due_at);

CREATE TABLE IF NOT EXISTS public.homework_checks (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  homework_id uuid NOT NULL REFERENCES public.homework(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('submitted', 'missing', 'late', 'absent', 'redo')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  PRIMARY KEY (student_id, homework_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework_checks TO authenticated;
GRANT ALL ON public.homework_checks TO service_role;
ALTER TABLE public.homework_checks ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.homework_checks DROP CONSTRAINT IF EXISTS homework_checks_status_check;
ALTER TABLE public.homework_checks
  ADD CONSTRAINT homework_checks_status_check
  CHECK (status IN ('submitted', 'missing', 'late', 'absent', 'redo'));

DROP POLICY IF EXISTS homework_checks_teacher ON public.homework_checks;
CREATE POLICY homework_checks_teacher ON public.homework_checks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

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

-- A policy on students must not SELECT students, or Postgres reports
-- "infinite recursion detected in policy". This function runs as its owner
-- and bypasses row level security, so the policy below only compares a value.
CREATE OR REPLACE FUNCTION public.captain_math_set()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT me.math_set
  FROM public.students me
  JOIN public.subject_captains cap ON cap.student_id = me.id
  WHERE me.user_id = auth.uid()
  LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.captain_math_set() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.captain_math_set() TO authenticated;

DROP POLICY IF EXISTS students_captain_roster ON public.students;
CREATE POLICY students_captain_roster ON public.students
  FOR SELECT TO authenticated
  USING (
    public.captain_math_set() IS NOT NULL
    AND math_set = public.captain_math_set()
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
