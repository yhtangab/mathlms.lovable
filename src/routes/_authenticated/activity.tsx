import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check, RotateCcw, Search, Sparkles, Undo2, Volume2, VolumeX, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TeacherOnly } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import {
  COIN_EMOJI,
  COIN_NAME,
  QUICK_AMOUNTS,
  QUICK_REASONS,
  coinBalance,
  deleteMarks,
  giveCoins,
  reasonLabel,
  type MarkReason,
} from "@/lib/coins";
import { sortByClass, type MathSet, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Class activity — HLC Math" },
      { name: "description", content: "Lucky draw and quick Math Coins for the class." },
      { property: "og:title", content: "Class activity — HLC Math" },
      { property: "og:description", content: "Pick a student and reward great answers." },
    ],
  }),
  component: ActivityPage,
});

const SETS: MathSet[] = ["S2M3", "S2M5"];
const BALL_COLORS = [
  "var(--primary)",
  "var(--success)",
  "var(--gold-deep)",
  "var(--flame)",
  "var(--destructive)",
  "oklch(0.6 0.15 300)",
];
const PILE_ROWS = [5, 4, 3, 2];
const BALL_SIZE = 30;
const BALL_COUNT = 14;

const ANIMATION_CSS = `
.hlc-ball { position: absolute; left: 50%; top: 50%; width: ${BALL_SIZE}px; height: ${BALL_SIZE}px; margin: -${BALL_SIZE / 2}px 0 0 -${BALL_SIZE / 2}px; border-radius: 9999px; display: grid; place-items: center; font-size: 11px; font-weight: 800; color: white; box-shadow: inset -4px -4px 6px rgb(0 0 0 / 0.25), inset 3px 3px 5px rgb(255 255 255 / 0.45); transition: transform 0.4s ease; }
.hlc-ball[data-spin="true"] { animation: hlc-orbit var(--d) linear infinite; animation-delay: var(--delay); }
@keyframes hlc-orbit { from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); } }
.hlc-machine[data-spin="true"] { animation: hlc-shake 0.25s ease-in-out infinite; }
@keyframes hlc-shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
.hlc-winner { animation: hlc-pop 0.7s cubic-bezier(0.2, 1.4, 0.4, 1) both, hlc-glow 1.6s ease-in-out 0.7s infinite; }
@keyframes hlc-pop { 0% { transform: translateY(-90px) scale(0.2); opacity: 0; } 70% { transform: translateY(6px) scale(1.08); opacity: 1; } 100% { transform: translateY(0) scale(1); } }
@keyframes hlc-glow { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--gold) 70%, transparent); } 50% { box-shadow: 0 0 48px 12px color-mix(in oklab, var(--gold) 70%, transparent); } }
.hlc-confetti { position: absolute; left: 50%; top: 45%; width: 10px; height: 14px; border-radius: 2px; opacity: 0; animation: hlc-burst 1.4s cubic-bezier(0.15, 0.7, 0.3, 1) forwards; animation-delay: var(--delay); }
@keyframes hlc-burst { 0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; } 100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) rotate(var(--rot)); opacity: 0; } }
.hlc-ticker { animation: hlc-flick 0.12s linear infinite alternate; }
@keyframes hlc-flick { from { opacity: 0.6; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .hlc-ball[data-spin="true"], .hlc-machine[data-spin="true"], .hlc-winner, .hlc-ticker, .hlc-confetti { animation: none; } }
`;

function randomIndex(n: number): number {
  if (n <= 1) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] ?? 0) % n;
}

/** Where each ball rests at the bottom of the machine when it is not spinning. */
function pilePosition(i: number): { x: number; y: number } {
  let index = i;
  for (let row = 0; row < PILE_ROWS.length; row++) {
    const count = PILE_ROWS[row] ?? 0;
    if (index < count) {
      return { x: (index - (count - 1) / 2) * (BALL_SIZE + 2), y: 78 - row * (BALL_SIZE - 4) };
    }
    index -= count;
  }
  return { x: 0, y: 0 };
}

