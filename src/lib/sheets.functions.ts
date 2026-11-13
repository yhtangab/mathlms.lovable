import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { parseSetTab, type MathSet, type ParsedStudent } from './sheet-parse';

const SPREADSHEET_ID = '1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8';
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const TABS: MathSet[] = ['S2M3', 'S2M5'];
type Grid = (string | number | boolean | null)[][];

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function normalizePrivateKey(raw: string): string {
  return raw
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\n/g, '\n');
}

async function getServiceAccountAccessToken(clientEmail: string, privateKeyRaw: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 60 > now) {
    return cachedAccessToken.token;
  }

  const { createSign } = await import('node:crypto');
  const privateKey = normalizePrivateKey(privateKeyRaw);

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: clientEmail.trim().replace(/^['"]|['"]$/g, ''),
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  ).toString('base64url');

  const unsignedJwt = `${header}.${claimSet}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(privateKey, 'base64url');
  const assertion = `${unsignedJwt}.${signature}`;

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Google OAuth token exchange failed [${res.status}]: ${errText}`);
    throw new Error(`Google Service Account 驗證失敗 [${res.status}]: ${errText.slice(0, 200)}`);
  }

  const tokenData = (await res.json()) as { access_token: string; expires_in?: number };
  cachedAccessToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in ?? 3600),
  };

  return tokenData.access_token;
}

async function readTabs(render: 'FORMULA' | 'UNFORMATTED_VALUE'): Promise<Grid[]> {
  const serviceEmail =
    process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'] || process.env['VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL'];
  const privateKey = process.env['GOOGLE_PRIVATE_KEY'] || process.env['VITE_GOOGLE_PRIVATE_KEY'];
  const sheetsApiKey =
    process.env['GOOGLE_SHEETS_API_KEY'] || process.env['VITE_GOOGLE_SHEETS_API_KEY'];

  const ranges = TABS.map(t => `ranges=${encodeURIComponent(`${t}!A1:GZ300`)}`).join('&');
  let url = `${GOOGLE_SHEETS_API_URL}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges}&valueRenderOption=${render}`;
  const headers: Record<string, string> = {};

  if (serviceEmail && privateKey) {
    const accessToken = await getServiceAccountAccessToken(serviceEmail, privateKey);
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else if (sheetsApiKey) {
    url += `&key=${encodeURIComponent(sheetsApiKey.trim())}`;
  } else {
    throw new Error(
      '找不到 GOOGLE_SERVICE_ACCOUNT_EMAIL 或 GOOGLE_PRIVATE_KEY，請檢查 .env 及 Vercel Environment Variables 設定。',
    );
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Sheets read failed [${res.status}]: ${body}`);
    throw new Error(`Google Sheets 讀取失敗 [${res.status}]: ${body.slice(0, 300)}`);
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
      .upsert(
        parsed.map(p => ({
          email: p.email,
          name: p.name,
          math_set: p.set,
          hlc_no: p.hlcNo,
          class_name: p.className,
          class_no: p.classNo,
        })),
        { onConflict: 'email' },
      )
      .select('id, email');
    if (rosterError) throw new Error(`Could not save the class list: ${rosterError.message}`);
    const idByEmail = new Map((roster ?? []).map(r => [r.email, r.id]));

    const syncedAt = new Date().toISOString();
    const rows = parsed.flatMap(p =>
      p.scores.map(s => ({ ...s, student_id: idByEmail.get(p.email)!, synced_at: syncedAt })),
    );
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabase.from('assessment_scores').upsert(rows.slice(i, i + 500));
      if (error) throw new Error(`Could not save scores: ${error.message}`);
    }
    // Remove marks for columns that no longer exist in the sheet.
    const { error: cleanError } = await supabase
      .from('assessment_scores')
      .delete()
      .in('student_id', [...idByEmail.values()])
      .lt('synced_at', syncedAt);
    if (cleanError) throw new Error(`Could not tidy old scores: ${cleanError.message}`);

    await supabase.from('sheet_syncs').insert({
      synced_by: userId,
      students: parsed.length,
      scores: rows.length,
    });
    return { students: parsed.length, scores: rows.length, syncedAt };
  });
