ALTER TABLE public.students ADD COLUMN hlc_no text UNIQUE, ADD COLUMN class_name text NOT NULL DEFAULT '', ADD COLUMN class_no text NOT NULL DEFAULT '';

CREATE TABLE public.assessment_scores (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term smallint NOT NULL CHECK (term BETWEEN 1 AND 2),
  kind text NOT NULL CHECK (kind IN ('item','summary')),
  category text NOT NULL CHECK (category IN ('homework','short_quiz','chapter_quiz','term_test','mock','exam','daily','overall','other')),
  label text NOT NULL,
  score numeric,
  absent boolean NOT NULL DEFAULT false,
  full_marks numeric,
  position integer NOT NULL DEFAULT 0,
  synced_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, term, kind, label)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_scores TO authenticated;
GRANT ALL ON public.assessment_scores TO service_role;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_assessment_read ON public.assessment_scores FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE POLICY teacher_assessment_write ON public.assessment_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE INDEX assessment_student_idx ON public.assessment_scores(student_id);

CREATE TABLE public.sheet_syncs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  synced_by uuid NOT NULL,
  students integer NOT NULL DEFAULT 0,
  scores integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sheet_syncs TO authenticated;
GRANT ALL ON public.sheet_syncs TO service_role;
ALTER TABLE public.sheet_syncs ENABLE ROW LEVEL SECURITY;
CREATE POLICY teacher_sync_read ON public.sheet_syncs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY teacher_sync_insert ON public.sheet_syncs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'teacher') AND synced_by = auth.uid());