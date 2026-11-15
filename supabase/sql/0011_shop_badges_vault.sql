-- HLC Math LMS · 0011 · Shop, daily check-in, Mistake Vault, exam dates
-- Run 0005, 0009 and 0010 first. Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run more than once.

-- 1) Shop items (virtual items bought with Math Coins). Students read; teachers edit.
CREATE TABLE IF NOT EXISTS public.shop_items (
  id text PRIMARY KEY CHECK (id ~ '^shop-[a-z0-9-]{1,40}$'),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 300),
  price integer NOT NULL CHECK (price BETWEEN 1 AND 1000),
  -- What buying it unlocks: frame ids (frame-…) and title ids (title-…).
  grants text[] NOT NULL CHECK (cardinality(grants) BETWEEN 1 AND 10),
  active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shop_items TO authenticated;
GRANT ALL ON public.shop_items TO service_role;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shop_items_read ON public.shop_items;
CREATE POLICY shop_items_read ON public.shop_items FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS shop_items_teacher_write ON public.shop_items;
CREATE POLICY shop_items_teacher_write ON public.shop_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));

INSERT INTO public.shop_items (id, name, description, price, grants, position) VALUES
  ('shop-golden-compass', 'Golden Compass Frame', 'A gold frame with a compass badge for your avatar.', 8, ARRAY['frame-gold'], 1),
  ('shop-neon-frame', 'Calculus Master Neon Frame', 'An animated, glowing neon frame for your avatar.', 15, ARRAY['frame-neon'], 2),
  ('shop-title-pack', 'Title Pack', 'Three titles: Formula Fanatic, Graph Guru and Sigma Scholar.', 5,
    ARRAY['title-formula-fan', 'title-graph-guru', 'title-sigma-scholar'], 3)
ON CONFLICT (id) DO NOTHING;

-- 2) What each student has bought. Students buy only through buy_shop_item().
CREATE TABLE IF NOT EXISTS public.shop_purchases (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES public.shop_items(id) ON DELETE RESTRICT,
  price integer NOT NULL CHECK (price >= 0),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, item_id)
);
GRANT SELECT ON public.shop_purchases TO authenticated;
GRANT ALL ON public.shop_purchases TO service_role;
ALTER TABLE public.shop_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS shop_purchases_read ON public.shop_purchases;
CREATE POLICY shop_purchases_read ON public.shop_purchases FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id
    AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));

-- 3) Daily 1-question check-in. One per student per Hong Kong day; added only through
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

-- 4) Coin totals per student: lessons + videos + game rewards + check-ins, minus tickets and
--    Shop items. New columns are added at the end so older code keeps working.
CREATE OR REPLACE VIEW public.student_coin_totals WITH (security_invoker = true) AS
SELECT
  s.id AS student_id,
  coalesce((SELECT sum(m.marks) FROM public.daily_marks m WHERE m.student_id = s.id), 0)::integer AS daily_earned,
  (SELECT count(*) FROM public.chapter_video_completions v WHERE v.student_id = s.id)::integer AS video_earned,
  coalesce((SELECT sum(r.cost) FROM public.reward_redemptions r WHERE r.student_id = s.id AND r.status <> 'rejected'), 0)::integer AS spent,
  coalesce((SELECT sum(g.mc) FROM public.game_rewards g WHERE g.student_id = s.id), 0)::integer AS reward_earned,
  ((SELECT count(*) FROM public.daily_checkins c WHERE c.student_id = s.id) / 5)::integer AS checkin_earned,
  coalesce((SELECT sum(p.price) FROM public.shop_purchases p WHERE p.student_id = s.id), 0)::integer AS shop_spent
FROM public.students s;
GRANT SELECT ON public.student_coin_totals TO authenticated;

