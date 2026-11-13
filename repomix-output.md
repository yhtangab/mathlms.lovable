This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
drizzle/
  migrations/
    meta/
      _journal.json
      0000_snapshot.json
      0001_snapshot.json
      0002_snapshot.json
      0003_snapshot.json
      0004_snapshot.json
    0000_private_math_records.sql
    0001_chapter_notes_access.sql
    0002_restrict_math_function_grants.sql
    0003_assessment_gradebook.sql
    0004_chapter_videos.sql
  schema.ts
public/
  favicon.ico
  robots.txt
src/
  components/
    ui/
      accordion.tsx
      alert-dialog.tsx
      alert.tsx
      aspect-ratio.tsx
      avatar.tsx
      badge.tsx
      breadcrumb.tsx
      button.tsx
      calendar.tsx
      card.tsx
      carousel.tsx
      chart.tsx
      checkbox.tsx
      collapsible.tsx
      command.tsx
      context-menu.tsx
      dialog.tsx
      drawer.tsx
      dropdown-menu.tsx
      form.tsx
      hover-card.tsx
      input-otp.tsx
      input.tsx
      label.tsx
      menubar.tsx
      navigation-menu.tsx
      pagination.tsx
      popover.tsx
      progress.tsx
      radio-group.tsx
      resizable.tsx
      scroll-area.tsx
      select.tsx
      separator.tsx
      sheet.tsx
      sidebar.tsx
      skeleton.tsx
      slider.tsx
      sonner.tsx
      switch.tsx
      table.tsx
      tabs.tsx
      textarea.tsx
      toggle-group.tsx
      toggle.tsx
      tooltip.tsx
    AppShell.tsx
    AssessmentReport.tsx
    ChapterVideoPlayer.tsx
    LessonMarks.tsx
    SheetGradebook.tsx
  hooks/
    use-mobile.tsx
  integrations/
    supabase/
      auth-attacher.ts
      auth-middleware.ts
      client.server.ts
      client.ts
      cron-auth.ts
      previewAuthStorage.ts
      types.ts
  lib/
    app-store.tsx
    assessments.ts
    coins.ts
    data.ts
    drive-link.ts
    error-capture.ts
    error-page.ts
    grade-rules.ts
    lovable-error-reporting.ts
    math.functions.ts
    sheet-parse.ts
    sheets.functions.ts
    utils.ts
    video-watch.ts
  routes/
    _authenticated/
      activity.tsx
      awards.tsx
      courses.$chapter.tsx
      courses.index.tsx
      dashboard.tsx
      leaderboard.tsx
      route.tsx
      teacher.tsx
      upload.tsx
    __root.tsx
    index.tsx
    README.md
    reset-password.tsx
  test/
    app-routing.test.tsx
    grade-rules.test.ts
    setup.ts
    sheet-sync.test.ts
    student-privacy.integration.test.ts
    video-watch.test.ts
  router.tsx
  routeTree.gen.ts
  server.ts
  start.ts
  styles.css
supabase/
  config.toml
.gitignore
.prettierignore
.prettierrc
AGENTS.md
bunfig.toml
components.json
dev
drizzle.config.ts
eslint.config.js
package.json
README.md
roadmap.md
tsconfig.json
vite.config.ts
vitest.config.ts
````

# Files

## File: drizzle/migrations/meta/0000_snapshot.json
````json
{
  "id": "5d6dca4e-6546-4810-b387-eb15539d2b63",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "version": "7",
  "dialect": "postgresql",
  "tables": {},
  "enums": {},
  "schemas": {},
  "views": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
````

## File: drizzle/migrations/meta/0001_snapshot.json
````json
{
  "id": "3bf8d9df-c722-4d33-b7f8-e5d71068c37c",
  "prevId": "5d6dca4e-6546-4810-b387-eb15539d2b63",
  "version": "7",
  "dialect": "postgresql",
  "tables": {},
  "enums": {},
  "schemas": {},
  "views": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
````

## File: drizzle/migrations/meta/0002_snapshot.json
````json
{
  "id": "361c4ae2-20f5-448f-84ea-5064779aa395",
  "prevId": "3bf8d9df-c722-4d33-b7f8-e5d71068c37c",
  "version": "7",
  "dialect": "postgresql",
  "tables": {},
  "enums": {},
  "schemas": {},
  "views": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
````

## File: drizzle/migrations/meta/0003_snapshot.json
````json
{
  "id": "32054d1f-2588-4850-920b-322ea98e3454",
  "prevId": "361c4ae2-20f5-448f-84ea-5064779aa395",
  "version": "7",
  "dialect": "postgresql",
  "tables": {},
  "enums": {},
  "schemas": {},
  "views": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
````

## File: drizzle/migrations/meta/0004_snapshot.json
````json
{
  "id": "a094e4bf-d48a-4325-a393-73f24c3f1128",
  "prevId": "32054d1f-2588-4850-920b-322ea98e3454",
  "version": "7",
  "dialect": "postgresql",
  "tables": {},
  "enums": {},
  "schemas": {},
  "views": {},
  "sequences": {},
  "roles": {},
  "policies": {},
  "_meta": {
    "columns": {},
    "schemas": {},
    "tables": {}
  }
}
````

## File: drizzle/migrations/0000_private_math_records.sql
````sql
CREATE TYPE public.app_role AS ENUM ('teacher', 'student');
CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, display_name text NOT NULL DEFAULT '', preferences jsonb NOT NULL DEFAULT '{}');
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_role_read ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE FUNCTION public.create_math_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles(id, display_name) VALUES(NEW.id, coalesce(NEW.raw_user_meta_data->>'full_name', '')); INSERT INTO public.user_roles(user_id, role) VALUES(NEW.id, 'student'); RETURN NEW; END $$;
CREATE TRIGGER math_profile_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_math_profile();
CREATE TABLE public.students (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL, name text NOT NULL, email text NOT NULL UNIQUE CHECK (email = lower(email)), math_set text NOT NULL CHECK (math_set IN ('S2M3','S2M5')), last_month_avg integer NOT NULL DEFAULT 0, last_month_form_rank integer NOT NULL DEFAULT 0, xp integer NOT NULL DEFAULT 0, streak integer NOT NULL DEFAULT 0);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY student_own_read ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY teacher_roster_write ON public.students FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE FUNCTION public.claim_student() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE verified_email text; BEGIN SELECT lower(email) INTO verified_email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL; IF verified_email IS NOT NULL THEN UPDATE public.students SET user_id = auth.uid() WHERE email = verified_email AND (user_id IS NULL OR user_id = auth.uid()); END IF; END $$;
REVOKE ALL ON FUNCTION public.claim_student() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_student() TO authenticated;
CREATE TABLE public.chapter_scores (student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE, chapter integer NOT NULL CHECK (chapter BETWEEN 1 AND 7), score integer CHECK (score BETWEEN 0 AND 100), PRIMARY KEY(student_id, chapter));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapter_scores TO authenticated;
GRANT ALL ON public.chapter_scores TO service_role;
ALTER TABLE public.chapter_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_scores_read ON public.chapter_scores FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE POLICY teacher_scores_write ON public.chapter_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE TABLE public.daily_marks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE, awarded_by uuid NOT NULL, lesson_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Hong_Kong')::date), marks integer NOT NULL CHECK (marks BETWEEN 0 AND 100), reason text NOT NULL CHECK (reason IN ('classwork','participation','correct_answer','incorrect_answer')), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.daily_marks TO authenticated;
GRANT ALL ON public.daily_marks TO service_role;
ALTER TABLE public.daily_marks ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_marks_read ON public.daily_marks FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE POLICY teacher_marks_insert ON public.daily_marks FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'teacher') AND awarded_by = auth.uid());
CREATE TABLE public.chapter_content (chapter integer PRIMARY KEY CHECK(chapter BETWEEN 1 AND 7), video text NOT NULL DEFAULT '', notes text NOT NULL DEFAULT '', quiz text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE ON public.chapter_content TO authenticated;
GRANT ALL ON public.chapter_content TO service_role;
ALTER TABLE public.chapter_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_read ON public.chapter_content FOR SELECT TO authenticated USING (true);
CREATE POLICY teacher_content_write ON public.chapter_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE TABLE public.video_completions (student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE, chapter integer NOT NULL REFERENCES public.chapter_content(chapter), video_url text NOT NULL, marks integer NOT NULL DEFAULT 1 CHECK (marks = 1), completed_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(student_id, chapter));
GRANT SELECT ON public.video_completions TO authenticated;
GRANT ALL ON public.video_completions TO service_role;
ALTER TABLE public.video_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_video_read ON public.video_completions FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE FUNCTION public.complete_video(_chapter integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ DECLARE sid uuid; vid text; BEGIN SELECT id INTO sid FROM public.students WHERE user_id = auth.uid(); SELECT video INTO vid FROM public.chapter_content WHERE chapter = _chapter; IF sid IS NULL OR vid IS NULL OR vid = '' THEN RAISE EXCEPTION 'No student or video found'; END IF; INSERT INTO public.video_completions(student_id, chapter, video_url) VALUES(sid, _chapter, vid) ON CONFLICT DO NOTHING; END $$;
REVOKE ALL ON FUNCTION public.complete_video(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_video(integer) TO authenticated;
CREATE INDEX scores_student_idx ON public.chapter_scores(student_id);
CREATE INDEX marks_student_idx ON public.daily_marks(student_id);
CREATE INDEX students_user_idx ON public.students(user_id);
````

## File: drizzle/migrations/0001_chapter_notes_access.sql
````sql
CREATE POLICY math_notes_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'chapter-notes');
CREATE POLICY math_notes_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'chapter-notes' AND public.has_role(auth.uid(), 'teacher'));
CREATE POLICY math_notes_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'chapter-notes' AND public.has_role(auth.uid(), 'teacher')) WITH CHECK (bucket_id = 'chapter-notes' AND public.has_role(auth.uid(), 'teacher'));
````

## File: drizzle/migrations/0002_restrict_math_function_grants.sql
````sql
REVOKE ALL ON FUNCTION public.create_math_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE ALL ON FUNCTION public.claim_student() FROM anon;
REVOKE ALL ON FUNCTION public.complete_video(integer) FROM anon;
````

## File: drizzle/migrations/0003_assessment_gradebook.sql
````sql
ALTER TABLE public.students ADD COLUMN hlc_no text UNIQUE, ADD COLUMN class_name text NOT NULL DEFAULT '', ADD COLUMN class_no text NOT NULL DEFAULT '';

CREATE TABLE public.assessment_scores (
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term smallint NOT NULL CHECK (term BETWEEN 1 AND 2),
  kind text NOT NULL CHECK (kind IN ('item','summary')),
  category text NOT NULL CHECK (category IN ('homework','short_quiz','chapter_quiz','term_test','mock','exam','daily','overall','other')),
  label text NOT NULL,
  score numeric,
  absent boolean NOT NULL DEFAULT false,
  full_marks numeric,
  position integer NOT NULL DEFAULT 0,
  synced_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, term, kind, label)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_scores TO authenticated;
GRANT ALL ON public.assessment_scores TO service_role;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY private_assessment_read ON public.assessment_scores FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'teacher'))));
CREATE POLICY teacher_assessment_write ON public.assessment_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'teacher')) WITH CHECK (public.has_role(auth.uid(), 'teacher'));
CREATE INDEX assessment_student_idx ON public.assessment_scores(student_id);

CREATE TABLE public.sheet_syncs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  synced_by uuid NOT NULL,
  students integer NOT NULL DEFAULT 0,
  scores integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.sheet_syncs TO authenticated;
GRANT ALL ON public.sheet_syncs TO service_role;
ALTER TABLE public.sheet_syncs ENABLE ROW LEVEL SECURITY;
CREATE POLICY teacher_sync_read ON public.sheet_syncs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher'));
CREATE POLICY teacher_sync_insert ON public.sheet_syncs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'teacher') AND synced_by = auth.uid());
````

## File: drizzle/migrations/0004_chapter_videos.sql
````sql
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
````

## File: drizzle/schema.ts
````typescript
// auto-generated and intentionally left blank, do not edit
````

## File: public/robots.txt
````
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
````

## File: src/components/ui/accordion.tsx
````typescript
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
````

## File: src/components/ui/alert-dialog.tsx
````typescript
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
````

## File: src/components/ui/alert.tsx
````typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
````

## File: src/components/ui/aspect-ratio.tsx
````typescript
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
````

## File: src/components/ui/avatar.tsx
````typescript
"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
````

## File: src/components/ui/badge.tsx
````typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
````

## File: src/components/ui/breadcrumb.tsx
````typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
````

## File: src/components/ui/button.tsx
````typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
````

## File: src/components/ui/calendar.tsx
````typescript
"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day,
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside,
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers["focused"]) ref.current?.focus();
  }, [modifiers]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers["selected"] &&
        !modifiers["range_start"] &&
        !modifiers["range_end"] &&
        !modifiers["range_middle"]
      }
      data-range-start={modifiers["range_start"]}
      data-range-end={modifiers["range_end"]}
      data-range-middle={modifiers["range_middle"]}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
````

## File: src/components/ui/card.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
````

## File: src/components/ui/carousel.tsx
````typescript
import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute  h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
````

## File: src/components/ui/chart.tsx
````typescript
import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`;
              const itemConfig = getPayloadConfigFromPayload(config, item, key);
              const indicatorColor = color || item.payload.fill || item.color;

              return (
                <div
                  key={item.dataKey}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center",
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              },
                            )}
                            style={
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                        )
                      )}
                      <div
                        className={cn(
                          "flex flex-1 justify-between leading-none",
                          nestLabel ? "items-end" : "items-center",
                        )}
                      >
                        <div className="grid gap-1.5">
                          {nestLabel ? tooltipLabel : null}
                          <span className="text-muted-foreground">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value && (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
````

## File: src/components/ui/checkbox.tsx
````typescript
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
````

## File: src/components/ui/collapsible.tsx
````typescript
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
````

## File: src/components/ui/command.tsx
````typescript
"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
````

## File: src/components/ui/context-menu.tsx
````typescript
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
````

## File: src/components/ui/dialog.tsx
````typescript
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
````

## File: src/components/ui/drawer.tsx
````typescript
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
````

## File: src/components/ui/dropdown-menu.tsx
````typescript
"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
````

## File: src/components/ui/form.tsx
````typescript
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
````

## File: src/components/ui/hover-card.tsx
````typescript
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-hover-card-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
````

## File: src/components/ui/input-otp.tsx
````typescript
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {
    char: null,
    hasFakeCaret: false,
    isActive: false,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
````

## File: src/components/ui/input.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
````

## File: src/components/ui/label.tsx
````typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
````

## File: src/components/ui/menubar.tsx
````typescript
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
      className,
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className,
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
      className,
    )}
    {...props}
  />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
};
MenubarShortcut.displayname = "MenubarShortcut";

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
````

## File: src/components/ui/navigation-menu.tsx
````typescript
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent",
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
````

## File: src/components/ui/pagination.tsx
````typescript
import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
````

## File: src/components/ui/popover.tsx
````typescript
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
````

## File: src/components/ui/progress.tsx
````typescript
"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
````

## File: src/components/ui/radio-group.tsx
````typescript
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
````

## File: src/components/ui/resizable.tsx
````typescript
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof Group>) => (
  <Group
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean;
}) => (
  <Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
````

## File: src/components/ui/scroll-area.tsx
````typescript
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
````

## File: src/components/ui/select.tsx
````typescript
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
````

## File: src/components/ui/separator.tsx
````typescript
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
````

## File: src/components/ui/sheet.tsx
````typescript
"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
````

## File: src/components/ui/sidebar.tsx
````typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex w-full flex-1 flex-col bg-background",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className,
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      />
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ ...props }, ref) => <li ref={ref} {...props} />,
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
````

## File: src/components/ui/skeleton.tsx
````typescript
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />;
}

export { Skeleton };
````

## File: src/components/ui/slider.tsx
````typescript
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
````

## File: src/components/ui/sonner.tsx
````typescript
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
````

## File: src/components/ui/switch.tsx
````typescript
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
````

## File: src/components/ui/table.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
````

## File: src/components/ui/tabs.tsx
````typescript
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
````

## File: src/components/ui/textarea.tsx
````typescript
import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
````

## File: src/components/ui/toggle-group.tsx
````typescript
"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "default",
  variant: "default",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
````

## File: src/components/ui/toggle.tsx
````typescript
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
````

## File: src/components/ui/tooltip.tsx
````typescript
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
````

## File: src/components/ChapterVideoPlayer.tsx
````typescript
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { REQUIRED_COVERAGE, createWatchTracker, parseVideoSource } from '@/lib/video-watch';

interface YTPlayer { getCurrentTime(): number; getDuration(): number; getPlayerState(): number; destroy(): void }
interface YTNamespace { Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer }
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void; __hlcYouTube?: Promise<YTNamespace> };

function loadYouTube(): Promise<YTNamespace> {
  const w = window as YTWindow;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  w.__hlcYouTube ??= new Promise(resolve => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => { previous?.(); if (w.YT) resolve(w.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return w.__hlcYouTube;
}

export interface PlayableVideo { id: string; title: string; url: string }

/** Plays a chapter video inside the page and calls onComplete once the student has watched it through. */
export function ChapterVideoPlayer({ video, completed, canEarn, onComplete }: { video: PlayableVideo; completed: boolean; canEarn: boolean; onComplete: (videoId: string) => Promise<void> }) {
  const source = parseVideoSource(video.url);
  const hostRef = useRef<HTMLDivElement>(null);
  const tracker = useRef(createWatchTracker());
  const done = useRef(completed);
  const [watched, setWatched] = useState(0);
  done.current = completed;

  const finish = async (duration: number) => {
    const coverage = tracker.current.coverage(duration);
    setWatched(coverage);
    if (!canEarn || done.current) return;
    if (coverage < REQUIRED_COVERAGE) {
      toast.info(`You watched ${Math.round(coverage * 100)}% of this video. Watch it all the way through, without skipping, to earn the mark.`);
      return;
    }
    done.current = true;
    try { await onComplete(video.id); } catch (e) { done.current = false; toast.error(e instanceof Error ? e.message : 'Could not save your mark'); }
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    tracker.current.reset();
    setWatched(0);
    if (source?.kind !== 'youtube' || !hostRef.current) return;
    const host = hostRef.current;
    const mount = document.createElement('div');
    host.appendChild(mount);
    let player: YTPlayer | null = null;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    void loadYouTube().then(YT => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId: source.id, width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
        playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
        events: { onStateChange: (e: { data: number }) => { if (e.data === 0 && player) void finishRef.current(player.getDuration()); } },
      });
      timer = setInterval(() => {
        if (!player?.getPlayerState) return;
        if (player.getPlayerState() === 1) {
          tracker.current.tick(player.getCurrentTime());
          setWatched(tracker.current.coverage(player.getDuration()));
        } else tracker.current.pause();
      }, 500);
    });
    return () => { cancelled = true; clearInterval(timer); player?.destroy(); host.replaceChildren(); };
  }, [source?.kind, source?.kind === 'youtube' ? source.id : video.url]);

  const pct = Math.round(watched * 100);
  return (
    <div>
      {source?.kind === 'youtube' && <div ref={hostRef} className="aspect-video w-full overflow-hidden rounded-xl bg-foreground [&_iframe]:h-full [&_iframe]:w-full" />}
      {source?.kind === 'file' && (
        <video key={video.url} controls controlsList="nodownload" playsInline className="aspect-video w-full rounded-xl bg-foreground" src={source.url}
          onTimeUpdate={e => { const v = e.currentTarget; if (!v.paused && !v.seeking) { tracker.current.tick(v.currentTime); setWatched(tracker.current.coverage(v.duration)); } }}
          onSeeking={() => tracker.current.pause()} onPause={() => tracker.current.pause()}
          onEnded={e => void finish(e.currentTarget.duration)} />
      )}
      {!source && (
        <div className="grid aspect-video w-full place-items-center rounded-xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
          <div><p>This link can't be played inside HLC Math.</p><a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-primary underline">Open video <ExternalLink className="h-4 w-4" /></a></div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <h3 className="mr-auto font-semibold">{video.title}</h3>
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 font-semibold text-success"><CheckCircle2 className="h-4 w-4" /> Watched · 1 mark earned</span>
        ) : canEarn && source ? (
          <span className="rounded-full bg-muted px-3 py-1 font-semibold text-muted-foreground">Watched {pct}% · finish to earn 1 mark</span>
        ) : null}
      </div>
      {!completed && canEarn && source && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>}
    </div>
  );
}
````

## File: src/hooks/use-mobile.tsx
````typescript
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
````

## File: src/integrations/supabase/auth-attacher.ts
````typescript
// This file is automatically generated. Do not edit it directly.
import { createMiddleware } from '@tanstack/react-start'
import { supabase } from './client'

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
)
````

## File: src/lib/coins.ts
````typescript
import { supabase } from "@/integrations/supabase/client";
import type { Student } from "./data";

export const COIN_NAME = "Math Coins";
export const COIN_NAME_ZH = "數學幣";
export const COIN_EMOJI = "🪙";
/** Coins for watching one chapter video to the end. */
export const VIDEO_COINS = 1;

export type MarkReason =
  | "classwork"
  | "participation"
  | "correct_answer"
  | "incorrect_answer"
  | "homework"
  | "bonus"
  | "deduction";

export interface ReasonInfo {
  id: MarkReason;
  label: string;
  zh: string;
}

export const REASONS: ReasonInfo[] = [
  { id: "correct_answer", label: "Correct answer", zh: "答啱問題" },
  { id: "incorrect_answer", label: "Tried to answer", zh: "有嘗試作答（0 分紀錄）" },
  { id: "classwork", label: "Classwork completed", zh: "完成課堂練習" },
  { id: "participation", label: "Great lesson performance", zh: "課堂表現好" },
  { id: "homework", label: "Homework on time", zh: "準時交齊功課" },
  { id: "bonus", label: "Bonus", zh: "其他獎勵" },
  { id: "deduction", label: "Deduction", zh: "扣分（欠交 / 違規）" },
];

export const QUICK_REASONS: ReasonInfo[] = REASONS.filter(
  (r) => r.id !== "correct_answer" && r.id !== "incorrect_answer",
);

export const QUICK_AMOUNTS = [-5, -2, -1, 1, 2, 5];

export function reasonLabel(id: string): string {
  return REASONS.find((r) => r.id === id)?.label ?? id;
}

export function coinsEarned(s: Pick<Student, "dailyMarks" | "videoMarks">): number {
  return (s.dailyMarks ?? 0) + (s.videoMarks ?? 0) * VIDEO_COINS;
}

export function coinBalance(s: Pick<Student, "dailyMarks" | "videoMarks" | "coinsSpent">): number {
  return coinsEarned(s) - (s.coinsSpent ?? 0);
}

const STATUS = {
  pending: { label: "Waiting for teacher", cls: "bg-gold/25 text-gold-deep" },
  approved: { label: "Approved · ready to use", cls: "bg-primary/10 text-primary" },
  used: { label: "Used", cls: "bg-success/15 text-success" },
  rejected: { label: "Rejected · coins returned", cls: "bg-muted text-muted-foreground" },
} as const;

export function redemptionStatus(status: string): { label: string; cls: string } {
  return (
    STATUS[status as keyof typeof STATUS] ?? {
      label: status,
      cls: "bg-muted text-muted-foreground",
    }
  );
}

/** Saves the same marks for every chosen student in one go and returns the new row ids (for undo). */
export async function giveCoins(input: {
  studentIds: string[];
  marks: number;
  reason: MarkReason;
  note: string;
}): Promise<string[]> {
  if (!input.studentIds.length) throw new Error("Choose at least one student first");
  if (!Number.isInteger(input.marks) || input.marks < -100 || input.marks > 100) {
    throw new Error("Marks must be a whole number from -100 to 100");
  }
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Please sign in with your teacher account again");

  const batchId = crypto.randomUUID();
  const { data, error } = await supabase
    .from("daily_marks")
    .insert(
      input.studentIds.map((studentId) => ({
        student_id: studentId,
        marks: input.marks,
        reason: input.reason,
        note: input.note.trim().slice(0, 200),
        awarded_by: userId,
        batch_id: batchId,
      })),
    )
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.id);
}

export async function deleteMarks(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await supabase
      .from("daily_marks")
      .delete()
      .in("id", ids.slice(i, i + 100));
    if (error) throw new Error(error.message);
  }
}
````

## File: src/lib/drive-link.ts
````typescript
/** Old notes were PDFs uploaded to Supabase Storage and saved as "<chapter>/<uuid>.pdf". */
export function isStoragePath(value: string): boolean {
  return /^\d+\/[\w-]+\.pdf$/i.test(value.trim());
}

export function isWebLink(value: string): boolean {
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

/** A version of a Google Drive / Docs / Slides / Sheets link that can be shown inside the page. */
export function notesPreviewUrl(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const id = url.pathname.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get("id") ?? "";
  if (!/^[\w-]{10,}$/.test(id)) return null;
  if (url.hostname === "drive.google.com") return `https://drive.google.com/file/d/${id}/preview`;
  if (url.hostname === "docs.google.com") {
    const kind = url.pathname.match(/^\/(document|presentation|spreadsheets)\//)?.[1];
    return kind ? `https://docs.google.com/${kind}/d/${id}/preview` : null;
  }
  return null;
}
````

