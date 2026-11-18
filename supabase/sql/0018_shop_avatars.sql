-- Shop avatars, a second equipped title, and a new look for the demo student.
-- Run after 0017. Safe to run more than once.

ALTER TABLE public.student_cosmetics
  ADD COLUMN IF NOT EXISTS title_id_2 text;

ALTER TABLE public.student_cosmetics DROP CONSTRAINT IF EXISTS student_cosmetics_title_id_2_check;
ALTER TABLE public.student_cosmetics
  ADD CONSTRAINT student_cosmetics_title_id_2_check
  CHECK (title_id_2 IS NULL OR title_id_2 ~ '^title-[a-z0-9-]{1,40}$');

ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_kind_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_kind_check CHECK (kind IN ('avatar', 'frame', 'title'));

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

INSERT INTO public.shop_items (
  id, name, description, price, grants, active, position, kind, emoji, ink, paper, style
) VALUES
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
