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