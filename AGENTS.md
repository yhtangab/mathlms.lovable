## Project rules
- Do not hand-edit `drizzle/` or `supabase/migrations/`. New database changes that the teacher pastes into the Supabase SQL Editor belong in `supabase/sql/`.
- Do not put secret values in the repo.
- Do not edit a file whose header says it is automatically generated.

## Application rules
- Cloud Auth supplies verified identity; roles live in protected user_roles, never browser storage or profile metadata, to prevent privilege escalation.
- Private records are read through RLS-scoped Cloud clients; students receive only their own records and peer leaderboard is teacher-only to protect grades.
- Authenticated pages live under the client-only _authenticated layout; the public sign-in and recovery pages remain SSR-enabled to avoid session redirect loops.
- Use authenticated server functions for score and lesson-mark writes, and database uniqueness for video rewards, so refreshes and repeated completions cannot duplicate a reward.
