import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { parseSetTab, type MathSet, type ParsedStudent } from './sheet-parse';

const SPREADSHEET_ID = '1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8';
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const TABS: MathSet[] = ['S2M3', 'S2M5'];
type Cell = string | number | boolean | null;
type Grid = Cell[][];

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function normalizePrivateKey(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned) as { private_key?: string };
      if (parsed.private_key) cleaned = parsed.private_key;
    } catch {
      // ignore
    }
  }
  return cleaned
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\n/g, '\n');
}

function extractClientEmail(emailRaw: string | undefined, keyRaw: string | undefined): string {
  if (keyRaw && keyRaw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(keyRaw.trim()) as { client_email?: string };
      if (parsed.client_email) return parsed.client_email.trim();
    } catch {
      // ignore
    }
  }
  return (emailRaw ?? '').trim().replace(/^['"]|['"]$/g, '');
}

async function getServiceAccountAccessToken(clientEmail: string, privateKeyRaw: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 60 > now) {
    return cachedAccessToken.token;
  }

  const { createSign } = await import('node:crypto');
  const privateKey = normalizePrivateKey(privateKeyRaw);
  const cleanEmail = extractClientEmail(clientEmail, privateKeyRaw);

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: cleanEmail,
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

function parseCsvGrid(csvText: string): Grid {
  const rows: Grid = [];
  let row: Cell[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(parseCellValue(current));
        current = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(parseCellValue(current));
        rows.push(row);
        row = [];
        current = '';
        i++;
      } else if (ch === '\n') {
        row.push(parseCellValue(current));
        rows.push(row);
        row = [];
        current = '';
      } else {
        current += ch;
      }
    }
  }
  if (current.length > 0 || row.length > 0) {
    row.push(parseCellValue(current));
    rows.push(row);
  }
  return rows;
}

function parseCellValue(raw: string): Cell {
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    if (Number.isFinite(n)) return n;
  }
  return trimmed;
}

async function readPublicTabsFallback(): Promise<{ formulas: Grid[]; values: Grid[] }> {
  const values: Grid[] = [];
  const formulas: Grid[] = [];

  for (const tab of TABS) {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`無法直接讀取分頁 ${tab} (HTTP ${res.status})`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    const text = await res.text();
    if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE html')) {
      throw new Error('Google Sheet 尚未開啟「知道連結的任何人可檢視」權限');
    }

    const grid = parseCsvGrid(text);
    values.push(grid);

    const itemRow = grid.findIndex(r => String(r?.[0] ?? '').trim().toLowerCase() === 'hlc no.');
    const groupRow = itemRow > 0 ? itemRow - 1 : 0;
    const formulaGrid: Grid = grid.map((r, rIdx) =>
      r.map((cell, cIdx) => {
        if (rIdx > itemRow && cIdx >= 6) {
          const gHeader = String(grid[groupRow]?.[cIdx] ?? '').trim();
          const iHeader = String(grid[itemRow]?.[cIdx] ?? '').trim();
          const hasWeightBracket = /\(\s*\d+(?:\.\d+)?\s*%?\s*\)\s*$/.test(iHeader || gHeader);
          const isSummaryHeader =
            hasWeightBracket && (!iHeader || /\(\s*\d+(?:\.\d+)?\s*%?\s*\)\s*$/.test(iHeader));
          if (isSummaryHeader && !/^daily/i.test(iHeader || gHeader)) {
            return '=SUMMARY()';
          }
        }
        return cell;
      }),
    );
    formulas.push(formulaGrid);
  }

  return { formulas, values };
}

async function readTabsViaApi(
  render: 'FORMULA' | 'UNFORMATTED_VALUE',
  headers: Record<string, string>,
  extraQuery = '',
): Promise<Grid[]> {
  const ranges = TABS.map(t => `ranges=${encodeURIComponent(`${t}!A1:GZ300`)}`).join('&');
  const url = `${GOOGLE_SHEETS_API_URL}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${ranges}&valueRenderOption=${render}${extraQuery}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API 讀取失敗 [${res.status}]: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { valueRanges?: { values?: Grid }[] };
  return TABS.map((_, i) => json.valueRanges?.[i]?.values ?? []);
}

async function loadAllSheetGrids(): Promise<{ formulas: Grid[]; values: Grid[] }> {
  const serviceEmail =
    process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'] || process.env['VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL'];
  const privateKey = process.env['GOOGLE_PRIVATE_KEY'] || process.env['VITE_GOOGLE_PRIVATE_KEY'];
  const sheetsApiKey =
    process.env['GOOGLE_SHEETS_API_KEY'] || process.env['VITE_GOOGLE_SHEETS_API_KEY'];

  let serviceAccountError: string | null = null;

  if (serviceEmail && privateKey) {
    try {
      const accessToken = await getServiceAccountAccessToken(serviceEmail, privateKey);
      const headers = { Authorization: `Bearer ${accessToken}` };
      const [formulas, values] = await Promise.all([
        readTabsViaApi('FORMULA', headers),
        readTabsViaApi('UNFORMATTED_VALUE', headers),
      ]);
      return { formulas, values };
    } catch (err) {
      serviceAccountError = err instanceof Error ? err.message : String(err);
      console.warn('[Google Sheets] Service Account failed, trying fallback:', serviceAccountError);
    }
  }

  if (sheetsApiKey) {
    try {
      const query = `&key=${encodeURIComponent(sheetsApiKey.trim())}`;
      const [formulas, values] = await Promise.all([
        readTabsViaApi('FORMULA', {}, query),
        readTabsViaApi('UNFORMATTED_VALUE', {}, query),
      ]);
      return { formulas, values };
    } catch (err) {
      console.warn('[Google Sheets] API Key failed, trying public link fallback:', err);
    }
  }

  try {
    return await readPublicTabsFallback();
  } catch {
    if (serviceAccountError) {
      throw new Error(
        `${serviceAccountError} —— 請將 Google Sheet 右上角「共用」設為「知道連結的任何人可檢視 (Viewer)」，或檢查 Service Account Email 是否正確。`,
      );
    }
    throw new Error(
      '無法讀取 Google Sheet：請將 Google Sheet 右上角「共用」設為「知道連結的任何人可檢視 (Viewer)」。',
    );
  }
}

export const syncGoogleSheet = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: allowed } = await supabase.rpc('has_role', { _user_id: userId, _role: 'teacher' });
    if (!allowed) throw new Error('Teacher access required');

    const { formulas, values } = await loadAllSheetGrids();
    const parsed: ParsedStudent[] = TABS.flatMap((set, i) =>
      parseSetTab(set, formulas[i] ?? [], values[i] ?? []),
    );
    if (!parsed.length) {
      throw new Error('No students with an HLC no. were found in the S2M3 or S2M5 tabs');
    }

    const { data: roster, error: rosterError } = await supabase
      .from('students')
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
