import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { AnonymousAvatar, AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
import { useApp } from "@/lib/app-store";
import type {
  BoardMetric,
  BoardScope,
  Leaderboard,
  LeaderboardEntry,
} from "@/lib/gamification/types";
import { boardId, boardTerm } from "@/lib/gamification/world";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Leaderboard — HLC Math" },
      { name: "description", content: "S2 Mathematics top 10 by set and form." },
      { property: "og:title", content: "Leaderboard — HLC Math" },
      { property: "og:description", content: "S2 Mathematics top 10 by set and form." },
    ],
  }),
  component: LeaderboardPage,
});

const SCOPES: { id: BoardScope; label: string }[] = [
  { id: "S2M3", label: "S2M3" },
  { id: "S2M5", label: "S2M5" },
  { id: "S2", label: "Whole form (S2)" },
];

const METRICS: { id: BoardMetric; label: string }[] = [
  { id: "total", label: "Academic score" },
  { id: "ca", label: "Continuous Assessment" },
  { id: "exp", label: "EXP" },
];

/** Podium positions (height and column) and medal colours. */
const PODIUM = [
  {
    place: 1,
    medal: "🥇",
    height: "h-28",
    color: "bg-gold text-accent-foreground",
    order: "order-2",
  },
  { place: 2, medal: "🥈", height: "h-20", color: "bg-silver text-foreground", order: "order-1" },
  { place: 3, medal: "🥉", height: "h-14", color: "bg-bronze text-white", order: "order-3" },
];

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap rounded-full bg-muted p-1">
      {options.map((o) => (
        <button
          type="button"
          key={String(o.id)}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-bold",
            value === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function scoreText(board: Leaderboard, score: number): string {
  return board.metric === "exp" ? `${score} EXP` : `${score} / 200`;
}

function LeaderboardPage() {
  const { role, me, boards, gameSnapshot, gameError, gamePublishedAt, cosmeticsOf, isPreview } =
    useApp();
  const teacherView = role === "teacher";
  const firstBoard = (scope: BoardScope, metric: BoardMetric) =>
    boards.find((b) => b.id === boardId(scope, metric, boardTerm(metric, 1)));
  const startScope: BoardScope = teacherView ? "S2M3" : me.set;
  const [scope, setScope] = useState<BoardScope>(startScope);
  const [metric, setMetric] = useState<BoardMetric>(
    (firstBoard(startScope, "total")?.rankedCount ?? 0) > 0 ? "total" : "ca",
  );
  const [term, setTerm] = useState<1 | 2>(1);

  const board = boards.find((b) => b.id === boardId(scope, metric, boardTerm(metric, term)));
  const standing = gameSnapshot?.boards.find((b) => b.boardId === board?.id) ?? null;
  const named = board ? (teacherView ? board.top : board.top.filter((e) => e.rank <= 10)) : [];
  const podium = named.slice(0, 3);
  const rest = named.slice(3);
  const unit = metric === "exp" ? "EXP" : "marks";

  const row = (entry: LeaderboardEntry) => {
    const c = cosmeticsOf(entry.studentId);
    const mine = entry.studentId === me.id;
    const hidden = teacherView && entry.rank > 10;
    return (
      <li
        key={entry.studentId}
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 px-3 py-2",
          mine ? "border-primary bg-primary/5" : "border-border bg-card",
          hidden && "opacity-70",
        )}
      >
        <span className="w-8 text-center text-lg font-bold tabular-nums text-muted-foreground">
          {entry.rank}
        </span>
        <AvatarBadge avatarId={c.avatarId} frameId={c.equippedFrameId} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">
            {entry.name}
            {mine ? <span className="ml-2 text-xs text-primary">You</span> : null}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>
              {entry.set} {entry.className} {entry.classNo}
            </span>
            <TitleTag titleId={c.equippedTitle} />
            {hidden ? <span>(students see this row as anonymous)</span> : null}
          </div>
        </div>
        <span className="font-bold tabular-nums">
          {board ? scoreText(board, entry.score) : entry.score}
        </span>
      </li>
    );
  };

  return (
    <AppShell>
      <PageHeader
        title={teacherView ? "Rankings" : "Leaderboard"}
        description={
          teacherView
            ? "Full rankings with every name. Students only see the top 10 by name; everyone else is anonymous."
            : "The top 10 are shown by name. Everyone else stays anonymous."
        }
      />

      {gameError && teacherView ? (
        <div className="mt-4">
          <Notice tone="error">{gameError}</Notice>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Segmented label="Set or form" options={SCOPES} value={scope} onChange={setScope} />
        <Segmented label="Score" options={METRICS} value={metric} onChange={setMetric} />
        {metric === "exp" ? null : (
          <Segmented
            label="Term"
            options={[
              { id: 1 as const, label: "Term 1" },
              { id: 2 as const, label: "Term 2" },
            ]}
            value={term}
            onChange={setTerm}
          />
        )}
      </div>

      {!board || board.rankedCount === 0 ? (
        <div className="mt-6">
          <Notice tone="info">
            {boards.length === 0
              ? "The leaderboard appears after your teacher publishes the marks."
              : "Nobody has a score on this board yet."}
          </Notice>
        </div>
      ) : (
        <>
          <section aria-label="Top 3" className="mt-8 grid grid-cols-3 items-end gap-3">
            {PODIUM.map((p) => {
              const entry = podium[p.place - 1];
              if (!entry) return <div key={p.place} className={p.order} />;
              const c = cosmeticsOf(entry.studentId);
              // Tied students share a rank, so the medal follows the rank, not the position.
              const medal = PODIUM.find((x) => x.place === entry.rank) ?? p;
              return (
                <div
                  key={p.place}
                  className={cn("flex flex-col items-center text-center", p.order)}
                >
                  <AvatarBadge
                    avatarId={c.avatarId}
                    frameId={c.equippedFrameId}
                    size={p.place === 1 ? "xl" : "lg"}
                  />
                  <p className="mt-3 line-clamp-2 text-sm font-bold">
                    {entry.name}
                    {entry.studentId === me.id ? " (You)" : ""}
                  </p>
                  <TitleTag titleId={c.equippedTitle} className="mt-1" />
                  <p className="mt-1 text-sm font-bold tabular-nums">
                    {scoreText(board, entry.score)}
                  </p>
                  <div
                    className={cn(
                      "mt-2 grid w-full place-items-center rounded-t-xl text-2xl font-bold",
                      p.height,
                      medal.color,
                    )}
                  >
                    <span>
                      {medal.medal} #{entry.rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          {rest.length > 0 ? <ol className="mt-6 space-y-2">{rest.map((e) => row(e))}</ol> : null}

          {!teacherView && board.anonymousCodes.length > 0 ? (
            <Panel
              tone="sky"
              className="mt-6"
              title={`Everyone else (${board.anonymousCodes.length})`}
              description="Ranks 11 and below stay private. Cards are in code order, not rank order."
            >
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {board.anonymousCodes.map((code) => {
                  const mine = standing?.anonymousCode === code;
                  return (
                    <li
                      key={code}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border-2 px-2.5 py-2 text-xs font-semibold",
                        mine ? "border-primary bg-primary/5" : "border-border",
                      )}
                    >
                      <AnonymousAvatar />
                      <span className="min-w-0">
                        Anonymous Mathematician #{code}
                        {mine ? <span className="block text-primary">You</span> : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ) : null}
        </>
      )}

      {!teacherView ? (
        <div className="sticky bottom-3 z-20 mt-8 flex flex-wrap items-center gap-3 rounded-xl border-2 border-primary bg-card px-4 py-3 shadow-pop">
          <AvatarBadge
            avatarId={cosmeticsOf(me.id).avatarId}
            frameId={cosmeticsOf(me.id).equippedFrameId}
            size="sm"
          />
          <p className="flex-1 font-bold">
            {!standing || standing.display === "—"
              ? "You do not have a score on this board yet."
              : standing.isTop10
                ? `Your Rank: ${standing.display} 🎉`
                : `Your Rank: 10+ (Only ${standing.gapToTop10 ?? 0} ${unit} away from Top 10! 💪)`}
          </p>
          {standing?.score !== null && standing?.score !== undefined && board ? (
            <span className="font-bold tabular-nums text-muted-foreground">
              {scoreText(board, standing.score)}
            </span>
          ) : null}
        </div>
      ) : null}

      {gamePublishedAt && !teacherView && !isPreview ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated{" "}
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
