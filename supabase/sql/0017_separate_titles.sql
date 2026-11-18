-- Split the title pack into separate titles, and add animated frames and titles.
-- Run after 0015. Safe to run more than once. Existing prices are left alone.

ALTER TABLE public.shop_items DROP CONSTRAINT IF EXISTS shop_items_style_check;
ALTER TABLE public.shop_items
  ADD CONSTRAINT shop_items_style_check
  CHECK (style IS NULL OR style IN (
    'default', 'gold', 'neon', 'prism', 'poly',
    'orbit', 'spark', 'wave', 'comet', 'aurora', 'halo'
  ));

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
  ('shop-halo-ring', 'Halo Ring', 'Buy it in the Shop.', 10, ARRAY['frame-halo'], true, 25, 'frame', '💫', '#5b21b6', '#ede9fe', 'halo')
ON CONFLICT (id) DO NOTHING;
