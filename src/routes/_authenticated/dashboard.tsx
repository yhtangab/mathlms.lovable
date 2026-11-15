import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AssessmentReport } from "@/components/AssessmentReport";
import { Notice, PageHeader, Panel, StatCard } from "@/components/PageParts";
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap";
import { AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
import { ClassBoxPlot } from "@/components/game/ClassBoxPlot";
import { CompetencyRadar } from "@/components/game/CompetencyRadar";
import { QuizTrajectory } from "@/components/game/QuizTrajectory";
import { ScoreComposition } from "@/components/game/ScoreComposition";
import { useApp } from "@/lib/app-store";
import { COIN_NAME, coinBalance, reasonLabel } from "@/lib/coins";
import { markMostImproved, quizResultsFromAssessments } from "@/lib/gamification/rules";
import { boardId, coursework200 } from "@/lib/gamification/world";
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

const HOMEWORK_PREVIEW = 5;
const RECENT_PREVIEW = 5;
const EXP_PER_LEVEL = 1000;

function Dashboard() {
  const { me, homework, markLog, gameSnapshot, gameError, gamePublishedAt, cosmeticsOf } = useApp();
  const assessments = me.assessments ?? [];
  const game = me.game;
  const hasTerm2 =
    (game?.t2Total ?? null) !== null ||
    assessments.some((a) => a.term === 2 && a.kind === "item" && (a.score !== null || a.absent));
  const [term, setTerm] = useState<1 | 2>(hasTerm2 ? 2 : 1);

  const total = term === 1 ? (game?.t1Total ?? null) : (game?.t2Total ?? null);
  const coursework = coursework200(assessments, term);
  const totalStanding = gameSnapshot?.boards.find(
    (b) => b.boardId === boardId(me.set, "total", term),
  );
  const courseworkStanding = gameSnapshot?.boards.find(
    (b) => b.boardId === boardId(me.set, "coursework", term),
  );
  const headline = total !== null ? totalStanding : courseworkStanding;

  // Without published data the trajectory is still drawn from the student's own marks.
  const quizzes =
    game?.quizHistory ?? markMostImproved(me.id, quizResultsFromAssessments(assessments)).quizzes;
  const distributions = gameSnapshot?.distributions ?? [];
  const termDistributions = distributions.filter((d) => d.term === term);

  const { upcoming } = splitByDue(homeworkForSet(homework, me.set));
  const coins = markLog.filter((m) => m.student_id === me.id).slice(0, RECENT_PREVIEW);
  const rewards = [...(game?.rewards ?? [])]
    .sort((a, b) => b.awardedAt.localeCompare(a.awardedAt))
    .slice(0, RECENT_PREVIEW);
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

      <section
        aria-label="Term score"
        className="mt-6 rounded-xl border-2 border-border bg-card p-5 shadow-chunky"
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
          <TitleTag titleId={cosmetics.equippedTitle} className="ml-auto" />
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Total academic score</p>
            <p className="mt-1 text-5xl font-bold tabular-nums">
              {total === null ? "—" : total}
              <span className="text-xl font-semibold text-muted-foreground"> / 200</span>
            </p>
            {total === null ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Not released yet. Your coursework so far is shown below.
              </p>
            ) : null}
            <p className="mt-3 text-sm">
              Coursework:{" "}
              <span className="font-bold tabular-nums">
                {coursework === null ? "no marks yet" : `${coursework} / 200`}
              </span>
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2">
            {headline ? (
              <div
                className={cn(
                  "rounded-xl px-4 py-3",
                  headline.isTop10 ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <p className="text-sm font-semibold opacity-90">
                  {total !== null ? "Total score" : "Coursework"} rank in {me.set}
                </p>
                <p className="text-3xl font-bold">{headline.display}</p>
                {headline.gapToTop10 !== null ? (
                  <p className="text-sm font-semibold">
                    Only {headline.gapToTop10} marks away from the top 10! 💪
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your rank appears once marks are published.
              </p>
            )}
            <Link to="/leaderboard" className="text-sm font-bold text-primary hover:underline">
              Open the leaderboard
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Summary" className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          tone="grape"
          label={`Level ${level}`}
          value={String(exp)}
          suffix="EXP"
          note={
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-white/30">
              <span
                className="block h-full rounded-full bg-white"
                style={{ width: `${((exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100}%` }}
              />
            </span>
          }
        />
        <StatCard
          tone="flame"
          label="Homework streak"
          value={String(game?.homeworkStreak ?? 0)}
          suffix="in a row"
          note={game ? `${game.missingHomeworkCount} missing so far` : null}
        />
        <StatCard
          tone="green"
          label="Times answered in class"
          value={String(game?.activeVoiceCount ?? 0)}
        />
        <Link to="/awards" className="block rounded-xl transition-transform hover:-translate-y-0.5">
          <StatCard
            tone="gold"
            label={COIN_NAME}
            value={String(coinBalance(me))}
            note="See rewards"
          />
        </Link>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel tone="blue" title={`Term ${term} coursework breakdown`}>
          <ScoreComposition assessments={assessments} term={term} />
        </Panel>
        <Panel
          tone="grape"
          title="Maths strengths"
          description={`You against the ${me.set} average`}
        >
          {gameSnapshot ? (
            <CompetencyRadar axes={gameSnapshot.radar} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Appears after your teacher publishes the marks.
            </p>
          )}
        </Panel>
      </div>

      <Panel
        tone="green"
        className="mt-6"
        title="Quiz journey"
        description="Short quizzes and chapter quizzes, oldest first"
      >
        <QuizTrajectory
          quizzes={quizzes}
          distributions={distributions}
          standings={game?.standings ?? []}
        />
      </Panel>

      <Panel tone="sky" className="mt-6" title={`Where you stand in ${me.set}, Term ${term}`}>
        {gameSnapshot ? (
          <ClassBoxPlot distributions={termDistributions} set={me.set} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Appears after your teacher publishes the marks.
          </p>
        )}
      </Panel>

      <Panel
        tone="green"
        className="mt-6"
        title="Your activity"
        description="Lesson marks, homework on time and videos, last 6 months"
      >
        <ActivityHeatmap studentId={me.id} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          tone="flame"
          title="Homework"
          description={
            upcoming.length === 0
              ? "Nothing due"
              : `${upcoming.length} upcoming deadline${upcoming.length === 1 ? "" : "s"}`
          }
          actions={
            <Link to="/homework" className="text-sm font-bold text-primary hover:underline">
              View all
            </Link>
          }
          bodyClassName="px-5 py-1"
        >
          {upcoming.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">No homework is due.</p>
          ) : (
            <ul className="divide-y-2 divide-border">
              {upcoming.slice(0, HOMEWORK_PREVIEW).map((h) => {
                const st = dueStatus(h.due_at);
                return (
                  <li key={h.id} className="flex items-start gap-3 py-3">
                    <CalendarClock
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug">{h.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDue(h.due_at)}
                        {h.chapter === null ? "" : `, Chapter ${h.chapter}`}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
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

        <Panel tone="gold" title="Recent rewards">
          {rewards.length === 0 && coins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rewards yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {rewards.map((r) => (
                <li key={r.sourceKey} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate">
                    {r.description}
                    {r.multiplier > 1 ? (
                      <span className="font-bold text-flame-deep"> 2x</span>
                    ) : null}
                  </span>
                  <span className="font-bold tabular-nums text-success-deep">+{r.mc} MC</span>
                  <span className="w-16 text-right text-xs font-semibold tabular-nums text-grape-deep">
                    +{r.exp} EXP
                  </span>
                </li>
              ))}
              {coins.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate">
                    {reasonLabel(m.reason)}
                    {m.note ? <span className="text-muted-foreground">, {m.note}</span> : null}
                  </span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      m.marks > 0
                        ? "text-success-deep"
                        : m.marks < 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {m.marks > 0 ? `+${m.marks}` : m.marks}
                  </span>
                  <span className="w-16" />
                </li>
              ))}
            </ul>
          )}
          {game && !game.rewardsSpendable && game.rewardCoins > 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Quiz reward coins ({game.rewardCoins} MC) can be spent when the Shop opens.
            </p>
          ) : null}
        </Panel>
      </div>

      <div className="mt-6">
        <AssessmentReport assessments={assessments} />
      </div>

      {gamePublishedAt ? (
        <p className="mt-6 text-xs text-muted-foreground">
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
