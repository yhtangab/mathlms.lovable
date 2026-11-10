REVOKE ALL ON FUNCTION public.create_math_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.claim_student() FROM anon;
REVOKE ALL ON FUNCTION public.complete_video(integer) FROM anon;