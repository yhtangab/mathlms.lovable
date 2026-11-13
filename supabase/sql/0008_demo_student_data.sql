-- Realistic marks for demo.student@hlc.edu.hk so the demo dashboard is not all zeros.
-- Only touches the demo student's own rows. Safe to run more than once.
-- Run after 0005 (it uses daily_marks.note and daily_marks.batch_id).
DO $$
DECLARE
  demo_email constant text := 'demo.student@hlc.edu.hk';
  demo_batch constant uuid := 'b1d3d3d3-0000-4000-8000-00000000d3e0';
  demo_user uuid;
  teacher_user uuid;
  sid uuid;
BEGIN
  SELECT u.id INTO demo_user FROM auth.users u WHERE lower(u.email) = demo_email;
  SELECT u.id INTO teacher_user FROM auth.users u WHERE lower(u.email) = 'yhtang@hlc.edu.hk';

  -- Only link the login if it has a profile row and is not linked to another student.
  IF demo_user IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = demo_user) THEN
    demo_user := NULL;
  END IF;
  IF demo_user IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.students s WHERE s.user_id = demo_user AND s.email <> demo_email
  ) THEN
    demo_user := NULL;
  END IF;

  INSERT INTO public.students (email, name, math_set, class_name, class_no, last_month_avg, user_id)
  VALUES (demo_email, 'Demo Student', 'S2M3', 'Demo', '1', 66, demo_user)
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    math_set = EXCLUDED.math_set,
    class_name = EXCLUDED.class_name,
    class_no = EXCLUDED.class_no,
    last_month_avg = EXCLUDED.last_month_avg,
    user_id = COALESCE(public.students.user_id, EXCLUDED.user_id)
  RETURNING id INTO sid;

  -- Chapter scores come from the assessment marks below, not from typed overrides.
  DELETE FROM public.chapter_scores WHERE student_id = sid;

  DELETE FROM public.assessment_scores WHERE student_id = sid;
  INSERT INTO public.assessment_scores
    (student_id, term, kind, category, label, score, absent, full_marks, position)
  VALUES
    (sid, 1, 'item', 'homework', 'HW1.1', 9, false, 10, 6),
    (sid, 1, 'item', 'homework', 'HW1.2', 8, false, 10, 7),
    (sid, 1, 'item', 'homework', 'HW2.1', 7, false, 10, 8),
    (sid, 1, 'item', 'homework', 'HW2.2', 9, false, 10, 9),
    (sid, 1, 'item', 'homework', 'HW3.1', 6, false, 10, 10),
    (sid, 1, 'item', 'homework', 'HW4.1', 8, false, 10, 11),
    (sid, 1, 'item', 'short_quiz', 'SQ1.1', 11, false, 14, 13),
    (sid, 1, 'item', 'short_quiz', 'SQ1.2', 12, false, 13, 14),
    (sid, 1, 'item', 'short_quiz', 'SQ2.1', 9, false, 15, 15),
    (sid, 1, 'item', 'short_quiz', 'SQ2.2', NULL, true, 15, 16),
    (sid, 1, 'item', 'short_quiz', 'SQ3.1', 7, false, 14, 17),
    (sid, 1, 'item', 'chapter_quiz', 'CQ1', 41, false, 50, 19),
    (sid, 1, 'item', 'chapter_quiz', 'CQ2', 33, false, 50, 20),
    (sid, 1, 'item', 'chapter_quiz', 'CQ3', 24, false, 50, 21),
    (sid, 1, 'item', 'mock', 'Mock 1', 72, false, 100, 23),
    (sid, 1, 'summary', 'daily', 'Daily (10%)', 8, false, 10, 25);

  DELETE FROM public.daily_marks WHERE student_id = sid AND batch_id = demo_batch;
  INSERT INTO public.daily_marks
    (student_id, awarded_by, lesson_date, marks, reason, note, batch_id, created_at)
  VALUES
    (sid, COALESCE(teacher_user, sid), (now() - interval '15 days')::date, 2, 'classwork', 'Ex 1A Q1-8', demo_batch, now() - interval '15 days'),
    (sid, COALESCE(teacher_user, sid), (now() - interval '12 days')::date, 1, 'correct_answer', 'Lucky draw', demo_batch, now() - interval '12 days'),
    (sid, COALESCE(teacher_user, sid), (now() - interval '9 days')::date, 2, 'participation', 'Group work', demo_batch, now() - interval '9 days'),
    (sid, COALESCE(teacher_user, sid), (now() - interval '6 days')::date, 3, 'classwork', 'Ex 2B', demo_batch, now() - interval '6 days'),
    (sid, COALESCE(teacher_user, sid), (now() - interval '3 days')::date, 1, 'correct_answer', 'Lucky draw', demo_batch, now() - interval '3 days'),
    (sid, COALESCE(teacher_user, sid), (now() - interval '1 day')::date, 2, 'participation', 'Board work', demo_batch, now() - interval '1 day');
END $$;
