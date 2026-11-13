import { useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { RefreshCw, Sheet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { scoreTone } from '@/components/AppShell';
import { useApp } from '@/lib/app-store';
import { supabase } from '@/integrations/supabase/client';
import { syncGoogleSheet } from '@/lib/sheets.functions';
import { ITEM_CATEGORIES, percent, termSummary, WEIGHTS } from '@/lib/assessments';
import { parseSetTab, type Category, type MathSet, type ParsedStudent } from '@/lib/sheet-parse';
import { cn } from '@/lib/utils';

const SPREADSHEET_ID = '1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`;
const TABS: MathSet[] = ['S2M3', 'S2M5'];
type Cell = string | number | boolean | null;
type Grid = Cell[][];

function parseCellValue(raw: string): Cell {
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const n = Number(trimmed);
    if (Number.isFinite(n)) return n;
  }
  return trimmed;
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

async function fetchSheetTabsDirect(): Promise<{ formulas: Grid[]; values: Grid[] }> {
  const values: Grid[] = [];
  const formulas: Grid[] = [];

  for (const tab of TABS) {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`無法讀取 Google Sheet 分頁 ${tab} (HTTP ${res.status})`);
    }
    const text = await res.text();
    if (text.trim().startsWith('<!DOCTYPE html') || text.includes('<html')) {
      throw new Error(
        '請先打開 Google Sheet「2627 Name list (For LMS)」，按右上角「共用 (Share)」，將一般存取權改為「知道連結的任何人 -> 檢視者 (Viewer)」！',
      );
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

export function SheetGradebook() {
  const { students, refresh, lastSync } = useApp();
  const serverSync = useServerFn(syncGoogleSheet);
  const [busy, setBusy] = useState(false);
  const [set, setSet] = useState<'S2M3' | 'S2M5'>('S2M3');
  const [term, setTerm] = useState(1);
  const [view, setView] = useState<Category | 'summary'>('summary');

  const list = students
    .filter(s => s.set === set)
    .sort((a, b) =>
      ((a.className ?? '') + (a.classNo ?? '').padStart(3, '0')).localeCompare(
        (b.className ?? '') + (b.classNo ?? '').padStart(3, '0'),
      ),
    );

  const columns = useMemo(() => {
    const seen = new Map<string, { label: string; full: number | null; position: number }>();
    for (const s of list)
      for (const a of s.assessments ?? [])
        if (a.kind === 'item' && a.term === term && a.category === view && !seen.has(a.label))
          seen.set(a.label, { label: a.label, full: a.full_marks, position: a.position });
    return [...seen.values()].sort((a, b) => a.position - b.position);
  }, [list, term, view]);

  const missingFull = useMemo(
    () => [
      ...new Set(
        students.flatMap(s =>
          (s.assessments ?? [])
            .filter(a => a.kind === 'item' && a.score !== null && !a.full_marks)
            .map(a => `${s.set} ${a.label}`),
        ),
      ),
    ],
    [students],
  );

  const runSync = async () => {
    setBusy(true);
    try {
      // 1. 優先透過後端 Server Function 同步（不會受瀏覽器 CORS 限制）
      try {
        const r = await serverSync();
        await refresh();
        toast.success(`成功同步 ${r.students} 位學生及 ${r.scores} 項分數紀錄！`);
        return;
      } catch (serverErr) {
        console.warn('[SheetGradebook] Server sync failed, trying direct browser sync:', serverErr);
      }

      // 2. 後備方案：直接由瀏覽器讀取並寫入 Supabase
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error('請先登入老師帳號');

      const { data: allowed } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'teacher',
      });
      if (!allowed) throw new Error('只有老師帳號 (Teacher) 可以執行同步');

      const { formulas, values } = await fetchSheetTabsDirect();
      const parsed: ParsedStudent[] = TABS.flatMap((tabSet, i) =>
        parseSetTab(tabSet, formulas[i] ?? [], values[i] ?? []),
      );
      if (!parsed.length) {
        throw new Error('在 S2M3 或 S2M5 分頁中找不到帶有 HLC no. 的學生資料');
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
      if (rosterError) throw new Error(`儲存學生名單失敗: ${rosterError.message}`);
      const idByEmail = new Map((roster ?? []).map(r => [r.email, r.id]));

      const syncedAt = new Date().toISOString();
      const rows = parsed.flatMap(p =>
        p.scores.map(s => ({
          ...s,
          student_id: idByEmail.get(p.email)!,
          synced_at: syncedAt,
        })),
      );

      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await supabase.from('assessment_scores').upsert(rows.slice(i, i + 500));
        if (error) throw new Error(`儲存分數失敗: ${error.message}`);
      }

      const { error: cleanError } = await supabase
        .from('assessment_scores')
        .delete()
        .in('student_id', [...idByEmail.values()])
        .lt('synced_at', syncedAt);
      if (cleanError) throw new Error(`清理舊分數失敗: ${cleanError.message}`);

      await supabase.from('sheet_syncs').insert({
        synced_by: userId,
        students: parsed.length,
        scores: rows.length,
      });

      await refresh();
      toast.success(`成功同步 ${parsed.length} 位學生及 ${rows.length} 項分數紀錄！`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sync failed');
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
            From{' '}
            <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-primary underline">
              2627 Name list (For LMS)
            </a>{' '}
            ·{' '}
            {lastSync
              ? `last synced ${new Date(lastSync).toLocaleString('en-HK', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}`
              : 'not synced yet'}
          </p>
        </div>
        <Button onClick={runSync} disabled={busy}>
          <RefreshCw className={cn(busy && 'animate-spin')} />
          {busy ? 'Syncing…' : 'Sync from Google Sheet'}
        </Button>
      </div>
      {missingFull.length > 0 && (
        <p className="mt-3 rounded-md bg-gold/20 p-2 text-sm text-gold-deep">
          Full marks missing in the sheet for: {missingFull.join(', ')}. Percentages for these
          can&apos;t be worked out until the &quot;Full marks&quot; row is filled in.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <select
          aria-label="Set"
          value={set}
          onChange={e => setSet(e.target.value as 'S2M3' | 'S2M5')}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"
        >
          <option>S2M3</option>
          <option>S2M5</option>
        </select>
        <select
          aria-label="Term"
          value={term}
          onChange={e => setTerm(Number(e.target.value))}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"
        >
          <option value={1}>Term 1</option>
          <option value={2}>Term 2</option>
        </select>
        <select
          aria-label="Category"
          value={view}
          onChange={e => setView(e.target.value as Category | 'summary')}
          className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"
        >
          <option value="summary">Weighted summary</option>
          {ITEM_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students in {set} yet — press Sync to bring in the class list.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-muted-foreground">
                <th className="p-2">Class</th>
                <th className="p-2">Student</th>
                {view === 'summary' ? (
                  <>
                    {WEIGHTS.map(w => (
                      <th key={w.id} className="p-2 text-center">
                        {w.label} ({w.weight})
                      </th>
                    ))}
                    <th className="p-2 text-center">Total /200</th>
                  </>
                ) : (
                  columns.map(c => (
                    <th key={c.label} className="p-2 text-center">
                      {c.label}
                      {c.full ? ` (${c.full})` : ''}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {list.map(s => {
                const sum = termSummary(s.assessments ?? [], term);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-2 whitespace-nowrap text-muted-foreground">
                      {s.className} {s.classNo}
                    </td>
                    <td className="p-2">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.hlcNo ?? s.email}</p>
                    </td>
                    {view === 'summary' ? (
                      <>
                        {sum.parts.map(p => (
                          <td key={p.id} className="p-2 text-center tabular-nums">
                            {p.value ?? '—'}
                          </td>
                        ))}
                        <td className="p-2 text-center font-display font-bold tabular-nums">
                          {sum.coursework200}
                        </td>
                      </>
                    ) : (
                      columns.map(c => {
                        const a = s.assessments?.find(
                          x => x.kind === 'item' && x.term === term && x.label === c.label,
                        );
                        const pct = a ? percent(a) : null;
                        return (
                          <td key={c.label} className="p-1 text-center">
                            <span
                              className={cn(
                                'inline-block min-w-12 rounded-md px-1 py-0.5 text-xs font-bold tabular-nums',
                                a?.absent ? 'bg-muted text-muted-foreground' : scoreTone(pct),
                              )}
                            >
                              {!a || (a.score === null && !a.absent)
                                ? '—'
                                : a.absent
                                  ? 'ABS'
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
