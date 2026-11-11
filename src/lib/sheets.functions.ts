import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { parseSetTab, type MathSet, type ParsedStudent } from './sheet-parse';

const SPREADSHEET_ID = '1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8';
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_sheets/v4';
const TABS: MathSet[] = ['S2M3', 'S2M5'];
type Grid = (string | number | boolean | null)[][];

async function readTabs(render: 'FORMULA' | 'UNFORMATTED_VALUE'): Promise<Grid[]> {
  const lovableKey = process.env['LOVABLE_API_KEY'];
  const sheetsKey = process.env['GOOGLE_SHEETS_API_KEY'];
  if (!lovableKey || !sheetsKey) throw new Error('Google Sheets is not connected to this app');
  const ranges = TABS.map(t => `ranges=${t}!A1:GZ300`).join('&');
  const res = await fetch(`${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges}&valueRenderOption=${render}`, {
    headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': sheetsKey },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Sheets read failed [${res.status}]: ${body}`);
    throw new Error(`Google Sheets read failed [${res.status}]: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { valueRanges?: { values?: Grid }[] };
  return TABS.map((_, i) => json.valueRanges?.[i]?.values ?? []);
}

export const syncGoogleSheet = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: allowed } = await supabase.rpc('has_role', { _user_id: userId, _role: 'teacher' });
    if (!allowed) throw new Error('Teacher access required');

    const [formulas, values] = await Promise.all([readTabs('FORMULA'), readTabs('UNFORMATTED_VALUE')]);
    const parsed: ParsedStudent[] = TABS.flatMap((set, i) => parseSetTab(set, formulas[i] ?? [], values[i] ?? []));
    if (!parsed.length) throw new Error('No students with an HLC no. were found in the S2M3 or S2M5 tabs');

    const { data: roster, error: rosterError } = await supabase.from('students')
      .upsert(parsed.map(p => ({ email: p.email, name: p.name, math_set: p.set, hlc_no: p.hlcNo, class_name: p.className, class_no: p.classNo })), { onConflict: 'email' })
      .select('id, email');
    if (rosterError) throw new Error(`Could not save the class list: ${rosterError.message}`);
    const idByEmail = new Map((roster ?? []).map(r => [r.email, r.id]));

    const syncedAt = new Date().toISOString();
    const rows = parsed.flatMap(p => p.scores.map(s => ({ ...s, student_id: idByEmail.get(p.email)!, synced_at: syncedAt })));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabase.from('assessment_scores').upsert(rows.slice(i, i + 500));
      if (error) throw new Error(`Could not save scores: ${error.message}`);
    }
    // Remove marks for columns that no longer exist in the sheet.
    const { error: cleanError } = await supabase.from('assessment_scores').delete()
      .in('student_id', [...idByEmail.values()]).lt('synced_at', syncedAt);
    if (cleanError) throw new Error(`Could not tidy old scores: ${cleanError.message}`);

    await supabase.from('sheet_syncs').insert({ synced_by: userId, students: parsed.length, scores: rows.length });
    return { students: parsed.length, scores: rows.length, syncedAt };
  });