-- The one balance sum used by every spending function (the app's coinBalance() matches it).
CREATE OR REPLACE FUNCTION public.coin_balance(_student_id uuid) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (
    coalesce((SELECT sum(marks) FROM public.daily_marks WHERE student_id = _student_id), 0)
    + (SELECT count(*) FROM public.chapter_video_completions WHERE student_id = _student_id)
    + coalesce((SELECT sum(mc) FROM public.game_rewards WHERE student_id = _student_id), 0)
    + (SELECT count(*) FROM public.daily_checkins WHERE student_id = _student_id) / 5
    - coalesce((SELECT sum(cost) FROM public.reward_redemptions WHERE student_id = _student_id AND status <> 'rejected'), 0)
    - coalesce((SELECT sum(price) FROM public.shop_purchases WHERE student_id = _student_id), 0)
  )::integer
$$;
REVOKE ALL ON FUNCTION public.coin_balance(uuid) FROM PUBLIC, anon, authenticated;

-- 5) Redemption tickets now count every kind of coin.
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id uuid) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  r public.rewards%ROWTYPE;
  balance integer;
  new_id uuid;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid() FOR UPDATE;
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record yet';
  END IF;
  SELECT * INTO r FROM public.rewards WHERE id = _reward_id AND active;
  IF r.id IS NULL THEN
    RAISE EXCEPTION 'This reward is not available right now';
  END IF;
  IF r.cooldown_days IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.reward_redemptions
    WHERE student_id = sid AND reward_id = r.id AND status <> 'rejected'
      AND created_at > now() - make_interval(days => r.cooldown_days)
  ) THEN
    RAISE EXCEPTION 'You can only redeem % once every % days', r.name, r.cooldown_days;
  END IF;
  balance := public.coin_balance(sid);
  IF balance < r.cost THEN
    RAISE EXCEPTION 'Not enough Math Coins: you have %, this reward costs %', balance, r.cost;
  END IF;
  INSERT INTO public.reward_redemptions (student_id, reward_id, reward_name, cost)
  VALUES (sid, r.id, r.emoji || ' ' || r.name, r.cost)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$;
REVOKE ALL ON FUNCTION public.redeem_reward(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(uuid) TO authenticated;

-- 6) Buy a Shop item: checks the balance and that it was not bought before.
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

-- 7) Equip: frames and titles may be earned (latest published snapshot) or bought.
CREATE OR REPLACE FUNCTION public.equip_cosmetics(_avatar text, _frame text, _title text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  unlocked jsonb;
  owned text[];
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid();
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record';
  END IF;
  IF _avatar IS NULL OR _avatar !~ '^avatar-[a-z0-9-]{1,40}$' THEN
    RAISE EXCEPTION 'Choose an avatar';
  END IF;
  SELECT payload -> 'unlocks' INTO unlocked FROM public.game_snapshots WHERE student_id = sid;
  SELECT coalesce(array_agg(g), ARRAY[]::text[]) INTO owned
  FROM public.shop_purchases p
  JOIN public.shop_items i ON i.id = p.item_id
  CROSS JOIN LATERAL unnest(i.grants) AS g
  WHERE p.student_id = sid;
  IF _frame IS NOT NULL AND _frame <> 'frame-default'
     AND NOT coalesce((unlocked -> 'frames') ? _frame, false)
     AND NOT (_frame = ANY (owned)) THEN
    RAISE EXCEPTION 'That frame is still locked';
  END IF;
  IF _title IS NOT NULL
     AND NOT coalesce((unlocked -> 'titles') ? _title, false)
     AND NOT (_title = ANY (owned)) THEN
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

-- 8) Record today's check-in (Hong Kong date, so it cannot be back-dated).
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

-- 9) Mistake Vault. Students keep their own; teachers can read them.
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

-- Question photos: private bucket, one folder per student id, 5 MB images only.
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

-- 10) Test and exam dates for the countdown. Everyone reads; teachers edit.
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

-- 11) Leaderboards: "coursework" is now "ca" (Continuous Assessment, TnA2).
DELETE FROM public.game_leaderboards WHERE metric NOT IN ('total', 'ca', 'exp');
ALTER TABLE public.game_leaderboards DROP CONSTRAINT IF EXISTS game_leaderboards_metric_check;
ALTER TABLE public.game_leaderboards ADD CONSTRAINT game_leaderboards_metric_check
  CHECK (metric IN ('total', 'ca', 'exp'));

-- 12) The privilege and gift tickets from the Step 3 brief (added once, by name).
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
