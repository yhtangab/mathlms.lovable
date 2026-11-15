-- Game data for Step 2: saved rewards, each student's private game snapshot, the public
-- leaderboards, avatars/frames/titles, and chapter self-checks.
-- Run 0009_system_config.sql first. Safe to run more than once.

-- True for the public demo login, which must never see real students.
CREATE OR REPLACE FUNCTION public.is_demo_user() RETURNS boolean
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT coalesce(lower(auth.jwt() ->> 'email'), '') = 'demo.student@hlc.edu.hk'
$$;
REVOKE ALL ON FUNCTION public.is_demo_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_demo_user() TO authenticated;

-- 1. Rewards ledger. Append-only: each reward is given once, with the 2x setting of that moment.
CREATE TABLE IF NOT EXISTS public.game_rewards (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  source_key text NOT NULL CHECK (length(source_key) BETWEEN 1 AND 200),
  reason text NOT NULL CHECK (reason IN ('quiz_top3', 'quiz_top10', 'most_improved', 'homework_streak')),
  quiz_id text,
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 300),
  base_mc integer NOT NULL CHECK (base_mc BETWEEN 0 AND 100),
  multiplier integer NOT NULL DEFAULT 1 CHECK (multiplier IN (1, 2)),
  mc integer NOT NULL,
  exp integer NOT NULL DEFAULT 0 CHECK (exp BETWEEN 0 AND 10000),
  awarded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, source_key),
  CHECK (mc = base_mc * multiplier)
);
GRANT SELECT, INSERT ON public.game_rewards TO authenticated;
GRANT ALL ON public.game_rewards TO service_role;
ALTER TABLE public.game_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS game_rewards_read ON public.game_rewards;
CREATE POLICY game_rewards_read ON public.game_rewards FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
DROP POLICY IF EXISTS game_rewards_teacher_insert ON public.game_rewards;
CREATE POLICY game_rewards_teacher_insert ON public.game_rewards FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- 2. Each student's private game snapshot (ranks below 10th are never stored in it).
CREATE TABLE IF NOT EXISTS public.game_snapshots (
  student_id uuid PRIMARY KEY REFERENCES public.students(id) ON DELETE CASCADE,
  math_set text NOT NULL,
  payload jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_snapshots TO authenticated;
GRANT ALL ON public.game_snapshots TO service_role;
ALTER TABLE public.game_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS game_snapshots_read ON public.game_snapshots;
CREATE POLICY game_snapshots_read ON public.game_snapshots FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
DROP POLICY IF EXISTS game_snapshots_teacher_write ON public.game_snapshots;
CREATE POLICY game_snapshots_teacher_write ON public.game_snapshots FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- 3. Public leaderboards: top 10 by name, everyone else only as anonymous codes.
CREATE TABLE IF NOT EXISTS public.game_leaderboards (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 60),
  scope text NOT NULL CHECK (scope IN ('S2M3', 'S2M5', 'S2')),
  metric text NOT NULL CHECK (metric IN ('total', 'coursework', 'exp')),
  term smallint CHECK (term IS NULL OR term BETWEEN 1 AND 2),
  payload jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_leaderboards TO authenticated;
GRANT ALL ON public.game_leaderboards TO service_role;
ALTER TABLE public.game_leaderboards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS game_leaderboards_read ON public.game_leaderboards;
CREATE POLICY game_leaderboards_read ON public.game_leaderboards FOR SELECT TO authenticated
  USING (NOT public.is_demo_user());
DROP POLICY IF EXISTS game_leaderboards_teacher_write ON public.game_leaderboards;
CREATE POLICY game_leaderboards_teacher_write ON public.game_leaderboards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- 4. Avatars, frames and titles. Shown next to top-10 names, so signed-in students can read
--    them (not the demo login). Students change their own only through equip_cosmetics().
CREATE TABLE IF NOT EXISTS public.student_cosmetics (
  student_id uuid PRIMARY KEY REFERENCES public.students(id) ON DELETE CASCADE,
  avatar_id text NOT NULL DEFAULT 'avatar-owl' CHECK (avatar_id ~ '^avatar-[a-z0-9-]{1,40}$'),
  frame_id text CHECK (frame_id IS NULL OR frame_id ~ '^frame-[a-z0-9-]{1,40}$'),
  title_id text CHECK (title_id IS NULL OR title_id ~ '^title-[a-z0-9-]{1,40}$'),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_cosmetics TO authenticated;
GRANT ALL ON public.student_cosmetics TO service_role;
ALTER TABLE public.student_cosmetics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS student_cosmetics_read ON public.student_cosmetics;
CREATE POLICY student_cosmetics_read ON public.student_cosmetics FOR SELECT TO authenticated
  USING (NOT public.is_demo_user()
    OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
DROP POLICY IF EXISTS student_cosmetics_teacher_write ON public.student_cosmetics;
CREATE POLICY student_cosmetics_teacher_write ON public.student_cosmetics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- Students equip an avatar, frame and title. Frames and titles must be unlocked in the
-- student's latest published snapshot.
CREATE OR REPLACE FUNCTION public.equip_cosmetics(_avatar text, _frame text, _title text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  unlocked jsonb;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid();
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record';
  END IF;
  IF _avatar IS NULL OR _avatar !~ '^avatar-[a-z0-9-]{1,40}$' THEN
    RAISE EXCEPTION 'Choose an avatar';
  END IF;
  SELECT payload -> 'unlocks' INTO unlocked FROM public.game_snapshots WHERE student_id = sid;
  IF _frame IS NOT NULL AND _frame <> 'frame-default'
     AND NOT coalesce((unlocked -> 'frames') ? _frame, false) THEN
    RAISE EXCEPTION 'That frame is still locked';
  END IF;
  IF _title IS NOT NULL AND NOT coalesce((unlocked -> 'titles') ? _title, false) THEN
    RAISE EXCEPTION 'That title is still locked';
  END IF;
  INSERT INTO public.student_cosmetics (student_id, avatar_id, frame_id, title_id, updated_at)
  VALUES (sid, _avatar, nullif(_frame, 'frame-default'), _title, now())
  ON CONFLICT (student_id) DO UPDATE SET
    avatar_id = EXCLUDED.avatar_id,
    frame_id = EXCLUDED.frame_id,
    title_id = EXCLUDED.title_id,
    updated_at = now();
END $$;
REVOKE ALL ON FUNCTION public.equip_cosmetics(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.equip_cosmetics(text, text, text) TO authenticated;

-- 5. Chapter self-check ("I can…" statements). Students tick and untick their own.
CREATE TABLE IF NOT EXISTS public.chapter_self_checks (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  chapter integer NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  objective_id text NOT NULL CHECK (objective_id ~ '^ch[1-7]-[a-z0-9-]{1,40}$'),
  checked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, objective_id)
);
GRANT SELECT, INSERT, DELETE ON public.chapter_self_checks TO authenticated;
GRANT ALL ON public.chapter_self_checks TO service_role;
ALTER TABLE public.chapter_self_checks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS self_checks_read ON public.chapter_self_checks;
CREATE POLICY self_checks_read ON public.chapter_self_checks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
DROP POLICY IF EXISTS self_checks_own_insert ON public.chapter_self_checks;
CREATE POLICY self_checks_own_insert ON public.chapter_self_checks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));
DROP POLICY IF EXISTS self_checks_own_delete ON public.chapter_self_checks;
CREATE POLICY self_checks_own_delete ON public.chapter_self_checks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS game_rewards_student_idx ON public.game_rewards (student_id);
CREATE INDEX IF NOT EXISTS self_checks_student_idx ON public.chapter_self_checks (student_id);
