-- Achievement badges: coin reason, badge rules, and one row per leaderboard day.
-- Run after 0010. Safe to run more than once. Existing thresholds are left alone.

ALTER TABLE public.game_rewards DROP CONSTRAINT IF EXISTS game_rewards_reason_check;
ALTER TABLE public.game_rewards
  ADD CONSTRAINT game_rewards_reason_check
  CHECK (reason IN ('quiz_top3', 'quiz_top10', 'most_improved', 'homework_streak', 'badge'));

CREATE TABLE IF NOT EXISTS public.badge_defs (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9-]{1,40}$'),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  emoji text NOT NULL CHECK (length(emoji) BETWEEN 1 AND 8),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 300),
  unit text NOT NULL CHECK (length(unit) BETWEEN 1 AND 80),
  bronze integer NOT NULL CHECK (bronze BETWEEN 1 AND 999),
  silver integer NOT NULL CHECK (silver BETWEEN 1 AND 999),
  gold integer NOT NULL CHECK (gold BETWEEN 1 AND 999),
  diamond integer NOT NULL CHECK (diamond BETWEEN 1 AND 999),
  published boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  CHECK (bronze < silver AND silver < gold AND gold < diamond)
);
GRANT SELECT, UPDATE ON public.badge_defs TO authenticated;
GRANT ALL ON public.badge_defs TO service_role;
ALTER TABLE public.badge_defs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS badge_defs_read ON public.badge_defs;
CREATE POLICY badge_defs_read ON public.badge_defs FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(), 'teacher'));
DROP POLICY IF EXISTS badge_defs_teacher_write ON public.badge_defs;
CREATE POLICY badge_defs_teacher_write ON public.badge_defs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

INSERT INTO public.badge_defs (id, name, emoji, description, unit, bronze, silver, gold, diamond, position) VALUES
  ('full-marks', 'Full Marks Slayer', '🛡️', 'Score 100% in a short quiz or chapter quiz.', 'full-mark quizzes', 1, 3, 6, 10, 1),
  ('homework-hero', 'Homework Hero', '🔥', 'Hand in homework on time, many in a row.', 'in a row (your best)', 10, 20, 30, 40, 2),
  ('topic-master', 'Chapter Complete', '🎯', 'Reach 100% of the progress of a chapter.', 'chapters at 100%', 1, 3, 7, 12, 3),
  ('active-voice', 'Active Voice', '🙋', 'Get picked in the class lucky draw and answer correctly.', 'correct lucky-draw answers', 10, 20, 35, 50, 4),
  ('comeback-kid', 'Comeback Kid', '🚀', 'Improve a chapter quiz by 15 points or more on the one before.', 'comebacks', 1, 2, 3, 5, 5),
  ('mistake-conqueror', 'Mistake Conqueror', '🧠', 'Log mistakes in the Mistake Vault and master them.', 'mistakes mastered', 3, 10, 20, 40, 6),
  ('daily-streak', 'Daily Streak Master', '⚡', 'Do the daily check-in on days in a row.', 'days in a row (your best)', 3, 7, 14, 30, 7),
  ('cq-top1', 'Quiz Champion', '🥇', 'Finish 1st in a chapter quiz in your set.', 'chapter quizzes in 1st', 1, 3, 5, 10, 8),
  ('cq-top3', 'Quiz Podium', '🥉', 'Finish in the top 3 of a chapter quiz in your set.', 'chapter quizzes in the top 3', 1, 3, 5, 10, 9),
  ('cq-bottom3', 'Keep Going', '💪', 'Finish in the bottom 3 of a chapter quiz (classes of at least 4).', 'chapter quizzes in the bottom 3', 1, 3, 5, 10, 10),
  ('board-top1', 'Board Leader', '👑', 'Be 1st on your set Continuous Assessment leaderboard. Each day counts once, when the teacher publishes.', 'days in 1st', 1, 5, 10, 20, 11),
  ('board-top3', 'Board Podium', '🏅', 'Be in the top 3 of your set Continuous Assessment leaderboard.', 'days in the top 3', 1, 5, 10, 20, 12),
  ('board-top10', 'Board Regular', '📈', 'Be in the top 10 of your set Continuous Assessment leaderboard.', 'days in the top 10', 1, 5, 10, 20, 13)
ON CONFLICT (id) DO NOTHING;

-- Only rewrite a description that still mentions EXP, so a teacher's own wording stays.
UPDATE public.badge_defs
SET description = 'Be 1st on your set Continuous Assessment leaderboard. Each day counts once, when the teacher publishes.'
WHERE id = 'board-top1'
  AND description LIKE '%EXP%';

UPDATE public.badge_defs
SET description = 'Be in the top 3 of your set Continuous Assessment leaderboard.'
WHERE id = 'board-top3'
  AND description LIKE '%EXP%';

UPDATE public.badge_defs
SET description = 'Be in the top 10 of your set Continuous Assessment leaderboard.'
WHERE id = 'board-top10'
  AND description LIKE '%EXP%';

CREATE TABLE IF NOT EXISTS public.badge_days (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  badge_id text NOT NULL REFERENCES public.badge_defs(id) ON DELETE CASCADE,
  day date NOT NULL,
  PRIMARY KEY (student_id, badge_id, day)
);
GRANT SELECT, INSERT ON public.badge_days TO authenticated;
GRANT ALL ON public.badge_days TO service_role;
ALTER TABLE public.badge_days ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS badge_days_read ON public.badge_days;
CREATE POLICY badge_days_read ON public.badge_days FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher')
    OR EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = student_id AND s.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS badge_days_teacher_insert ON public.badge_days;
CREATE POLICY badge_days_teacher_insert ON public.badge_days FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

NOTIFY pgrst, 'reload schema';
