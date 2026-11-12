CREATE TABLE public.chapter_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter integer NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  url text NOT NULL CHECK (url ~ '^https://'),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapter_videos TO authenticated;
GRANT ALL ON public.chapter_videos TO service_role;
ALTER TABLE public.chapter_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY videos_read ON public.chapter_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY teacher_videos_write ON public.chapter_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE INDEX chapter_videos_chapter_idx ON public.chapter_videos(chapter, position);

CREATE TABLE public.chapter_video_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  video_id uuid REFERENCES public.chapter_videos(id) ON DELETE SET NULL,
  chapter integer NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  video_title text NOT NULL,
  marks integer NOT NULL DEFAULT 1 CHECK (marks = 1),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, video_id)
);
GRANT SELECT ON public.chapter_video_completions TO authenticated;
GRANT ALL ON public.chapter_video_completions TO service_role;
ALTER TABLE public.chapter_video_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_video_completion_read ON public.chapter_video_completions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE INDEX chapter_video_completions_student_idx ON public.chapter_video_completions(student_id);

-- Backfill the single video each chapter used to have, and its earned marks.
INSERT INTO public.chapter_videos (chapter, title, url, position)
SELECT chapter, 'Chapter ' || chapter || ' video', video, 0 FROM public.chapter_content WHERE video ~ '^https://';
INSERT INTO public.chapter_video_completions (student_id, video_id, chapter, video_title, completed_at)
SELECT vc.student_id, cv.id, vc.chapter, cv.title, vc.completed_at
FROM public.video_completions vc JOIN public.chapter_videos cv ON cv.chapter = vc.chapter AND cv.url = vc.video_url
ON CONFLICT DO NOTHING;

CREATE FUNCTION public.complete_chapter_video(_video_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE sid uuid; v record; n integer;
BEGIN
  SELECT id INTO sid FROM public.students WHERE user_id = auth.uid();
  SELECT id, chapter, title INTO v FROM public.chapter_videos WHERE id = _video_id;
  IF sid IS NULL OR v.id IS NULL THEN RAISE EXCEPTION 'No student or video found'; END IF;
  INSERT INTO public.chapter_video_completions(student_id, video_id, chapter, video_title) VALUES (sid, v.id, v.chapter, v.title) ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END $$;
REVOKE ALL ON FUNCTION public.complete_chapter_video(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_chapter_video(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.complete_chapter_video(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.complete_video(integer) FROM authenticated;
COMMENT ON FUNCTION public.complete_video(integer) IS 'DEPRECATED: replaced by complete_chapter_video';
COMMENT ON TABLE public.video_completions IS 'DEPRECATED: replaced by chapter_video_completions';
COMMENT ON COLUMN public.chapter_content.video IS 'DEPRECATED: replaced by chapter_videos';