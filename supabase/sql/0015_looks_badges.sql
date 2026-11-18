-- Shop looks the teacher can design, and badge rules the teacher can tune.
-- Run after 0011 and 0014. Safe to run more than once.

-- 1) Each Shop look is one frame or one title. The title pack is removed.
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS kind text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS emoji text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS ink text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS paper text;
ALTER TABLE public.shop_items ADD COLUMN IF NOT EXISTS style text;

UPDATE public.shop_items
SET
  kind = CASE WHEN id = 'shop-title-pack' THEN 'title' ELSE 'frame' END,
  emoji = CASE WHEN id = 'shop-neon-frame' THEN '💜' ELSE '🧭' END,
  ink = '#5b21b6',
  paper = '#ede9fe',
  style = CASE
    WHEN id = 'shop-golden-compass' THEN 'gold'
    WHEN id = 'shop-neon-frame' THEN 'neon'
    ELSE NULL
  END
WHERE kind IS NULL;

ALTER TABLE public.shop_items ALTER COLUMN kind SET DEFAULT 'title';
ALTER TABLE public.shop_items ALTER COLUMN emoji SET DEFAULT '✨';
ALTER TABLE public.shop_items ALTER COLUMN ink SET DEFAULT '#5b21b6';
ALTER TABLE public.shop_items ALTER COLUMN paper SET DEFAULT '#ede9fe';
UPDATE public.shop_items SET kind = 'frame' WHERE kind IS NULL;
UPDATE public.shop_items SET emoji = '✨' WHERE emoji IS NULL OR length(trim(emoji)) = 0;
UPDATE public.shop_items SET ink = '#5b21b6' WHERE ink IS NULL;
UPDATE public.shop_items SET paper = '#ede9fe' WHERE paper IS NULL;
ALTER TABLE public.shop_items ALTER COLUMN kind SET NOT NULL;
ALTER TABLE public.shop_items ALTER COLUMN emoji SET NOT NULL;
ALTER TABLE public.shop_items ALTER COLUMN ink SET NOT NULL;
ALTER TABLE public.shop_items ALTER COLUMN paper SET NOT NULL;

ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_kind_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_kind_check CHECK (kind IN ('frame', 'title'));
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_ink_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_ink_check CHECK (ink ~ '^#[0-9a-fA-F]{6}$');
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_paper_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_paper_check CHECK (paper ~ '^#[0-9a-fA-F]{6}$');
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_style_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_style_check
  CHECK (style IS NULL OR style IN ('default', 'gold', 'neon', 'prism', 'poly'));

-- One title per purchase. Shrink the old pack, then delete it when nobody owns it.
UPDATE public.shop_items
SET active = false, grants = ARRAY['title-formula-fan']::text[]
WHERE id = 'shop-title-pack';
DELETE FROM public.shop_items
WHERE id = 'shop-title-pack'
  AND NOT EXISTS (
    SELECT 1 FROM public.shop_purchases p WHERE p.item_id = 'shop-title-pack'
  );

CREATE OR REPLACE FUNCTION public.shop_grants_ok(_kind text, _grants text[])
RETURNS boolean
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN _kind = 'title' THEN cardinality(_grants) = 1
      AND _grants[1] ~ '^title-[a-z0-9-]{1,40}$'
    WHEN _kind = 'frame' THEN cardinality(_grants) = 1
      AND _grants[1] ~ '^frame-[a-z0-9-]{1,40}$'
    ELSE false
  END
$$;

ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_one_grant_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_one_grant_check
  CHECK (public.shop_grants_ok(kind, grants));

CREATE OR REPLACE FUNCTION public.buy_shop_item(_item_id text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  item public.shop_items%ROWTYPE;
  balance integer;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid() FOR UPDATE;
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record yet';
  END IF;
  SELECT * INTO item FROM public.shop_items WHERE id = _item_id AND active;
  IF item.id IS NULL THEN
    RAISE EXCEPTION 'This item is not available right now';
  END IF;
  IF NOT public.shop_grants_ok(item.kind, item.grants) THEN
    RAISE EXCEPTION 'Each purchase can include only one title or one frame';
  END IF;
  IF EXISTS (SELECT 1 FROM public.shop_purchases WHERE student_id = sid AND item_id = item.id) THEN
    RAISE EXCEPTION 'You already own %', item.name;
  END IF;
  balance := public.coin_balance(sid);
  IF balance < item.price THEN
    RAISE EXCEPTION 'Not enough Math Coins: you have %, % costs %', balance, item.name, item.price;
  END IF;
  INSERT INTO public.shop_purchases (student_id, item_id, price) VALUES (sid, item.id, item.price);
END $$;
REVOKE ALL ON FUNCTION public.buy_shop_item(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buy_shop_item(text) TO authenticated;

-- 2) Badge rules. Teachers change the numbers and can hide a badge. Students read published ones.
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
  ('board-top1', 'Board Leader', '👑', 'Be 1st on your set EXP leaderboard. One day counts once, when the teacher publishes.', 'days in 1st', 1, 5, 10, 20, 11),
  ('board-top3', 'Board Podium', '🏅', 'Be in the top 3 of your set EXP leaderboard.', 'days in the top 3', 1, 5, 10, 20, 12),
  ('board-top10', 'Board Regular', '📈', 'Be in the top 10 of your set EXP leaderboard.', 'days in the top 10', 1, 5, 10, 20, 13)
ON CONFLICT (id) DO NOTHING;

-- 3) One row per student, per leaderboard badge, per Hong Kong day. Publish writes these.
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