## File: src/lib/error-capture.ts
````typescript
// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

// h3's HTTPError serializes to {"status":500,"unhandled":true,"message":"HTTPError"} —
// no stack, no cause — so a plain console.error(error) reaches the log pipeline with
// the failure detail stripped. Expand Error-like args into a string that keeps the
// message, stack, and the full cause chain.
const CAUSE_DEPTH_LIMIT = 5;
const DESCRIPTION_LENGTH_LIMIT = 8_000;

export function describeError(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
    if (!(current instanceof Error)) {
      parts.push(typeof current === "string" ? current : safeStringify(current));
      break;
    }
    const label = depth === 0 ? "" : "caused by: ";
    const status = describeStatus(current);
    parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
    current = current.cause;
  }
  return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}

function describeStatus(error: Error): string {
  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown };
  const value = status ?? statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function isErrorLike(value: unknown): value is Error {
  return value instanceof Error;
}

// Wrap console.error so errors logged by any layer — including h3's internal
// unhandled-error logging, which this file cannot hook directly — are both
// recorded for consumeLastCapturedError and expanded before serialization.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const expanded = args.map((arg) => {
    if (!isErrorLike(arg)) return arg;
    record(arg);
    return describeError(arg);
  });
  originalConsoleError(...expanded);
};

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
````

## File: src/lib/error-page.ts
````typescript
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
````

## File: src/lib/grade-rules.ts
````typescript
import { z } from 'zod';
export const scoreSchema = z.number().int().min(0).max(100).nullable();
export const awardSchema = z.object({ studentId: z.string().uuid(), marks: z.number().int().min(0).max(100), reason: z.enum(['classwork', 'participation', 'correct_answer', 'incorrect_answer']) });
export const answerMarks = (correct: boolean) => correct ? 1 : 0;
export const VIDEO_MARKS = 1;
export function parseScoreCsv(text: string) {
  const rows = new Map<string, (number | null)[]>();
  text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(l => l.trim()).forEach((line, index) => {
    const [email, ...cells] = line.split(',').map(v => v.trim());
    if (index === 0 && email?.toLowerCase() === 'email') return;
    if (!email?.includes('@') || cells.length !== 7) throw new Error(`Row ${index + 1}: expected email and seven scores.`);
    const key = email.toLowerCase();
    if (rows.has(key)) throw new Error(`Row ${index + 1}: duplicate email.`);
    rows.set(key, cells.map(v => scoreSchema.parse(v === '' ? null : Number(v))));
  });
  return rows;
}
````

## File: src/lib/math.functions.ts
````typescript
import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { awardSchema, scoreSchema } from './grade-rules';

export const saveScores = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.array(z.object({ student_id: z.string().uuid(), chapter: z.number().int().min(1).max(7), score: scoreSchema })).min(1).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'teacher' });
    if (!allowed) throw new Error('Teacher access required');
    const { error } = await context.supabase.from('chapter_scores').upsert(data);
    if (error) throw new Error(error.message);
    return { saved: data.length };
  });
export const awardMarks = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => awardSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'teacher' });
    if (!allowed) throw new Error('Teacher access required');
    const { error } = await context.supabase.from('daily_marks').insert({ student_id: data.studentId, marks: data.marks, reason: data.reason, awarded_by: context.userId });
    if (error) throw new Error(error.message);
    return { saved: true };
  });
````

## File: src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
````

## File: src/lib/video-watch.ts
````typescript
/** Share of a video a student must actually play (not skip) before the mark is awarded. */
export const REQUIRED_COVERAGE = 0.9;
/** Largest gap between two position samples still counted as continuous playback (allows up to 2x speed). */
const MAX_STEP_SECONDS = 2.5;

export type VideoSource = { kind: 'youtube'; id: string } | { kind: 'file'; url: string };

/** Recognise links that can be played and tracked inside the app: YouTube or a direct video file. */
export function parseVideoSource(raw: string): VideoSource | null {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const idOk = (id: string | null | undefined): id is string => Boolean(id && /^[\w-]{11}$/.test(id));
  if (host === 'youtu.be') { const id = url.pathname.split('/')[1]; return idOk(id) ? { kind: 'youtube', id } : null; }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (idOk(v)) return { kind: 'youtube', id: v };
    const [, section, id] = url.pathname.split('/');
    return section && ['embed', 'shorts', 'live'].includes(section) && idOk(id) ? { kind: 'youtube', id } : null;
  }
  if (/\.(mp4|webm|ogg|m4v)$/i.test(url.pathname)) return { kind: 'file', url: url.toString() };
  return null;
}

/**
 * Records which whole seconds of a video were actually played. Jumps (seeking ahead)
 * are not counted, so a student cannot skip to the end to earn the mark.
 */
export function createWatchTracker() {
  const watched = new Set<number>();
  let last: number | null = null;
  return {
    /** Feed the current playback position while the video is playing. */
    tick(position: number) {
      if (last !== null) {
        const step = position - last;
        if (step > 0 && step <= MAX_STEP_SECONDS) for (let s = Math.floor(last); s < Math.floor(position); s++) watched.add(s);
      }
      last = position;
    },
    /** Call on pause, buffering or seeking so the next position starts a new stretch. */
    pause() { last = null; },
    coverage(duration: number) { return duration > 0 ? Math.min(1, watched.size / Math.floor(duration)) : 0; },
    reset() { watched.clear(); last = null; },
  };
}
````

## File: src/routes/_authenticated/activity.tsx
````typescript
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, RotateCcw, Search, Sparkles, Undo2, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import {
  COIN_EMOJI,
  COIN_NAME,
  QUICK_AMOUNTS,
  QUICK_REASONS,
  coinBalance,
  deleteMarks,
  giveCoins,
  reasonLabel,
  type MarkReason,
} from "@/lib/coins";
import { sortByClass, type MathSet, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Class activity — HLC Math" },
      { name: "description", content: "Lucky draw and quick Math Coins for the class." },
      { property: "og:title", content: "Class activity — HLC Math" },
      { property: "og:description", content: "Pick a student and reward great answers." },
    ],
  }),
  component: ActivityPage,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];
const BALL_COLORS = [
  "var(--primary)",
  "var(--success)",
  "var(--gold-deep)",
  "var(--flame)",
  "var(--destructive)",
  "oklch(0.6 0.15 300)",
];
const PILE_ROWS = [5, 4, 3, 2];
const BALL_SIZE = 30;
const BALL_COUNT = 14;

const ANIMATION_CSS = `
.hlc-ball { position: absolute; left: 50%; top: 50%; width: ${BALL_SIZE}px; height: ${BALL_SIZE}px; margin: -${BALL_SIZE / 2}px 0 0 -${BALL_SIZE / 2}px; border-radius: 9999px; display: grid; place-items: center; font-size: 11px; font-weight: 800; color: white; box-shadow: inset -4px -4px 6px rgb(0 0 0 / 0.25), inset 3px 3px 5px rgb(255 255 255 / 0.45); transition: transform 0.4s ease; }
.hlc-ball[data-spin="true"] { animation: hlc-orbit var(--d) linear infinite; animation-delay: var(--delay); }
@keyframes hlc-orbit { from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); } }
.hlc-machine[data-spin="true"] { animation: hlc-shake 0.25s ease-in-out infinite; }
@keyframes hlc-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
.hlc-winner { animation: hlc-pop 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) both, hlc-glow 1.6s ease-in-out 0.7s infinite; }
@keyframes hlc-pop { 0% { transform: translateY(-90px) scale(0.2); opacity: 0; } 70% { transform: translateY(6px) scale(1.08); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
@keyframes hlc-glow { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--gold) 70%, transparent); } 50% { box-shadow: 0 0 48px 12px color-mix(in oklab, var(--gold) 70%, transparent); } }
.hlc-confetti { position: absolute; left: 50%; top: 45%; width: 10px; height: 14px; border-radius: 2px; opacity: 0; animation: hlc-burst 1.4s cubic-bezier(0.15, 0.7, 0.3, 1) forwards; animation-delay: var(--delay); }
@keyframes hlc-burst { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--rot)); opacity: 0; } }
.hlc-ticker { animation: hlc-flick 0.12s linear infinite alternate; }
@keyframes hlc-flick { from { opacity: 0.6; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .hlc-ball[data-spin="true"], .hlc-machine[data-spin="true"], .hlc-winner, .hlc-ticker, .hlc-confetti { animation: none; } }
`;

function randomIndex(n: number): number {
  if (n <= 1) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) % n;
}

/** Where each ball rests at the bottom of the machine when it is not spinning. */
function pilePosition(i: number): { x: number; y: number } {
  let index = i;
  for (let row = 0; row < PILE_ROWS.length; row++) {
    const count = PILE_ROWS[row] ?? 0;
    if (index < count) {
      return { x: (index - (count - 1) / 2) * (BALL_SIZE + 2), y: 78 - row * (BALL_SIZE - 4) };
    }
    index -= count;
  }
  return { x: 0, y: 0 };
}

