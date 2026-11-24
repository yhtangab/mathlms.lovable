import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AssessmentReport } from "@/components/AssessmentReport";
import { Notice, PageHeader, Panel, StatCard } from "@/components/PageParts";
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap";
import { AvatarBadge, TitleTags } from "@/components/game/AvatarBadge";
import { ClassBoxPlot } from "@/components/game/ClassBoxPlot";
import { CompetencyRadar } from "@/components/game/CompetencyRadar";
import { QuizTrajectory } from "@/components/game/QuizTrajectory";
import { ScoreComposition } from "@/components/game/ScoreComposition";
import { useApp } from "@/lib/app-store";
import { COIN_NAME, reasonLabel } from "@/lib/coins";
import {
  TERM_WEIGHTS,
  displayCoins,
  markMostImproved,
  quizResultsFromAssessments,
  termResult,
} from "@/lib/gamification/rules";
import { CHAPTERS } from "@/lib/data";
import { CHAPTER_STRANDS, STRANDS } from "@/lib/gamification/catalog";
import type { Strand } from "@/lib/gamification/types";
import { boardId } from "@/lib/gamification/world";
import {
  DUE_LABEL,
  DUE_TONE,
  dueStatus,
  formatDue,
  homeworkForSet,
  splitByDue,
} from "@/lib/homework";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard — HLC Math" },
      { name: "description", content: "Your scores, charts, ranks and homework." },
      { property: "og:title", content: "Dashboard — HLC Math" },
      { property: "og:description", content: "Scores, charts, ranks and homework." },
    ],
  }),
  component: Dashboard,
});

const COLLAPSED_ROWS = 3;
const EXP_PER_LEVEL = 1000;

const PAGE_SECTIONS = [
  { id: "homework", label: "Homework" },
  { id: "scores", label: "Scores" },
  { id: "charts", label: "Charts" },
] as const;

type PageSection = (typeof PAGE_SECTIONS)[number]["id"];

