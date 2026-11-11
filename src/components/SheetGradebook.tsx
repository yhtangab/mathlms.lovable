import { useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { RefreshCw, Sheet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { scoreTone } from '@/components/AppShell';
import { useApp } from '@/lib/app-store';
import { syncGoogleSheet } from '@/lib/sheets.functions';
import { ITEM_CATEGORIES, percent, termSummary, WEIGHTS } from '@/lib/assessments';
import type { Category } from '@/lib/sheet-parse';
import { cn } from '@/lib/utils';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1alJ2ErpHOBgHMCT5vixmopRMlfO-yUr3wDPcYqxLbX8/edit';

export function SheetGradebook() {
  const { students, refresh, lastSync } = useApp();
  const sync = useServerFn(syncGoogleSheet);
  const [busy, setBusy] = useState(false);
  const [set, setSet] = useState<'S2M3' | 'S2M5'>('S2M3');
  const [term, setTerm] = useState(1);
  const [view, setView] = useState<Category | 'summary'>('summary');

  const list = students.filter(s => s.set === set).sort((a, b) => (a.className + a.classNo.padStart(3, '0')).localeCompare(b.className + b.classNo.padStart(3, '0')));
  const columns = useMemo(() => {
    const seen = new Map<string, { label: string; full: number | null; position: number }>();
    for (const s of list) for (const a of s.assessments ?? []) if (a.kind === 'item' && a.term === term && a.category === view && !seen.has(a.label)) seen.set(a.label, { label: a.label, full: a.full_marks, position: a.position });
    return [...seen.values()].sort((a, b) => a.position - b.position);
  }, [list, term, view]);
  const missingFull = useMemo(() => [...new Set(students.flatMap(s => (s.assessments ?? []).filter(a => a.kind === 'item' && a.score !== null && !a.full_marks).map(a => `${s.set} ${a.label}`)))], [students]);

  const runSync = async () => {
    setBusy(true);
    try { const r = await sync(); await refresh(); toast.success(`Synced ${r.students} students and ${r.scores} marks`); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Sync failed'); }
    finally { setBusy(false); }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Sheet className="h-5 w-5 text-success" />Assessment gradebook</h2>
          <p className="text-sm text-muted-foreground">
            From <a href={SHEET_URL} target="_blank" rel="noreferrer" className="text-primary underline">2627 Name list (For LMS)</a> · {lastSync ? `last synced ${new Date(lastSync).toLocaleString('en-HK', { dateStyle: 'medium', timeStyle: 'short' })}` : 'not synced yet'}
          </p>
        </div>
        <Button onClick={runSync} disabled={busy}><RefreshCw className={cn(busy && 'animate-spin')} />{busy ? 'Syncing…' : 'Sync from Google Sheet'}</Button>
      </div>
      {missingFull.length > 0 && <p className="mt-3 rounded-md bg-gold/20 p-2 text-sm text-gold-deep">Full marks missing in the sheet for: {missingFull.join(', ')}. Percentages for these can't be worked out until the "Full marks" row is filled in.</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <select aria-label="Set" value={set} onChange={e => setSet(e.target.value as 'S2M3' | 'S2M5')} className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"><option>S2M3</option><option>S2M5</option></select>
        <select aria-label="Term" value={term} onChange={e => setTerm(Number(e.target.value))} className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold"><option value={1}>Term 1</option><option value={2}>Term 2</option></select>
        <select aria-label="Category" value={view} onChange={e => setView(e.target.value as Category | 'summary')} className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold">
          <option value="summary">Weighted summary</option>
          {ITEM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto">
        {list.length === 0 ? <p className="text-sm text-muted-foreground">No students in {set} yet — press Sync to bring in the class list.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-bold uppercase text-muted-foreground">
              <th className="p-2">Class</th><th className="p-2">Student</th>
              {view === 'summary'
                ? <>{WEIGHTS.map(w => <th key={w.id} className="p-2 text-center">{w.label} ({w.weight})</th>)}<th className="p-2 text-center">Total /200</th></>
                : columns.map(c => <th key={c.label} className="p-2 text-center">{c.label}{c.full ? ` (${c.full})` : ''}</th>)}
            </tr></thead>
            <tbody>
              {list.map(s => {
                const sum = termSummary(s.assessments ?? [], term);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-2 whitespace-nowrap text-muted-foreground">{s.className} {s.classNo}</td>
                    <td className="p-2"><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.hlcNo ?? s.email}</p></td>
                    {view === 'summary'
                      ? <>{sum.parts.map(p => <td key={p.id} className="p-2 text-center tabular-nums">{p.value ?? '—'}</td>)}<td className="p-2 text-center font-display font-bold tabular-nums">{sum.coursework200}</td></>
                      : columns.map(c => {
                        const a = s.assessments?.find(x => x.kind === 'item' && x.term === term && x.label === c.label);
                        const pct = a ? percent(a) : null;
                        return <td key={c.label} className="p-1 text-center"><span className={cn('inline-block min-w-12 rounded-md px-1 py-0.5 text-xs font-bold tabular-nums', a?.absent ? 'bg-muted text-muted-foreground' : scoreTone(pct))}>{!a || (a.score === null && !a.absent) ? '—' : a.absent ? 'ABS' : a.score}</span></td>;
                      })}
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
