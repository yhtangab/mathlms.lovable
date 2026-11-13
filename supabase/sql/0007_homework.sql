-- Homework with deadlines. Teachers write, every signed-in user can read.
-- Safe to run more than once.
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
