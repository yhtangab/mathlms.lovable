import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-store";
import { sortByClass, type MathSet, type Student } from "@/lib/data";
import { cn } from "@/lib/utils";

const SETS: MathSet[] = ["S2M3", "S2M5"];

/** The bars shown above every signed-in page. */
export function GlobalBars() {
  return (
    <>
      <TeacherPreviewBar />
      <DoubleMcBanner />
    </>
  );
}

function optionLabel(s: Student): string {
  const cls = [s.className, s.classNo].filter(Boolean).join(" ");
  return cls ? `${s.name} (${cls})` : s.name;
}

/** Lets a teacher see the site exactly as one student sees it, without saving anything. */
export function TeacherPreviewBar() {
  const {
    actualRole,
    isPreview,
    previewSource,
    me,
    students,
    mockStudents,
    startPreview,
    exitPreview,
  } = useApp();
  const navigate = useNavigate();

  const groups = useMemo(
    () =>
      [
        ...SETS.map((set) => ({
          label: `${set} class list`,
          list: sortByClass(students.filter((s) => s.set === set)),
        })),
        ...SETS.map((set) => ({
          label: `${set} sandbox (sample data)`,
          list: sortByClass(mockStudents.filter((s) => s.set === set)),
        })),
      ].filter((g) => g.list.length > 0),
    [students, mockStudents],
  );

  if (actualRole !== "teacher") return null;

  const choose = (id: string) => {
    if (!id) return;
    startPreview(id);
    void navigate({ to: "/dashboard" });
  };

  const exit = () => {
    exitPreview();
    void navigate({ to: "/teacher" });
  };

  return (
    <div
      role="region"
      aria-label="Student preview"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 px-4 py-2 text-sm md:px-8",
        isPreview
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground",
      )}
    >
      <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="mr-auto min-w-0 font-semibold">
        {isPreview
          ? `Previewing as ${me.name}, ${me.set}${previewSource === "mock" ? " sandbox" : ""}. Read-only: nothing is saved.`
          : "Preview student version"}
      </p>
      <select
        aria-label="Choose a student to preview"
        value={isPreview ? me.id : ""}
        onChange={(e) => choose(e.target.value)}
        className="max-w-full rounded-md border border-input bg-card px-2 py-1.5 text-sm font-medium text-foreground"
      >
        <option value="">Choose a student…</option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.list.map((s) => (
              <option key={s.id} value={s.id}>
                {optionLabel(s)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <DoubleMcSwitch />
      {isPreview ? (
        <Button size="sm" variant="secondary" onClick={exit}>
          <X /> Exit preview
        </Button>
      ) : null}
      {isPreview ? <PreviewStats student={me} /> : null}
    </div>
  );
}

/** The game figures worked out for the previewed student, so the teacher can check the rules. */
function PreviewStats({ student }: { student: Student }) {
  const game = student.game;
  if (!game) return null;
  const latest = [...game.standings].reverse().find((s) => s.display !== "—");
  const stats: { label: string; value: string }[] = [
    { label: "Math Coins", value: String(game.mathCoins) },
    {
      label: "From rewards",
      value: game.rewardsSpendable
        ? String(game.rewardCoins)
        : `${game.rewardCoins} (not saved yet)`,
    },
    { label: "EXP", value: `${game.exp}, Level ${game.level}` },
    { label: "T1 total", value: game.t1Total === null ? "—" : `${game.t1Total} / 200` },
    { label: "T2 total", value: game.t2Total === null ? "—" : `${game.t2Total} / 200` },
    { label: "Homework streak", value: String(game.homeworkStreak) },
    { label: "Missing homework", value: String(game.missingHomeworkCount) },
    { label: "Times answered", value: String(game.activeVoiceCount) },
  ];
  if (latest) {
    stats.push({
      label: `Latest quiz ${latest.label}`,
      value:
        latest.marksToTop10 === null
          ? latest.display
          : `${latest.display}, ${latest.marksToTop10} more marks for 10th`,
    });
  }
  return (
    <dl className="flex w-full flex-wrap gap-1.5 text-xs">
      {stats.map((s) => (
        <div key={s.label} className="rounded-md bg-primary-foreground/15 px-2 py-0.5">
          <dt className="inline">{s.label}: </dt>
          <dd className="inline font-bold tabular-nums">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Teacher switch for the 2x Math Coins event. */
function DoubleMcSwitch() {
  const { systemConfig, configError, setDoubleMcEvent } = useApp();
  const [busy, setBusy] = useState(false);
  const on = systemConfig.isDoubleMCEventActive;

  const toggle = async (next: boolean) => {
    const question = next
      ? "Turn on the 2x Math Coins event? Every student will see the banner, and quiz, most improved and homework streak rewards given while it is on are doubled."
      : "Turn off the 2x Math Coins event? Rewards already given keep their double coins.";
    if (!window.confirm(question)) return;
    setBusy(true);
    try {
      await setDoubleMcEvent(next);
      toast.success(next ? "2x Math Coins event is on" : "2x Math Coins event is off");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not change the 2x Math Coins event");
    } finally {
      setBusy(false);
    }
  };

  if (configError) {
    return (
      <p className="text-xs font-semibold text-destructive" title={configError}>
        2x event: run 0009_system_config.sql first
      </p>
    );
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 font-semibold">
      <Switch
        checked={on}
        disabled={busy}
        className="data-[state=checked]:bg-gold"
        onCheckedChange={(next) => void toggle(next)}
        aria-label="2x Math Coins event"
      />
      2x Math Coins event
    </label>
  );
}

/** Shown to everyone while the 2x Math Coins event is on. */
export function DoubleMcBanner() {
  const { systemConfig } = useApp();
  if (!systemConfig.isDoubleMCEventActive) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 border-b-2 border-gold-deep bg-gold px-4 py-2.5 text-center text-sm font-bold text-accent-foreground md:text-base"
    >
      <span aria-hidden="true" className="motion-safe:animate-pulse">
        🔥
      </span>
      <span>
        2x MathCoins Exam Revision Event is LIVE! All quiz &amp; practice rewards are DOUBLED!
      </span>
    </div>
  );
}
