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
      `Service account (${cleanEmail}) could not sign in [${res.status}]: ${errText.slice(0, 200)}`,
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
    throw new Error(`Google Sheets API read failed [${res.status}]: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { valueRanges?: { values?: Grid }[] };
  return TABS.map((_, i) => json.valueRanges?.[i]?.values ?? []);
}

async function loadXlsx(): Promise<XlsxModule> {
  const mod = (await import("xlsx")) as unknown as Partial<XlsxModule> & { default?: XlsxModule };
  if (typeof mod.read === "function" && mod.utils) return mod as XlsxModule;
  if (mod.default && typeof mod.default.read === "function") return mod.default;
  throw new Error("The xlsx reader could not be loaded. Run npm install and try again.");
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
    throw new Error(`Could not download the spreadsheet (HTTP ${res.status})`);
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  // A real .xlsx file is a zip archive and starts with "PK"; a Google login page is HTML.
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    throw new Error(
      'Google did not allow the spreadsheet to be downloaded. Set sharing to "Anyone with the link: Viewer" and make sure viewers are allowed to download.',
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
    if (!sheet) throw new Error(`The spreadsheet has no tab called "${tab}"`);
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
      failures.push(`Service account: ${errorMessage(err)}`);
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
      failures.push(`API key: ${errorMessage(err)}`);
    }
  }

  try {
    const grids = await readPublicWorkbook();
    return { ...grids, source: "public_xlsx" };
  } catch (err) {
    failures.push(`Public link: ${errorMessage(err)}`);
  }

  throw new Error(`Could not read the Google Sheet. ${failures.join("; ")}`);
}

export const syncGoogleSheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SyncReport> => {
    const { supabase, userId } = context;
    const { data: allowed, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "teacher",
    });
    if (roleError) throw new Error(`Could not check teacher access: ${roleError.message}`);
    if (!allowed) throw new Error("Only teacher accounts can sync marks");

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
      throw new Error("No students with an HLC no. were found in the S2M3 or S2M5 tabs");
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
        'The class list was read but no marks were found, so the sync stopped to keep the saved marks. Check that each tab has an "HLC no." heading row and that marks start in column G.',
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
    if (rosterError) throw new Error(`Could not save the class list: ${rosterError.message}`);
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
      if (error) throw new Error(`Could not save marks: ${error.message}`);
    }

    for (const ids of chunk([...idByEmail.values()], DELETE_CHUNK)) {
      const { error } = await supabase
        .from("assessment_scores")
        .delete()
        .in("student_id", ids)
        .lt("synced_at", syncedAt);
      if (error) throw new Error(`Could not remove old marks: ${error.message}`);
    }

    const { error: logError } = await supabase.from("sheet_syncs").insert({
      synced_by: userId,
      students: parsed.length,
      scores: rows.length,
    });
    if (logError) console.warn("[Google Sheets] Could not record the sync time:", logError.message);

    return { source, students: parsed.length, scores: rows.length, syncedAt, tabs, duplicates };
  });
