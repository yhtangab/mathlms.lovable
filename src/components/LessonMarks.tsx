import { useState } from 'react';
import { Plus, Shuffle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-store';
import { supabase } from '@/integrations/supabase/client';
import { answerMarks, awardSchema } from '@/lib/grade-rules';

export function LessonMarks() {
  const { students, refresh } = useApp();
  const [set, setSet] = useState<'S2M3' | 'S2M5'>('S2M3');
  const [selected, select] = useState('');
  const [picked, pick] = useState('');
  const [spinning, spin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [marks, setMarks] = useState(1);
  const [reason, setReason] = useState<'classwork' | 'participation'>('classwork');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const list = students.filter(s => s.set === set);

  const send = async (
    id: string,
    markReason: 'classwork' | 'participation' | 'correct_answer' | 'incorrect_answer',
    n: number,
  ) => {
    setBusy(true);
    try {
      const parsed = awardSchema.parse({ studentId: id, reason: markReason, marks: n });
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error('請先登入老師帳號');

      const { error } = await supabase.from('daily_marks').insert({
        student_id: parsed.studentId,
        marks: parsed.marks,
        reason: parsed.reason,
        awarded_by: userId,
      });
      if (error) throw error;

      await refresh();
      toast.success(n ? `${n} mark(s) saved` : 'Answer recorded');
      if (markReason.includes('answer')) pick('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save marks');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 space-y-6 border-y border-border py-6">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async e => {
          e.preventDefault();
          setBusy(true);
          try {
            const { error } = await supabase
              .from('students')
              .insert({ name: name.trim(), email: email.trim().toLowerCase(), math_set: set });
            if (error) throw error;
            await refresh();
            setName('');
            setEmail('');
            toast.success('Student added');
          } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Could not add student');
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="text-sm font-medium">
          Class set
          <select
            aria-label="Class set"
            value={set}
            onChange={e => {
              setSet(e.target.value as 'S2M3' | 'S2M5');
              select('');
              pick('');
            }}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          >
            <option>S2M3</option>
            <option>S2M5</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Student name
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          />
        </label>
        <label className="text-sm font-medium">
          School email
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block rounded-md border border-input bg-card p-2"
          />
        </label>
        <Button disabled={busy} type="submit">
          <Plus />
          Add student
        </Button>
      </form>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Daily lesson marks</h2>
          <select
            aria-label="Student for daily marks"
            value={selected}
            onChange={e => select(e.target.value)}
            className="w-full rounded-md border border-input bg-card p-2"
          >
            <option value="">Choose student</option>
            {list.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.dailyMarks ?? 0} marks
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              Reason
              <select
                aria-label="Mark reason"
                value={reason}
                onChange={e => setReason(e.target.value as typeof reason)}
                className="mt-1 block rounded-md border border-input bg-card p-2"
              >
                <option value="classwork">Classwork completed</option>
                <option value="participation">Good lesson performance</option>
              </select>
            </label>
            <label className="text-sm">
              Marks
              <input
                aria-label="Marks"
                type="number"
                min={0}
                max={100}
                value={marks}
                onChange={e => setMarks(Number(e.target.value))}
                className="mt-1 block w-20 rounded-md border border-input bg-card p-2"
              />
            </label>
            <Button disabled={!selected || busy} onClick={() => send(selected, reason, marks)}>
              <Plus />
              Award marks
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Random student</h2>
          <div
            aria-live="polite"
            className="flex min-h-20 items-center justify-center border-y border-border font-display text-2xl"
          >
            {students.find(s => s.id === picked)?.name ?? '—'}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!list.length || spinning || busy || Boolean(picked)}
              onClick={() => {
                spin(true);
                let turns = 0;
                const timer = setInterval(() => {
                  pick(list[Math.floor(Math.random() * list.length)]?.id ?? '');
                  if (++turns === 12) {
                    clearInterval(timer);
                    spin(false);
                  }
                }, 100);
              }}
            >
              <Shuffle />
              {spinning ? 'Choosing…' : 'Choose student'}
            </Button>
            {picked && !spinning && (
              <>
                <Button
                  disabled={busy}
                  onClick={() => send(picked, 'correct_answer', answerMarks(true))}
                >
                  <Check />
                  Correct +1
                </Button>
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={() => send(picked, 'incorrect_answer', answerMarks(false))}
                >
                  <X />
                  Incorrect
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