function Dashboard() {
  const { me, homework, markLog, gameSnapshot, gameError, gamePublishedAt, cosmeticsOf } = useApp();
  const assessments = me.assessments ?? [];
  const game = me.game;
  const hasTerm2 = assessments.some(
    (a) =>
      a.term === 2 && (a.score !== null || a.absent) && !(a.kind === "summary" && a.score === 0),
  );
  const [term, setTerm] = useState<1 | 2>(hasTerm2 ? 2 : 1);
  const [section, setSection] = useState<PageSection>("homework");
  const [homeworkOpen, setHomeworkOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);

  const jumpTo = (id: PageSection) => {
    setSection(id);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  // Worked out from the student's own marks, so it shows even before anything is published.
  const result = termResult(assessments, term);
  const totalStanding = gameSnapshot?.boards.find(
    (b) => b.boardId === boardId(me.set, "total", term),
  );
  const caStanding = gameSnapshot?.boards.find((b) => b.boardId === boardId(me.set, "ca", term));
  const headline = result.total !== null ? totalStanding : caStanding;
  const parts = [
    { label: `${term === 1 ? "1st" : "2nd"} Term Test`, weight: TERM_WEIGHTS.tt, value: result.tt },
    { label: `Continuous Assessment (T${term}A2)`, weight: TERM_WEIGHTS.ca, value: result.ca },
    { label: `Exam (T${term}A3)`, weight: TERM_WEIGHTS.exam, value: result.exam },
  ];

  // Without published data the trajectory is still drawn from the student's own marks.
  const quizzes =
    game?.quizHistory ?? markMostImproved(me.id, quizResultsFromAssessments(assessments)).quizzes;
  const distributions = gameSnapshot?.distributions ?? [];
  const termDistributions = distributions.filter((d) => d.term === term);

  const { upcoming } = splitByDue(homeworkForSet(homework, me.set));
  const coins = markLog.filter((m) => m.student_id === me.id);
  const rewards = [...(game?.rewards ?? [])].sort((a, b) => b.awardedAt.localeCompare(a.awardedAt));
  const shownHomework = homeworkOpen ? upcoming : upcoming.slice(0, COLLAPSED_ROWS);
  const rewardCount = rewards.length + coins.length;
  const shownRewardCount = rewardsOpen ? rewardCount : Math.min(COLLAPSED_ROWS, rewardCount);
  const shownRewards = rewards.slice(0, shownRewardCount);
  const shownCoins = coins.slice(0, Math.max(0, shownRewardCount - shownRewards.length));
  const exp = game?.exp ?? me.xp;
  const level = game?.level ?? Math.floor(exp / EXP_PER_LEVEL) + 1;
  const firstName = me.name.split(" ")[0] ?? me.name;
  const cosmetics = cosmeticsOf(me.id);
  const classText = me.className
    ? `, class ${me.className}${me.classNo ? ` (${me.classNo})` : ""}`
    : "";

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={`${me.set} Mathematics${classText}`}
        actions={
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3"
          >
            <AvatarBadge
              avatarId={cosmetics.avatarId}
              frameId={cosmetics.equippedFrameId}
              size="sm"
            />
            <span className="text-sm font-bold">Edit profile</span>
          </Link>
        }
      />

      {gameError ? (
        <div className="mt-4">
          <Notice tone="info">Ranks and class charts are not available yet.</Notice>
        </div>
      ) : !gameSnapshot ? (
        <div className="mt-4">
          <Notice tone="info">
            Ranks and class charts appear after your teacher next publishes the marks.
          </Notice>
        </div>
      ) : null}

      <nav
        aria-label="On this page"
        className="sticky top-[6.5rem] z-20 mt-6 flex flex-wrap gap-1 rounded-lg bg-background/95 p-1 md:top-0 md:bg-muted"
      >
        {PAGE_SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => jumpTo(item.id)}
            aria-current={section === item.id ? "true" : undefined}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-bold sm:flex-none",
              section === item.id ? "bg-card text-foreground shadow" : "text-muted-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section id="homework" className="mt-6 scroll-mt-40 md:scroll-mt-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel
            tone="flame"
            title="Homework"
            description={
              upcoming.length === 0
                ? "Nothing due"
                : `${upcoming.length} upcoming deadline${upcoming.length === 1 ? "" : "s"}`
            }
            actions={
              <span className="flex items-center gap-3">
                {upcoming.length > COLLAPSED_ROWS ? (
                  <button
                    type="button"
                    onClick={() => setHomeworkOpen((open) => !open)}
                    aria-expanded={homeworkOpen}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    {homeworkOpen ? "Show less" : "More"}
                  </button>
                ) : null}
                <Link to="/homework" className="text-sm font-bold text-primary hover:underline">
                  View all
                </Link>
              </span>
            }
            bodyClassName="px-4 py-0.5"
          >
            {upcoming.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">No homework is due.</p>
            ) : (
              <ul className="divide-y divide-border">
                {shownHomework.map((h) => {
                  const st = dueStatus(h.due_at);
                  return (
                    <li key={h.id} className="flex items-center gap-2 py-1.5">
                      <CalendarClock
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold leading-tight">{h.title}</p>
                        <p className="text-xs leading-tight text-muted-foreground">
                          Due {formatDue(h.due_at)}
                          {h.chapter === null ? "" : `, Chapter ${h.chapter}`}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                          DUE_TONE[st],
                        )}
                      >
                        {DUE_LABEL[st]}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            tone="gold"
            title="Recent rewards"
            actions={
              rewardCount > COLLAPSED_ROWS ? (
                <button
                  type="button"
                  onClick={() => setRewardsOpen((open) => !open)}
                  aria-expanded={rewardsOpen}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  {rewardsOpen ? "Show less" : "More"}
                </button>
              ) : null
            }
            bodyClassName="px-4 py-0.5"
          >
            {rewardCount === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">No rewards yet.</p>
            ) : (
              <ul className="text-sm">
                {shownRewards.map((r) => (
                  <li
                    key={r.sourceKey}
                    className="flex items-baseline gap-2 border-b border-border py-1 last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {r.description}
                      {r.multiplier > 1 ? (
                        <span className="font-bold text-flame-deep"> 2x</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-bold tabular-nums text-success-deep">
                      +{r.mc} MC
                    </span>
                    <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-grape-deep">
                      +{r.exp} EXP
                    </span>
                  </li>
                ))}
                {shownCoins.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-baseline gap-2 border-b border-border py-1 last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {reasonLabel(m.reason)}
                      {m.note ? <span className="text-muted-foreground">, {m.note}</span> : null}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-bold tabular-nums",
                        m.marks > 0
                          ? "text-success-deep"
                          : m.marks < 0
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    >
                      {m.marks > 0 ? `+${m.marks}` : m.marks}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      <section id="scores" className="mt-8 scroll-mt-40 md:scroll-mt-16">
        <section
          aria-label="Term score"
          className="rounded-xl border-2 border-border bg-card p-4 shadow-chunky md:p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-muted p-1" role="group" aria-label="Choose a term">
              {([1, 2] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTerm(t)}
                  aria-pressed={term === t}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-bold",
                    term === t ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  Term {t}
                </button>
              ))}
            </div>
            <TitleTags
              titles={[cosmetics.equippedTitle, cosmetics.equippedTitle2]}
              className="ml-auto"
            />
          </div>
          <div className="mt-4 grid items-stretch gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-muted-foreground">
                Term {term} academic score
              </p>
              <p className="mt-1 font-display text-5xl font-extrabold tabular-nums">
                {result.total ?? "—"}
                <span className="text-xl font-semibold text-muted-foreground"> / 200</span>
              </p>
              <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                20% Term Test + 40% Continuous Assessment + 40% Exam
                {result.total === null ? ". Shown once all three have a mark." : "."}
              </p>
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-2">
              {headline ? (
                <Link
                  to="/leaderboard"
                  className={cn(
                    "flex h-full flex-col justify-center rounded-xl px-4 py-4",
                    headline.isTop10 ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="text-sm font-semibold">
                    {result.total !== null ? "Academic score" : "Continuous Assessment"} rank in{" "}
                    {me.set}
                  </p>
                  <p className="text-3xl font-bold">{headline.display}</p>
                  {headline.gapToTop10 !== null ? (
                    <p className="mt-2 flex items-start gap-1.5 text-sm font-semibold">
                      <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {headline.gapToTop10} more marks to reach the top 10.
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm font-bold underline">Open the leaderboard</p>
                </Link>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Your rank appears once marks are published.
                  </p>
                  <Link
                    to="/leaderboard"
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Open the leaderboard
                  </Link>
                </>
              )}
            </div>
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {parts.map((p) => (
              <li key={p.label} className="rounded-lg bg-muted/60 px-3 py-3">
                <p className="text-sm font-semibold leading-snug text-muted-foreground">
                  {p.label} ({Math.round(p.weight * 100)}%)
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {p.value ?? "—"}
                  <span className="text-xs font-semibold text-muted-foreground"> / 200</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Summary" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            appearance="soft"
            tone="grape"
            label={`Level ${level}`}
            value={String(exp)}
            suffix="EXP"
            note={
              <span className="mt-1 block h-2 overflow-hidden rounded-full bg-grape/20">
                <span
                  className="block h-full rounded-full bg-grape"
                  style={{ width: `${((exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100}%` }}
                />
              </span>
            }
          />
          <StatCard
            appearance="soft"
            tone="flame"
            label="Homework streak 🔥"
            value={String(game?.homeworkStreak ?? 0)}
            suffix="in a row"
            note={game ? `${game.missingHomeworkCount} missing so far` : null}
          />
          <StatCard
            appearance="soft"
            tone="green"
            label="Times answered in class"
            value={String(game?.activeVoiceCount ?? 0)}
          />
          <Link to="/shop" className="block rounded-xl transition-transform hover:-translate-y-0.5">
            <StatCard
              tone="gold"
              label={COIN_NAME}
              value={String(displayCoins(me))}
              note="Open the Shop"
            />
          </Link>
        </section>

        <div className="mt-6">
          <Panel tone="blue" title={`Term ${term} score breakdown`}>
            <ScoreComposition assessments={assessments} term={term} />
          </Panel>
        </div>

        <div className="mt-8">
          <AssessmentReport assessments={assessments} />
        </div>
      </section>

      <section id="charts" className="mt-8 scroll-mt-40 space-y-8 md:scroll-mt-16">
        <Panel
          heading="lg"
          tone="grape"
          title="Maths strengths"
          description={`You against the ${me.set} average`}
        >
          {gameSnapshot ? (
            <>
              <CompetencyRadar axes={gameSnapshot.radar} />
              <StrandChapters />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Appears after your teacher publishes the marks.
            </p>
          )}
        </Panel>

        <Panel
          heading="lg"
          tone="green"
          title="Quiz journey"
          description="Short quizzes and chapter quizzes, oldest first"
        >
          <QuizTrajectory
            quizzes={quizzes}
            distributions={distributions}
            standings={game?.standings ?? []}
          />
        </Panel>

        <Panel heading="lg" tone="sky" title={`Where you stand in ${me.set}, Term ${term}`}>
          {gameSnapshot ? (
            <ClassBoxPlot distributions={termDistributions} set={me.set} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Appears after your teacher publishes the marks.
            </p>
          )}
        </Panel>

        <Panel
          heading="lg"
          tone="green"
          title="Your activity"
          description="Lesson marks, homework on time and videos, last 6 months"
        >
          <ActivityHeatmap studentId={me.id} />
        </Panel>
      </section>

      {gamePublishedAt ? (
        <p className="mt-8 text-xs text-muted-foreground">
          Ranks and class charts last updated{" "}
          {new Date(gamePublishedAt).toLocaleString("en-HK", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          .
        </p>
      ) : null}
    </AppShell>
  );
}

function StrandChapters() {
  const [open, setOpen] = useState<Strand | null>(null);
  return (
    <ul className="mt-3 space-y-1">
      {STRANDS.filter((s) => s.id !== "attitude").map((strand) => {
        const chapters = CHAPTERS.filter((c) => CHAPTER_STRANDS[c.id] === strand.id);
        const shown = open === strand.id;
        return (
          <li key={strand.id}>
            <button
              type="button"
              aria-expanded={shown}
              onClick={() => setOpen(shown ? null : strand.id)}
              className="flex w-full items-baseline gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-muted"
            >
              {strand.label}
              <span className="text-xs font-normal text-muted-foreground">
                {chapters.length === 0 ? "No S2 chapter yet" : `${chapters.length} chapters`}
              </span>
            </button>
            {shown && chapters.length > 0 ? (
              <ul className="mt-1 space-y-1 pl-3">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/courses/$chapter"
                      params={{ chapter: String(c.id) }}
                      className="block py-1 text-sm hover:underline"
                    >
                      Chapter {c.id}: {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
