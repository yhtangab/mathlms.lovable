-- Board day badges follow Continuous Assessment, not EXP.
-- Only rewrite a description that still mentions EXP, so a teacher's own wording stays.

UPDATE public.badge_defs
SET description = 'Be 1st on your set Continuous Assessment leaderboard. Each day counts once, when the teacher publishes.'
WHERE id = 'board-top1'
  AND description LIKE '%EXP%';

UPDATE public.badge_defs
SET description = 'Be in the top 3 of your set Continuous Assessment leaderboard.'
WHERE id = 'board-top3'
  AND description LIKE '%EXP%';

UPDATE public.badge_defs
SET description = 'Be in the top 10 of your set Continuous Assessment leaderboard.'
WHERE id = 'board-top10'
  AND description LIKE '%EXP%';
