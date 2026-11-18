import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader } from "@/components/PageParts";
import { BadgeIcon } from "@/components/game/BadgeIcon";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import {
  TIER_NAMES,
  badgeProgress,
  tierFor,
  type BadgeDef,
  type BadgeProgress,
} from "@/lib/gamification/badges";
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
  const { role, me, selfChecks, videos, badgeDefs } = useApp();
  const progress = useStudentProgress(role === "student" ? me.id : "");

  if (role !== "student") return <TeacherBadges />;

  const quizzes =
    me.game?.quizHistory ??
    markMostImproved(me.id, quizResultsFromAssessments(me.assessments ?? [])).quizzes;
  const data = progress.data;
  const videosByChapter = new Map<number, number>();
  for (const video of videos) {
    videosByChapter.set(video.chapter, (videosByChapter.get(video.chapter) ?? 0) + 1);
  }
  const watchedByChapter = new Map<number, number>();
  for (const id of me.completedVideos ?? []) {
    const video = videos.find((item) => item.id === id);
    if (!video) continue;
    watchedByChapter.set(video.chapter, (watchedByChapter.get(video.chapter) ?? 0) + 1);
  }
  const badges = withSavedCounts(
    badgeProgress(
      {
        quizzes,
        bestHomeworkStreak: me.game?.bestHomeworkStreak ?? 0,
        selfChecks,
        luckyDrawCorrect: data?.luckyDrawCorrect ?? 0,
        masteredMistakes: (data?.mistakes ?? []).filter((m) => m.status === "mastered").length,
        bestCheckinStreak: checkinStreak(
          (data?.checkins ?? []).map((c) => c.date),
          hkDateKey(),
        ).best,
        videosByChapter,
        watchedByChapter,
        cqStandings: (me.game?.standings ?? []).map((s) => ({
          kind: s.kind,
          provisional: s.provisional,
          rank: s.rank,
          rankedCount: 0,
          status: s.display === "ABS" ? "absent" : "ranked",
        })),
      },
      badgeDefs.filter((def) => def.published !== false),
    ),
    me.game?.badgeValues,
  );
  const unlocked = badges.filter((b) => b.tier > 0).length;
  const diamonds = badges.filter((b) => b.tier === 4).length;

  return (
    <AppShell>
      <PageHeader
        title="Badges"
        description="Level each badge from Bronze to Diamond. A higher tier replaces the one below it."
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
        . Chapter Complete needs every part of that chapter's progress bar at 100%. Leaderboard day
        badges update when your teacher publishes.
      </p>
    </AppShell>
  );
}

function withSavedCounts(
  progress: BadgeProgress[],
  saved: Record<string, number> | undefined,
): BadgeProgress[] {
  if (!saved) return progress;
  return progress.map((b) => {
    const special = b.def.id === "cq-bottom3" || b.def.id.startsWith("board-");
    const value = special ? saved[b.def.id] : undefined;
    if (value === undefined) return b;
    const tier = tierFor(value, b.def.thresholds);
    const next = tier >= 4 ? null : (b.def.thresholds.at(tier) ?? null);
    const prev = tier <= 0 ? 0 : (b.def.thresholds.at(tier - 1) ?? 0);
    const ratio = next === null ? 1 : Math.min(1, Math.max(0, (value - prev) / (next - prev)));
    return { ...b, value, tier, next, progress: ratio };
  });
}

const badgeField =
  "w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary";

