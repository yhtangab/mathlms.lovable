-- Daily check-in, Mistake Vault, and exam dates.
-- The Shop is 0018_shop_avatars.sql. Badges are 0014_badges.sql.
-- Run 0010 first. Safe to run more than once.

-- 1) Daily 1-question check-in. One per student per Hong Kong day; added only through
--    submit_daily_checkin(). Every 5 check-ins earn 1 Math Coin.
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  checkin_date date NOT NULL,
  question_id text NOT NULL CHECK (length(question_id) BETWEEN 1 AND 40),
  correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, checkin_date)
);
GRANT SELECT ON public.daily_checkins TO authenticated;
GRANT ALL ON public.daily_checkins TO service_role;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS daily_checkins_read ON public.daily_checkins;
CREATE POLICY daily_checkins_read ON public.daily_checkins FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));

CREATE OR REPLACE FUNCTION public.submit_daily_checkin(_question_id text, _correct boolean)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  today date := (now() AT TIME ZONE 'Asia/Hong_Kong')::date;
  total integer;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid();
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record yet';
  END IF;
  IF _question_id IS NULL OR _question_id !~ '^q[0-9]-[a-z0-9-]{1,30}$' THEN
    RAISE EXCEPTION 'Unknown question';
  END IF;
  IF EXISTS (SELECT 1 FROM public.daily_checkins WHERE student_id = sid AND checkin_date = today) THEN
    RAISE EXCEPTION 'You have already checked in today. Come back tomorrow!';
  END IF;
  INSERT INTO public.daily_checkins (student_id, checkin_date, question_id, correct)
  VALUES (sid, today, _question_id, coalesce(_correct, false));
  SELECT count(*) INTO total FROM public.daily_checkins WHERE student_id = sid;
  RETURN total;
END $$;
REVOKE ALL ON FUNCTION public.submit_daily_checkin(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_daily_checkin(text, boolean) TO authenticated;

-- 2) Mistake Vault. Students keep their own; teachers can read them.
CREATE TABLE IF NOT EXISTS public.mistakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  chapter integer NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  error_type text NOT NULL CHECK (error_type IN ('careless', 'concept', 'formula', 'misread')),
  question text NOT NULL DEFAULT '' CHECK (length(question) <= 2000),
  image_path text CHECK (image_path IS NULL OR image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(png|jpg|jpeg|webp|gif)$'),
  solution text NOT NULL DEFAULT '' CHECK (length(solution) <= 4000),
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'practiced', 'mastered')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(trim(question)) > 0 OR image_path IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS mistakes_student_idx ON public.mistakes (student_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mistakes TO authenticated;
GRANT ALL ON public.mistakes TO service_role;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mistakes_read ON public.mistakes;
CREATE POLICY mistakes_read ON public.mistakes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
DROP POLICY IF EXISTS mistakes_own_write ON public.mistakes;
CREATE POLICY mistakes_own_write ON public.mistakes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('mistake-images', 'mistake-images', false, 5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS mistake_images_read ON storage.objects;
CREATE POLICY mistake_images_read ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'mistake-images' AND (
    (storage.foldername(name))[1] IN (SELECT id::text FROM public.students WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'teacher')));
DROP POLICY IF EXISTS mistake_images_insert ON storage.objects;
CREATE POLICY mistake_images_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'mistake-images'
    AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.students WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS mistake_images_delete ON storage.objects;
CREATE POLICY mistake_images_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'mistake-images'
    AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.students WHERE user_id = auth.uid()));

-- 3) Test and exam dates for the countdown. Everyone reads; teachers edit.
CREATE TABLE IF NOT EXISTS public.exam_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 80),
  kind text NOT NULL DEFAULT 'exam' CHECK (kind IN ('term_test', 'exam', 'quiz', 'other')),
  math_set text NOT NULL DEFAULT 'ALL' CHECK (math_set IN ('ALL', 'S2M3', 'S2M5')),
  starts_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_dates TO authenticated;
GRANT ALL ON public.exam_dates TO service_role;
ALTER TABLE public.exam_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS exam_dates_read ON public.exam_dates;
CREATE POLICY exam_dates_read ON public.exam_dates FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS exam_dates_teacher_write ON public.exam_dates;
CREATE POLICY exam_dates_teacher_write ON public.exam_dates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- 4) Leaderboards: "coursework" is now "ca" (Continuous Assessment, TnA2).
DELETE FROM public.game_leaderboards WHERE metric NOT IN ('total', 'ca', 'exp');
ALTER TABLE public.game_leaderboards DROP CONSTRAINT IF EXISTS game_leaderboards_metric_check;
ALTER TABLE public.game_leaderboards ADD CONSTRAINT game_leaderboards_metric_check
  CHECK (metric IN ('total', 'ca', 'exp'));

-- 5) The privilege and gift tickets from the Step 3 brief (added once, by name).
INSERT INTO public.rewards (emoji, name, description, cost, cooldown_days, position)
SELECT v.emoji, v.name, v.description, v.cost, v.cooldown_days, v.position
FROM (VALUES
  ('💡', 'Quiz Hint Card', 'One hint from your teacher during a class quiz (not tests or exams).', 6, 7, 10),
  ('🖨️', 'Skip the Queue: Notes Printing', 'Go to the front of the queue when notes are printed.', 10, 14, 11),
  ('⭐', 'Math Stickers', 'A sheet of maths stickers.', 8, 14, 12),
  ('✏️', 'Stationery', 'A piece of stationery chosen by your teacher.', 12, 30, 13),
  ('🍪', 'Snacks Coupon', 'One snack, given out at a time your teacher chooses.', 15, 30, 14)
) AS v (emoji, name, description, cost, cooldown_days, position)
WHERE NOT EXISTS (SELECT 1 FROM public.rewards r WHERE r.name = v.name);

NOTIFY pgrst, 'reload schema';
