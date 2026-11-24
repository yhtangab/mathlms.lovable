-- Shop: items, purchases, one look per purchase, separate titles, avatars, and a second title.
-- Replaces the shop parts of the old 0011, 0015 and 0017. Run after 0010 and 0011.
-- Safe to run more than once. Existing prices are left alone.

CREATE TABLE IF NOT EXISTS public.shop_items (
  id text PRIMARY KEY CHECK (id ~ '^shop-[a-z0-9-]{1,40}$'),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 300),
  price integer NOT NULL CHECK (price BETWEEN 1 AND 1000),
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
  ADD CONSTRAINT shop_items_kind_check CHECK (kind IN ('avatar', 'frame', 'title'));
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_ink_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_ink_check CHECK (ink ~ '^#[0-9a-fA-F]{6}$');
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_paper_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_paper_check CHECK (paper ~ '^#[0-9a-fA-F]{6}$');
ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_style_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_style_check
  CHECK (style IS NULL OR style IN (
    'default', 'gold', 'neon', 'prism', 'poly',
    'orbit', 'spark', 'wave', 'comet', 'aurora', 'halo'
  ));

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
    WHEN _kind = 'avatar' THEN cardinality(_grants) = 1
      AND _grants[1] ~ '^avatar-[a-z0-9-]{1,40}$'
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
    RAISE EXCEPTION 'Each purchase is one avatar, one title or one frame';
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

ALTER TABLE public.student_cosmetics
  ADD COLUMN IF NOT EXISTS title_id_2 text;

ALTER TABLE public.student_cosmetics DROP CONSTRAINT IF EXISTS student_cosmetics_title_id_2_check;
ALTER TABLE public.student_cosmetics
  ADD CONSTRAINT student_cosmetics_title_id_2_check
  CHECK (title_id_2 IS NULL OR title_id_2 ~ '^title-[a-z0-9-]{1,40}$');

DROP FUNCTION IF EXISTS public.equip_cosmetics(text, text, text);

