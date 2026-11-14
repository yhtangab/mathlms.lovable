-- One-row settings table for app-wide switches. First switch: the 2x Math Coins event.
-- Everyone signed in can read it (students see the banner); only teachers can change it.
-- Nobody can add or delete rows from the app. Safe to run more than once.
CREATE TABLE IF NOT EXISTS public.system_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  double_mc_event_active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

INSERT INTO public.system_config (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

GRANT SELECT, UPDATE ON public.system_config TO authenticated;
GRANT ALL ON public.system_config TO service_role;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS system_config_read ON public.system_config;
CREATE POLICY system_config_read ON public.system_config
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS system_config_teacher_update ON public.system_config;
CREATE POLICY system_config_teacher_update ON public.system_config
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));
