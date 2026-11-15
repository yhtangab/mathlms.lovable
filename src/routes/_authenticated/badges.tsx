import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader } from "@/components/PageParts";
import { BadgeIcon } from "@/components/game/BadgeIcon";
import { useApp } from "@/lib/app-store";
import { TIER_NAMES, badgeProgress } from "@/lib/gamification/badges";
import { checkinStreak, hkDateKey } from "@/lib/gamification/checkin";
import { markMostImproved, quizResultsFromAssessments } from "@/lib/gamification/rules";
import { useStudentProgress } from "@/lib/gamification/student-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/badges")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Badges — HLC Math" },
      {
        name: "description",
        content: "Achievement badges with Bronze, Silver, Gold and Diamond tiers.",
      },
      { property: "og:title", content: "Badges — HLC Math" },
      { property: "og:description", content: "Achievement badges and progress." },
    ],
  }),
  component: BadgesPage,
});

const TIER_TEXT = [
  "text-muted-foreground",
  "text-flame-deep",
  "text-muted-foreground",
  "text-gold-deep",
  "text-sky-deep",
];

function BadgesPage() {
  const { role, me, selfChecks } = useApp();
  const progress = useStudentProgress(role === "student" ? me.id : "");

  if (role !== "student") {
    return (
      <AppShell>
        <PageHeader title="Badges" />
        <div className="mt-6">
          <Notice tone="info">
            Badges belong to students. Use Preview student version to see a student's badges.
          </Notice>
        </div>
      </AppShell>
    );
  }

  const quizzes =
    me.game?.quizHistory ??
    markMostImproved(me.id, quizResultsFromAssessments(me.assessments ?? [])).quizzes;
  const data = progress.data;
  const badges = badgeProgress({
    quizzes,
    bestHomeworkStreak: me.game?.bestHomeworkStreak ?? 0,
    selfChecks,
    luckyDrawCorrect: data?.luckyDrawCorrect ?? 0,
    masteredMistakes: (data?.mistakes ?? []).filter((m) => m.status === "mastered").length,
    bestCheckinStreak: checkinStreak(
      (data?.checkins ?? []).map((c) => c.date),
      hkDateKey(),
    ).best,
  });
  const unlocked = badges.filter((b) => b.tier > 0).length;
  const diamonds = badges.filter((b) => b.tier === 4).length;

  return (
    <AppShell>
      <PageHeader
        title="Badges"
        description="Collect all seven and level each one up from Bronze to Diamond."
        actions={
          <div className="flex gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              {unlocked} / {badges.length} unlocked
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
              💎 {diamonds}
            </span>
          </div>
        }
      />
      {progress.isError ? (
        <div className="mt-4">
          <Notice tone="info">
            Some badge progress could not be loaded: {progress.error.message}
          </Notice>
        </div>
      ) : null}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((b) => (
          <li
            key={b.def.id}
            className={cn(
              "flex flex-col items-center rounded-xl border-2 bg-card p-5 text-center shadow-chunky",
              b.tier === 4 ? "border-sky" : "border-border",
            )}
          >
            <BadgeIcon emoji={b.def.emoji} tier={b.tier} />
            <h2 className="mt-3 text-lg font-bold">{b.def.name}</h2>
            <p className={cn("text-sm font-bold", TIER_TEXT[b.tier])}>
              {b.tier === 0 ? "Not unlocked yet" : `${TIER_NAMES[b.tier]} tier`}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{b.def.description}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs font-bold">
                <span className="tabular-nums">
                  {b.value} {b.def.unit}
                </span>
                <span className="text-muted-foreground">
                  {b.next === null
                    ? "Max tier!"
                    : `Next: ${b.next} for ${TIER_NAMES[b.tier + 1] ?? ""}`}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(b.progress * 100)}%` }}
                />
              </div>
              <ol className="mt-3 flex justify-between gap-1 text-[10px] font-bold">
                {b.def.thresholds.map((t, i) => (
                  <li
                    key={t}
                    className={cn(
                      "flex-1 rounded-full px-1 py-0.5",
                      b.tier > i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {TIER_NAMES[i + 1]} {t}
                  </li>
                ))}
              </ol>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-muted-foreground">
        Mistake Conqueror and Daily Streak Master grow in the{" "}
        <Link to="/mistake-vault" className="font-bold text-primary underline">
          Mistake Vault
        </Link>
        . Topic Master needs the chapter self-check and the chapter quiz.
      </p>
    </AppShell>
  );
}
