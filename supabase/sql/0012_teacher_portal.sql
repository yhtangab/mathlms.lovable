-- Teacher homework matrix, and the leaderboard privacy switch.
-- Run 0007 (homework) and 0009 (system_config) first. Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.homework_checks (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  homework_id uuid NOT NULL REFERENCES public.homework(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('submitted', 'missing', 'late', 'redo')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  PRIMARY KEY (student_id, homework_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework_checks TO authenticated;
GRANT ALL ON public.homework_checks TO service_role;
ALTER TABLE public.homework_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS homework_checks_teacher ON public.homework_checks;
CREATE POLICY homework_checks_teacher ON public.homework_checks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

ALTER TABLE public.system_config
  ADD COLUMN IF NOT EXISTS leaderboard_show_all boolean NOT NULL DEFAULT true;

NOTIFY pgrst, 'reload schema';