function ActivityPage() {
  const { students, coinsError } = useApp();
  const [set, setSet] = useState<MathSet>("S2M3");
  const list = useMemo(() => sortByClass(students.filter((s) => s.set === set)), [students, set]);
  return (
    <AppShell>
      <TeacherOnly>
        <style>{ANIMATION_CSS}</style>
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h1 className="text-3xl font-bold">Class activity</h1>
            <p className="font-semibold text-muted-foreground">
              Lucky draw and quick {COIN_NAME} for {set}
            </p>
          </div>
          <div className="flex rounded-2xl bg-muted p-1">
            {SETS.map((x) => (
              <Button
                key={x}
                variant="ghost"
                onClick={() => setSet(x)}
                className={cn(
                  "rounded-xl px-4 font-extrabold",
                  set === x
                    ? "bg-primary text-primary-foreground shadow-chunky-primary hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {x}
              </Button>
            ))}
          </div>
        </div>
        {coinsError && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            {coinsError}
          </p>
        )}
        <LuckyDraw key={`draw-${set}`} list={list} />
        <QuickPoints key={`points-${set}`} list={list} />
        <RecentActivity />
      </TeacherOnly>
    </AppShell>
  );
}

type Phase = "idle" | "spinning" | "revealed";

function LuckyDraw({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [phase, setPhase] = useState<Phase>("idle");
  const [ticker, setTicker] = useState("");
  const [winner, setWinner] = useState<Student | null>(null);
  const [drawn, setDrawn] = useState<string[]>([]);
  const [noRepeat, setNoRepeat] = useState(true);
  const [sound, setSound] = useState(true);
  const [reward, setReward] = useState(1);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<AudioContext | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      void audio.current?.close();
    },
    [],
  );

  const spinning = phase === "spinning";
  const pool = noRepeat ? list.filter((s) => !drawn.includes(s.id)) : list;
  const live = winner ? (list.find((s) => s.id === winner.id) ?? winner) : null;

  const balls = useMemo(
    () =>
      Array.from({ length: BALL_COUNT }, (_, i) => ({
        label: list.length
          ? list[i % list.length]?.classNo || String((i % list.length) + 1)
          : String(i + 1),
        color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--primary)",
        radius: 28 + (i % 4) * 18,
        duration: 0.8 + (i % 5) * 0.2,
        delay: -(i * 0.37),
        pile: pilePosition(i),
      })),
    [list],
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: burst ? 42 : 0 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 180;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60,
          rot: Math.random() * 720 - 360,
          color: BALL_COLORS[i % BALL_COLORS.length] ?? "var(--gold)",
          delay: Math.random() * 0.15,
        };
      }),
    [burst],
  );

  const beep = (freq: number, seconds: number, volume = 0.05) => {
    if (!sound) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + seconds);
    } catch {
      // Sound is optional; some browsers block it.
    }
  };

  const fanfare = () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => beep(f, 0.35, 0.07), i * 120);
    });
  };

  const draw = () => {
    if (spinning) return;
    if (!pool.length) {
      toast.info(
        list.length
          ? "Everyone has had a turn — press Reset to start again."
          : "No students in this set yet.",
      );
      return;
    }
    const pick = pool[randomIndex(pool.length)];
    if (!pick) return;
    setPhase("spinning");
    setWinner(null);
    setSaved(null);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = reduced ? 3 : 20;
    let i = 0;
    const step = () => {
      i += 1;
      if (i >= steps) {
        setTicker(pick.name);
        setWinner(pick);
        setPhase("revealed");
        setDrawn((d) => (d.includes(pick.id) ? d : [...d, pick.id]));
        setBurst((b) => b + 1);
        fanfare();
        return;
      }
      setTicker(list[randomIndex(list.length)]?.name ?? "");
      beep(300 + i * 25, 0.05, 0.03);
      timer.current = setTimeout(step, 50 + Math.pow(i / steps, 2) * 380);
    };
    step();
  };

  const reset = () => {
    setDrawn([]);
    setWinner(null);
    setSaved(null);
    setPhase("idle");
  };

  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      setSaved(null);
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };

  const answer = async (correct: boolean) => {
    if (!winner) return;
    setBusy(true);
    try {
      const ids = await giveCoins({
        studentIds: [winner.id],
        marks: correct ? reward : 0,
        reason: correct ? "correct_answer" : "incorrect_answer",
        note: "Lucky draw",
      });
      await refresh();
      const message = correct
        ? `+${reward} ${COIN_NAME} for ${winner.name}`
        : `Answer recorded for ${winner.name}`;
      setSaved(message);
      toast.success(message, { action: { label: "Undo", onClick: () => void undo(ids) } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-gold-deep" /> Lucky draw
        </h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={noRepeat}
            onChange={(e) => setNoRepeat(e.target.checked)}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          No repeats
        </label>
        <Button
          variant="ghost"
          size="icon"
          aria-label={sound ? "Turn sound off" : "Turn sound on"}
          onClick={() => setSound(!sound)}
        >
          {sound ? <Volume2 /> : <VolumeX />}
        </Button>
        <Button variant="outline" size="sm" onClick={reset} disabled={spinning || !drawn.length}>
          <RotateCcw /> Reset
        </Button>
      </div>

      <div className="mt-5 grid items-center gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col items-center">
          <div
            className="hlc-machine relative h-60 w-60 rounded-full border-4 border-primary/40 bg-gradient-to-b from-primary/5 to-primary/20"
            data-spin={spinning}
          >
            <div className="absolute left-8 top-6 h-10 w-16 -rotate-12 rounded-full bg-white/50 blur-sm" />
            {balls.map((b, i) => (
              <span
                key={i}
                className="hlc-ball"
                data-spin={spinning}
                style={
                  {
                    background: b.color,
                    "--r": `${b.radius}px`,
                    "--d": `${b.duration}s`,
                    "--delay": `${b.delay}s`,
                    ...(spinning ? {} : { transform: `translate(${b.pile.x}px, ${b.pile.y}px)` }),
                  } as CSSProperties
                }
              >
                {b.label}
              </span>
            ))}
          </div>
          <div className="h-4 w-20 rounded-b-xl bg-primary/40" />
          <Button
            size="lg"
            onClick={draw}
            disabled={spinning || !list.length}
            className="mt-4 h-14 w-full rounded-2xl text-lg font-extrabold shadow-chunky-primary"
          >
            {spinning ? "Drawing…" : winner ? "Draw again" : "Draw a student"}
          </Button>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {noRepeat
              ? `${pool.length} of ${list.length} students left`
              : `${list.length} students in the draw`}
          </p>
        </div>

        <div className="relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-3xl bg-muted/60 p-6 text-center">
          {phase === "idle" && (
            <p className="font-display text-2xl font-bold text-muted-foreground">
              Press “Draw a student” 🎱
            </p>
          )}
          {spinning && (
            <p className="hlc-ticker font-display text-4xl font-bold md:text-6xl">{ticker}</p>
          )}
          {phase === "revealed" && live && (
            <>
              <div key={burst} className="pointer-events-none absolute inset-0">
                {confetti.map((p, i) => (
                  <span
                    key={i}
                    className="hlc-confetti"
                    style={
                      {
                        background: p.color,
                        "--x": `${p.x}px`,
                        "--y": `${p.y}px`,
                        "--rot": `${p.rot}deg`,
                        "--delay": `${p.delay}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <p className="text-sm font-extrabold uppercase tracking-widest text-gold-deep">
                🎉 Lucky winner 🎉
              </p>
              <div className="hlc-winner mt-3 rounded-3xl bg-gold px-8 py-5">
                <p className="font-display text-4xl font-bold text-accent-foreground md:text-6xl">
                  {live.name}
                </p>
                <p className="mt-1 text-sm font-bold text-accent-foreground/80">
                  {live.className} {live.classNo} · {COIN_EMOJI} {coinBalance(live)}
                </p>
              </div>
              {saved ? (
                <p className="mt-5 font-bold text-success">✓ {saved}</p>
              ) : (
                <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
                  <div className="flex rounded-xl bg-card p-1">
                    {[1, 2, 3].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setReward(n)}
                        className={cn(
                          "rounded-lg px-3 py-1 text-sm font-extrabold",
                          reward === n
                            ? "bg-success text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                  <Button
                    disabled={busy}
                    onClick={() => void answer(true)}
                    className="bg-success text-primary-foreground hover:bg-success/90"
                  >
                    <Check /> Correct +{reward}
                  </Button>
                  <Button disabled={busy} variant="outline" onClick={() => void answer(false)}>
                    <X /> Incorrect
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {noRepeat && drawn.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-muted-foreground">Already drawn:</span>
          {drawn.map((id) => (
            <span key={id} className="rounded-full bg-muted px-2 py-0.5 font-semibold">
              {list.find((s) => s.id === id)?.name ?? "?"}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function QuickPoints({ list }: { list: Student[] }) {
  const { refresh } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState<MarkReason>("classwork");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = q
    ? list.filter((s) =>
        `${s.name} ${s.className ?? ""}${s.classNo ?? ""} ${s.hlcNo ?? ""}`
          .toLowerCase()
          .includes(q),
      )
    : list;

  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const chooseAmount = (n: number) => {
    const value = Number.isFinite(n) ? Math.max(-100, Math.min(100, Math.trunc(n))) : 0;
    setAmount(value);
    if (value < 0) setReason("deduction");
    else if (reason === "deduction") setReason("classwork");
  };

  const chooseReason = (r: MarkReason) => {
    setReason(r);
    if (r === "deduction" && amount > 0) setAmount(-amount);
    if (r !== "deduction" && amount < 0) setAmount(-amount);
  };

  const undo = async (ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    }
  };

  const save = async () => {
    if (amount === 0) {
      toast.error("Choose an amount other than 0");
      return;
    }
    setBusy(true);
    try {
      const count = selected.length;
      const ids = await giveCoins({ studentIds: selected, marks: amount, reason, note });
      await refresh();
      setSelected([]);
      setNote("");
      toast.success(
        `${amount > 0 ? "+" : ""}${amount} ${COIN_NAME} saved for ${count} student${count === 1 ? "" : "s"}`,
        { action: { label: "Undo", onClick: () => void undo(ids) } },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="mr-auto text-xl font-bold">
          {COIN_EMOJI} Quick {COIN_NAME} · tick and save
        </h2>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-input px-3 py-1.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search students"
            className="w-32 bg-transparent text-sm font-semibold outline-none"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelected([...new Set([...selected, ...shown.map((s) => s.id)])])}
        >
          Select all
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelected([])}
          disabled={!selected.length}
        >
          Clear
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No students in this set yet.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s) => {
            const on = selected.includes(s.id);
            return (
              <label
                key={s.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition",
                  on ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                  className="h-5 w-5 shrink-0 accent-[var(--primary)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {s.className} {s.classNo}
                  </span>
                </span>
                <span className="text-sm font-extrabold tabular-nums">
                  {COIN_EMOJI} {coinBalance(s)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-3 mt-4 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-border bg-card p-3 shadow-lg">
        <div>
          <p className="mb-1 text-xs font-bold text-muted-foreground">Amount</p>
          <div className="flex flex-wrap items-center gap-1">
            {QUICK_AMOUNTS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => chooseAmount(n)}
                className={cn(
                  "min-w-10 rounded-lg px-2 py-1.5 text-sm font-extrabold",
                  amount === n
                    ? n < 0
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-success text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {n > 0 ? `+${n}` : n}
              </button>
            ))}
            <input
              type="number"
              min={-100}
              max={100}
              value={amount}
              aria-label="Custom amount"
              onChange={(e) => chooseAmount(Number(e.target.value))}
              className="w-16 rounded-lg border border-input bg-card px-2 py-1.5 text-sm font-bold"
            />
          </div>
        </div>
        <label className="text-xs font-bold text-muted-foreground">
          Reason
          <select
            value={reason}
            onChange={(e) => chooseReason(e.target.value as MarkReason)}
            className="mt-1 block rounded-lg border border-input bg-card p-2 text-sm font-semibold text-foreground"
          >
            {QUICK_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} · {r.zh}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-40 flex-1 text-xs font-bold text-muted-foreground">
          Note (optional)
          <input
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Ex 5B Q1–6"
            className="mt-1 block w-full rounded-lg border border-input bg-card p-2 text-sm font-semibold text-foreground"
          />
        </label>
        <Button
          disabled={busy || !selected.length || amount === 0}
          onClick={() => void save()}
          className={cn(
            "h-10",
            amount < 0 && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          )}
        >
          {busy
            ? "Saving…"
            : `Give ${amount > 0 ? "+" : ""}${amount} to ${selected.length} student${selected.length === 1 ? "" : "s"}`}
        </Button>
      </div>
    </section>
  );
}

interface LogGroup {
  key: string;
  ids: string[];
  studentIds: string[];
  marks: number;
  reason: string;
  note: string;
  at: string;
}

function RecentActivity() {
  const { markLog, students, refresh } = useApp();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const names = useMemo(() => new Map(students.map((s) => [s.id, s.name])), [students]);
  const groups = useMemo(() => {
    const out: LogGroup[] = [];
    const index = new Map<string, number>();
    for (const m of markLog) {
      const key = m.batch_id ?? m.id;
      const at = index.get(key);
      const group = at === undefined ? undefined : out[at];
      if (group) {
        group.ids.push(m.id);
        group.studentIds.push(m.student_id);
      } else {
        index.set(key, out.length);
        out.push({
          key,
          ids: [m.id],
          studentIds: [m.student_id],
          marks: m.marks,
          reason: m.reason,
          note: m.note ?? "",
          at: m.created_at,
        });
      }
    }
    return out.slice(0, 12);
  }, [markLog]);

  const undo = async (g: LogGroup) => {
    const who = g.studentIds.map((id) => names.get(id) ?? "?").join(", ");
    if (
      !window.confirm(
        `Undo ${g.marks > 0 ? "+" : ""}${g.marks} (${reasonLabel(g.reason)}) for ${who}?`,
      )
    )
      return;
    setBusyKey(g.key);
    try {
      await deleteMarks(g.ids);
      await refresh();
      toast.success("Undone");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not undo");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky">
      <h2 className="text-xl font-bold">Recent activity</h2>
      {groups.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No {COIN_NAME} given yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {groups.map((g) => {
            const who = g.studentIds.map((id) => names.get(id) ?? "?");
            return (
              <li key={g.key} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {new Date(g.at).toLocaleString("en-HK", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={cn(
                    "w-12 rounded-md text-center font-extrabold",
                    g.marks > 0
                      ? "bg-success/15 text-success"
                      : g.marks < 0
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {g.marks > 0 ? `+${g.marks}` : g.marks}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold">{reasonLabel(g.reason)}</span>
                  {g.note && <span className="text-muted-foreground"> · {g.note}</span>}
                  <span className="block truncate text-xs text-muted-foreground">
                    {who.slice(0, 5).join(", ")}
                    {who.length > 5 ? ` +${who.length - 5} more` : ""}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyKey === g.key}
                  onClick={() => void undo(g)}
                >
                  <Undo2 /> Undo
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