CREATE OR REPLACE FUNCTION public.equip_cosmetics(
  _avatar text, _frame text, _title text, _title2 text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid uuid;
  unlocked jsonb;
  owned text[];
  current_avatar text;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid();
  IF sid IS NULL THEN
    RAISE EXCEPTION 'Your account is not linked to a student record';
  END IF;
  IF _avatar IS NULL OR _avatar !~ '^avatar-[a-z0-9-]{1,40}$' THEN
    RAISE EXCEPTION 'Choose an avatar';
  END IF;
  IF _title IS NOT NULL AND _title = _title2 THEN
    RAISE EXCEPTION 'Choose two different titles';
  END IF;
  SELECT payload -> 'unlocks' INTO unlocked FROM public.game_snapshots WHERE student_id = sid;
  SELECT avatar_id INTO current_avatar FROM public.student_cosmetics WHERE student_id = sid;
  SELECT coalesce(array_agg(g), ARRAY[]::text[]) INTO owned
  FROM public.shop_purchases p
  JOIN public.shop_items i ON i.id = p.item_id
  CROSS JOIN LATERAL unnest(i.grants) AS g
  WHERE p.student_id = sid;
  IF _avatar NOT IN ('avatar-owl', 'avatar-shiba', 'avatar-fox', 'avatar-cat')
     AND NOT (_avatar = ANY (owned))
     AND _avatar IS DISTINCT FROM current_avatar THEN
    RAISE EXCEPTION 'Buy that avatar in the Shop first';
  END IF;
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
  IF _title2 IS NOT NULL
     AND NOT coalesce((unlocked -> 'titles') ? _title2, false)
     AND NOT (_title2 = ANY (owned)) THEN
    RAISE EXCEPTION 'That title is still locked';
  END IF;
  INSERT INTO public.student_cosmetics (
    student_id, avatar_id, frame_id, title_id, title_id_2, updated_at
  )
  VALUES (sid, _avatar, nullif(_frame, 'frame-default'), _title, _title2, now())
  ON CONFLICT (student_id) DO UPDATE SET
    avatar_id = EXCLUDED.avatar_id,
    frame_id = EXCLUDED.frame_id,
    title_id = EXCLUDED.title_id,
    title_id_2 = EXCLUDED.title_id_2,
    updated_at = now();
END $$;
REVOKE ALL ON FUNCTION public.equip_cosmetics(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.equip_cosmetics(text, text, text, text) TO authenticated;

UPDATE public.shop_items
SET active = false
WHERE id = 'shop-title-pack';

INSERT INTO public.shop_items (
  id, name, description, price, grants, active, position, kind, emoji, ink, paper, style
) VALUES
  ('shop-formula-fan', 'Formula Fanatic', 'Buy it in the Shop.', 5, ARRAY['title-formula-fan'], true, 10, 'title', 'Σ', '#5b21b6', '#ede9fe', NULL),
  ('shop-graph-guru', 'Graph Guru', 'Buy it in the Shop.', 5, ARRAY['title-graph-guru'], true, 11, 'title', '📈', '#0f766e', '#ccfbf1', NULL),
  ('shop-sigma-scholar', 'Sigma Scholar', 'Buy it in the Shop.', 5, ARRAY['title-sigma-scholar'], true, 12, 'title', 'Σ', '#7c3aed', '#ede9fe', NULL),
  ('shop-equation-explorer', 'Equation Explorer', 'Buy it in the Shop.', 5, ARRAY['title-equation-explorer'], true, 13, 'title', '𝑥', '#1d4ed8', '#dbeafe', NULL),
  ('shop-pi-pioneer', 'Pi Pioneer', 'Buy it in the Shop.', 5, ARRAY['title-pi-pioneer'], true, 14, 'title', 'π', '#b45309', '#fef3c7', NULL),
  ('shop-vector-voyager', 'Vector Voyager', 'Buy it in the Shop.', 5, ARRAY['title-vector-voyager'], true, 15, 'title', '➤', '#0369a1', '#e0f2fe', NULL),
  ('shop-proof-pilot', 'Proof Pilot', 'Buy it in the Shop.', 5, ARRAY['title-proof-pilot'], true, 16, 'title', '✔', '#166534', '#dcfce7', NULL),
  ('shop-radian-ranger', 'Radian Ranger', 'Buy it in the Shop.', 5, ARRAY['title-radian-ranger'], true, 17, 'title', '∠', '#9d174d', '#fce7f3', NULL),
  ('shop-orbit-ring', 'Orbit Ring', 'Buy it in the Shop.', 8, ARRAY['frame-orbit'], true, 20, 'frame', '🪐', '#5b21b6', '#ede9fe', 'orbit'),
  ('shop-spark-ring', 'Spark Ring', 'Buy it in the Shop.', 8, ARRAY['frame-spark'], true, 21, 'frame', '✨', '#5b21b6', '#ede9fe', 'spark'),
  ('shop-wave-ring', 'Wave Ring', 'Buy it in the Shop.', 10, ARRAY['frame-wave'], true, 22, 'frame', '🌊', '#5b21b6', '#ede9fe', 'wave'),
  ('shop-comet-ring', 'Comet Ring', 'Buy it in the Shop.', 12, ARRAY['frame-comet'], true, 23, 'frame', '☄', '#5b21b6', '#ede9fe', 'comet'),
  ('shop-aurora-ring', 'Aurora Ring', 'Buy it in the Shop.', 12, ARRAY['frame-aurora'], true, 24, 'frame', '🌌', '#5b21b6', '#ede9fe', 'aurora'),
  ('shop-halo-ring', 'Halo Ring', 'Buy it in the Shop.', 10, ARRAY['frame-halo'], true, 25, 'frame', '💫', '#5b21b6', '#ede9fe', 'halo'),
  ('shop-avatar-robot', 'Pi Robot', 'Buy it in the Shop.', 8, ARRAY['avatar-robot'], true, 30, 'avatar', '🤖', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-astronaut', 'Calculus Astronaut', 'Buy it in the Shop.', 8, ARRAY['avatar-astronaut'], true, 31, 'avatar', '🚀', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-panda', 'Prime Panda', 'Buy it in the Shop.', 6, ARRAY['avatar-panda'], true, 32, 'avatar', '🐼', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-penguin', 'Proof Penguin', 'Buy it in the Shop.', 6, ARRAY['avatar-penguin'], true, 33, 'avatar', '🐧', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-dragon', 'Fractal Dragon', 'Buy it in the Shop.', 12, ARRAY['avatar-dragon'], true, 34, 'avatar', '🐉', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-octopus', 'Octagon Octopus', 'Buy it in the Shop.', 10, ARRAY['avatar-octopus'], true, 35, 'avatar', '🐙', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-phoenix', 'Ember Phoenix', 'Buy it in the Shop.', 14, ARRAY['avatar-phoenix'], true, 36, 'avatar', '🔥', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-unicorn', 'Prism Unicorn', 'Buy it in the Shop.', 14, ARRAY['avatar-unicorn'], true, 37, 'avatar', '🦄', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-crystal', 'Crystal Golem', 'Buy it in the Shop.', 12, ARRAY['avatar-crystal'], true, 38, 'avatar', '💎', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-whale', 'Aurora Whale', 'Buy it in the Shop.', 12, ARRAY['avatar-whale'], true, 39, 'avatar', '🐳', '#5b21b6', '#ede9fe', NULL),
  ('shop-avatar-hare', 'Comet Hare', 'Buy it in the Shop.', 10, ARRAY['avatar-hare'], true, 40, 'avatar', '🐇', '#5b21b6', '#ede9fe', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.student_cosmetics (student_id, avatar_id, frame_id, title_id, title_id_2)
SELECT id, 'avatar-phoenix', 'frame-aurora', 'title-formula-fan', 'title-pi-pioneer'
FROM public.students
WHERE email = 'demo.student@hlc.edu.hk'
ON CONFLICT (student_id) DO UPDATE SET
  avatar_id = EXCLUDED.avatar_id,
  frame_id = EXCLUDED.frame_id,
  title_id = EXCLUDED.title_id,
  title_id_2 = EXCLUDED.title_id_2,
  updated_at = now();

-- Coin totals count lessons, videos, game rewards and check-ins, minus tickets and Shop items.
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

NOTIFY pgrst, 'reload schema';
