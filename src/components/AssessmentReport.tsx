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
        <Tabs defaultValue={cats[0]?.id} key={term} className="mt-5">
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