function ActivityPage() {
  const { students, coinsError } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const list = useMemo(() => sortByClass(students.filter((s) => s.set === set)), [students, set]);
  return (
    <AppShell>
      <TeacherOnly>
        <style>{ANIMATION_CSS}</style>
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h1 className="text-3xl font-bold">Class activity</h1>
            <p className="font-semibold text-muted-foreground">
              Lucky draw and quick {COIN_NAME} for {set}
            </p>
          </div>
          <div className="flex rounded-2xl bg-muted p-1">
            {SETS.map((x) => (
              <Button
                key={x}
                variant="ghost"
                onClick={() => setSet(x)}
                className={cn(
                  "rounded-xl px-4 font-extrabold",
                  set === x
                    ? "bg-primary text-primary-foreground shadow-chunky-primary hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {x}
              </Button>
            ))}
          </div>
        </div>
        {coinsError && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            {coinsError}
          </p>
        )}
        <LuckyDraw key={`draw-${set}`} list={list} />
        <QuickPoints key={`points-${set}`} list={list} />
        <RecentActivity />
      </TeacherOnly>
    </AppShell>
  );
}

type Phase = "idle" | "spinning" | "revealed";

function LuckyDraw({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [ticker, setTicker] = useState("");
  const [winner, setWinner] = useState<Student | null>(null);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [noRepeat, setNoRepeat] = useState(true);
  const [sound, setSound] = useState(true);
  const [reward, setReward] = useState(1);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      void audio.current?.close();
    },
    [],
  );

  const spinning = phase === "spinning";
  const pool = noRepeat ? list.filter((s) => !drawn.includes(s.id)) : list;
  const live = winner ? (list.find((s) => s.id === winner.id) ?? winner) : null;

  const balls = useMemo(
    () =>
      Array.from({ length: BALL_COUNT }, (_, i) => ({
        label: list.length
          ? list[i % list.length]?.classNo || String((i % list.length) + 1)
          : String(i + 1),
        color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--primary)",
        radius: 28 + (i % 4) * 18,
        duration: 0.8 + (i % 5) * 0.2,
        delay: -(i * 0.37),
        pile: pilePosition(i),
      })),
    [list],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: burst ? 42 : 0 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 180;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60,
          rot: Math.random() * 720 - 360,
          color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--gold)",
          delay: Math.random() * 0.15,
        };
      }),
    [burst],
  );

  const beep = (freq: number, seconds: number, volume = 0.05) => {
    if (!sound) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + seconds);
    } catch {
      // Sound is optional; some browsers block it.
    }
  };

  const fanfare = () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => beep(f, 0.35, 0.07), i * 120);
    });
  };

  const draw = () => {
    if (spinning) return;
    if (!pool.length) {
      toast.info(
        list.length
          ? "Everyone has had a turn — press Reset to start again."
          : "No students in this set yet.",
      );
      return;
    }
    const pick = pool[randomIndex(pool.length)];
    if (!pick) return;
    setPhase("spinning");
    setWinner(null);
    setSaved(null);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = reduced ? 3 : 20;
    let i = 0;
    const step = () => {
      i += 1;
      if (i >= steps) {
        setTicker(pick.name);
        setWinner(pick);
        setPhase("revealed");
        setDrawn((d) => (d.includes(pick.id) ? d : [...d, pick.id]));
        setBurst((b) => b + 1);
        fanfare();
        return;
      }
      setTicker(list[randomIndex(list.length)]?.name ?? "");
      beep(300 + i * 25, 0.05, 0.03);
      timer.current = setTimeout(step, 50 + Math.pow(i / steps, 2) * 380);
    };
    step();
  };

  const reset = () => {
    setDrawn([]);
    setWinner(null);
    setSaved(null);
    setPhase("idle");
  };

  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      setSaved(null);
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };

  const answer = async (correct: boolean) => {
    if (!winner) return;
    setBusy(true);
    try {
      const ids = await giveCoins({
        studentIds: [winner.id],
        marks: correct ? reward : 0,
        reason: correct ? "correct_answer" : "incorrect_answer",
        note: "Lucky draw",
      });
      await refresh();
      const message = correct
        ? `+${reward} ${COIN_NAME} for ${winner.name}`
        : `Answer recorded for ${winner.name}`;
      setSaved(message);
      toast.success(message, { action: { label: "Undo", onClick: () => void undo(ids) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-gold-deep" /> Lucky draw
        </h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={noRepeat}
            onChange={(e) => setNoRepeat(e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          No repeats
        </label>
        <Button
          variant="ghost"
          size="icon"
          aria-label={sound ? "Turn sound off" : "Turn sound on"}
          onClick={() => setSound(!sound)}
        >
          {sound ? <Volume2 /> : <VolumeX />}
        </Button>
        <Button variant="outline" size="sm" onClick={reset} disabled={spinning || !drawn.length}>
          <RotateCcw /> Reset
        </Button>
      </div>

      <div className="mt-5 grid items-center gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <div
            className="hlc-machine relative h-60 w-60 rounded-full border-4 border-primary/40 bg-gradient-to-b from-primary/5 to-primary/20"
            data-spin={spinning}
          >
            <div className="absolute left-8 top-6 h-10 w-16 -rotate-12 rounded-full bg-white/50 blur-sm" />
            {balls.map((b, i) => (
              <span
                key={i}
                className="hlc-ball"
                data-spin={spinning}
                style={
                  {
                    background: b.color,
                    "--r": `${b.radius}px`,
                    "--d": `${b.duration}s`,
                    "--delay": `${b.delay}s`,
                    ...(spinning ? {} : { transform: `translate(${b.pile.x}px, ${b.pile.y}px)` }),
                  } as CSSProperties
                }
              >
                {b.label}
              </span>
            ))}
          </div>
          <div className="h-4 w-20 rounded-b-xl bg-primary/40" />
          <Button
            size="lg"
            onClick={draw}
            disabled={spinning || !list.length}
            className="mt-4 h-14 w-full rounded-2xl text-lg font-extrabold shadow-chunky-primary"
          >
            {spinning ? "Drawing…" : winner ? "Draw again" : "Draw a student"}
          </Button>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {noRepeat
              ? `${pool.length} of ${list.length} students left`
              : `${list.length} students in the draw`}
          </p>
        </div>

        <div className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-3xl bg-muted/60 p-6 text-center">
          {phase === "idle" && (
            <p className="font-display text-2xl font-bold text-muted-foreground">
              Press “Draw a student” 🎱
            </p>
          )}
          {spinning && (
            <p className="hlc-ticker font-display text-4xl font-bold md:text-6xl">{ticker}</p>
          )}
          {phase === "revealed" && live && (
            <>
              <div key={burst} className="pointer-events-none absolute inset-0">
                {confetti.map((p, i) => (
                  <span
                    key={i}
                    className="hlc-confetti"
                    style={
                      {
                        background: p.color,
                        "--x": `${p.x}px`,
                        "--y": `${p.y}px`,
                        "--rot": `${p.rot}deg`,
                        "--delay": `${p.delay}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <p className="text-sm font-extrabold uppercase tracking-widest text-gold-deep">
                🎉 Lucky winner 🎉
              </p>
              <div className="hlc-winner mt-3 rounded-3xl bg-gold px-8 py-5">
                <p className="font-display text-4xl font-bold text-accent-foreground md:text-6xl">
                  {live.name}
                </p>
                <p className="mt-1 text-sm font-bold text-accent-foreground/80">
                  {live.className} {live.classNo} · {COIN_EMOJI} {coinBalance(live)}
                </p>
              </div>
              {saved ? (
                <p className="mt-5 font-bold text-success">✓ {saved}</p>
              ) : (
                <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
                  <div className="flex rounded-xl bg-card p-1">
                    {[1, 2, 3].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setReward(n)}
                        className={cn(
                          "rounded-lg px-3 py-1 text-sm font-extrabold",
                          reward === n
                            ? "bg-success text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                  <Button
                    disabled={busy}
                    onClick={() => void answer(true)}
                    className="bg-success text-primary-foreground hover:bg-success/90"
                  >
                    <Check /> Correct +{reward}
                  </Button>
                  <Button disabled={busy} variant="outline" onClick={() => void answer(false)}>
                    <X /> Incorrect
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {noRepeat && drawn.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-muted-foreground">Already drawn:</span>
          {drawn.map((id) => (
            <span key={id} className="rounded-full bg-muted px-2 py-0.5 font-semibold">
              {list.find((s) => s.id === id)?.name ?? "?"}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function QuickPoints({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState<MarkReason>("classwork");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = q
    ? list.filter((s) =>
        `${s.name} ${s.className ?? ""}${s.classNo ?? ""} ${s.hlcNo ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : list;

  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const chooseAmount = (n: number) => {
    const value = Number.isFinite(n) ? Math.max(-100, Math.min(100, Math.trunc(n))) : 0;
    setAmount(value);
    if (value < 0) setReason("deduction");
    else if (reason === "deduction") setReason("classwork");
  };

  const chooseReason = (r: MarkReason) => {
    setReason(r);
    if (r === "deduction" && amount > 0) setAmount(-amount);
    if (r !== "deduction" && amount < 0) setAmount(-amount);
  };

  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };

  const save = async () => {
    if (amount === 0) {
      toast.error("Choose an amount other than 0");
      return;
    }
    setBusy(true);
    try {
      const count = selected.length;
      const ids = await giveCoins({ studentIds: selected, marks: amount, reason, note });
      await refresh();
      setSelected([]);
      setNote("");
      toast.success(
        `${amount > 0 ? "+" : ""}${amount} ${COIN_NAME} saved for ${count} student${count === 1 ? "" : "s"}`,
        { action: { label: "Undo", onClick: () => void undo(ids) } },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-xl font-bold">
          {COIN_EMOJI} Quick {COIN_NAME} · tick and save
        </h2>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-input px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search students"
            className="w-32 bg-transparent text-sm font-semibold outline-none"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelected([...new Set([...selected, ...shown.map((s) => s.id)])])}
        >
          Select all
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelected([])}
          disabled={!selected.length}
        >
          Clear
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No students in this set yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s) => {
            const on = selected.includes(s.id);
            return (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition",
                  on ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                  className="h-5 w-5 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.className} {s.classNo}
                  </span>
                </span>
                <span className="text-sm font-extrabold tabular-nums">
                  {COIN_EMOJI} {coinBalance(s)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-3 mt-4 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-border bg-card p-3 shadow-lg">
        <div>
          <p className="mb-1 text-xs font-bold text-muted-foreground">Amount</p>
          <div className="flex flex-wrap items-center gap-1">
            {QUICK_AMOUNTS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => chooseAmount(n)}
                className={cn(
                  "min-w-10 rounded-lg px-2 py-1.5 text-sm font-extrabold",
                  amount === n
                    ? n < 0
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-success text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {n > 0 ? `+${n}` : n}
              </button>
            ))}
            <input
              type="number"
              min={-100}
              max={100}
              value={amount}
              aria-label="Custom amount"
              onChange={(e) => chooseAmount(Number(e.target.value))}
              className="w-16 rounded-lg border border-input bg-card px-2 py-1.5 text-sm font-bold"
            />
          </div>
        </div>
        <label className="text-xs font-bold text-muted-foreground">
          Reason
          <select
            value={reason}
            onChange={(e) => chooseReason(e.target.value as MarkReason)}
            className="mt-1 block rounded-lg border border-input bg-card p-2 text-sm font-semibold text-foreground"
          >
            {QUICK_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} · {r.zh}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-40 flex-1 text-xs font-bold text-muted-foreground">
          Note (optional)
          <input
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ex 5B Q1–6"
            className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-sm font-semibold text-foreground"
          />
        </label>
        <Button
          disabled={busy || !selected.length || amount === 0}
          onClick={() => void save()}
          className={cn(
            "h-10",
            amount < 0 && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          )}
        >
          {busy
            ? "Saving…"
            : `Give ${amount > 0 ? "+" : ""}${amount} to ${selected.length} student${selected.length === 1 ? "" : "s"}`}
        </Button>
      </div>
    </section>
  );
}

interface LogGroup {
  key: string;
  ids: string[];
  studentIds: string[];
  marks: number;
  reason: string;
  note: string;
  at: string;
}

function RecentActivity() {
  const { markLog, students, refresh } = useApp();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const names = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const groups = useMemo(() => {
    const out: LogGroup[] = [];
    const index = new Map<string, number>();
    for (const m of markLog) {
      const key = m.batch_id ?? m.id;
      const at = index.get(key);
      const group = at === undefined ? undefined : out[at];
      if (group) {
        group.ids.push(m.id);
        group.studentIds.push(m.student_id);
      } else {
        index.set(key, out.length);
        out.push({
          key,
          ids: [m.id],
          studentIds: [m.student_id],
          marks: m.marks,
          reason: m.reason,
          note: m.note ?? "",
          at: m.created_at,
        });
      }
    }
    return out.slice(0, 12);
  }, [markLog]);

  const undo = async (g: LogGroup) => {
    const who = g.studentIds.map((id) => names.get(id) ?? "?").join(", ");
    if (
      !window.confirm(
        `Undo ${g.marks > 0 ? "+" : ""}${g.marks} (${reasonLabel(g.reason)}) for ${who}?`,
      )
    )
      return;
    setBusyKey(g.key);
    try {
      await deleteMarks(g.ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <h2 className="text-xl font-bold">Recent activity</h2>
      {groups.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No {COIN_NAME} given yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {groups.map((g) => {
            const who = g.studentIds.map((id) => names.get(id) ?? "?");
            return (
              <li key={g.key} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {new Date(g.at).toLocaleString("en-HK", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={cn(
                    "w-12 rounded-md text-center font-extrabold",
                    g.marks > 0
                      ? "bg-success/15 text-success"
                      : g.marks < 0
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {g.marks > 0 ? `+${g.marks}` : g.marks}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold">{reasonLabel(g.reason)}</span>
                  {g.note && <span className="text-muted-foreground"> · {g.note}</span>}
                  <span className="block truncate text-xs text-muted-foreground">
                    {who.slice(0, 5).join(", ")}
                    {who.length > 5 ? ` +${who.length - 5} more` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyKey === g.key}
                  onClick={() => void undo(g)}
                >
                  <Undo2 /> Undo
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
````

## File: src/routes/_authenticated/awards.tsx
````typescript
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Gift, History, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp, type Redemption, type Reward } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import {
  COIN_EMOJI,
  COIN_NAME,
  COIN_NAME_ZH,
  REASONS,
  VIDEO_COINS,
  coinBalance,
  coinsEarned,
  reasonLabel,
  redemptionStatus,
} from "@/lib/coins";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/awards")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Awards — HLC Math" },
      { name: "description", content: "Spend Math Coins on class rewards." },
      { property: "og:title", content: "Awards — HLC Math" },
      {
        property: "og:description",
        content: "Earn Math Coins in lessons and swap them for rewards.",
      },
    ],
  }),
  component: AwardsPage,
});

const DAY_MS = 86_400_000;

function AwardsPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherAwards /> : <StudentAwards />}</AppShell>;
}

function SetupNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
      {message}
    </p>
  );
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-HK", { day: "numeric", month: "short" });
}

function StudentAwards() {
  const { me, rewards, redemptions, markLog, refresh, coinsError } = useApp();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const balance = coinBalance(me);
  const mine = redemptions.filter((r) => r.student_id === me.id);
  const history = markLog.filter((m) => m.student_id === me.id).slice(0, 15);
  const shop = rewards.filter((r) => r.active);

  const nextAvailable = (reward: Reward): Date | null => {
    if (!reward.cooldown_days) return null;
    const last = mine.find((r) => r.reward_id === reward.id && r.status !== "rejected");
    if (!last) return null;
    const next = new Date(new Date(last.created_at).getTime() + reward.cooldown_days * DAY_MS);
    return next.getTime() > Date.now() ? next : null;
  };

  const redeem = async (reward: Reward) => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("redeem_reward", { _reward_id: reward.id });
      if (error) throw new Error(error.message);
      await refresh();
      setConfirming(null);
      toast.success(`${reward.emoji} ${reward.name} requested! Your teacher will confirm it.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not redeem");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Awards</h1>
      <p className="font-semibold text-muted-foreground">
        Earn {COIN_NAME} in lessons and swap them for rewards.
      </p>
      {coinsError && <SetupNotice message={coinsError} />}

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <section className="rounded-3xl bg-gold p-6 text-accent-foreground shadow-chunky-gold">
          <p className="text-sm font-bold">
            My {COIN_NAME} · {COIN_NAME_ZH}
          </p>
          <p className="font-display text-5xl font-bold">
            {COIN_EMOJI} {balance}
          </p>
          <p className="mt-1 text-sm font-semibold">
            Earned {coinsEarned(me)} · Spent {me.coinsSpent ?? 0}
          </p>
        </section>
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="font-bold">How to earn {COIN_NAME}</h2>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            {REASONS.filter((r) => r.id !== "deduction" && r.id !== "incorrect_answer").map((r) => (
              <li key={r.id}>✅ {r.label}</li>
            ))}
            <li>🎬 Watch a chapter video to the end (+{VIDEO_COINS})</li>
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Missing homework or breaking class rules can take coins away.
          </p>
        </section>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-xl font-bold">
        <Gift className="h-5 w-5 text-primary" /> Rewards
      </h2>
      {shop.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Your teacher has not added rewards yet.
        </p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shop.map((r) => {
            const next = nextAvailable(r);
            const short = r.cost - balance;
            return (
              <div
                key={r.id}
                className="flex flex-col rounded-3xl border-2 border-border bg-card p-5 shadow-chunky"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-4xl">{r.emoji}</span>
                  <span className="rounded-full bg-gold/25 px-3 py-1 text-sm font-extrabold text-gold-deep">
                    {COIN_EMOJI} {r.cost}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-tight">{r.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.description}</p>
                {r.cooldown_days && (
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    Once every {r.cooldown_days} days
                  </p>
                )}
                <div className="mt-4">
                  {next ? (
                    <Button disabled variant="outline" className="w-full">
                      Available again {formatDate(next)}
                    </Button>
                  ) : short > 0 ? (
                    <Button disabled variant="outline" className="w-full">
                      Need {short} more
                    </Button>
                  ) : confirming === r.id ? (
                    <div className="flex gap-2">
                      <Button disabled={busy} className="flex-1" onClick={() => void redeem(r)}>
                        <Check /> Spend {r.cost}
                      </Button>
                      <Button variant="outline" disabled={busy} onClick={() => setConfirming(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setConfirming(r.id)}>
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="font-bold">My rewards</h2>
          {mine.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nothing redeemed yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {mine.map((r) => {
                const st = redemptionStatus(r.status);
                return (
                  <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{r.reward_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.created_at)} · {COIN_EMOJI} {r.cost}
                      </span>
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", st.cls)}>
                      {st.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="flex items-center gap-2 font-bold">
            <History className="h-4 w-4" /> Coin history
          </h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No lesson coins yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {history.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">
                    {formatDate(m.created_at)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {reasonLabel(m.reason)}
                    {m.note ? ` · ${m.note}` : ""}
                  </span>
                  <span
                    className={cn(
                      "font-extrabold tabular-nums",
                      m.marks > 0
                        ? "text-success"
                        : m.marks < 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {m.marks > 0 ? `+${m.marks}` : m.marks}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function TeacherAwards() {
  const { redemptions, students, refresh, coinsError } = useApp();
  const [busyId, setBusyId] = useState<string | null>(null);
  const names = useMemo(
    () =>
      new Map(
        students.map((s) => [
          s.id,
          `${s.name} · ${s.set}${s.classNo ? ` · ${s.className ?? ""} ${s.classNo}` : ""}`,
        ]),
      ),
    [students],
  );
  const pending = redemptions.filter((r) => r.status === "pending");
  const approved = redemptions.filter((r) => r.status === "approved");
  const done = redemptions
    .filter((r) => r.status === "used" || r.status === "rejected")
    .slice(0, 15);

  const decide = async (r: Redemption, status: "approved" | "used" | "rejected") => {
    setBusyId(r.id);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("reward_redemptions")
        .update({ status, decided_at: new Date().toISOString(), decided_by: auth.user?.id ?? null })
        .eq("id", r.id);
      if (error) throw new Error(error.message);
      await refresh();
      toast.success(
        status === "rejected"
          ? "Rejected — coins returned"
          : status === "used"
            ? "Marked as used"
            : "Approved",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const row = (r: Redemption, actions: "pending" | "approved" | "none") => {
    const st = redemptionStatus(r.status);
    return (
      <li key={r.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{r.reward_name}</span>
          <span className="text-xs text-muted-foreground">
            {names.get(r.student_id) ?? "Unknown student"} · {formatDate(r.created_at)} ·{" "}
            {COIN_EMOJI} {r.cost}
          </span>
        </span>
        {actions === "pending" && (
          <>
            <Button size="sm" disabled={busyId === r.id} onClick={() => void decide(r, "approved")}>
              <Check /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyId === r.id}
              onClick={() => void decide(r, "rejected")}
            >
              <X /> Reject
            </Button>
          </>
        )}
        {actions === "approved" && (
          <>
            <Button size="sm" disabled={busyId === r.id} onClick={() => void decide(r, "used")}>
              <Check /> Mark used
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busyId === r.id}
              onClick={() => void decide(r, "rejected")}
            >
              Cancel & refund
            </Button>
          </>
        )}
        {actions === "none" && (
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", st.cls)}>
            {st.label}
          </span>
        )}
      </li>
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Awards</h1>
      <p className="font-semibold text-muted-foreground">
        Students spend {COIN_NAME} here. Approve requests, mark them used, or reject to refund.
      </p>
      {coinsError && <SetupNotice message={coinsError} />}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="font-bold">Waiting for approval ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No new requests.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">{pending.map((r) => row(r, "pending"))}</ul>
          )}
        </section>
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="font-bold">Approved · not used yet ({approved.length})</h2>
          {approved.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nothing waiting to be used.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {approved.map((r) => row(r, "approved"))}
            </ul>
          )}
        </section>
      </div>

      {done.length > 0 && (
        <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="font-bold">Recently finished</h2>
          <ul className="mt-2 divide-y divide-border">{done.map((r) => row(r, "none"))}</ul>
        </section>
      )}

      <RewardEditor />
    </>
  );
}

interface Draft {
  id: string;
  emoji: string;
  name: string;
  description: string;
  cost: string;
  cooldown: string;
  active: boolean;
  position: number;
}

function toDraft(r: Reward): Draft {
  return {
    id: r.id,
    emoji: r.emoji,
    name: r.name,
    description: r.description,
    cost: String(r.cost),
    cooldown: r.cooldown_days === null ? "" : String(r.cooldown_days),
    active: r.active,
    position: r.position,
  };
}

const field =
  "w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm font-semibold";

function RewardEditor() {
  const { rewards, refresh } = useApp();
  const [edits, setEdits] = useState<Record<string, Draft>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const rows = [
    ...rewards.map((r) => edits[r.id] ?? toDraft(r)),
    ...Object.values(edits).filter((d) => !rewards.some((r) => r.id === d.id)),
  ];

  const change = (d: Draft, patch: Partial<Draft>) =>
    setEdits((e) => ({ ...e, [d.id]: { ...d, ...patch } }));

  const add = () => {
    const position = Math.max(0, ...rows.map((d) => d.position)) + 1;
    const draft: Draft = {
      id: crypto.randomUUID(),
      emoji: "🎁",
      name: "",
      description: "",
      cost: "10",
      cooldown: "",
      active: true,
      position,
    };
    setEdits((e) => ({ ...e, [draft.id]: draft }));
  };

  const save = async (d: Draft) => {
    const cost = Number(d.cost);
    const cooldown = d.cooldown.trim() === "" ? null : Number(d.cooldown);
    if (!d.name.trim()) {
      toast.error("Give the reward a name");
      return;
    }
    if (!Number.isInteger(cost) || cost < 1 || cost > 1000) {
      toast.error("Cost must be a whole number from 1 to 1000");
      return;
    }
    if (cooldown !== null && (!Number.isInteger(cooldown) || cooldown < 1 || cooldown > 365)) {
      toast.error("Limit must be 1–365 days, or leave it blank for no limit");
      return;
    }
    setBusyId(d.id);
    try {
      const { error } = await supabase.from("rewards").upsert({
        id: d.id,
        emoji: d.emoji.trim() || "🎁",
        name: d.name.trim(),
        description: d.description.trim(),
        cost,
        cooldown_days: cooldown,
        active: d.active,
        position: d.position,
      });
      if (error) throw new Error(error.message);
      await refresh();
      setEdits(({ [d.id]: _saved, ...rest }) => rest);
      toast.success(`${d.name.trim()} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto font-bold">Reward list</h2>
        <Button variant="outline" size="sm" onClick={add}>
          <Plus /> Add reward
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Untick “Shown” to hide a reward from students. “Limit” = once every N days per student
        (blank = no limit).
      </p>
      <div className="mt-3 hidden grid-cols-[56px_1fr_2fr_80px_80px_64px_auto] gap-2 px-1 text-xs font-bold uppercase text-muted-foreground md:grid">
        <span>Icon</span>
        <span>Name</span>
        <span>Description</span>
        <span>Cost</span>
        <span>Limit</span>
        <span>Shown</span>
        <span />
      </div>
      <div className="mt-1 space-y-2">
        {rows.map((d) => {
          const dirty = edits[d.id] !== undefined;
          return (
            <div
              key={d.id}
              className={cn(
                "grid gap-2 rounded-2xl border-2 p-2 md:grid-cols-[56px_1fr_2fr_80px_80px_64px_auto] md:items-center",
                dirty ? "border-primary/60 bg-primary/5" : "border-border",
              )}
            >
              <input
                aria-label="Icon"
                value={d.emoji}
                onChange={(e) => change(d, { emoji: e.target.value })}
                className={cn(field, "text-center text-lg")}
              />
              <input
                aria-label="Name"
                value={d.name}
                placeholder="Reward name"
                onChange={(e) => change(d, { name: e.target.value })}
                className={field}
              />
              <input
                aria-label="Description"
                value={d.description}
                placeholder="What the student gets"
                onChange={(e) => change(d, { description: e.target.value })}
                className={field}
              />
              <input
                aria-label="Cost"
                type="number"
                min={1}
                max={1000}
                value={d.cost}
                onChange={(e) => change(d, { cost: e.target.value })}
                className={field}
              />
              <input
                aria-label="Limit in days"
                type="number"
                min={1}
                max={365}
                value={d.cooldown}
                placeholder="—"
                onChange={(e) => change(d, { cooldown: e.target.value })}
                className={field}
              />
              <label className="flex items-center gap-2 text-sm font-semibold md:justify-center">
                <input
                  type="checkbox"
                  checked={d.active}
                  onChange={(e) => change(d, { active: e.target.checked })}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                <span className="md:hidden">Shown</span>
              </label>
              <Button size="sm" disabled={!dirty || busyId === d.id} onClick={() => void save(d)}>
                <Save /> Save
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
````

## File: src/routes/_authenticated/route.tsx
````typescript
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: '/' });
  },
  component: Outlet,
});
````

## File: src/routes/README.md
````markdown
# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
````

## File: src/routes/reset-password.tsx
````typescript
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/reset-password')({ head: () => ({ meta: [{ title: 'Reset password — HLC Math' }, { name: 'description', content: 'Recover your HLC Math account password.' }, { property: 'og:title', content: 'Reset password — HLC Math' }, { property: 'og:description', content: 'Secure password recovery for your school account.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }), component: Reset });
function Reset() { const [recovery, setRecovery] = useState(false); const [value, setValue] = useState(''); const [message, setMessage] = useState(''); useEffect(() => { setRecovery(window.location.hash.includes('type=recovery')); const { data } = supabase.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') setRecovery(true); }); return () => data.subscription.unsubscribe(); }, []); return <main className="mx-auto max-w-sm space-y-5 px-4 py-16"><h1 className="text-2xl font-semibold">{recovery ? 'Set a new password' : 'Reset password'}</h1><form className="space-y-4" onSubmit={async e => { e.preventDefault(); const r = recovery ? await supabase.auth.updateUser({ password: value }) : await supabase.auth.resetPasswordForEmail(value, { redirectTo: `${window.location.origin}/reset-password` }); setMessage(r.error?.message ?? (recovery ? 'Password updated.' : 'Check your email for a reset link.')); }}><label className="block">{recovery ? 'New password' : 'School email'}<input className="mt-2 w-full rounded-md border border-input p-3" required type={recovery ? 'password' : 'email'} minLength={recovery ? 8 : undefined} value={value} onChange={e => setValue(e.target.value)} /></label><Button type="submit">{recovery ? 'Update password' : 'Send reset link'}</Button></form><p role="status">{message}</p><Link to="/">Back to sign in</Link></main>; }
````

## File: src/test/app-routing.test.tsx
````typescript
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
````

## File: src/test/grade-rules.test.ts
````typescript
import { describe, expect, it } from 'vitest';
import { answerMarks, VIDEO_MARKS, scoreSchema, parseScoreCsv } from '@/lib/grade-rules';
describe('School marks', () => {
 it('awards one daily mark for a correct answer', () => expect(answerMarks(true)).toBe(1));
 it('awards no marks for an incorrect answer', () => expect(answerMarks(false)).toBe(0));
 it('awards one mark per video', () => expect(VIDEO_MARKS).toBe(1));
 it('accepts a score between zero and 100 only', () => { expect(scoreSchema.parse(100)).toBe(100); expect(() => scoreSchema.parse(101)).toThrow(); expect(() => scoreSchema.parse(-1)).toThrow(); });
 it('imports blank scores as unattempted', () => expect(parseScoreCsv('email,ch1,ch2,ch3,ch4,ch5,ch6,ch7\na@hlc.edu.hk,0,100,,50,60,70,80').get('a@hlc.edu.hk')).toEqual([0,100,null,50,60,70,80]));
});
````

## File: src/test/setup.ts
````typescript
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
````

## File: src/test/sheet-sync.test.ts
````typescript
import { describe, expect, it } from 'vitest';
import { parseSetTab } from '@/lib/sheet-parse';
import { contribution, termSummary, type Assessment } from '@/lib/assessments';

// Mirrors the layout of the "2627 Name list (For LMS)" tabs.
const formulas = [
  ['', '', '2026-27 Set'],
  ['', 'Class', 'No.', 'Name in English', '姓名', 'Sex', 'HW', 'Homework (30%)', 'SQ', 'SQ', 'Daily (10%)', 'T1A3 (200)'],
  ['HLC no.', '', '', '', '', '', 'HWB1', '', 'SQ1.1', 'SQ1.2', '', ''],
  ['HLC250015', '2B', '1', 'Chan Ying Tung (Percy)', '陳映彤', 'F', 4, '=G4/G$6*30', 10, 'ABS', 8, '=0'],
  ['', '', '', 'Mean'],
  ['', '', '', 'Full marks', '', '', 10, '', 14, 13, '', ''],
];
const values = formulas.map(r => r.map(c => (typeof c === 'string' && c.startsWith('=') ? 12 : c)));

const item = (category: Assessment['category'], score: number | null, full: number | null, absent = false): Assessment =>
  ({ term: 1, kind: 'item', category, label: `${category}${score}`, score, full_marks: full, absent, position: 0 });

describe('Google Sheet sync', () => {
  const [s] = parseSetTab('S2M3', formulas, values);
  it('signs students in with their HLC no. school email', () => expect(s?.email).toBe('hlc250015@hlc.edu.hk'));
  it('reads typed marks with full marks from the Full marks row', () =>
    expect(s?.scores.find(x => x.label === 'SQ1.1')).toMatchObject({ kind: 'item', category: 'short_quiz', score: 10, full_marks: 14 }));
  it('keeps ABS as absent, not zero', () => expect(s?.scores.find(x => x.label === 'SQ1.2')).toMatchObject({ absent: true, score: null }));
  it('reads the Daily (10%) column as a mark out of 10', () => expect(s?.scores.find(x => x.category === 'daily')).toMatchObject({ score: 8, full_marks: 10 }));
});

describe('Weighted coursework', () => {
  it('Homework is 30% of the average homework percentage', () => expect(contribution([item('homework', 4, 10), item('homework', 8, 10)], 1, 'homework', 30)).toBe(18));
  it('absent quizzes are left out of the average', () => expect(contribution([item('short_quiz', 7, 14), item('short_quiz', null, 13, true)], 1, 'short_quiz', 20)).toBe(10));
  it('coursework total is out of 200 (HW 30 + SQ 20 + CQ 30 + Mock 10 + Daily 10, doubled)', () => {
    const all = [item('homework', 10, 10), item('short_quiz', 10, 10), item('chapter_quiz', 10, 10), item('mock', 20, 20),
      { term: 1, kind: 'summary', category: 'daily', label: 'Daily (10%)', score: 10, full_marks: 10, absent: false, position: 0 } as Assessment];
    expect(termSummary(all, 1).coursework200).toBe(200);
  });
});
````

## File: src/test/student-privacy.integration.test.ts
````typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Explicit opt-in: temporary test identities are prepared outside the repository.
const fixturePath = process.env['MATH_PRIVACY_FIXTURE'];
describe.skipIf(!fixturePath)('Live student privacy', () => {
  it('returns only each student’s own scores and refuses teacher promotion', async () => {
    if (!fixturePath) throw new Error('Missing temporary identity fixture');
    const users = JSON.parse(readFileSync(fixturePath, 'utf8')) as { role: string; id: string; session: { access_token: string } }[];
    const base = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!base || !key) throw new Error('Missing test connection');
    for (const u of users.filter(u => u.role.startsWith('student'))) {
      // JWT identity, not the service role, determines RLS permissions.
      const headers = { apikey: key, Authorization: `Bearer ${u.session.access_token}` };
      const roster = await fetch(`${base}/rest/v1/students?select=id,user_id`, { headers });
      expect(roster.status).toBe(200);
      const own = await roster.json() as { id: string; user_id: string }[];
      expect(own.length).toBe(1);
      expect(own[0]?.user_id).toBe(u.id);
      const scores = await fetch(`${base}/rest/v1/chapter_scores`, { headers });
      expect(scores.status).toBe(200);
      const rows = await scores.json() as { student_id: string; score: number }[];
      expect(rows.length).toBe(1);
      expect(rows[0]?.student_id).toBe(own[0]?.id);
      expect(rows[0]?.score).toBe(u.role === 'student-a' ? 78 : 93);
      const promote = await fetch(`${base}/rest/v1/user_roles`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: u.id, role: 'teacher' }) });
      expect(promote.ok).toBe(false);
    }
  });
});
````

## File: src/test/video-watch.test.ts
````typescript
import { describe, expect, it } from 'vitest';
import { REQUIRED_COVERAGE, createWatchTracker, parseVideoSource } from '@/lib/video-watch';

function play(t: ReturnType<typeof createWatchTracker>, from: number, to: number, step = 0.5) {
  for (let p = from; p <= to + 1e-9; p += step) t.tick(p);
}

describe('video completion tracking', () => {
  it('counts a video watched from start to end as complete', () => {
    const t = createWatchTracker();
    play(t, 0, 120);
    expect(t.coverage(120)).toBeGreaterThanOrEqual(REQUIRED_COVERAGE);
  });
  it('does not count seconds skipped by jumping ahead', () => {
    const t = createWatchTracker();
    play(t, 0, 10);
    play(t, 115, 120); // seek near the end
    expect(t.coverage(120)).toBeLessThan(REQUIRED_COVERAGE);
  });
  it('requires 90% of the video to be played', () => {
    expect(REQUIRED_COVERAGE).toBe(0.9);
    const t = createWatchTracker();
    play(t, 0, 100);
    expect(t.coverage(120)).toBeLessThan(REQUIRED_COVERAGE);
  });
  it('counts double-speed playback', () => {
    const t = createWatchTracker();
    play(t, 0, 60, 1);
    expect(t.coverage(60)).toBeGreaterThanOrEqual(REQUIRED_COVERAGE);
  });
});

describe('video links', () => {
  it('accepts YouTube links in their common forms', () => {
    for (const u of ['https://www.youtube.com/watch?v=tTdou0A5kEk', 'https://youtu.be/tTdou0A5kEk', 'https://www.youtube.com/embed/tTdou0A5kEk', 'https://youtube.com/shorts/tTdou0A5kEk'])
      expect(parseVideoSource(u)).toEqual({ kind: 'youtube', id: 'tTdou0A5kEk' });
  });
  it('accepts direct video files and rejects other pages', () => {
    expect(parseVideoSource('https://example.com/lesson.mp4')?.kind).toBe('file');
    expect(parseVideoSource('https://drive.google.com/file/d/abc/view')).toBeNull();
    expect(parseVideoSource('http://www.youtube.com/watch?v=tTdou0A5kEk')).toBeNull();
  });
});
````

## File: src/router.tsx
````typescript
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // One client per request: a module-level QueryClient leaks cached data between SSR requests.
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Lets Query own freshness; set caching defaults on the QueryClient, not the router.
    defaultPreloadStaleTime: 0,
  });

  return router;
};
````

## File: src/server.ts
````typescript
import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Hosting compresses every response at the edge. Never compress a body (gzip, brotli,
// CompressionStream) or set content-encoding here or in a server route: the body gets encoded
// twice and renders garbled.
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
.output
.vinxi
.tanstack/**
.nitro
*.local

# Wrangler / Cloudflare
.wrangler/
.dev.vars

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
````

## File: .prettierignore
````
node_modules
dist
.output
.vinxi
pnpm-lock.yaml
package-lock.json
bun.lock
routeTree.gen.ts
````

## File: .prettierrc
````
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
````

## File: bunfig.toml
````toml
[install]
saveTextLockfile = true
# 24h supply-chain guard: skip package versions published less than a day ago.
minimumReleaseAge = 86400
# Each entry bypasses the 24h guard for one package — confirm with the user
# before adding any.
minimumReleaseAgeExcludes = ["@lovable.dev/vite-tanstack-config", "@lovable.dev/mcp-js", "@lovable.dev/ai-gateway", "@lovable.dev/email-js", "@lovable.dev/webhooks-js"]
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
````

## File: dev
````
> vite dev

vite.config.ts (10:29) [UNRESOLVED_IMPORT] Could not resolve '@lovabl
vite.config.ts (10:29) [UNRESOLVED_IMPORT] Could not resolve '@lovable.dev/vite-tanstack-config' in vite.config.ts
    ╭─[ vite.config.ts:10:30 ]
    │
 10 │ import { defineConfig } from "@lovable.dev/vite-tanstack-config
 10 │ import { defineConfig } from "@lovable.dev/vite-tanstack-config";
    │                              ─────────────────┬────────────────
    │                              ─────────────────┬─────────────────
    │                                               ╰────────────────
    │                                               ╰─────────────────── Module not found, treating it as an external dependency
────╯

failedable.dev/vite-
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@lovable.dev/vite-tanstack-config' imported from /Users/yhtang/Documents/GitHub/mathlms
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@lovable.dev/vite-tanstack-config' imported from /Users/yhtang/Documents/GitHub/mathlms.lovable/node_modules/.vite-temp/vite.config.ts.timestamp-17945751434
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@lovable.dev/vite-tanstack-config' imported from /Users/yhtang/Documents/GitHub/mathlms.lovable/node_modules/.vite-temp/vite.config.ts.timestamp-1794575143454-59034acd2aa588.mjs
    at Object.getPackageJSONURL (node:internal/modules/package_json_r
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:343:9)
    at packageResolve (node:internal/modules/esm/resolve:751:25)
    at moduleResolve (node:internal/modules/esm/resolve:840:18)
    at defaultResolve (node:internal/modules/esm/resolve:973:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:708:20
    at #cachedDefaultResolve (node:internal/modules/esm/loader:708:20)
    at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm
    at #resolveAndMaybeBlockOnLoaderThread (node:internal/modules/esm/loader:728:38)
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:766
    at ModuleLoader.resolveSync (node:internal/modules/esm/loader:766:56)
    at #resolve (node:internal/modules/esm/loader:690:17)
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/l
    at ModuleLoader.getOrCreateModuleJob (node:internal/modules/esm/loader:610:35)
    at ModuleJob.syncLink (node:internal/modules/esm/module_job:277:3
    at ModuleJob.syncLink (node:internal/modules/esm/module_job:277:33) {
  code: 'ERR_MODULE_NOT_FOUND'
````

## File: eslint.config.js
````javascript
import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
);
````

## File: vitest.config.ts
````typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
````

## File: src/components/AssessmentReport.tsx
````typescript
import { useState } from 'react';
import { ITEM_CATEGORIES, percent, termSummary, termsOf, type Assessment } from '@/lib/assessments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scoreTone } from '@/components/AppShell';
import { cn } from '@/lib/utils';

export function AssessmentReport({ assessments }: { assessments: Assessment[] }) {
  const terms = termsOf(assessments.filter(a => a.kind === 'item' && (a.score !== null || a.absent)));
  const [term, setTerm] = useState(terms[0] ?? 1);
  if (!assessments.length) {
    return <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky"><h2 className="text-lg font-bold">Assessment record</h2><p className="mt-2 text-sm text-muted-foreground">Your teacher has not shared assessment marks yet.</p></section>;
  }
  const { parts, coursework200 } = termSummary(assessments, term);
  const items = assessments.filter(a => a.term === term && a.kind === 'item').sort((a, b) => a.position - b.position);
  const cats = ITEM_CATEGORIES.filter(c => items.some(i => i.category === c.id));
  return (
    <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-lg font-bold">Assessment record</h2>
        {terms.length > 1 && terms.map(t => (
          <button key={t} onClick={() => setTerm(t)} className={cn('rounded-md px-3 py-1 text-sm font-semibold', t === term ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>Term {t}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
          <p className="text-sm font-semibold opacity-90">Term {term} coursework</p>
          <p className="font-display text-4xl font-bold">{coursework200}<span className="text-lg opacity-80"> / 200</span></p>
          <p className="mt-1 text-xs opacity-80">HW 30% · SQ 20% · CQ 30% · Mock 10% · Daily 10%</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {parts.map(p => (
            <li key={p.id} className="rounded-2xl bg-muted p-3">
              <p className="text-xs font-semibold text-muted-foreground">{p.label}</p>
              <p className="font-display text-xl font-bold">{p.value ?? '—'}<span className="text-xs font-semibold text-muted-foreground"> / {p.weight}</span></p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full bg-primary" style={{ width: `${((p.value ?? 0) / p.weight) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      </div>
      {cats.length > 0 && (
        <Tabs defaultValue={cats[0]?.id ?? "homework"} key={term} className="mt-5">
          <TabsList className="h-auto flex-wrap">{cats.map(c => <TabsTrigger key={c.id} value={c.id}>{c.label}</TabsTrigger>)}</TabsList>
          {cats.map(c => (
            <TabsContent key={c.id} value={c.id}>
              <ul className="divide-y divide-border">
                {items.filter(i => i.category === c.id).map(i => {
                  const pct = percent(i);
                  return (
                    <li key={i.label} className="flex items-center gap-3 py-2 text-sm">
                      <span className="w-32 shrink-0 font-semibold">{i.label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full', pct !== null && pct < 50 ? 'bg-destructive' : 'bg-success')} style={{ width: `${pct ?? 0}%` }} /></div>
                      <span className="w-24 text-right tabular-nums text-muted-foreground">{i.absent ? 'Absent' : i.score === null ? 'Not yet' : `${i.score}${i.full_marks ? ` / ${i.full_marks}` : ''}`}</span>
                      <span className={cn('w-14 rounded-md text-center text-xs font-bold leading-6', scoreTone(pct))}>{pct === null ? '—' : `${pct}%`}</span>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}
````

## File: src/components/LessonMarks.tsx
````typescript
import { useState } from 'react';
import { Plus, Shuffle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-store';
import { supabase } from '@/integrations/supabase/client';
import { answerMarks, awardSchema } from '@/lib/grade-rules';

export function LessonMarks() {
  const { students, refresh } = useApp();
  const [set, setSet] = useState<'S2M3' | 'S2M5'>('S2M3');
  const [selected, select] = useState('');
  const [picked, pick] = useState('');
  const [spinning, spin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [marks, setMarks] = useState(1);
  const [reason, setReason] = useState<'classwork' | 'participation'>('classwork');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const list = students.filter(s => s.set === set);

  const send = async (
    id: string,
    markReason: 'classwork' | 'participation' | 'correct_answer' | 'incorrect_answer',
    n: number,
  ) => {
    setBusy(true);
    try {
      const parsed = awardSchema.parse({ studentId: id, reason: markReason, marks: n });
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error('請先登入老師帳號');

      const { error } = await supabase.from('daily_marks').insert({
        student_id: parsed.studentId,
        marks: parsed.marks,
        reason: parsed.reason,
        awarded_by: userId,
      });
      if (error) throw error;

      await refresh();
      toast.success(n ? `${n} mark(s) saved` : 'Answer recorded');
      if (markReason.includes('answer')) pick('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save marks');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 space-y-6 border-y border-border py-6">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async e => {
          e.preventDefault();
          setBusy(true);
          try {
            const { error } = await supabase
              .from('students')
              .insert({ name: name.trim(), email: email.trim().toLowerCase(), math_set: set });
            if (error) throw error;
            await refresh();
            setName('');
            setEmail('');
            toast.success('Student added');
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Could not add student');
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="text-sm font-medium">
          Class set
          <select
            aria-label="Class set"
            value={set}
            onChange={e => {
              setSet(e.target.value as 'S2M3' | 'S2M5');
              select('');
              pick('');
            }}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          >
            <option>S2M3</option>
            <option>S2M5</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Student name
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          />
        </label>
        <label className="text-sm font-medium">
          School email
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          />
        </label>
        <Button disabled={busy} type="submit">
          <Plus />
          Add student
        </Button>
      </form>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Daily lesson marks</h2>
          <select
            aria-label="Student for daily marks"
            value={selected}
            onChange={e => select(e.target.value)}
            className="w-full rounded-md border border-input bg-card p-2"
          >
            <option value="">Choose student</option>
            {list.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.dailyMarks ?? 0} marks
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              Reason
              <select
                aria-label="Mark reason"
                value={reason}
                onChange={e => setReason(e.target.value as typeof reason)}
                className="mt-1 block rounded-md border border-input bg-card p-2"
              >
                <option value="classwork">Classwork completed</option>
                <option value="participation">Good lesson performance</option>
              </select>
            </label>
            <label className="text-sm">
              Marks
              <input
                aria-label="Marks"
                type="number"
                min={0}
                max={100}
                value={marks}
                onChange={e => setMarks(Number(e.target.value))}
                className="mt-1 block w-20 rounded-md border border-input bg-card p-2"
              />
            </label>
            <Button disabled={!selected || busy} onClick={() => send(selected, reason, marks)}>
              <Plus />
              Award marks
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Random student</h2>
          <div
            aria-live="polite"
            className="flex min-h-20 items-center justify-center border-y border-border font-display text-2xl"
          >
            {students.find(s => s.id === picked)?.name ?? '—'}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!list.length || spinning || busy || Boolean(picked)}
              onClick={() => {
                spin(true);
                let turns = 0;
                const timer = setInterval(() => {
                  pick(list[Math.floor(Math.random() * list.length)]?.id ?? '');
                  if (++turns === 12) {
                    clearInterval(timer);
                    spin(false);
                  }
                }, 100);
              }}
            >
              <Shuffle />
              {spinning ? 'Choosing…' : 'Choose student'}
            </Button>
            {picked && !spinning && (
              <>
                <Button
                  disabled={busy}
                  onClick={() => send(picked, 'correct_answer', answerMarks(true))}
                >
                  <Check />
                  Correct +1
                </Button>
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={() => send(picked, 'incorrect_answer', answerMarks(false))}
                >
                  <X />
                  Incorrect
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
````

## File: src/integrations/supabase/auth-middleware.ts
````typescript
import { createMiddleware } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://mbyselvthprrfjioyvhu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_6d4BjM4FHDurcIw2BhpeaQ_hsYnu4Ju';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function normalizeSupabaseUrl(rawUrl: string | undefined): string {
  const cleaned = (rawUrl ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return DEFAULT_SUPABASE_URL;
  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    return parsed.origin;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function readEnv(key: string): string | undefined {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv && metaEnv[key]) return metaEnv[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return undefined;
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const rawUrl = readEnv('VITE_SUPABASE_URL') || readEnv('SUPABASE_URL');
    const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);

    const rawKey =
      readEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
      readEnv('SUPABASE_PUBLISHABLE_KEY') ||
      readEnv('VITE_SUPABASE_ANON_KEY') ||
      readEnv('SUPABASE_ANON_KEY') ||
      DEFAULT_SUPABASE_KEY;
    const SUPABASE_PUBLISHABLE_KEY = rawKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

    const request = getRequest();

    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      throw new Error('Unauthorized: No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    if (token.split('.').length !== 3) {
      throw new Error('Unauthorized: Invalid token');
    }

    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) {
      throw new Error('Unauthorized: Invalid token');
    }

    if (!data.claims.sub) {
      throw new Error('Unauthorized: No user ID found in token');
    }

    return next({
      context: {
        supabase,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  },
);
````

## File: src/integrations/supabase/client.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://mbyselvthprrfjioyvhu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_6d4BjM4FHDurcIw2BhpeaQ_hsYnu4Ju';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function normalizeSupabaseUrl(rawUrl: string | undefined): string {
  const cleaned = (rawUrl ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return DEFAULT_SUPABASE_URL;
  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    return parsed.origin;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function getEnvVar(key: string): string | undefined {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  if (metaEnv && metaEnv[key]) return metaEnv[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return undefined;
}

function createSupabaseClient() {
  const rawUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
  const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);

  const rawKey =
    getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('VITE_SUPABASE_ANON_KEY') ||
    getEnvVar('SUPABASE_ANON_KEY') ||
    DEFAULT_SUPABASE_KEY;
  const SUPABASE_PUBLISHABLE_KEY = rawKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
      },
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
````

## File: src/integrations/supabase/cron-auth.ts
````typescript
export async function authenticateCronRequest(request: Request): Promise<Response | null> {
  const currentSecret = process.env["CRON_SECRET"];
  const previousSecret = process.env["CRON_SECRET_PREVIOUS"];

  if (!currentSecret) {
    return new Response("Server configuration error", { status: 500 });
  }

  const match = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "");
  const token = match?.[1];
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { createHash, timingSafeEqual } = await import("node:crypto");
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  const providedDigest = digest(token);
  const currentMatches = timingSafeEqual(providedDigest, digest(currentSecret));
  const previousMatches = timingSafeEqual(
    providedDigest,
    digest(previousSecret ?? currentSecret),
  );

  if (!currentMatches && !previousMatches) {
    return new Response("Unauthorized", { status: 401 });
  }

  return null;
}
````

## File: supabase/config.toml
````toml
project_id = "mbyselvthprrfjioyvhu"
````

## File: AGENTS.md
````markdown
<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application rules
- Cloud Auth supplies verified identity; roles live in protected user_roles, never browser storage or profile metadata, to prevent privilege escalation.
- Private records are read through RLS-scoped Cloud clients; students receive only their own records and peer leaderboard is teacher-only to protect grades.
- Authenticated pages live under the client-only _authenticated layout; the public sign-in and recovery pages remain SSR-enabled to avoid session redirect loops.
- Use authenticated server functions for score and lesson-mark writes, and database uniqueness for video rewards, so refreshes and repeated completions cannot duplicate a reward.
````

## File: drizzle.config.ts
````typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
````

## File: README.md
````markdown
# Math LMS

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://math-lms.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb544cd6-b485-4ea3-bb65-9a9cf0db1070).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
````

## File: tsconfig.json
````json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "vite.config.ts",
    "vitest.config.ts",
    "drizzle.config.ts",
    "eslint.config.js"
  ],
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client", "vitest/globals", "node"],

    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "noEmit": true,

    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
````

## File: vite.config.ts
````typescript
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Custom SSR wrapper at src/server.ts. Default router entry is src/router.tsx.
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
});
````

## File: src/integrations/supabase/client.server.ts
````typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_SUPABASE_URL = 'https://mbyselvthprrfjioyvhu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_6d4BjM4FHDurcIw2BhpeaQ_hsYnu4Ju';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function normalizeSupabaseUrl(rawUrl: string | undefined): string {
  const cleaned = (rawUrl ?? '').trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned) return DEFAULT_SUPABASE_URL;
  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    return parsed.origin;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseAdminClient() {
  const rawUrl = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const SUPABASE_URL = normalizeSupabaseUrl(rawUrl);
  const rawServiceKey =
    process.env['SUPABASE_SERVICE_ROLE_KEY'] ||
    process.env['SUPABASE_PUBLISHABLE_KEY'] ||
    process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
    DEFAULT_SUPABASE_KEY;
  const SUPABASE_KEY = rawServiceKey.trim().replace(/^['"]|['"]$/g, '') || DEFAULT_SUPABASE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
````

## File: src/lib/lovable-error-reporting.ts
````typescript

````

## File: src/lib/sheet-parse.ts
````typescript
// Pure rules for turning the teacher's Google Sheet tab into student records.
export type Category =
  | "homework"
  | "short_quiz"
  | "chapter_quiz"
  | "term_test"
  | "mock"
  | "exam"
  | "daily"
  | "overall"
  | "other";
export type MathSet = "S2M3" | "S2M5";

export interface ParsedScore {
  term: 1 | 2;
  kind: "item" | "summary";
  category: Category;
  label: string;
  score: number | null;
  absent: boolean;
  full_marks: number | null;
  position: number;
}

export interface ParsedStudent {
  hlcNo: string;
  email: string;
  name: string;
  className: string;
  classNo: string;
  set: MathSet;
  scores: ParsedScore[];
}

type Cell = string | number | boolean | null | undefined;

const text = (c: Cell) => (c === null || c === undefined ? "" : String(c)).trim();
const isFormula = (c: Cell) => typeof c === "string" && c.trim().startsWith("=");
const HLC_NO = /^HLC\d+$/i;
const HLC_HEADING = /^hlc\s*no\.?$/i;
const FULL_MARKS_HEADING = /^(full\s*marks?|max\.?\s*marks?|滿分)$/i;
const WEIGHT_HEADER = /\(\s*\d+(?:\.\d+)?\s*%\s*\)\s*$/;
// Column G. A = HLC no., B = Class, C = No., D = Name in English, E = 姓名, F = Sex.
const FIRST_SCORE_COLUMN = 6;

export function toNumber(c: Cell): number | null {
  if (typeof c === "number") return Number.isFinite(c) ? c : null;
  const t = text(c).replace(/%$/, "").replace(/,/g, "");
  if (!t || t.startsWith("#") || t === "-" || t === "—" || /^n\/?a$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function isAbsent(c: Cell) {
  const t = text(c).toUpperCase().replace(/\.$/, "");
  return t === "ABS" || t === "ABSENT";
}

/** "Homework (30%)" -> 30, "1st TT (200)" -> 200, "HW(30)" -> 30. */
export function bracketMarks(header: string): number | null {
  const m = header.match(/\(\s*(\d+(?:\.\d+)?)\s*%?\s*\)\s*$/);
  return m ? Number(m[1]) : null;
}

export function itemCategory(label: string, group = ""): Category {
  const l = label.toLowerCase().trim();
  const g = group.toLowerCase().trim();
  const combined = `${g} ${l}`;

  if (/^hw|\bhw\b|homework|assignment|worksheet|\bws\b|\bex\b|\bch\d*\s*hw/i.test(combined)) {
    return "homework";
  }
  if (/^sq|\bsq\b|short\s*quiz|s\.?q\.?\d/i.test(combined)) {
    return "short_quiz";
  }
  if (/^cq|\bcq\b|chapter\s*quiz|ch\.?\s*quiz|c\.?q\.?\d|post-summer|quiz/i.test(combined)) {
    return "chapter_quiz";
  }
  if (/\btt\b|term\s*test|t\da1|\but\b|unit\s*test|uniform\s*test/i.test(combined)) {
    return "term_test";
  }
  if (/mock/i.test(combined)) {
    return "mock";
  }
  if (/exam|t\da3/i.test(combined)) {
    return "exam";
  }
  return "other";
}

export function summaryCategory(header: string): Category {
  const h = header.toLowerCase().trim();
  if (/^t\da2|annual|overall|coursework/i.test(h)) return "overall";
  if (/^t\da1|\btt\b|term\s*test/i.test(h)) return "term_test";
  if (/^t\da3|exam/i.test(h) && !/mock/i.test(h)) return "exam";
  if (/homework|^hw|\bhw\b/i.test(h)) return "homework";
  if (/short\s*quiz|^sq|\bsq\b/i.test(h)) return "short_quiz";
  if (/chapter\s*quiz|^cq|\bcq\b/i.test(h)) return "chapter_quiz";
  if (/mock/i.test(h)) return "mock";
  if (/daily/i.test(h)) return "daily";
  return "other";
}

const round1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

function isSummaryHeaderName(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  if (/^daily/i.test(clean)) return true;
  if (
    /^(homework|short\s*quiz|chapter\s*quiz|mock(\s*exam)?|1st\s*tt|2nd\s*tt|t\da\d|annual|overall)\b/i.test(
      clean,
    )
  ) {
    return bracketMarks(clean) !== null;
  }
  return WEIGHT_HEADER.test(clean);
}

/** A weighted coursework column such as "Homework (30%)" or "Daily (10%)". */
function isWeightHeader(h: string): boolean {
  const clean = h.trim();
  if (!clean) return false;
  return /^daily/i.test(clean) || WEIGHT_HEADER.test(clean);
}

/**
 * formulas: the tab read with formulas kept (tells typed marks apart from calculated columns).
 * values: the same tab read as calculated values.
 */
export function parseSetTab(set: MathSet, formulas: Cell[][], values: Cell[][]): ParsedStudent[] {
  const gridF = formulas.length ? formulas : values;
  const gridV = values.length ? values : formulas;
  // Only trust "is this cell a formula?" when the source really kept formulas.
  const hasFormulaInfo = gridF.some((r) => r?.some((c) => isFormula(c)));

  let itemRow = gridF.findIndex((r) => HLC_HEADING.test(text(r?.[0])));
  if (itemRow < 0) {
    itemRow = gridF.findIndex((r) => r?.some((c) => HLC_HEADING.test(text(c))));
  }
  if (itemRow < 0) {
    const firstStudentIdx = gridF.findIndex((r) => HLC_NO.test(text(r?.[0])));
    if (firstStudentIdx > 0) itemRow = firstStudentIdx - 1;
  }
  if (itemRow < 0) {
    throw new Error(`${set}: could not find the "HLC no." heading in column A`);
  }

  const groupRow = itemRow > 0 ? itemRow - 1 : itemRow;

  const fullRow = gridF.findIndex(
    (r, idx) => idx !== itemRow && r?.some((c) => FULL_MARKS_HEADING.test(text(c))),
  );

  const studentRows = gridF
    .map((r, i) => ({ r, i }))
    .filter((x) => x.i > itemRow && HLC_NO.test(text(x.r?.[0])));

  const width = Math.max(
    0,
    ...gridF.map((r) => r?.length ?? 0),
    ...gridV.map((r) => r?.length ?? 0),
  );
  const header = (row: number, c: number) => (row >= 0 ? text(gridF[row]?.[c]) : "");

  const emailCol =
    [groupRow, itemRow]
      .map((row) => (gridF[row] ?? []).findIndex((c) => /e-?mail/i.test(text(c))))
      .find((i) => i >= 0) ?? -1;

  type Col = Omit<ParsedScore, "score" | "absent"> & { col: number };
  const cols: Col[] = [];
  const usedLabels = new Map<string, number>();
  let term: 1 | 2 = 1;
  let activeGroup = "";

  for (let c = FIRST_SCORE_COLUMN; c < width; c++) {
    if (c === emailCol) continue;

    const rawGroup = header(groupRow, c);
    const name = header(itemRow, c);

    // Merged group headings only fill their first cell, so carry them to the right.
    if (rawGroup) activeGroup = isSummaryHeaderName(rawGroup) ? "" : rawGroup;
    const group = rawGroup || activeGroup;

    let formulaCells = 0;
    let typedCells = 0;
    for (const s of studentRows) {
      const cell = s.r?.[c];
      if (isFormula(cell)) formulaCells++;
      else if (text(cell) !== "") typedCells++;
    }
    const computedByFormula = formulaCells > 0 && formulaCells >= typedCells;
    const computed = hasFormulaInfo
      ? computedByFormula || isWeightHeader(name) || (!name && isWeightHeader(rawGroup))
      : isSummaryHeaderName(name) || (!name && isSummaryHeaderName(rawGroup));

    if (/^t2|2nd/i.test(name) || /^t2|2nd/i.test(rawGroup)) term = 2;

    if (name && !computed && !name.includes("_%") && !name.startsWith("#")) {
      const fullFromRow = fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null;
      const full = fullFromRow ?? bracketMarks(name);
      // Two columns with the same heading are both kept instead of one silently disappearing.
      const key = `${term}|item|${name}`;
      const seen = (usedLabels.get(key) ?? 0) + 1;
      usedLabels.set(key, seen);
      cols.push({
        col: c,
        term,
        kind: "item",
        category: itemCategory(name, group),
        label: seen === 1 ? name : `${name} (${seen})`,
        full_marks: full,
        position: c,
      });
    } else {
      const label = name && bracketMarks(name) !== null ? name : rawGroup || name;
      const full = bracketMarks(label) ?? (fullRow >= 0 ? toNumber(gridV[fullRow]?.[c]) : null);
      const key = `${term}|summary|${label}`;
      if (label && full !== null && !label.startsWith("#") && !usedLabels.has(key)) {
        usedLabels.set(key, 1);
        cols.push({
          col: c,
          term,
          kind: "summary",
          category: summaryCategory(label),
          label,
          full_marks: full,
          position: c,
        });
      }
    }

    if (/^t1a3/i.test(rawGroup) || /^t1a3/i.test(name)) term = 2;
  }

  return studentRows.map(({ r, i }) => {
    const hlcNo = text(r[0]).toUpperCase();
    const typedEmail = emailCol >= 0 ? text(r[emailCol]).toLowerCase() : "";
    return {
      hlcNo,
      set,
      email: typedEmail.includes("@") ? typedEmail : `${hlcNo.toLowerCase()}@hlc.edu.hk`,
      name: text(r[3]) || hlcNo,
      className: text(r[1]),
      classNo: text(r[2]),
      scores: cols.flatMap(({ col, ...meta }) => {
        const raw = gridV[i]?.[col];
        const absent = isAbsent(raw);
        const score = round1(toNumber(raw));
        if (meta.kind === "summary" && score === null) return [];
        if (meta.category === "other" && score === null && !absent) return [];
        return [{ ...meta, score, absent }];
      }),
    };
  });
}
````

## File: src/start.ts
````typescript
import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
````

## File: src/styles.css
````css
/*
 * Tailwind v4 entry: config lives here, with no tailwind.config.js or PostCSS plugin.
 * - Keep every @import in this top block, above @theme and the rest of the file. Install an
 *   npm package before @importing its CSS. Never @import a remote URL (web fonts, CDN CSS): the
 *   build resolves @import from the filesystem. Load those with a <link> in the head() of
 *   src/routes/__root.tsx and name the family in a --font-* token in @theme inline below.
 */
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/*
 * Design system definition.
 *
 * The design lives in this file: oklch color tokens on the shadcn variables
 * (--background, --foreground, --primary, --secondary, --muted, --accent, ...) plus
 * new tokens as needed, font tokens, and custom styles and animations.
 *
 * The @theme inline block maps CSS custom properties to Tailwind utility
 * classes (e.g. --color-primary -> bg-primary, text-primary).
 *
 * The :root and .dark blocks define the actual color values using oklch.
 * All colors MUST use oklch format.
 *
 * To add a new semantic color:
 * 1. Add the variable to :root (light value) and .dark (dark value)
 * 2. Register it in @theme inline as --color-<name>: var(--<name>)
 */

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-ring-offset-background: var(--background);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-success: var(--success);
  --color-gold: var(--gold);
  --color-gold-deep: var(--gold-deep);
  --color-silver: var(--silver);
  --color-bronze: var(--bronze);
  --color-flame: var(--flame);
  --font-display: "Source Sans 3", ui-sans-serif, sans-serif;
  --font-sans: "Source Sans 3", ui-sans-serif, sans-serif;
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

:root {
  --radius: 1rem;
  --background: oklch(0.98 0.01 240);
  --foreground: oklch(0.25 0.04 255);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.25 0.04 255);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.25 0.04 255);
  --primary: oklch(0.62 0.19 250);
  --primary-deep: oklch(0.5 0.18 252);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.95 0.03 240);
  --secondary-foreground: oklch(0.3 0.08 255);
  --muted: oklch(0.95 0.012 245);
  --muted-foreground: oklch(0.52 0.03 255);
  --accent: oklch(0.82 0.16 82);
  --accent-foreground: oklch(0.3 0.06 60);
  --success: oklch(0.7 0.17 152);
  --success-deep: oklch(0.58 0.15 152);
  --gold: oklch(0.82 0.16 82);
  --gold-deep: oklch(0.68 0.15 70);
  --silver: oklch(0.8 0.01 250);
  --bronze: oklch(0.66 0.11 55);
  --flame: oklch(0.7 0.2 40);
  --destructive: oklch(0.64 0.22 25);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.91 0.015 245);
  --input: oklch(0.91 0.015 245);
  --ring: oklch(0.62 0.19 250);
  --chart-1: oklch(0.62 0.19 250);
  --chart-2: oklch(0.7 0.17 152);
  --chart-3: oklch(0.82 0.16 82);
  --chart-4: oklch(0.64 0.22 25);
  --chart-5: oklch(0.6 0.15 300);
  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.25 0.04 255);
  --sidebar-primary: oklch(0.62 0.19 250);
  --sidebar-primary-foreground: oklch(0.99 0 0);
  --sidebar-accent: oklch(0.95 0.03 240);
  --sidebar-accent-foreground: oklch(0.3 0.08 255);
  --sidebar-border: oklch(0.91 0.015 245);
  --sidebar-ring: oklch(0.62 0.19 250);
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}

@layer base {
  h1, h2, h3 { font-family: var(--font-display); }
}
@utility shadow-chunky-primary { box-shadow: 0 4px 0 var(--primary-deep); }
@utility shadow-chunky-success { box-shadow: 0 4px 0 var(--success-deep); }
@utility shadow-chunky-gold { box-shadow: 0 4px 0 var(--gold-deep); }
@utility shadow-chunky { box-shadow: 0 4px 0 var(--border); }
@utility bg-hero { background: radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 50%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--success) 22%, transparent), transparent 50%), var(--background); }

.google-auth { background: #FFFFFF; border: 1px solid #747775; color: #1F1F1F; font-weight: 500; }
````

## File: src/components/AppShell.tsx
````typescript
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Dices,
  Gift,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Trophy,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Button } from "@/components/ui/button";

interface NavLink {
  to: "/dashboard" | "/courses" | "/awards" | "/teacher" | "/activity" | "/upload" | "/leaderboard";
  label: string;
  icon: LucideIcon;
}

const STUDENT_LINKS: NavLink[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Chapter", icon: BookOpen },
  { to: "/awards", label: "Awards", icon: Gift },
];

const TEACHER_LINKS: NavLink[] = [
  { to: "/teacher", label: "Analytics", icon: Users },
  { to: "/activity", label: "Class activity", icon: Dices },
  { to: "/upload", label: "Chapter content", icon: Upload },
  { to: "/awards", label: "Awards", icon: Gift },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, logout, ready, error, me } = useApp();
  const navigate = useNavigate();
  const links = role === "student" ? STUDENT_LINKS : TEACHER_LINKS;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            to={role === "teacher" ? "/teacher" : "/dashboard"}
            className="flex items-center gap-2 font-display text-xl font-semibold"
          >
            <GraduationCap className="h-6 w-6 text-primary" />
            HLC Math
          </Link>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:ml-6 md:w-auto">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground"
                activeProps={{ className: "bg-muted text-primary" }}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm capitalize text-muted-foreground">{role}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              title={session?.email}
              onClick={async () => {
                await logout();
                await navigate({ to: "/", replace: true });
              }}
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {!ready ? (
          <p>Loading your records…</p>
        ) : error ? (
          <p role="alert" className="text-destructive">
            {error}
          </p>
        ) : !session ? (
          <Link to="/">Sign in</Link>
        ) : role === "student" && !me.id ? (
          <p>
            Your school account is not linked to a student record yet. Please contact your teacher.
          </p>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export function TeacherOnly({ children }: { children: ReactNode }) {
  const { role } = useApp();
  return role === "teacher" ? children : <p>Teacher access required.</p>;
}

export function scoreTone(s: number | null) {
  return s === null
    ? "bg-muted text-muted-foreground"
    : s >= 85
      ? "bg-success/15 text-success"
      : s >= 60
        ? "bg-primary/10 text-primary"
        : "bg-destructive/15 text-destructive";
}

export const CHAPTER_STATUS = {
  Completed: { cls: "bg-success/15 text-success", icon: CheckCircle2 },
  "In Progress": { cls: "bg-gold/25 text-gold-deep", icon: PlayCircle },
  "Not Started": { cls: "bg-muted text-muted-foreground", icon: Circle },
};
````

## File: src/integrations/supabase/previewAuthStorage.ts
````typescript
// This file is automatically generated. Do not edit it directly.

export interface PreviewAuthStorage {
    getItem: (key: string) => string | null | Promise<string | null>;
    setItem: (key: string, value: string) => void | Promise<void>;
    removeItem: (key: string) => void | Promise<void>;
  }
  
  export function brokeredPreviewStorage(): PreviewAuthStorage | undefined {
    if (typeof window === 'undefined') return undefined;
    return window.localStorage;
  }
````

## File: src/routes/_authenticated/courses.$chapter.tsx
````typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  ListChecks,
  PlayCircle,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { ChapterVideoPlayer } from "@/components/ChapterVideoPlayer";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { percent } from "@/lib/assessments";
import { isWebLink, notesPreviewUrl } from "@/lib/drive-link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/$chapter")({
  head: ({ params }) => {
    const c = CHAPTERS.find((x) => String(x.id) === params.chapter);
    const title = c ? `Chapter ${c.id}: ${c.title} — HLC Math` : "Chapter — HLC Math";
    return {
      meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { title },
        {
          name: "description",
          content: c ? `Videos, notes, exercise and progress for ${c.title}.` : "Math chapter.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Watch the lessons, read the notes and practise." },
      ],
    };
  },
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter } = Route.useParams();
  const { me, role, videos, content, refresh } = useApp();
  const c = CHAPTERS.find((x) => String(x.id) === chapter);
  const list = videos.filter((v) => v.chapter === c?.id);
  const done = (id: string) => Boolean(me.completedVideos?.includes(id));
  const [activeId, setActiveId] = useState<string | null>(null);
  if (!c) {
    return (
      <AppShell>
        <p>Chapter not found.</p>
        <Link to="/courses" className="text-primary underline">
          Back to chapters
        </Link>
      </AppShell>
    );
  }

  const active = list.find((v) => v.id === activeId) ?? list.find((v) => !done(v.id)) ?? list[0];
  const materials = content.find((m) => m.chapter === c.id);
  const notes = materials?.notes.trim() ?? "";
  const preview = notesPreviewUrl(notes);
  const idx = c.id - 1;
  const score = me.scores[idx] ?? null;
  const st = chapterStatus(score, idx, me.scores);
  const S = STATUS[st];
  const watched = list.filter((v) => done(v.id)).length;
  const canEarn = role === "student" && Boolean(me.id);
  const quizzes = (me.assessments ?? []).filter(
    (a) =>
      a.kind === "item" && new RegExp(`^(SQ|CQ)\\s*${c.id}(\\.\\d+)?$`, "i").test(a.label.trim()),
  );

  const complete = async (videoId: string) => {
    const { data, error } = await supabase.rpc("complete_chapter_video", { _video_id: videoId });
    if (error) throw error;
    await refresh();
    if (data) toast.success("Video completed — 1 Math Coin earned");
  };

  const openOldPdf = async (path: string) => {
    const { data, error } = await supabase.storage.from("chapter-notes").createSignedUrl(path, 300);
    if (error) toast.error(error.message);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell>
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All chapters
      </Link>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-3xl">
          {c.emoji}
        </span>
        <div className="mr-auto min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
            Chapter {c.id}
          </p>
          <h1 className="text-2xl font-bold leading-tight md:text-3xl">{c.title}</h1>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold",
            S.cls,
          )}
        >
          <S.icon className="h-3.5 w-3.5" /> {st}
        </span>
      </div>

      <section aria-label="Progress" className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Videos watched</p>
          <p className="font-display text-3xl font-bold">
            {watched}
            <span className="text-lg text-muted-foreground"> / {list.length}</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${list.length ? (watched / list.length) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Math Coins from videos</p>
          <p className="font-display text-3xl font-bold">🪙 {watched}</p>
          <p className="text-xs text-muted-foreground">1 coin for each video watched to the end</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-4">
          <p className="text-sm font-semibold text-muted-foreground">Chapter score</p>
          <p
            className={cn(
              "mt-1 inline-block rounded-full px-3 py-1 text-lg font-extrabold",
              scoreTone(score),
            )}
          >
            {score === null ? "No score yet" : `${score}%`}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Video className="h-5 w-5 text-primary" /> Videos
        </h2>
        {!active ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Your teacher has not added videos for this chapter yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <ChapterVideoPlayer
              key={active.id}
              video={active}
              completed={done(active.id)}
              canEarn={canEarn}
              onComplete={complete}
            />
            <ol className="space-y-2">
              {list.map((v, i) => (
                <li key={v.id}>
                  <button
                    onClick={() => setActiveId(v.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm",
                      v.id === active.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {done(v.id) ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <PlayCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-muted-foreground">Video {i + 1}</span>
                      <span className="block font-semibold">{v.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section
          className={cn(
            "rounded-3xl border-2 border-border bg-card p-5 shadow-chunky",
            preview && "md:col-span-2",
          )}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <FileText className="h-5 w-5 text-success" /> Notes
          </h2>
          {isWebLink(notes) ? (
            <>
              {preview && (
                <iframe
                  src={preview}
                  title={`Chapter ${c.id} notes`}
                  loading="lazy"
                  allow="autoplay"
                  className="mt-3 h-[70vh] w-full rounded-xl border-2 border-border bg-muted"
                />
              )}
              <a
                href={notes}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary underline"
              >
                Open notes in Google Drive <ExternalLink className="h-4 w-4" />
              </a>
              {preview && (
                <p className="mt-1 text-xs text-muted-foreground">
                  If the notes don&apos;t show, sign in to Google with your school account.
                </p>
              )}
            </>
          ) : notes ? (
            <Button className="mt-3" variant="outline" onClick={() => void openOldPdf(notes)}>
              Open chapter notes (PDF)
            </Button>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No notes uploaded yet.</p>
          )}
        </section>
        <section className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ListChecks className="h-5 w-5 text-gold-deep" /> Exercise
          </h2>
          {materials?.quiz ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{materials.quiz}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">No exercise added yet.</p>
          )}
        </section>
      </div>

      {quizzes.length > 0 && (
        <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
          <h2 className="text-lg font-bold">My quiz results for this chapter</h2>
          <ul className="mt-3 divide-y divide-border">
            {quizzes.map((q) => {
              const p = percent(q);
              return (
                <li
                  key={`${q.term}-${q.label}`}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="font-semibold">
                    {q.label.toUpperCase().startsWith("CQ") ? "Chapter quiz" : "Short quiz"}{" "}
                    {q.label}
                  </span>
                  <span className={cn("rounded-full px-3 py-0.5 font-bold", scoreTone(p))}>
                    {q.absent
                      ? "Absent"
                      : q.score === null
                        ? "—"
                        : `${q.score}${q.full_marks ? ` / ${q.full_marks}` : ""}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
````

## File: src/routes/_authenticated/courses.index.tsx
````typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell, CHAPTER_STATUS as STATUS, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, chapterStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/courses/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapters — HLC Math" },
      { name: "description", content: "Mathematics chapters 1–7 with videos, notes and exercises." },
      { property: "og:title", content: "Chapters — HLC Math" },
      { property: "og:description", content: "Seven Math chapters to master." },
    ],
  }),
  component: Courses,
});

function Courses() {
  const { me, videos } = useApp();
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Chapter</h1>
      <p className="font-semibold text-muted-foreground">Mathematics · choose a chapter to open its videos, notes and exercise</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c, i) => {
          const list = videos.filter(v => v.chapter === c.id);
          const watched = list.filter(v => me.completedVideos?.includes(v.id)).length;
          const s = me.scores[i] ?? null;
          const st = chapterStatus(s, i, me.scores);
          const S = STATUS[st];
          return (
            <Link key={c.id} to="/courses/$chapter" params={{ chapter: String(c.id) }} className="flex flex-col rounded-3xl border-2 border-border bg-card p-5 shadow-chunky transition hover:-translate-y-1 hover:border-primary">
              <div className="flex items-start justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-3xl">{c.emoji}</span>
                <span className={cn("flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold", S.cls)}>
                  <S.icon className="h-3.5 w-3.5" /> {st}
                </span>
              </div>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-primary">Chapter {c.id}</p>
              <h2 className="text-lg font-bold leading-tight">{c.title}</h2>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>{list.length ? `${watched}/${list.length} videos watched` : "No videos yet"}</span>
                </div>
                {list.length > 0 && <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{ width: `${(watched / list.length) * 100}%` }} /></div>}
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className={cn("rounded-full px-3 py-1 text-sm font-extrabold", scoreTone(s))}>
                  {s === null ? "No score yet" : `Score ${s}%`}
                </span>
                <span className="flex items-center text-sm font-semibold text-primary">Open <ChevronRight className="h-4 w-4" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
````

## File: src/integrations/supabase/types.ts
````typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessment_scores: {
        Row: {
          absent: boolean
          category: string
          full_marks: number | null
          kind: string
          label: string
          position: number
          score: number | null
          student_id: string
          synced_at: string
          term: number
        }
        Insert: {
          absent?: boolean
          category: string
          full_marks?: number | null
          kind: string
          label: string
          position?: number
          score?: number | null
          student_id: string
          synced_at?: string
          term: number
        }
        Update: {
          absent?: boolean
          category?: string
          full_marks?: number | null
          kind?: string
          label?: string
          position?: number
          score?: number | null
          student_id?: string
          synced_at?: string
          term?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_content: {
        Row: {
          chapter: number
          notes: string
          quiz: string
          updated_at: string
          video: string
        }
        Insert: {
          chapter: number
          notes?: string
          quiz?: string
          updated_at?: string
          video?: string
        }
        Update: {
          chapter?: number
          notes?: string
          quiz?: string
          updated_at?: string
          video?: string
        }
        Relationships: []
      }
      chapter_scores: {
        Row: {
          chapter: number
          score: number | null
          student_id: string
        }
        Insert: {
          chapter: number
          score?: number | null
          student_id: string
        }
        Update: {
          chapter?: number
          score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_video_completions: {
        Row: {
          chapter: number
          completed_at: string
          id: string
          marks: number
          student_id: string
          video_id: string | null
          video_title: string
        }
        Insert: {
          chapter: number
          completed_at?: string
          id?: string
          marks?: number
          student_id: string
          video_id?: string | null
          video_title: string
        }
        Update: {
          chapter?: number
          completed_at?: string
          id?: string
          marks?: number
          student_id?: string
          video_id?: string | null
          video_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_video_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_video_completions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "chapter_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_videos: {
        Row: {
          chapter: number
          created_at: string
          id: string
          position: number
          title: string
          url: string
        }
        Insert: {
          chapter: number
          created_at?: string
          id?: string
          position?: number
          title: string
          url: string
        }
        Update: {
          chapter?: number
          created_at?: string
          id?: string
          position?: number
          title?: string
          url?: string
        }
        Relationships: []
      }
      daily_marks: {
        Row: {
          awarded_by: string
          batch_id: string | null
          created_at: string
          id: string
          lesson_date: string
          marks: number
          note: string
          reason: string
          student_id: string
        }
        Insert: {
          awarded_by: string
          batch_id?: string | null
          created_at?: string
          id?: string
          lesson_date?: string
          marks: number
          note?: string
          reason: string
          student_id: string
        }
        Update: {
          awarded_by?: string
          batch_id?: string | null
          created_at?: string
          id?: string
          lesson_date?: string
          marks?: number
          note?: string
          reason?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string
          id: string
          preferences: Json
        }
        Insert: {
          display_name?: string
          id: string
          preferences?: Json
        }
        Update: {
          display_name?: string
          id?: string
          preferences?: Json
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          cost: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          reward_id: string | null
          reward_name: string
          status: string
          student_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          reward_id?: string | null
          reward_name: string
          status?: string
          student_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          reward_id?: string | null
          reward_name?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active: boolean
          cooldown_days: number | null
          cost: number
          created_at: string
          description: string
          emoji: string
          id: string
          name: string
          position: number
        }
        Insert: {
          active?: boolean
          cooldown_days?: number | null
          cost: number
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          name: string
          position?: number
        }
        Update: {
          active?: boolean
          cooldown_days?: number | null
          cost?: number
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      sheet_syncs: {
        Row: {
          created_at: string
          id: string
          scores: number
          students: number
          synced_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          scores?: number
          students?: number
          synced_by: string
        }
        Update: {
          created_at?: string
          id?: string
          scores?: number
          students?: number
          synced_by?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_name: string
          class_no: string
          email: string
          hlc_no: string | null
          id: string
          last_month_avg: number
          last_month_form_rank: number
          math_set: string
          name: string
          streak: number
          user_id: string | null
          xp: number
        }
        Insert: {
          class_name?: string
          class_no?: string
          email: string
          hlc_no?: string | null
          id?: string
          last_month_avg?: number
          last_month_form_rank?: number
          math_set: string
          name: string
          streak?: number
          user_id?: string | null
          xp?: number
        }
        Update: {
          class_name?: string
          class_no?: string
          email?: string
          hlc_no?: string | null
          id?: string
          last_month_avg?: number
          last_month_form_rank?: number
          math_set?: string
          name?: string
          streak?: number
          user_id?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_completions: {
        Row: {
          chapter: number
          completed_at: string
          marks: number
          student_id: string
          video_url: string
        }
        Insert: {
          chapter: number
          completed_at?: string
          marks?: number
          student_id: string
          video_url: string
        }
        Update: {
          chapter?: number
          completed_at?: string
          marks?: number
          student_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_completions_chapter_fkey"
            columns: ["chapter"]
            isOneToOne: false
            referencedRelation: "chapter_content"
            referencedColumns: ["chapter"]
          },
          {
            foreignKeyName: "video_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      student_coin_totals: {
        Row: {
          daily_earned: number | null
          spent: number | null
          student_id: string | null
          video_earned: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      claim_student: { Args: never; Returns: undefined }
      complete_chapter_video: { Args: { _video_id: string }; Returns: boolean }
      complete_video: { Args: { _chapter: number }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_reward: { Args: { _reward_id: string }; Returns: string }
    }
    Enums: {
      app_role: "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["teacher", "student"],
    },
  },
} as const
````

## File: src/lib/assessments.ts
````typescript
import type { Category } from "./sheet-parse";

export interface Assessment {
  term: number;
  kind: "item" | "summary";
  category: Category;
  label: string;
  score: number | null;
  absent: boolean;
  full_marks: number | null;
  position: number;
}

export const ITEM_CATEGORIES: { id: Category; label: string }[] = [
  { id: "homework", label: "Homework" },
  { id: "short_quiz", label: "Short Quiz" },
  { id: "chapter_quiz", label: "Chapter Quiz" },
  { id: "term_test", label: "Term Test" },
  { id: "mock", label: "Mock Exam" },
  { id: "exam", label: "Exam" },
];

/** Coursework weights from the teacher's sheet: total out of 100, doubled to /200 (T1A2). */
export const WEIGHTS = [
  { id: "homework", label: "Homework", weight: 30 },
  { id: "short_quiz", label: "Short Quiz", weight: 20 },
  { id: "chapter_quiz", label: "Chapter Quiz", weight: 30 },
  { id: "mock", label: "Mock Exam", weight: 10 },
  { id: "daily", label: "Daily", weight: 10 },
] as const satisfies readonly { id: Category; label: string; weight: number }[];

const round1 = (n: number) => Math.round(n * 10) / 10;

const QUIZ_CATEGORIES: Category[] = ["short_quiz", "chapter_quiz"];

/** Ways a column heading can name its chapter. The first pattern that matches wins. */
const CHAPTER_PATTERNS: RegExp[] = [
  /\bch(?:apter)?\s*\.?\s*(\d{1,2})(?!\d)/i, // "Ch1", "Ch.1", "Chapter 1", "SQ Ch2"
  /^(?:SQ|CQ|HW|Q|QUIZ|WS|EX)\s*[-_.]?\s*(\d{1,2})\s*[.\-_]\s*\d+/i, // "SQ1.1", "CQ 2-1", "HW3.2"
  /^(?:SQ|CQ|QUIZ|Q)\s*[-_.]?\s*(\d{1,2})$/i, // "SQ1", "CQ 2", "Quiz 3"
  /^(\d{1,2})\s*\.\s*\d+$/, // "1.1" under an SQ / CQ group heading
];

export function percent(a: Pick<Assessment, "score" | "full_marks">) {
  if (a.score === null) return null;
  if (a.full_marks && a.full_marks > 0) {
    return Math.round((a.score / a.full_marks) * 100);
  }
  return a.score >= 0 && a.score <= 100 ? Math.round(a.score) : null;
}

export function termsOf(list: Assessment[]) {
  return [...new Set(list.map((a) => a.term))].sort();
}

export function chapterOfLabel(label: string, maxChapter = 7): number | null {
  const t = label.trim();
  for (const re of CHAPTER_PATTERNS) {
    const n = Number(re.exec(t)?.[1]);
    if (Number.isInteger(n) && n >= 1 && n <= maxChapter) return n;
  }
  return null;
}

function markedPercent(a: Assessment): number | null {
  if (a.absent || a.score === null || a.full_marks === null || a.full_marks <= 0) return null;
  return (a.score / a.full_marks) * 100;
}

function chapterAverage(
  list: Assessment[],
  categories: Category[],
  chapter: number,
  maxChapter: number,
): number | null {
  const values = list
    .filter(
      (a) =>
        a.kind === "item" &&
        categories.includes(a.category) &&
        chapterOfLabel(a.label, maxChapter) === chapter,
    )
    .map(markedPercent)
    .filter((p): p is number => p !== null);
  return values.length ? Math.round(values.reduce((x, y) => x + y, 0) / values.length) : null;
}

/**
 * Chapter score from the Google Sheet: the average percentage of that chapter's short quizzes
 * and chapter quizzes; if a chapter has no quiz yet, its homework average is used instead.
 */
export function chapterScoresFromAssessments(list: Assessment[], chapters = 7): (number | null)[] {
  return Array.from(
    { length: chapters },
    (_, i) =>
      chapterAverage(list, QUIZ_CATEGORIES, i + 1, chapters) ??
      chapterAverage(list, ["homework"], i + 1, chapters),
  );
}

/** Quiz columns whose heading does not name a chapter, so they cannot count towards Ch1–Ch7. */
export function unmatchedChapterLabels(list: Assessment[], chapters = 7): string[] {
  return [
    ...new Set(
      list
        .filter(
          (a) =>
            a.kind === "item" &&
            QUIZ_CATEGORIES.includes(a.category) &&
            chapterOfLabel(a.label, chapters) === null,
        )
        .map((a) => a.label),
    ),
  ].sort();
}

/** Average of marked items (absent and blank ignored, like the sheet's AVERAGE) times the category weight. */
export function contribution(
  list: Assessment[],
  term: number,
  category: Category,
  weight: number,
): number | null {
  if (category === "daily") {
    const d = list.find((a) => a.term === term && a.kind === "summary" && a.category === "daily");
    return d?.score ?? null;
  }

  const withFull = list.filter(
    (a) =>
      a.term === term &&
      a.kind === "item" &&
      a.category === category &&
      !a.absent &&
      a.score !== null &&
      a.full_marks &&
      a.full_marks > 0,
  );
  if (withFull.length > 0) {
    const ratios = withFull.map((a) => (a.score as number) / (a.full_marks as number));
    return round1((ratios.reduce((x, y) => x + y, 0) / ratios.length) * weight);
  }

  const summaryItem = list.find(
    (a) => a.term === term && a.kind === "summary" && a.category === category && a.score !== null,
  );
  if (summaryItem && summaryItem.score !== null) {
    return round1(summaryItem.score);
  }

  return null;
}

export function termSummary(list: Assessment[], term: number) {
  const parts = WEIGHTS.map((w) => ({ ...w, value: contribution(list, term, w.id, w.weight) }));
  const sum = parts.reduce((t, p) => t + (p.value ?? 0), 0);
  return { parts, coursework200: round1(sum * 2) };
}
````

## File: src/lib/sheets.functions.ts
````typescript
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { parseSetTab, type MathSet, type ParsedStudent } from "./sheet-parse";

const SPREADSHEET_ID = "1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8";
const GOOGLE_SHEETS_API_URL = "https://sheets.googleapis.com/v4";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
// The xlsx export keeps every tab, the real cell values and the formulas. The gviz CSV endpoint
// does not: it blanks out text in mostly-numeric columns, which wipes the "SQ1.1" heading row.
const PUBLIC_XLSX_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`;
const TABS: MathSet[] = ["S2M3", "S2M5"];
const MAX_ROWS = 1000;
const MAX_COLS = 400;
const WRITE_CHUNK = 500;
const DELETE_CHUNK = 100;

type Cell = string | number | boolean | null;
type Grid = Cell[][];

export type SheetSource = "service_account" | "api_key" | "public_xlsx";

export interface TabReport {
  set: MathSet;
  students: number;
  term1Items: number;
  term2Items: number;
  scores: number;
}

export interface SyncReport {
  source: SheetSource;
  students: number;
  scores: number;
  syncedAt: string;
  tabs: TabReport[];
  duplicates: string[];
}

interface SheetGrids {
  formulas: Grid[];
  values: Grid[];
  source: SheetSource;
}

interface XlsxCell {
  t?: string;
  v?: unknown;
  w?: string;
  f?: string;
}

type XlsxSheet = Record<string, unknown>;

interface XlsxRange {
  s: { r: number; c: number };
  e: { r: number; c: number };
}

interface XlsxModule {
  read: (
    data: Uint8Array,
    opts: Record<string, unknown>,
  ) => { SheetNames: string[]; Sheets: Record<string, XlsxSheet | undefined> };
  utils: {
    decode_range: (ref: string) => XlsxRange;
    encode_cell: (cell: { r: number; c: number }) => string;
  };
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function cleanEnv(raw: string | undefined): string {
  return (raw ?? "").trim().replace(/^['"]|['"]$/g, "");
}

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

function normalizePrivateKey(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("{")) {
    try {
      const parsed = JSON.parse(cleaned) as { private_key?: string };
      if (parsed.private_key) cleaned = parsed.private_key;
    } catch {
      // Not JSON: treat the value as the key itself.
    }
  }
  return cleaned.replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n");
}

function extractClientEmail(emailRaw: string | undefined, keyRaw: string | undefined): string {
  if (keyRaw && keyRaw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(keyRaw.trim()) as { client_email?: string };
      if (parsed.client_email) return parsed.client_email.trim();
    } catch {
      // Not JSON: fall back to the separate email variable.
    }
  }
  return cleanEnv(emailRaw);
}

async function getServiceAccountAccessToken(
  clientEmail: string,
  privateKeyRaw: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 60 > now) {
    return cachedAccessToken.token;
  }

  const { createSign } = await import("node:crypto");
  const privateKey = normalizePrivateKey(privateKeyRaw);
  const cleanEmail = extractClientEmail(clientEmail, privateKeyRaw);

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: cleanEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  ).toString("base64url");

  const unsignedJwt = `${header}.${claimSet}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${unsignedJwt}.${signature}`;

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `Service Account (${cleanEmail}) 驗證失敗 [${res.status}]: ${errText.slice(0, 200)}`,
    );
  }

  const tokenData = (await res.json()) as { access_token: string; expires_in?: number };
  cachedAccessToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in ?? 3600),
  };
  return tokenData.access_token;
}

async function readTabsViaApi(
  render: "FORMULA" | "UNFORMATTED_VALUE",
  headers: Record<string, string>,
  extraQuery = "",
): Promise<Grid[]> {
  const ranges = TABS.map((t) => `ranges=${encodeURIComponent(`'${t}'!A1:ZZ${MAX_ROWS}`)}`).join(
    "&",
  );
  const url = `${GOOGLE_SHEETS_API_URL}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges}&valueRenderOption=${render}&majorDimension=ROWS${extraQuery}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API 讀取失敗 [${res.status}]: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { valueRanges?: { values?: Grid }[] };
  return TABS.map((_, i) => json.valueRanges?.[i]?.values ?? []);
}

async function loadXlsx(): Promise<XlsxModule> {
  const mod = (await import("xlsx")) as unknown as Partial<XlsxModule> & { default?: XlsxModule };
  if (typeof mod.read === "function" && mod.utils) return mod as XlsxModule;
  if (mod.default && typeof mod.default.read === "function") return mod.default;
  throw new Error("無法載入 xlsx 解析器，請確認已經執行安裝指令");
}

function cellValue(cell: XlsxCell | undefined): Cell {
  if (!cell) return null;
  if (cell.t === "e") return typeof cell.w === "string" ? cell.w : "#ERROR";
  const v = cell.v;
  if (typeof v === "number" || typeof v === "boolean" || typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  return null;
}

function sheetToGrids(XLSX: XlsxModule, sheet: XlsxSheet): { formulas: Grid; values: Grid } {
  const ref = sheet["!ref"];
  if (typeof ref !== "string" || ref === "") return { formulas: [], values: [] };
  const range = XLSX.utils.decode_range(ref);
  const lastRow = Math.min(range.e.r, MAX_ROWS - 1);
  const lastCol = Math.min(range.e.c, MAX_COLS - 1);
  const formulas: Grid = [];
  const values: Grid = [];
  // Always start from A1 so row and column numbers line up with the sheet.
  for (let r = 0; r <= lastRow; r++) {
    const formulaRow: Cell[] = [];
    const valueRow: Cell[] = [];
    for (let c = 0; c <= lastCol; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })] as XlsxCell | undefined;
      const value = cellValue(cell);
      valueRow.push(value);
      formulaRow.push(cell && typeof cell.f === "string" && cell.f !== "" ? `=${cell.f}` : value);
    }
    formulas.push(formulaRow);
    values.push(valueRow);
  }
  return { formulas, values };
}

async function readPublicWorkbook(): Promise<{ formulas: Grid[]; values: Grid[] }> {
  const res = await fetch(PUBLIC_XLSX_URL, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`下載試算表失敗 (HTTP ${res.status})`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  // A real .xlsx file is a zip archive and starts with "PK"; a Google login page is HTML.
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(
      "Google 冇俾下載試算表（請確認已開放「知道連結的任何人 → 檢視者」，以及冇關閉檢視者的下載權限）",
    );
  }
  const XLSX = await loadXlsx();
  const workbook = XLSX.read(bytes, {
    type: "array",
    cellFormula: true,
    cellText: true,
    cellDates: false,
  });
  const formulas: Grid[] = [];
  const values: Grid[] = [];
  for (const tab of TABS) {
    const sheetName = workbook.SheetNames.find((n) => n.trim().toUpperCase() === tab.toUpperCase());
    const sheet = sheetName === undefined ? undefined : workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`試算表入面搵唔到分頁「${tab}」`);
    const grids = sheetToGrids(XLSX, sheet);
    formulas.push(grids.formulas);
    values.push(grids.values);
  }
  return { formulas, values };
}

async function loadAllSheetGrids(): Promise<SheetGrids> {
  const failures: string[] = [];
  const serviceEmail =
    process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] || process.env["VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const privateKey = process.env["GOOGLE_PRIVATE_KEY"] || process.env["VITE_GOOGLE_PRIVATE_KEY"];
  const sheetsApiKey = cleanEnv(
    process.env["GOOGLE_SHEETS_API_KEY"] || process.env["VITE_GOOGLE_SHEETS_API_KEY"],
  );

  if (serviceEmail && privateKey) {
    try {
      const accessToken = await getServiceAccountAccessToken(serviceEmail, privateKey);
      const headers = { Authorization: `Bearer ${accessToken}` };
      const [formulas, values] = await Promise.all([
        readTabsViaApi("FORMULA", headers),
        readTabsViaApi("UNFORMATTED_VALUE", headers),
      ]);
      return { formulas, values, source: "service_account" };
    } catch (err) {
      failures.push(`Service Account：${errorMessage(err)}`);
    }
  }

  if (sheetsApiKey) {
    try {
      const query = `&key=${encodeURIComponent(sheetsApiKey)}`;
      const [formulas, values] = await Promise.all([
        readTabsViaApi("FORMULA", {}, query),
        readTabsViaApi("UNFORMATTED_VALUE", {}, query),
      ]);
      return { formulas, values, source: "api_key" };
    } catch (err) {
      failures.push(`API key：${errorMessage(err)}`);
    }
  }

  try {
    const grids = await readPublicWorkbook();
    return { ...grids, source: "public_xlsx" };
  } catch (err) {
    failures.push(`公開連結：${errorMessage(err)}`);
  }

  throw new Error(`無法讀取 Google Sheet。${failures.join("；")}`);
}

export const syncGoogleSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SyncReport> => {
    const { supabase, userId } = context;
    const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "teacher",
    });
    if (roleError) throw new Error(`檢查老師權限失敗：${roleError.message}`);
    if (!allowed) throw new Error("只有老師帳號 (Teacher) 可以同步成績");

    const { formulas, values, source } = await loadAllSheetGrids();
    const perTab = TABS.map((set, i) => ({
      set,
      students: parseSetTab(set, formulas[i] ?? [], values[i] ?? []),
    }));

    // The same email twice in one upsert makes Postgres reject the whole batch.
    const byEmail = new Map<string, ParsedStudent>();
    const duplicates: string[] = [];
    for (const { students } of perTab) {
      for (const p of students) {
        if (byEmail.has(p.email)) duplicates.push(`${p.set} ${p.hlcNo}`);
        else byEmail.set(p.email, p);
      }
    }
    const parsed = [...byEmail.values()];
    if (!parsed.length) {
      throw new Error("S2M3 / S2M5 分頁入面搵唔到任何有 HLC no. 嘅學生");
    }

    const tabs: TabReport[] = perTab.map(({ set, students }) => {
      const term1 = new Set<string>();
      const term2 = new Set<string>();
      let filled = 0;
      for (const p of students) {
        for (const s of p.scores) {
          if (s.kind === "item") (s.term === 1 ? term1 : term2).add(s.label);
          if (s.score !== null || s.absent) filled++;
        }
      }
      return {
        set,
        students: students.length,
        term1Items: term1.size,
        term2Items: term2.size,
        scores: filled,
      };
    });

    // Never wipe the saved marks because of a sheet that could not be read properly.
    if (tabs.every((t) => t.scores === 0)) {
      throw new Error(
        "讀到學生名單，但一個分數都讀唔到，為免清走舊分數，今次同步已停止。請檢查分頁有冇「HLC no.」標題列，以及分數係咪由 G 欄開始。",
      );
    }

    const { data: roster, error: rosterError } = await supabase
      .from("students")
      .upsert(
        parsed.map((p) => ({
          email: p.email,
          name: p.name,
          math_set: p.set,
          hlc_no: p.hlcNo,
          class_name: p.className,
          class_no: p.classNo,
        })),
        { onConflict: "email" },
      )
      .select("id, email");
    if (rosterError) throw new Error(`儲存學生名單失敗：${rosterError.message}`);
    const idByEmail = new Map((roster ?? []).map((r) => [r.email, r.id]));

    const syncedAt = new Date().toISOString();
    const rows = parsed.flatMap((p) => {
      const studentId = idByEmail.get(p.email);
      if (!studentId) return [];
      return p.scores.map((s) => ({ ...s, student_id: studentId, synced_at: syncedAt }));
    });

    for (const part of chunk(rows, WRITE_CHUNK)) {
      const { error } = await supabase
        .from("assessment_scores")
        .upsert(part, { onConflict: "student_id,term,kind,label" });
      if (error) throw new Error(`儲存分數失敗：${error.message}`);
    }

    for (const ids of chunk([...idByEmail.values()], DELETE_CHUNK)) {
      const { error } = await supabase
        .from("assessment_scores")
        .delete()
        .in("student_id", ids)
        .lt("synced_at", syncedAt);
      if (error) throw new Error(`清理舊分數失敗：${error.message}`);
    }

    const { error: logError } = await supabase.from("sheet_syncs").insert({
      synced_by: userId,
      students: parsed.length,
      scores: rows.length,
    });
    if (logError) console.warn("[Google Sheets] Could not record the sync time:", logError.message);

    return { source, students: parsed.length, scores: rows.length, syncedAt, tabs, duplicates };
  });
````

## File: src/routes/_authenticated/leaderboard.tsx
````typescript
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Flame } from "lucide-react";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { average, improvement, ranked } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Leaderboard — HLC Math" },
      { name: "description", content: "Math rankings across S2M3 and S2M5." },
      { property: "og:title", content: "Leaderboard — HLC Math" },
      { property: "og:description", content: "Who's topping Math this month?" },
    ],
  }),
  component: Leaderboard,
});

const FILTERS = ["Overall S2", "S2M3", "S2M5"] as const;
const PODIUM = [
  { ring: "border-gold bg-gold/15", badge: "bg-gold text-accent-foreground", h: "md:mt-0", trophy: "🥇" },
  { ring: "border-silver bg-silver/20", badge: "bg-silver text-foreground", h: "md:mt-8", trophy: "🥈" },
  { ring: "border-bronze bg-bronze/15", badge: "bg-bronze text-primary-foreground", h: "md:mt-12", trophy: "🥉" },
];

function Leaderboard() {
  const { students, me } = useApp();
  const [f, setF] = useState<(typeof FILTERS)[number]>("Overall S2");
  const list = ranked(f === "Overall S2" ? students : students.filter((s) => s.set === f));
  const top = list.slice(0, 3);
  const order = [1, 0, 2];

  return (
    <AppShell><TeacherOnly>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
        <div className="flex rounded-2xl bg-muted p-1">
          {FILTERS.map((x) => (
            <Button variant="ghost"
              key={x}
              onClick={() => setF(x)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-extrabold",
                f === x ? "bg-primary text-primary-foreground shadow-chunky-primary" : "text-muted-foreground",
              )}
            >
              {x}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {order.map((i) => {
          const s = top[i];
          if (!s) return null;
          const p = PODIUM[i];
          if (!p) return null;
          return (
            <div key={s.id} className={cn("rounded-3xl border-4 p-6 text-center", p.ring, p.h)}>
              {i === 0 && <Crown className="mx-auto h-8 w-8 text-gold" />}
              <div className="text-5xl">{p.trophy}</div>
              <p className="mt-2 font-display text-xl font-bold">{s.name}</p>
              <p className="text-sm font-bold text-muted-foreground">{s.set}</p>
              <span className={cn("mt-3 inline-block rounded-full px-4 py-1 font-display text-lg font-bold", p.badge)}>
                {average(s)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky">
        {list.map((s, i) => {
          const imp = improvement(s);
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-3 border-b border-border px-4 py-3 last:border-0",
                s.id === me.id && "bg-primary/10",
              )}
            >
              <span className="w-8 text-center font-display text-lg font-bold text-muted-foreground">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">
                  {s.name} {s.id === me.id && <span className="text-primary">(You)</span>}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">{s.set}</p>
              </div>
              <span className="hidden items-center gap-1 text-sm font-bold text-flame sm:flex">
                <Flame className="h-4 w-4" /> {s.streak}
              </span>
              <span className={cn("hidden w-14 text-right text-sm font-extrabold sm:block", imp >= 0 ? "text-success" : "text-destructive")}>
                {imp >= 0 ? "+" : ""}
                {imp}%
              </span>
              <span className="w-14 text-right font-display text-lg font-bold">{average(s)}%</span>
            </div>
          );
        })}
      </div>
    </TeacherOnly></AppShell>
  );
}
````

## File: src/routes/__root.tsx
````typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import { AppProvider } from "../lib/app-store";
import { Toaster } from "../components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong on our end. You can try refreshing or head back home."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HLC Math — Mathematics" },
      { name: "description", content: "Mathematics learning and progress for HLC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AppProvider>
    </QueryClientProvider>
  );
}
````

## File: drizzle/migrations/meta/_journal.json
````json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 1794207959028,
      "tag": "0000_private_math_records",
      "breakpoints": true
    },
    {
      "idx": 1,
      "version": "7",
      "when": 1794207995286,
      "tag": "0001_chapter_notes_access",
      "breakpoints": true
    },
    {
      "idx": 2,
      "version": "7",
      "when": 1794282352006,
      "tag": "0002_restrict_math_function_grants",
      "breakpoints": true
    },
    {
      "idx": 3,
      "version": "7",
      "when": 1794364838779,
      "tag": "0003_assessment_gradebook",
      "breakpoints": true
    },
    {
      "idx": 4,
      "version": "7",
      "when": 1794450463152,
      "tag": "0004_chapter_videos",
      "breakpoints": true
    }
  ]
}
````

## File: src/components/SheetGradebook.tsx
````typescript
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, RefreshCw, Sheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { syncGoogleSheet, type SheetSource, type SyncReport } from "@/lib/sheets.functions";
import { ITEM_CATEGORIES, percent, termSummary, termsOf, WEIGHTS } from "@/lib/assessments";
import type { Category, MathSet } from "@/lib/sheet-parse";
import { cn } from "@/lib/utils";

const SPREADSHEET_ID = "1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
const TERM_OPTIONS = [1, 2] as const;
const SOURCE_LABEL: Record<SheetSource, string> = {
  service_account: "Google Service Account",
  api_key: "Google Sheets API key",
  public_xlsx: "公開連結（完整試算表）",
};

export function SheetGradebook() {
  const { students, refresh, lastSync } = useApp();
  const serverSync = useServerFn(syncGoogleSheet);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<SyncReport | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [set, setSet] = useState<MathSet>("S2M3");
  const [term, setTerm] = useState<number>(1);
  const [view, setView] = useState<Category | "summary">("summary");

  const list = useMemo(
    () =>
      students
        .filter((s) => s.set === set)
        .sort((a, b) =>
          `${a.className ?? ""}${(a.classNo ?? "").padStart(3, "0")}`.localeCompare(
            `${b.className ?? ""}${(b.classNo ?? "").padStart(3, "0")}`,
          ),
        ),
    [students, set],
  );

  const termsWithScores = useMemo(
    () =>
      termsOf(
        list.flatMap((s) =>
          (s.assessments ?? []).filter((a) => a.kind === "item" && (a.score !== null || a.absent)),
        ),
      ),
    [list],
  );
  // If the chosen term has no marks yet, show the first term that does.
  const activeTerm =
    termsWithScores.length === 0 || termsWithScores.includes(term)
      ? term
      : (termsWithScores[0] ?? term);

  const categoryCounts = useMemo(() => {
    const counts = new Map<Category, number>();
    for (const c of ITEM_CATEGORIES) {
      const labels = new Set<string>();
      for (const s of list) {
        for (const a of s.assessments ?? []) {
          if (a.kind === "item" && a.term === activeTerm && a.category === c.id) {
            labels.add(a.label);
          }
        }
      }
      counts.set(c.id, labels.size);
    }
    return counts;
  }, [list, activeTerm]);

  const columns = useMemo(() => {
    const seen = new Map<string, { label: string; full: number | null; position: number }>();
    for (const s of list) {
      for (const a of s.assessments ?? []) {
        if (
          a.kind === "item" &&
          a.term === activeTerm &&
          a.category === view &&
          !seen.has(a.label)
        ) {
          seen.set(a.label, { label: a.label, full: a.full_marks, position: a.position });
        }
      }
    }
    return [...seen.values()].sort((a, b) => a.position - b.position);
  }, [list, activeTerm, view]);

  const missingFull = useMemo(
    () => [
      ...new Set(
        students.flatMap((s) =>
          (s.assessments ?? [])
            .filter((a) => a.kind === "item" && a.score !== null && !a.full_marks)
            .map((a) => `${s.set} ${a.label}`),
        ),
      ),
    ],
    [students],
  );

  const runSync = async () => {
    setBusy(true);
    setSyncError(null);
    try {
      const result = await serverSync();
      setReport(result);
      await refresh();
      toast.success(`成功同步 ${result.students} 位學生、${result.scores} 項分數紀錄！`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "同步失敗";
      setSyncError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Sheet className="h-5 w-5 text-success" />
            Assessment gradebook
          </h2>
          <p className="text-sm text-muted-foreground">
            From{" "}
            <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-primary underline">
              2627 Name list (For LMS)
            </a>{" "}
            ·{" "}
            {lastSync
              ? `last synced ${new Date(lastSync).toLocaleString("en-HK", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}`
              : "not synced yet"}
          </p>
        </div>
        <Button onClick={runSync} disabled={busy}>
          <RefreshCw className={cn(busy && "animate-spin")} />
          {busy ? "Syncing…" : "Sync from Google Sheet"}
        </Button>
      </div>

      {syncError && (
        <div
          role="alert"
          className="mt-3 flex gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="whitespace-pre-wrap">{syncError}</p>
        </div>
      )}

      {report && !syncError && (
        <div className="mt-3 rounded-xl bg-success/10 p-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" />
            同步完成：{SOURCE_LABEL[report.source]} · {report.students} 位學生 · {report.scores}{" "}
            項分數
          </p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            {report.tabs.map((t) => (
              <li key={t.set}>
                {t.set}：{t.students} 位學生 · Term 1 {t.term1Items} 個評估項目 · Term 2{" "}
                {t.term2Items} 個評估項目 · 已填 {t.scores} 個分數
              </li>
            ))}
          </ul>
          {report.duplicates.length > 0 && (
            <p className="mt-1 text-gold-deep">
              重複出現嘅學生（只保留第一次出現）：{report.duplicates.join(", ")}
            </p>
          )}
        </div>
      )}

      {missingFull.length > 0 && (
        <p className="mt-3 rounded-md bg-gold/20 p-2 text-sm text-gold-deep">
          Full marks missing in the sheet for: {missingFull.join(", ")}. Percentages for these
          can&apos;t be worked out until the &quot;Full marks&quot; row is filled in.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          aria-label="Set"
          value={set}
          onChange={(e) => setSet(e.target.value as MathSet)}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"
        >
          <option>S2M3</option>
          <option>S2M5</option>
        </select>
        <select
          aria-label="Term"
          value={activeTerm}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"
        >
          {TERM_OPTIONS.map((t) => (
            <option key={t} value={t}>
              Term {t}
              {termsWithScores.includes(t) ? "" : "（未有分數）"}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setView("summary")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-bold transition",
              view === "summary"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Weighted summary
          </button>
          {ITEM_CATEGORIES.map((c) => {
            const count = categoryCounts.get(c.id) ?? 0;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setView(c.id)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-bold transition",
                  view === c.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {set} 暫時未有學生 — 請按「Sync from Google Sheet」匯入名單同分數。
          </p>
        ) : view !== "summary" && columns.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Term {activeTerm} 暫時沒有 {ITEM_CATEGORIES.find((c) => c.id === view)?.label}{" "}
            的分數紀錄。
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-muted-foreground">
                <th className="p-2">Class</th>
                <th className="p-2">Student</th>
                {view === "summary" ? (
                  <>
                    {WEIGHTS.map((w) => (
                      <th key={w.id} className="p-2 text-center">
                        {w.label} ({w.weight})
                      </th>
                    ))}
                    <th className="p-2 text-center">Total /200</th>
                  </>
                ) : (
                  columns.map((c) => (
                    <th key={c.label} className="p-2 text-center">
                      {c.label}
                      {c.full ? ` (${c.full})` : ""}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => {
                const sum = termSummary(s.assessments ?? [], activeTerm);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="whitespace-nowrap p-2 text-muted-foreground">
                      {s.className} {s.classNo}
                    </td>
                    <td className="p-2">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.hlcNo ?? s.email}</p>
                    </td>
                    {view === "summary" ? (
                      <>
                        {sum.parts.map((p) => (
                          <td key={p.id} className="p-2 text-center tabular-nums">
                            {p.value ?? "—"}
                          </td>
                        ))}
                        <td className="p-2 text-center font-display font-bold tabular-nums">
                          {sum.coursework200}
                        </td>
                      </>
                    ) : (
                      columns.map((c) => {
                        const a = s.assessments?.find(
                          (x) => x.kind === "item" && x.term === activeTerm && x.label === c.label,
                        );
                        const pct = a ? percent(a) : null;
                        return (
                          <td key={c.label} className="p-1 text-center">
                            <span
                              title={pct === null ? "" : `${pct}%`}
                              className={cn(
                                "inline-block min-w-12 rounded-md px-1 py-0.5 text-xs font-bold tabular-nums",
                                a?.absent ? "bg-muted text-muted-foreground" : scoreTone(pct),
                              )}
                            >
                              {!a || (a.score === null && !a.absent)
                                ? "—"
                                : a.absent
                                  ? "ABS"
                                  : a.score}
                            </span>
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
````

## File: src/routes/_authenticated/teacher.tsx
````typescript
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Eraser, FileUp, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { parseScoreCsv, scoreSchema } from "@/lib/grade-rules";
import { Button } from "@/components/ui/button";
import { SheetGradebook } from "@/components/SheetGradebook";
import { AppShell, TeacherOnly, scoreTone } from "@/components/AppShell";
import { useApp } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { unmatchedChapterLabels } from "@/lib/assessments";
import {
  CHAPTERS,
  average,
  completion,
  formRank,
  improvement,
  type MathSet,
  weakTopics,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/teacher")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Teacher Analytics — HLC Math" },
      {
        name: "description",
        content: "Compare S2M3 and S2M5 scores, completion and weaker topics.",
      },
      { property: "og:title", content: "Teacher Analytics — HLC Math" },
      { property: "og:description", content: "Math class analytics and master score table." },
    ],
  }),
  component: Teacher,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];

function Teacher() {
  const { students, refresh } = useApp();
  const [q, setQ] = useState("");
  const [setF, setSetF] = useState<"All" | MathSet>("All");
  const [editing, setEditing] = useState<{ id: string; ch: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stats = SETS.map((set) => {
    const list = students.filter((s) => s.set === set);
    const chAvg = CHAPTERS.map((_, i) => {
      const v = list
        .map((s) => s.scores[i])
        .filter((x) => x !== null && x !== undefined) as number[];
      return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
    });
    const weakest = chAvg
      .map((v, i) => ({ v, c: CHAPTERS[i] }))
      .filter((x): x is { v: number; c: (typeof CHAPTERS)[number] } => x.v !== null && Boolean(x.c))
      .sort((a, b) => a.v - b.v)
      .slice(0, 2);
    return {
      set,
      n: list.length,
      avg: Math.round(list.reduce((a, s) => a + average(s), 0) / (list.length || 1)),
      comp: Math.round(list.reduce((a, s) => a + completion(s), 0) / (list.length || 1)),
      chAvg,
      weakest,
    };
  });

  const rows = useMemo(
    () =>
      students
        .filter((s) => setF === "All" || s.set === setF)
        .filter((s) => (s.name + s.email).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => formRank(a, students) - formRank(b, students)),
    [students, q, setF],
  );

  const manualStudents = students.filter((s) => (s.scoreSources ?? []).includes("manual"));
  const manualCount = students.reduce(
    (n, s) => n + (s.scoreSources ?? []).filter((x) => x === "manual").length,
    0,
  );
  const unmatched = useMemo(
    () => unmatchedChapterLabels(students.flatMap((s) => s.assessments ?? [])),
    [students],
  );

  const updateScore = async (id: string, ch: number, val: string) => {
    try {
      const parsedScore = scoreSchema.parse(val.trim() === "" ? null : Number(val));
      const { error } = await supabase
        .from("chapter_scores")
        .upsert([{ student_id: id, chapter: ch + 1, score: parsedScore }]);
      if (error) throw error;
      await refresh();
      setEditing(null);
      toast.success(
        parsedScore === null ? "Cleared — showing the Google Sheet score" : "Score saved",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save score");
    }
  };

  const clearManual = async () => {
    const ids = manualStudents.map((s) => s.id);
    if (!ids.length) return;
    if (
      !window.confirm(
        `刪除 ${ids.length} 位學生喺 App 入面手動輸入嘅章節分數？之後會改為顯示 Google Sheet 計出嚟嘅分數。`,
      )
    ) {
      return;
    }
    try {
      for (let i = 0; i < ids.length; i += 100) {
        const { error } = await supabase
          .from("chapter_scores")
          .delete()
          .in("student_id", ids.slice(i, i + 100));
        if (error) throw error;
      }
      await refresh();
      toast.success("Now showing Google Sheet scores");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not clear scores");
    }
  };

  const importCsv = async (file: File) => {
    try {
      const map = parseScoreCsv(await file.text());
      const unknown = [...map.keys()].filter((email) => !students.some((s) => s.email === email));
      if (unknown.length) {
        throw new Error(`${unknown.length} email(s) are not in the roster. Add students first.`);
      }
      const data = students.flatMap((s) => {
        const scores = map.get(s.email);
        return scores
          ? scores.map((score, i) => ({ student_id: s.id, chapter: i + 1, score }))
          : [];
      });
      if (!data.length) throw new Error("No student scores found");
      const { error } = await supabase.from("chapter_scores").upsert(data);
      if (error) throw error;
      await refresh();
      toast.success(`Saved scores for ${map.size} students`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    }
  };

  return (
    <AppShell>
      <TeacherOnly>
        <h1 className="text-3xl font-bold">Class Analytics</h1>
        <SheetGradebook />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {stats.map((st, k) => (
            <div
              key={st.set}
              className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{st.set}</h2>
                <span className="text-sm font-bold text-muted-foreground">{st.n} students</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "rounded-2xl p-3",
                    k === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-success text-primary-foreground",
                  )}
                >
                  <p className="text-xs font-bold opacity-90">Average score</p>
                  <p className="font-display text-3xl font-bold">{st.avg}%</p>
                </div>
                <div className="rounded-2xl bg-gold p-3 text-accent-foreground">
                  <p className="text-xs font-bold">Completion</p>
                  <p className="font-display text-3xl font-bold">{st.comp}%</p>
                </div>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {st.chAvg.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground">{v ?? "—"}</span>
                    <div
                      className={cn(
                        "w-full rounded-t-lg",
                        v !== null && v < 70
                          ? "bg-destructive/70"
                          : k === 0
                            ? "bg-primary"
                            : "bg-success",
                      )}
                      style={{ height: `${(v ?? 0) * 0.8}px` }}
                    />
                    <span className="text-[10px] font-bold">Ch{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-muted-foreground">Weaker topics:</span>
                {st.weakest.map((w) => (
                  <span
                    key={w.c.id}
                    className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-extrabold text-destructive"
                  >
                    Ch{w.c.id} {w.c.short} ({w.v}%)
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void importCsv(f);
          }}
          onClick={() => fileRef.current?.click()}
          className="mt-6 flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center hover:bg-primary/10"
        >
          <FileUp className="h-8 w-8 text-primary" />
          <p className="mt-2 font-display text-lg font-bold">
            Drop a score CSV here or click to browse
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            Format: email,ch1,ch2,ch3,ch4,ch5,ch6,ch7 · or click any score below to edit
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importCsv(f);
            }}
          />
        </div>

        <div className="mt-6 rounded-3xl border-2 border-border bg-card p-4 shadow-chunky">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-auto text-xl font-bold">Student Master Score Table</h2>
            {manualCount > 0 && (
              <Button variant="outline" size="sm" onClick={() => void clearManual()}>
                <Eraser /> Use Google Sheet scores ({manualCount} typed)
              </Button>
            )}
            <div className="flex items-center gap-2 rounded-2xl border-2 border-input px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-32 bg-transparent text-sm font-semibold outline-none"
              />
            </div>
            <select
              value={setF}
              onChange={(e) => setSetF(e.target.value as "All" | MathSet)}
              className="rounded-2xl border-2 border-input bg-card px-3 py-1.5 text-sm font-bold"
            >
              <option>All</option>
              <option>S2M3</option>
              <option>S2M5</option>
            </select>
          </div>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Dashed box = worked out from Google Sheet (average % of that chapter&apos;s SQ / CQ, or
            homework if there is no quiz yet). Solid = typed here. Click a score to type over it;
            clear it to go back to the Google Sheet score.
          </p>
          {unmatched.length > 0 && (
            <p className="mt-2 rounded-md bg-gold/20 p-2 text-sm text-gold-deep">
              These quiz columns don&apos;t say which chapter they belong to, so they are not
              counted in Ch1–Ch7: {unmatched.slice(0, 20).join(", ")}
              {unmatched.length > 20 ? " …" : ""}. Name them like SQ1.1, CQ1 or Ch1 Quiz in the
              Google Sheet, then sync again.
            </p>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="text-left text-xs font-extrabold uppercase text-muted-foreground">
                  <th className="p-2">Rank</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Set</th>
                  {CHAPTERS.map((c) => (
                    <th key={c.id} className="p-2 text-center">
                      Ch{c.id}
                    </th>
                  ))}
                  <th className="p-2 text-center">Avg</th>
                  <th className="p-2 text-center">Improve</th>
                  <th className="p-2">Weaker topics</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const imp = improvement(s);
                  return (
                    <tr key={s.id} className="border-t border-border">
                      <td className="p-2 font-display font-bold">#{formRank(s, students)}</td>
                      <td className="p-2">
                        <p className="font-bold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="p-2 font-bold">{s.set}</td>
                      {s.scores.map((sc, i) => {
                        const src = s.scoreSources?.[i] ?? null;
                        return (
                          <td key={i} className="p-1 text-center">
                            {editing?.id === s.id && editing.ch === i ? (
                              <input
                                autoFocus
                                type="number"
                                defaultValue={src === "manual" ? (sc ?? "") : ""}
                                placeholder={sc === null ? "" : String(sc)}
                                onBlur={(e) => void updateScore(s.id, i, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                  if (e.key === "Escape") setEditing(null);
                                }}
                                className="w-14 rounded-lg border-2 border-primary px-1 text-center font-bold"
                              />
                            ) : (
                              <Button
                                variant="ghost"
                                title={
                                  src === "sheet"
                                    ? "From Google Sheet — click to type over it"
                                    : src === "manual"
                                      ? "Typed in the app"
                                      : "No score yet"
                                }
                                onClick={() => setEditing({ id: s.id, ch: i })}
                                className={cn(
                                  "w-12 rounded-lg py-1 font-extrabold",
                                  scoreTone(sc),
                                  src === "sheet" && "border border-dashed border-current",
                                )}
                              >
                                {sc ?? "—"}
                              </Button>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-display font-bold">{average(s)}%</td>
                      <td
                        className={cn(
                          "p-2 text-center font-extrabold",
                          imp >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {imp >= 0 ? "+" : ""}
                        {imp}%
                      </td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {weakTopics(s).map((c) => (
                            <span
                              key={c.id}
                              className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-extrabold text-destructive"
                            >
                              Ch{c.id} {c.short}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <AddStudentForm />
      </TeacherOnly>
    </AppShell>
  );
}

function AddStudentForm() {
  const { refresh } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-6 flex flex-wrap items-end gap-3 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const { error } = await supabase
            .from("students")
            .insert({ name: name.trim(), email: email.trim().toLowerCase(), math_set: set });
          if (error) throw error;
          await refresh();
          setName("");
          setEmail("");
          toast.success("Student added");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not add student");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="w-full text-sm font-bold">
        Add a student by hand (most students come in automatically from the Google Sheet sync)
      </p>
      <label className="text-sm font-medium">
        Class set
        <select
          aria-label="Class set"
          value={set}
          onChange={(e) => setSet(e.target.value as MathSet)}
          className="mt-1 block rounded-md border border-input bg-card p-2"
        >
          <option>S2M3</option>
          <option>S2M5</option>
        </select>
      </label>
      <label className="text-sm font-medium">
        Student name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block rounded-md border border-input bg-card p-2"
        />
      </label>
      <label className="text-sm font-medium">
        School email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block rounded-md border border-input bg-card p-2"
        />
      </label>
      <Button disabled={busy} type="submit">
        <Plus />
        Add student
      </Button>
    </form>
  );
}
````

## File: src/routes/_authenticated/upload.tsx
````typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  FileText,
  ListChecks,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { CHAPTERS } from "@/lib/data";
import { useApp } from "@/lib/app-store";
import { parseVideoSource } from "@/lib/video-watch";
import { isStoragePath, isWebLink, notesPreviewUrl } from "@/lib/drive-link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Chapter Content — HLC Math" },
      {
        name: "description",
        content: "Add named videos, notes and exercises for each Math chapter.",
      },
      { property: "og:title", content: "Chapter Content — HLC Math" },
      { property: "og:description", content: "Prepare S2 chapter content for students." },
    ],
  }),
  component: Upload,
});

interface DraftVideo {
  id: string;
  title: string;
  url: string;
}
interface Draft {
  notes: string;
  quiz: string;
  videos: DraftVideo[];
}
const input =
  "w-full rounded-xl border-2 border-input bg-background px-3 py-2 font-semibold outline-none focus:border-primary";

function Upload() {
  const { content, videos, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [ch, setCh] = useState(1);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const saved = (chapter: number): Draft => {
    const c = content.find((x) => x.chapter === chapter);
    return {
      notes: c?.notes ?? "",
      quiz: c?.quiz ?? "",
      videos: videos
        .filter((v) => v.chapter === chapter)
        .map((v) => ({ id: v.id, title: v.title, url: v.url })),
    };
  };
  const cur = drafts[ch] ?? saved(ch);
  const update = (patch: Partial<Draft>) => setDrafts({ ...drafts, [ch]: { ...cur, ...patch } });
  const setVideo = (i: number, patch: Partial<DraftVideo>) =>
    update({ videos: cur.videos.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const move = (i: number, d: number) => {
    const list = [...cur.videos];
    const [v] = list.splice(i, 1);
    if (v) list.splice(i + d, 0, v);
    update({ videos: list });
  };

  const notes = cur.notes.trim();
  const oldPdf = isStoragePath(notes);
  const notesInvalid = notes !== "" && !oldPdf && !isWebLink(notes);
  const preview = isWebLink(notes) ? notesPreviewUrl(notes) : null;

  const save = async () => {
    setBusy(true);
    try {
      if (notesInvalid)
        throw new Error("Chapter notes: paste the full Google Drive link (starting with https://)");
      cur.videos.forEach((v, i) => {
        if (!v.title.trim()) throw new Error(`Give video ${i + 1} a name`);
        if (!parseVideoSource(v.url)) {
          throw new Error(
            `Video ${i + 1} ("${v.title}") needs a YouTube link or an https link to an .mp4/.webm file`,
          );
        }
      });
      const { error } = await supabase
        .from("chapter_content")
        .upsert({ chapter: ch, notes, quiz: cur.quiz });
      if (error) throw error;
      const keep = new Set(cur.videos.map((v) => v.id));
      const removed = videos.filter((v) => v.chapter === ch && !keep.has(v.id)).map((v) => v.id);
      if (removed.length) {
        const r = await supabase.from("chapter_videos").delete().in("id", removed);
        if (r.error) throw r.error;
      }
      if (cur.videos.length) {
        const r = await supabase.from("chapter_videos").upsert(
          cur.videos.map((v, i) => ({
            id: v.id,
            chapter: ch,
            title: v.title.trim(),
            url: v.url.trim(),
            position: i,
          })),
        );
        if (r.error) throw r.error;
      }
      await refresh();
      setDrafts((d) => {
        const n = { ...d };
        delete n[ch];
        return n;
      });
      toast.success(`Chapter ${ch} content saved`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <TeacherOnly>
        <h1 className="text-3xl font-bold">Chapter content</h1>
        <p className="font-semibold text-muted-foreground">
          Add videos, notes and an exercise for each chapter. Students earn 1 Math Coin for each
          video they watch to the end.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {CHAPTERS.map((c) => {
              const n = videos.filter((v) => v.chapter === c.id).length;
              return (
                <Button
                  variant="ghost"
                  key={c.id}
                  onClick={() => setCh(c.id)}
                  className={cn(
                    "flex h-auto min-w-48 items-center gap-3 rounded-2xl border-2 p-3 text-left",
                    ch === c.id ? "border-primary bg-primary/10" : "border-border bg-card",
                  )}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-extrabold text-primary">
                      Chapter {c.id}
                      {drafts[c.id] ? " · unsaved" : ""}
                    </span>
                    <span className="block truncate text-sm font-bold">{c.short}</span>
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {n} video{n === 1 ? "" : "s"}
                  </span>
                </Button>
              );
            })}
          </div>
          <div className="space-y-5 rounded-3xl border-2 border-border bg-card p-6 shadow-chunky">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="mr-auto text-xl font-bold">
                Ch {ch}: {CHAPTERS[ch - 1]?.title}
              </h2>
              <Link
                to="/courses/$chapter"
                params={{ chapter: String(ch) }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <Eye className="h-4 w-4" /> Preview chapter page
              </Link>
            </div>

            <Field icon={<Video className="h-5 w-5 text-primary" />} label="Videos">
              <div className="space-y-3">
                {cur.videos.length === 0 && (
                  <p className="text-sm text-muted-foreground">No videos yet.</p>
                )}
                {cur.videos.map((v, i) => {
                  const ok = !v.url || parseVideoSource(v.url);
                  return (
                    <div key={v.id} className="rounded-2xl border-2 border-border p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">{i + 1}.</span>
                        <input
                          aria-label={`Video ${i + 1} name`}
                          value={v.title}
                          onChange={(e) => setVideo(i, { title: e.target.value })}
                          placeholder="Video name, e.g. 5.1 Solving by substitution"
                          className={input}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move up"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move down"
                          disabled={i === cur.videos.length - 1}
                          onClick={() => move(i, 1)}
                        >
                          <ArrowDown />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove video ${i + 1}`}
                          onClick={() => update({ videos: cur.videos.filter((_, j) => j !== i) })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <input
                        aria-label={`Video ${i + 1} link`}
                        value={v.url}
                        onChange={(e) => setVideo(i, { url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=…"
                        className={cn(input, "mt-2", !ok && "border-destructive")}
                      />
                      {!ok && (
                        <p className="mt-1 text-xs text-destructive">
                          Use a YouTube link or an https link to an .mp4/.webm file so it can play
                          inside HLC Math.
                        </p>
                      )}
                    </div>
                  );
                })}
                <Button
                  variant="outline"
                  onClick={() =>
                    update({
                      videos: [...cur.videos, { id: crypto.randomUUID(), title: "", url: "" }],
                    })
                  }
                >
                  <Plus /> Add video
                </Button>
                <p className="text-xs text-muted-foreground">
                  Removing a video keeps the coins students already earned from it.
                </p>
              </div>
            </Field>

            <Field
              icon={<FileText className="h-5 w-5 text-success" />}
              label="Chapter notes (Google Drive link)"
            >
              <input
                aria-label="Google Drive link for chapter notes"
                value={oldPdf ? "" : cur.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="https://drive.google.com/file/d/…/view"
                className={cn(input, notesInvalid && "border-destructive")}
              />
              {oldPdf && (
                <p className="mt-1 text-xs text-muted-foreground">
                  This chapter still uses a PDF uploaded to HLC Math. Paste a Google Drive link to
                  replace it.
                </p>
              )}
              {notesInvalid && (
                <p className="mt-1 text-xs text-destructive">
                  Paste the full link, starting with https://
                </p>
              )}
              {isWebLink(notes) && (
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-success">
                  {preview
                    ? "✓ Students will see this file inside the chapter page."
                    : "✓ Students will get a button that opens this link."}
                  <a
                    href={notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline"
                  >
                    Test link <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                In Google Drive: Share → General access → “HLC” (or “Anyone with the link”) → Viewer
                → Copy link.
              </p>
            </Field>

            <Field icon={<ListChecks className="h-5 w-5 text-gold-deep" />} label="Exercise">
              <textarea
                value={cur.quiz}
                onChange={(e) => update({ quiz: e.target.value })}
                rows={6}
                placeholder={"Q1. Solve x + y = 5 and x − y = 1.\nQ2. …"}
                className={input}
              />
            </Field>

            <Button disabled={busy} onClick={() => void save()}>
              {busy ? "Saving…" : "Save chapter content"}
            </Button>
          </div>
        </div>
      </TeacherOnly>
    </AppShell>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-extrabold">
        {icon} {label}
      </p>
      {children}
    </div>
  );
}
````

## File: package.json
````json
{
  "name": "tanstack_start_ts",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "overrides": {
    "rolldown": "1.2.1"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.8",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/supabase-js": "^2.119.0",
    "@tailwindcss/vite": "^4.2.1",
    "@tanstack/react-query": "^5.101.1",
    "@tanstack/react-router": "1.170.41",
    "@tanstack/react-start": "1.168.60",
    "@tanstack/router-plugin": "1.168.42",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.575.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.71.2",
    "react-resizable-panels": "^4.6.5",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "tw-animate-css": "^1.3.4",
    "vaul": "^1.1.2",
    "vite-tsconfig-paths": "^6.0.2",
    "xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.16.5",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.2.0",
    "drizzle-kit": "0.x",
    "drizzle-orm": "0.x",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.1",
    "eslint-plugin-prettier": "^5.2.6",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "jsdom": "^20.0.3",
    "nitro": "3.0.260603-beta",
    "postgres": "^4.1.0",
    "prettier": "^3.7.3",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.56.1",
    "vite": "8.1.5",
    "vitest": "^4.1.10"
  }
}
````

## File: roadmap.md
````markdown
# Database update
- [x] Add profiles, protected roles, private student records, chapter scores, daily marks, chapter content and video completions.
- [x] Replace pretend sign-in and connect teacher edits/imports and student views to saved data.
- [x] Add daily-mark controls and lesson student selection; save chapter content.
- [x] Verify persistence and student privacy with temporary teacher and two student accounts.
- [x] Assign the confirmed teacher account yhtang@hlc.edu.hk.
- [x] Inspect spreadsheet columns (S2M3 / S2M5 tabs, HW/SQ/CQ/TT/Mock/Exam, full marks row).

# Google Sheet sync + assessment gradebook
- [ ] Store assessment items and term summaries per student (private, teacher writes).
- [ ] Teacher "Sync from Google Sheet" button (roster + all assessments, last synced time).
- [ ] Student dashboard: term summary + category breakdown.
- [ ] Teacher gradebook filtered by set and category.
- [ ] Tests for sheet parsing rules; verify sync end-to-end.

# Chapter pages + tracked videos
- [x] Confirm students sign in with Google as HLC number @hlc.edu.hk (all 40 roster emails match).
- [ ] Multiple named videos per chapter (teacher editor).
- [ ] Videos play inside the app; mark awarded only after watching to the end (no skipping).
- [ ] Chapter detail page: videos, notes, exercise, progress.
````

## File: src/lib/data.ts
````typescript
import type { Assessment } from "./assessments";

export const CHAPTERS = [
  { id: 1, title: "Approximation and Errors", short: "Approx. & Errors", emoji: "🎯" },
  {
    id: 2,
    title: "Operations and Factorization of Polynomials",
    short: "Polynomials",
    emoji: "🧩",
  },
  { id: 3, title: "Identities", short: "Identities", emoji: "🟰" },
  { id: 4, title: "Algebraic Fractions and Formulae", short: "Algebraic Fractions", emoji: "➗" },
  { id: 5, title: "Linear Equations in Two Unknowns", short: "Linear Equations", emoji: "📈" },
  { id: 6, title: "Angles and Parallel Lines (II)", short: "Angles & Parallels", emoji: "📐" },
  { id: 7, title: "Organization and Presentation of Data (II)", short: "Data (II)", emoji: "📊" },
] as const;

export type MathSet = "S2M3" | "S2M5";

/** Where a chapter score came from: typed in the app, or worked out from the Google Sheet. */
export type ScoreSource = "manual" | "sheet" | null;

export interface Student {
  id: string;
  userId?: string | null;
  /** Math Coins earned from lesson marks (can include deductions). */
  dailyMarks?: number;
  /** Math Coins earned from watching chapter videos to the end. */
  videoMarks?: number;
  /** Math Coins spent on rewards (rejected requests are not counted). */
  coinsSpent?: number;
  /** Ids of chapter videos this student has watched to the end. */
  completedVideos?: string[];
  assessments?: Assessment[];
  hlcNo?: string | null;
  className?: string;
  classNo?: string;
  name: string;
  email: string;
  set: MathSet;
  scores: (number | null)[]; // 7 chapters, null = not yet attempted
  scoreSources?: ScoreSource[];
  lastMonthAvg: number;
  lastMonthFormRank: number;
  xp: number;
  streak: number;
}

export function average(s: Student) {
  const done = s.scores.filter((x) => x !== null) as number[];
  return done.length ? Math.round(done.reduce((a, b) => a + b, 0) / done.length) : 0;
}

export function completion(s: Student) {
  return Math.round((s.scores.filter((x) => x !== null).length / CHAPTERS.length) * 100);
}

export function weakTopics(s: Student) {
  return s.scores
    .map((sc, i) => ({ sc, ch: CHAPTERS[i] }))
    .filter(
      (x): x is { sc: number; ch: (typeof CHAPTERS)[number] } =>
        x.sc !== null && x.sc < 60 && Boolean(x.ch),
    )
    .sort((a, b) => (a.sc as number) - (b.sc as number))
    .slice(0, 2)
    .map((x) => x.ch);
}

export function ranked(list: Student[]) {
  return [...list].sort((a, b) => average(b) - average(a));
}

export function formRank(s: Student, all: Student[]) {
  return ranked(all).findIndex((x) => x.id === s.id) + 1;
}

export function setRank(s: Student, all: Student[]) {
  return ranked(all.filter((x) => x.set === s.set)).findIndex((x) => x.id === s.id) + 1;
}

export function improvement(s: Student) {
  return s.lastMonthAvg ? Math.round(((average(s) - s.lastMonthAvg) / s.lastMonthAvg) * 100) : 0;
}

export function level(xp: number) {
  return Math.floor(xp / 1000) + 1;
}

export function chapterStatus(score: number | null, idx: number, scores: (number | null)[]) {
  if (score !== null) return "Completed" as const;
  const firstOpen = scores.findIndex((x) => x === null);
  return idx === firstOpen ? ("In Progress" as const) : ("Not Started" as const);
}

/** Sort by class, then class number, then name (e.g. 2A 1, 2A 2, 2B 1). */
export function sortByClass<T extends Pick<Student, "className" | "classNo" | "name">>(
  list: T[],
): T[] {
  const key = (s: T) => `${s.className ?? ""}${(s.classNo ?? "").padStart(3, "0")}${s.name}`;
  return [...list].sort((a, b) => key(a).localeCompare(key(b)));
}
````

## File: src/routes/_authenticated/dashboard.tsx
````typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AlertTriangle, Flame, Medal, Sparkles, TrendingUp, Zap } from "lucide-react";
import { AppShell, scoreTone } from "@/components/AppShell";
import { AssessmentReport } from "@/components/AssessmentReport";
import { useApp } from "@/lib/app-store";
import { CHAPTERS, average, completion, improvement, level, weakTopics } from "@/lib/data";
import { COIN_EMOJI, COIN_NAME, coinBalance } from "@/lib/coins";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My Dashboard — HLC Math" },
      { name: "description", content: "Your private Math scores, Math Coins and weaker topics." },
      { property: "og:title", content: "My Dashboard — HLC Math" },
      { property: "og:description", content: "Track private S2 chapter scores and Math Coins." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { me } = useApp();
  const avg = average(me);
  const imp = improvement(me);
  const weak = weakTopics(me);
  const lvl = level(me.xp);
  const lvlPct = (me.xp % 1000) / 10;

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border-2 border-border bg-card p-6 shadow-chunky lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
              {me.name
                .split(" ")
                .map((p) => p.charAt(0))
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{me.name}</h1>
              <p className="truncate text-sm font-semibold text-muted-foreground">{me.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">
                {me.set}
              </span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat
              icon={<Flame className="h-5 w-5 text-flame" />}
              value={me.streak}
              label="Day streak"
            />
            <Stat
              icon={<Zap className="h-5 w-5 text-gold" />}
              value={me.xp.toLocaleString()}
              label="XP"
            />
            <Stat
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              value={`Lv ${lvl}`}
              label="Level"
            />
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
              <span>Level {lvl}</span>
              <span>
                {1000 - (me.xp % 1000)} XP to Lv {lvl + 1}
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold" style={{ width: `${lvlPct}%` }} />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <Pill className="bg-gold/20 text-gold-deep" icon={<Medal className="h-4 w-4" />}>
              {me.set} · Private student record
            </Pill>
            <Pill
              className={
                imp >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
              }
              icon={<TrendingUp className="h-4 w-4" />}
            >
              {imp >= 0 ? "+" : ""}
              {imp}% score this month
            </Pill>
            {weak.length > 0 && (
              <Pill
                className="bg-destructive/10 text-destructive"
                icon={<AlertTriangle className="h-4 w-4" />}
              >
                Needs Practice: Ch {weak[0]?.id} {weak[0]?.short}
              </Pill>
            )}
          </div>
        </section>

        <section className="space-y-6 lg:col-span-2">
          <AssessmentReport assessments={me.assessments ?? []} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Big
              label="Overall average"
              value={`${avg}%`}
              tone="bg-primary text-primary-foreground shadow-chunky-primary"
            />
            <Big
              label="Chapters done"
              value={`${completion(me)}%`}
              tone="bg-success text-primary-foreground shadow-chunky-success"
            />
            <Link to="/awards" className="col-span-2 md:col-span-1">
              <Big
                label={`${COIN_EMOJI} ${COIN_NAME} · tap to spend`}
                value={`${coinBalance(me)}`}
                tone="h-full bg-gold text-accent-foreground shadow-chunky-gold transition hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {weak.length > 0 && (
            <div className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-destructive">
                <AlertTriangle className="h-5 w-5" /> Weaker Topics Alert
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {weak.map((c) => (
                  <Link
                    to="/courses/$chapter"
                    params={{ chapter: String(c.id) }}
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-chunky"
                  >
                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Chapter {c.id}</p>
                      <p className="font-bold">{c.short}</p>
                      <p className="text-sm font-extrabold text-destructive">
                        {me.scores[c.id - 1]}%
                      </p>
                    </div>
                    <span className="rounded-full bg-gold/25 px-3 py-1 text-xs font-extrabold text-gold-deep">
                      Recommended Review
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
            <h2 className="text-lg font-bold">Progress timeline · Chapters 1–7</h2>
            <ol className="mt-4 space-y-3">
              {CHAPTERS.map((c, i) => {
                const s = me.scores[i] ?? null;
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg",
                        s === null ? "bg-muted" : s >= 60 ? "bg-success/20" : "bg-destructive/15",
                      )}
                    >
                      {c.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2 text-sm font-bold">
                        <span className="truncate">
                          Ch {c.id} · {c.short}
                        </span>
                        <span className={cn("rounded-full px-2 text-xs leading-5", scoreTone(s))}>
                          {s === null ? "—" : `${s}%`}
                        </span>
                      </div>
                      <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            s !== null && s < 60 ? "bg-destructive" : "bg-success",
                          )}
                          style={{ width: `${s ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <div className="flex justify-center">{icon}</div>
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
    </div>
  );
}

function Pill({
  children,
  icon,
  className,
}: {
  children: ReactNode;
  icon: ReactNode;
  className: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold",
        className,
      )}
    >
      {icon}
      {children}
    </div>
  );
}

function Big({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={cn("rounded-3xl p-5", tone)}>
      <p className="text-sm font-bold opacity-90">{label}</p>
      <p className="font-display text-4xl font-bold">{value}</p>
    </div>
  );
}
````

## File: src/routeTree.gen.ts
````typescript
/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthenticatedRouteRouteImport } from './routes/_authenticated/route'
import { Route as ResetPasswordRouteImport } from './routes/reset-password'
import { Route as AuthenticatedActivityRouteImport } from './routes/_authenticated/activity'
import { Route as AuthenticatedAwardsRouteImport } from './routes/_authenticated/awards'
import { Route as AuthenticatedDashboardRouteImport } from './routes/_authenticated/dashboard'
import { Route as AuthenticatedLeaderboardRouteImport } from './routes/_authenticated/leaderboard'
import { Route as AuthenticatedTeacherRouteImport } from './routes/_authenticated/teacher'
import { Route as AuthenticatedUploadRouteImport } from './routes/_authenticated/upload'
import { Route as AuthenticatedCoursesIndexRouteImport } from './routes/_authenticated/courses.index'
import { Route as AuthenticatedCoursesChapterRouteImport } from './routes/_authenticated/courses.$chapter'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthenticatedRouteRoute = AuthenticatedRouteRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRouteImport,
} as any)
const ResetPasswordRoute = ResetPasswordRouteImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthenticatedActivityRoute = AuthenticatedActivityRouteImport.update({
  id: '/activity',
  path: '/activity',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)
const AuthenticatedAwardsRoute = AuthenticatedAwardsRouteImport.update({
  id: '/awards',
  path: '/awards',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)
const AuthenticatedDashboardRoute = AuthenticatedDashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)
const AuthenticatedLeaderboardRoute =
  AuthenticatedLeaderboardRouteImport.update({
    id: '/leaderboard',
    path: '/leaderboard',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)
const AuthenticatedTeacherRoute = AuthenticatedTeacherRouteImport.update({
  id: '/teacher',
  path: '/teacher',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)
const AuthenticatedUploadRoute = AuthenticatedUploadRouteImport.update({
  id: '/upload',
  path: '/upload',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)
const AuthenticatedCoursesIndexRoute =
  AuthenticatedCoursesIndexRouteImport.update({
    id: '/courses/',
    path: '/courses/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)
const AuthenticatedCoursesChapterRoute =
  AuthenticatedCoursesChapterRouteImport.update({
    id: '/courses/$chapter',
    path: '/courses/$chapter',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/reset-password': typeof ResetPasswordRoute
  '/activity': typeof AuthenticatedActivityRoute
  '/awards': typeof AuthenticatedAwardsRoute
  '/dashboard': typeof AuthenticatedDashboardRoute
  '/leaderboard': typeof AuthenticatedLeaderboardRoute
  '/teacher': typeof AuthenticatedTeacherRoute
  '/upload': typeof AuthenticatedUploadRoute
  '/courses/$chapter': typeof AuthenticatedCoursesChapterRoute
  '/courses/': typeof AuthenticatedCoursesIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/reset-password': typeof ResetPasswordRoute
  '/activity': typeof AuthenticatedActivityRoute
  '/awards': typeof AuthenticatedAwardsRoute
  '/dashboard': typeof AuthenticatedDashboardRoute
  '/leaderboard': typeof AuthenticatedLeaderboardRoute
  '/teacher': typeof AuthenticatedTeacherRoute
  '/upload': typeof AuthenticatedUploadRoute
  '/courses/$chapter': typeof AuthenticatedCoursesChapterRoute
  '/courses': typeof AuthenticatedCoursesIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/reset-password': typeof ResetPasswordRoute
  '/_authenticated/activity': typeof AuthenticatedActivityRoute
  '/_authenticated/awards': typeof AuthenticatedAwardsRoute
  '/_authenticated/dashboard': typeof AuthenticatedDashboardRoute
  '/_authenticated/leaderboard': typeof AuthenticatedLeaderboardRoute
  '/_authenticated/teacher': typeof AuthenticatedTeacherRoute
  '/_authenticated/upload': typeof AuthenticatedUploadRoute
  '/_authenticated/courses/$chapter': typeof AuthenticatedCoursesChapterRoute
  '/_authenticated/courses/': typeof AuthenticatedCoursesIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/reset-password'
    | '/activity'
    | '/awards'
    | '/dashboard'
    | '/leaderboard'
    | '/teacher'
    | '/upload'
    | '/courses/$chapter'
    | '/courses/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/reset-password'
    | '/activity'
    | '/awards'
    | '/dashboard'
    | '/leaderboard'
    | '/teacher'
    | '/upload'
    | '/courses/$chapter'
    | '/courses'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/reset-password'
    | '/_authenticated/activity'
    | '/_authenticated/awards'
    | '/_authenticated/dashboard'
    | '/_authenticated/leaderboard'
    | '/_authenticated/teacher'
    | '/_authenticated/upload'
    | '/_authenticated/courses/$chapter'
    | '/_authenticated/courses/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  ResetPasswordRoute: typeof ResetPasswordRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated/activity': {
      id: '/_authenticated/activity'
      path: '/activity'
      fullPath: '/activity'
      preLoaderRoute: typeof AuthenticatedActivityRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/awards': {
      id: '/_authenticated/awards'
      path: '/awards'
      fullPath: '/awards'
      preLoaderRoute: typeof AuthenticatedAwardsRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/dashboard': {
      id: '/_authenticated/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AuthenticatedDashboardRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/leaderboard': {
      id: '/_authenticated/leaderboard'
      path: '/leaderboard'
      fullPath: '/leaderboard'
      preLoaderRoute: typeof AuthenticatedLeaderboardRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/teacher': {
      id: '/_authenticated/teacher'
      path: '/teacher'
      fullPath: '/teacher'
      preLoaderRoute: typeof AuthenticatedTeacherRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/upload': {
      id: '/_authenticated/upload'
      path: '/upload'
      fullPath: '/upload'
      preLoaderRoute: typeof AuthenticatedUploadRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/courses/': {
      id: '/_authenticated/courses/'
      path: '/courses'
      fullPath: '/courses/'
      preLoaderRoute: typeof AuthenticatedCoursesIndexRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/courses/$chapter': {
      id: '/_authenticated/courses/$chapter'
      path: '/courses/$chapter'
      fullPath: '/courses/$chapter'
      preLoaderRoute: typeof AuthenticatedCoursesChapterRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
  }
}

interface AuthenticatedRouteRouteChildren {
  AuthenticatedActivityRoute: typeof AuthenticatedActivityRoute
  AuthenticatedAwardsRoute: typeof AuthenticatedAwardsRoute
  AuthenticatedDashboardRoute: typeof AuthenticatedDashboardRoute
  AuthenticatedLeaderboardRoute: typeof AuthenticatedLeaderboardRoute
  AuthenticatedTeacherRoute: typeof AuthenticatedTeacherRoute
  AuthenticatedUploadRoute: typeof AuthenticatedUploadRoute
  AuthenticatedCoursesChapterRoute: typeof AuthenticatedCoursesChapterRoute
  AuthenticatedCoursesIndexRoute: typeof AuthenticatedCoursesIndexRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedActivityRoute: AuthenticatedActivityRoute,
  AuthenticatedAwardsRoute: AuthenticatedAwardsRoute,
  AuthenticatedDashboardRoute: AuthenticatedDashboardRoute,
  AuthenticatedLeaderboardRoute: AuthenticatedLeaderboardRoute,
  AuthenticatedTeacherRoute: AuthenticatedTeacherRoute,
  AuthenticatedUploadRoute: AuthenticatedUploadRoute,
  AuthenticatedCoursesChapterRoute: AuthenticatedCoursesChapterRoute,
  AuthenticatedCoursesIndexRoute: AuthenticatedCoursesIndexRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  ResetPasswordRoute: ResetPasswordRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
````

## File: src/routes/index.tsx
````typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-store';

const DEFAULT_SUPABASE_KEY = 'sb_publishable_6d4BjM4FHDurcIw2BhpeaQ_hsYnu4Ju';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Sign in — HLC Math' },
      { name: 'description', content: 'Sign in to your private HLC Mathematics records.' },
      { property: 'og:title', content: 'Sign in — HLC Math' },
      { property: 'og:description', content: 'School mathematics scores and chapter progress.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }),
  component: Login
});

function Login() {
  const { session, ready, role } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (ready && session) void navigate({ to: role === 'teacher' ? '/teacher' : '/dashboard' });
  }, [ready, session, role, navigate]);

  const social = async (provider: 'google') => {
    setMessage('');
    setBusy(true);
    try {
      const key =
        (import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined) ||
        DEFAULT_SUPABASE_KEY;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: true,
          queryParams: {
            hd: 'hlc.edu.hk',
            prompt: 'select_account'
          }
        }
      });
      if (error || !data?.url) {
        setMessage(error?.message ?? 'Could not start Google sign-in');
        return;
      }
      const target = new URL(data.url);
      if (key && !target.searchParams.has('apikey')) {
        target.searchParams.set('apikey', key.trim());
      }
      window.location.assign(target.toString());
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm py-12">
        <GraduationCap className="mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-semibold">HLC Math</h1>
        <p className="mb-8 mt-2 text-muted-foreground">Mathematics</p>

        <div className="mt-6 space-y-3">
          <Button
            className="google-auth w-full"
            variant="outline"
            disabled={busy}
            onClick={() => social('google')}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setMessage('');
              const r = await supabase.auth.signInWithPassword({
                email: 'demo.student@hlc.edu.hk',
                password: 'HlcMath2026!'
              });
              if (r.error) setMessage(r.error.message);
              setBusy(false);
            }}
          >
            Try demo student (no login)
          </Button>
        </div>

        {message && (
          <p role="status" className="mt-5 text-sm text-destructive">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
````

## File: src/lib/app-store.tsx
````typescript
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ScoreSource, Student } from "./data";
import { chapterScoresFromAssessments, type Assessment } from "./assessments";

type PublicTables = Database["public"]["Tables"];
type AssessmentRow = PublicTables["assessment_scores"]["Row"];
type VideoCompletionRow = PublicTables["chapter_video_completions"]["Row"];
type CoinTotalRow = Database["public"]["Views"]["student_coin_totals"]["Row"];
type Content = PublicTables["chapter_content"]["Row"];
export type ChapterVideo = PublicTables["chapter_videos"]["Row"];
export type MarkRow = PublicTables["daily_marks"]["Row"];
export type Reward = PublicTables["rewards"]["Row"];
export type Redemption = PublicTables["reward_redemptions"]["Row"];

const CHAPTER_COUNT = 7;
const PAGE_SIZE = 1000;
const MARK_LOG_LIMIT = 300;
const REDEMPTION_LIMIT = 500;

/** Supabase caps how many rows one request returns, so keep paging until a page comes back empty. */
async function fetchAllAssessments(): Promise<AssessmentRow[]> {
  const rows: AssessmentRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("assessment_scores")
      .select("*")
      .order("student_id")
      .order("term")
      .order("kind")
      .order("label")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

async function fetchAllVideoCompletions(): Promise<VideoCompletionRow[]> {
  const rows: VideoCompletionRow[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("chapter_video_completions")
      .select("*")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) return rows;
    rows.push(...data);
    from += data.length;
  }
}

interface CoinData {
  error: string | null;
  totals: CoinTotalRow[];
  rewards: Reward[];
  redemptions: Redemption[];
}

/** Coins and awards are optional: if their tables are not set up yet, the rest of the app still works. */
async function loadCoinData(): Promise<CoinData> {
  const [totals, rewards, redemptions] = await Promise.all([
    supabase.from("student_coin_totals").select("*"),
    supabase.from("rewards").select("*").order("position").order("cost"),
    supabase
      .from("reward_redemptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(REDEMPTION_LIMIT),
  ]);
  const error = totals.error ?? rewards.error ?? redemptions.error;
  if (error) {
    return {
      error: `Math Coins / Awards 未設定好：${error.message}（請先喺 Supabase SQL Editor 執行 0005 SQL）`,
      totals: [],
      rewards: [],
      redemptions: [],
    };
  }
  return {
    error: null,
    totals: totals.data ?? [],
    rewards: rewards.data ?? [],
    redemptions: redemptions.data ?? [],
  };
}

function toAssessment(row: AssessmentRow): Assessment {
  return {
    term: row.term,
    kind: row.kind === "summary" ? "summary" : "item",
    category: row.category as Assessment["category"],
    label: row.label,
    score: row.score,
    absent: row.absent,
    full_marks: row.full_marks,
    position: row.position,
  };
}

interface Store {
  session: { email: string; name: string } | null;
  role: "student" | "teacher";
  students: Student[];
  me: Student;
  ready: boolean;
  error: string | null;
  content: Content[];
  videos: ChapterVideo[];
  lastSync: string | null;
  /** Latest lesson-mark entries (teachers see everyone's, students only their own). */
  markLog: MarkRow[];
  rewards: Reward[];
  redemptions: Redemption[];
  coinsError: string | null;
  refresh: () => Promise<unknown>;
  logout: () => Promise<void>;
}

const g = globalThis as unknown as {
  __hlcCloudCtx?: ReturnType<typeof createContext<Store | null>>;
};
const Ctx = (g.__hlcCloudCtx ??= createContext<Store | null>(null));

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    let active = true;
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) {
        setUser(data.user);
        setHydrated(true);
      }
    };
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) return;
      if (event === "SIGNED_OUT") {
        setUser(null);
        qc.clear();
      } else {
        setHydrated(false);
        setTimeout(() => {
          void verify();
        }, 0);
      }
    });
    void verify();
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [qc]);

  const query = useQuery({
    queryKey: ["math-records", user?.id],
    enabled: Boolean(user),
    retry: false,
    queryFn: async () => {
      const claim = await supabase.rpc("claim_student");
      if (claim.error) throw claim.error;
      const [
        roles,
        roster,
        scores,
        markLog,
        videoRows,
        content,
        assessmentRows,
        syncs,
        chapterVideos,
        coins,
      ] = await Promise.all([
        supabase.from("user_roles").select("role"),
        supabase.from("students").select("*"),
        supabase.from("chapter_scores").select("*"),
        supabase
          .from("daily_marks")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MARK_LOG_LIMIT),
        fetchAllVideoCompletions(),
        supabase.from("chapter_content").select("*"),
        fetchAllAssessments(),
        supabase
          .from("sheet_syncs")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1),
        supabase.from("chapter_videos").select("*").order("chapter").order("position"),
        loadCoinData(),
      ]);
      for (const r of [roles, roster, scores, markLog, content, syncs, chapterVideos]) {
        if (r.error) throw r.error;
      }

      const assessmentsByStudent = new Map<string, Assessment[]>();
      for (const row of assessmentRows) {
        const item = toAssessment(row);
        const existing = assessmentsByStudent.get(row.student_id);
        if (existing) existing.push(item);
        else assessmentsByStudent.set(row.student_id, [item]);
      }

      const videosByStudent = new Map<string, VideoCompletionRow[]>();
      for (const row of videoRows) {
        const existing = videosByStudent.get(row.student_id);
        if (existing) existing.push(row);
        else videosByStudent.set(row.student_id, [row]);
      }

      const savedScores = new Map<string, number | null>();
      for (const row of scores.data ?? [])
        savedScores.set(`${row.student_id}|${row.chapter}`, row.score);

      const totals = new Map<string, CoinTotalRow>();
      for (const t of coins.totals) if (t.student_id) totals.set(t.student_id, t);

      // Only used if the coin totals view is not set up yet.
      const dailyFromLog = new Map<string, number>();
      for (const m of markLog.data ?? []) {
        dailyFromLog.set(m.student_id, (dailyFromLog.get(m.student_id) ?? 0) + m.marks);
      }

      const students: Student[] = (roster.data ?? []).map((s) => {
        const own = assessmentsByStudent.get(s.id) ?? [];
        const fromSheet = chapterScoresFromAssessments(own, CHAPTER_COUNT);
        const ownVideos = videosByStudent.get(s.id) ?? [];
        const total = totals.get(s.id);

        // A score the teacher typed in the app wins; otherwise use the Google Sheet's score.
        const chapterScores: (number | null)[] = [];
        const scoreSources: ScoreSource[] = [];
        for (let ch = 1; ch <= CHAPTER_COUNT; ch++) {
          const saved = savedScores.get(`${s.id}|${ch}`);
          if (saved !== undefined && saved !== null) {
            chapterScores.push(saved);
            scoreSources.push("manual");
          } else {
            const sheet = fromSheet[ch - 1] ?? null;
            chapterScores.push(sheet);
            scoreSources.push(sheet === null ? null : "sheet");
          }
        }

        return {
          id: s.id,
          userId: s.user_id,
          name: s.name,
          email: s.email,
          set: s.math_set as Student["set"],
          scores: chapterScores,
          scoreSources,
          lastMonthAvg: s.last_month_avg,
          lastMonthFormRank: s.last_month_form_rank,
          xp: s.xp,
          streak: s.streak,
          dailyMarks: total?.daily_earned ?? dailyFromLog.get(s.id) ?? 0,
          videoMarks: ownVideos.length,
          coinsSpent: total?.spent ?? 0,
          completedVideos: ownVideos.flatMap((v) => (v.video_id ? [v.video_id] : [])),
          assessments: own,
          hlcNo: s.hlc_no,
          className: s.class_name,
          classNo: s.class_no,
        };
      });

      return {
        lastSync: syncs.data?.[0]?.created_at ?? null,
        students,
        role: roles.data?.some((r) => r.role === "teacher")
          ? ("teacher" as const)
          : ("student" as const),
        content: content.data ?? [],
        videos: chapterVideos.data ?? [],
        markLog: markLog.data ?? [],
        rewards: coins.rewards,
        redemptions: coins.redemptions,
        coinsError: coins.error,
      };
    },
  });

  const students = user ? (query.data?.students ?? []) : [];
  const metaName: unknown = user?.user_metadata?.["full_name"];
  const fallbackMe: Student = {
    id: "",
    name: typeof metaName === "string" && metaName ? metaName : "Student",
    email: user?.email ?? "",
    set: "S2M3",
    scores: Array.from({ length: CHAPTER_COUNT }, () => null),
    scoreSources: [],
    lastMonthAvg: 0,
    lastMonthFormRank: 0,
    xp: 0,
    streak: 0,
    dailyMarks: 0,
    videoMarks: 0,
    coinsSpent: 0,
    completedVideos: [],
  };
  const me = students.find((s) => s.userId === user?.id) ?? fallbackMe;

  return (
    <Ctx.Provider
      value={{
        session: user ? { email: user.email ?? "", name: me.name } : null,
        role: query.data?.role ?? "student",
        students,
        me,
        ready: hydrated && (!user || !query.isPending),
        error: query.error?.message ?? null,
        content: query.data?.content ?? [],
        videos: query.data?.videos ?? [],
        lastSync: query.data?.lastSync ?? null,
        markLog: query.data?.markLog ?? [],
        rewards: query.data?.rewards ?? [],
        redemptions: query.data?.redemptions ?? [],
        coinsError: query.data?.coinsError ?? null,
        refresh: () => query.refetch(),
        logout: async () => {
          await supabase.auth.signOut();
          qc.clear();
          setUser(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
````