function TeacherBadges() {
  const { badgeDefs, classProfiles, students, refresh } = useApp();
  const [edits, setEdits] = useState<Record<string, BadgeDef>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const rows = badgeDefs.map((def) => edits[def.id] ?? def);

  const save = async (def: BadgeDef) => {
    const [bronze, silver, gold, diamond] = def.thresholds;
    if (
      bronze === undefined ||
      silver === undefined ||
      gold === undefined ||
      diamond === undefined ||
      !(bronze < silver && silver < gold && gold < diamond)
    ) {
      toast.error("Each level must be a higher number than the one before it");
      return;
    }
    if (!def.name.trim()) {
      toast.error("Give the badge a name");
      return;
    }
    setBusyId(def.id);
    try {
      const { error } = await supabase
        .from("badge_defs")
        .update({
          name: def.name.trim(),
          emoji: def.emoji.trim() || "🏅",
          description: def.description.trim(),
          unit: def.unit.trim() || "times",
          bronze,
          silver,
          gold,
          diamond,
          published: def.published !== false,
        })
        .eq("id", def.id);
      if (error) throw new Error(error.message);
      await refresh();
      setEdits(({ [def.id]: _saved, ...rest }) => rest);
      toast.success(`${def.name.trim()} saved`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save this badge";
      toast.error(
        message.includes("badge_defs") || message.includes("schema")
          ? "Run supabase/sql/0015_looks_badges.sql in the Supabase SQL Editor, then save again."
          : message,
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Badges"
        description="Change how many times a student needs for each level. Untick Published to hide a badge. The list shows who has it now."
      />
      <div className="mt-6">
        <Notice tone="info">
          Leaderboard day badges count one day each time you publish, for 1st, top 3 and top 10 on
          the set EXP leaderboard. Chapter Complete is 100% of a chapter. There are 7 chapters, so
          Diamond 12 stays out of reach until you lower that number.
        </Notice>
      </div>
      <ul className="mt-6 space-y-4">
        {rows.map((def) => {
          const dirty = edits[def.id] !== undefined;
          const holders = [...(classProfiles ?? new Map()).entries()].flatMap(([id, profile]) => {
            const value = profile.badgeValues?.[def.id] ?? 0;
            const tier = tierFor(value, def.thresholds);
            if (tier < 1) return [];
            const student = students.find((s) => s.id === id);
            if (!student) return [];
            return [{ student, value, tier }];
          });
          holders.sort((a, b) => b.tier - a.tier || a.student.name.localeCompare(b.student.name));
          return (
            <li key={def.id} className="rounded-xl border-2 border-border bg-card p-4">
              <div className="grid gap-2 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-center">
                <input
                  aria-label="Icon"
                  value={def.emoji}
                  onChange={(e) =>
                    setEdits((current) => ({
                      ...current,
                      [def.id]: { ...def, emoji: e.target.value },
                    }))
                  }
                  className={cn(badgeField, "text-center text-lg")}
                />
                <input
                  aria-label="Name"
                  value={def.name}
                  onChange={(e) =>
                    setEdits((current) => ({
                      ...current,
                      [def.id]: { ...def, name: e.target.value },
                    }))
                  }
                  className={badgeField}
                />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={def.published !== false}
                    onChange={(e) =>
                      setEdits((current) => ({
                        ...current,
                        [def.id]: { ...def, published: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  Published
                </label>
              </div>
              <input
                aria-label="Description"
                value={def.description}
                onChange={(e) =>
                  setEdits((current) => ({
                    ...current,
                    [def.id]: { ...def, description: e.target.value },
                  }))
                }
                className={cn(badgeField, "mt-2")}
              />
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["Bronze", "Silver", "Gold", "Diamond"] as const).map((label, index) => (
                  <label key={label} className="text-xs font-semibold">
                    {label}
                    <input
                      aria-label={label}
                      type="number"
                      min={1}
                      max={999}
                      value={def.thresholds[index] ?? ""}
                      onChange={(e) => {
                        const next = [...def.thresholds] as [number, number, number, number];
                        next[index] = Number(e.target.value);
                        setEdits((current) => ({
                          ...current,
                          [def.id]: { ...def, thresholds: next },
                        }));
                      }}
                      className={cn(badgeField, "mt-1")}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  disabled={!dirty || busyId === def.id}
                  onClick={() => void save(def)}
                >
                  <Save /> Save
                </Button>
                <span className="text-xs text-muted-foreground">{def.unit}</span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold">
                  {holders.length} student{holders.length === 1 ? "" : "s"}
                </p>
                {holders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nobody has this badge yet.</p>
                ) : (
                  <ul className="mt-1 divide-y divide-border text-sm">
                    {holders.map(({ student, tier, value }) => (
                      <li key={student.id} className="flex items-center gap-2 py-1">
                        <BadgeIcon emoji={def.emoji} tier={tier} size={22} />
                        <span className="font-semibold">{student.name}</span>
                        <span className="text-muted-foreground">
                          {student.className} {student.classNo}
                        </span>
                        <span className="ml-auto font-bold">
                          {TIER_NAMES[tier]} · {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
