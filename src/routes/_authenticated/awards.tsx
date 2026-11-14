import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { useApp, type Redemption, type Reward } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import {
  COIN_NAME,
  REASONS,
  VIDEO_COINS,
  coinBalance,
  coinsEarned,
  reasonLabel,
  redemptionStatus,
} from "@/lib/coins";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/awards")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Awards — HLC Math" },
      { name: "description", content: "Exchange Math Coins for class rewards." },
      { property: "og:title", content: "Awards — HLC Math" },
      {
        property: "og:description",
        content: "Earn Math Coins in lessons and exchange them for rewards.",
      },
    ],
  }),
  component: AwardsPage,
});

const DAY_MS = 86_400_000;

function AwardsPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherAwards /> : <StudentAwards />}</AppShell>;
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-HK", { day: "numeric", month: "short" });
}

function coins(n: number) {
  return `${n} coin${n === 1 ? "" : "s"}`;
}

function StudentAwards() {
  const { me, rewards, redemptions, markLog, refresh, coinsError, readOnly } = useApp();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const balance = coinBalance(me);
  const mine = redemptions.filter((r) => r.student_id === me.id);
  const history = markLog.filter((m) => m.student_id === me.id).slice(0, 15);
  const shop = rewards.filter((r) => r.active);

  const nextAvailable = (reward: Reward): Date | null => {
    if (!reward.cooldown_days) return null;
    const last = mine.find((r) => r.reward_id === reward.id && r.status !== "rejected");
    if (!last) return null;
    const next = new Date(new Date(last.created_at).getTime() + reward.cooldown_days * DAY_MS);
    return next.getTime() > Date.now() ? next : null;
  };

  const redeem = async (reward: Reward) => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("redeem_reward", { _reward_id: reward.id });
      if (error) throw new Error(error.message);
      await refresh();
      setConfirming(null);
      toast.success(`${reward.name} requested. Your teacher will confirm it.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not request the reward");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Awards"
        description={`Earn ${COIN_NAME} in lessons and exchange them for class rewards.`}
      />
      {coinsError && (
        <div className="mt-4">
          <Notice tone="error">{coinsError}</Notice>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <section className="rounded-lg border border-border border-l-4 border-l-gold bg-card p-5 shadow-chunky">
          <p className="text-sm text-muted-foreground">Your balance</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums">{balance}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {coins(coinsEarned(me))} earned, {coins(me.coinsSpent ?? 0)} spent
          </p>
        </section>
        <Panel title={`How to earn ${COIN_NAME}`}>
          <ul className="grid list-disc gap-1 pl-5 text-sm sm:grid-cols-2">
            {REASONS.filter((r) => r.id !== "deduction" && r.id !== "incorrect_answer").map((r) => (
              <li key={r.id}>{r.label}</li>
            ))}
            <li>Watching a chapter video to the end (+{VIDEO_COINS})</li>
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Missing homework or breaking class rules can lose coins.
          </p>
        </Panel>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Rewards</h2>
      {shop.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No rewards have been added yet.</p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shop.map((r) => {
            const next = nextAvailable(r);
            const short = r.cost - balance;
            return (
              <div
                key={r.id}
                className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-chunky"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-muted text-xl">
                    {r.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{coins(r.cost)}</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm">{r.description}</p>
                {r.cooldown_days && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Once every {r.cooldown_days} days
                  </p>
                )}
                <div className="mt-4">
                  {readOnly ? (
                    <Button disabled variant="outline" className="w-full">
                      Preview only
                    </Button>
                  ) : next ? (
                    <Button disabled variant="outline" className="w-full">
                      Available again {formatDate(next)}
                    </Button>
                  ) : short > 0 ? (
                    <Button disabled variant="outline" className="w-full">
                      {short} more needed
                    </Button>
                  ) : confirming === r.id ? (
                    <div className="flex gap-2">
                      <Button disabled={busy} className="flex-1" onClick={() => void redeem(r)}>
                        <Check /> Spend {r.cost}
                      </Button>
                      <Button variant="outline" disabled={busy} onClick={() => setConfirming(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setConfirming(r.id)}>
                      Request
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Panel title="My requests">
          {mine.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rewards requested yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {mine.map((r) => {
                const st = redemptionStatus(r.status);
                return (
                  <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{r.reward_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.created_at)}, {coins(r.cost)}
                      </span>
                    </span>
                    <span className={cn("rounded px-2 py-0.5 text-xs font-semibold", st.cls)}>
                      {st.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        <Panel title="Coin history">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lesson coins yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {history.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="w-16 shrink-0 text-xs text-muted-foreground">
                    {formatDate(m.created_at)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {reasonLabel(m.reason)}
                    {m.note ? <span className="text-muted-foreground">, {m.note}</span> : null}
                  </span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      m.marks > 0
                        ? "text-success"
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
    </>
  );
}

function TeacherAwards() {
  const { redemptions, students, refresh, coinsError } = useApp();
  const [busyId, setBusyId] = useState<string | null>(null);
  const names = useMemo(
    () =>
      new Map(
        students.map((s) => [
          s.id,
          `${s.name}, ${s.set}${s.classNo ? `, ${s.className ?? ""} ${s.classNo}` : ""}`,
        ]),
      ),
    [students],
  );
  const pending = redemptions.filter((r) => r.status === "pending");
  const approved = redemptions.filter((r) => r.status === "approved");
  const done = redemptions
    .filter((r) => r.status === "used" || r.status === "rejected")
    .slice(0, 15);

  const decide = async (r: Redemption, status: "approved" | "used" | "rejected") => {
    setBusyId(r.id);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("reward_redemptions")
        .update({ status, decided_at: new Date().toISOString(), decided_by: auth.user?.id ?? null })
        .eq("id", r.id);
      if (error) throw new Error(error.message);
      await refresh();
      toast.success(
        status === "rejected"
          ? "Rejected and coins returned"
          : status === "used"
            ? "Marked as used"
            : "Approved",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the request");
    } finally {
      setBusyId(null);
    }
  };

  const row = (r: Redemption, actions: "pending" | "approved" | "none") => {
    const st = redemptionStatus(r.status);
    return (
      <li key={r.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{r.reward_name}</span>
          <span className="text-xs text-muted-foreground">
            {names.get(r.student_id) ?? "Unknown student"}, {formatDate(r.created_at)},{" "}
            {coins(r.cost)}
          </span>
        </span>
        {actions === "pending" && (
          <>
            <Button size="sm" disabled={busyId === r.id} onClick={() => void decide(r, "approved")}>
              <Check /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busyId === r.id}
              onClick={() => void decide(r, "rejected")}
            >
              <X /> Reject
            </Button>
          </>
        )}
        {actions === "approved" && (
          <>
            <Button size="sm" disabled={busyId === r.id} onClick={() => void decide(r, "used")}>
              <Check /> Mark used
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busyId === r.id}
              onClick={() => void decide(r, "rejected")}
            >
              Cancel and refund
            </Button>
          </>
        )}
        {actions === "none" && (
          <span className={cn("rounded px-2 py-0.5 text-xs font-semibold", st.cls)}>
            {st.label}
          </span>
        )}
      </li>
    );
  };

  return (
    <>
      <PageHeader
        title="Awards"
        description={`Students spend ${COIN_NAME} here. Approve a request, mark it used, or reject it to return the coins.`}
      />
      {coinsError && (
        <div className="mt-4">
          <Notice tone="error">{coinsError}</Notice>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={`Waiting for approval (${pending.length})`}>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new requests.</p>
          ) : (
            <ul className="divide-y divide-border">{pending.map((r) => row(r, "pending"))}</ul>
          )}
        </Panel>
        <Panel title={`Approved, not used yet (${approved.length})`}>
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing waiting to be used.</p>
          ) : (
            <ul className="divide-y divide-border">{approved.map((r) => row(r, "approved"))}</ul>
          )}
        </Panel>
      </div>

      {done.length > 0 && (
        <Panel className="mt-6" title="Recently finished">
          <ul className="divide-y divide-border">{done.map((r) => row(r, "none"))}</ul>
        </Panel>
      )}

      <RewardEditor />
    </>
  );
}

interface Draft {
  id: string;
  emoji: string;
  name: string;
  description: string;
  cost: string;
  cooldown: string;
  active: boolean;
  position: number;
}

function toDraft(r: Reward): Draft {
  return {
    id: r.id,
    emoji: r.emoji,
    name: r.name,
    description: r.description,
    cost: String(r.cost),
    cooldown: r.cooldown_days === null ? "" : String(r.cooldown_days),
    active: r.active,
    position: r.position,
  };
}

const field =
  "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary";

function RewardEditor() {
  const { rewards, refresh } = useApp();
  const [edits, setEdits] = useState<Record<string, Draft>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const rows = [
    ...rewards.map((r) => edits[r.id] ?? toDraft(r)),
    ...Object.values(edits).filter((d) => !rewards.some((r) => r.id === d.id)),
  ];

  const change = (d: Draft, patch: Partial<Draft>) =>
    setEdits((e) => ({ ...e, [d.id]: { ...d, ...patch } }));

  const add = () => {
    const position = Math.max(0, ...rows.map((d) => d.position)) + 1;
    const draft: Draft = {
      id: crypto.randomUUID(),
      emoji: "🎁",
      name: "",
      description: "",
      cost: "10",
      cooldown: "",
      active: true,
      position,
    };
    setEdits((e) => ({ ...e, [draft.id]: draft }));
  };

  const save = async (d: Draft) => {
    const cost = Number(d.cost);
    const cooldown = d.cooldown.trim() === "" ? null : Number(d.cooldown);
    if (!d.name.trim()) {
      toast.error("Give the reward a name");
      return;
    }
    if (!Number.isInteger(cost) || cost < 1 || cost > 1000) {
      toast.error("Cost must be a whole number from 1 to 1000");
      return;
    }
    if (cooldown !== null && (!Number.isInteger(cooldown) || cooldown < 1 || cooldown > 365)) {
      toast.error("Limit must be 1 to 365 days, or blank for no limit");
      return;
    }
    setBusyId(d.id);
    try {
      const { error } = await supabase.from("rewards").upsert({
        id: d.id,
        emoji: d.emoji.trim() || "🎁",
        name: d.name.trim(),
        description: d.description.trim(),
        cost,
        cooldown_days: cooldown,
        active: d.active,
        position: d.position,
      });
      if (error) throw new Error(error.message);
      await refresh();
      setEdits(({ [d.id]: _saved, ...rest }) => rest);
      toast.success(`${d.name.trim()} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the reward");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Panel
      className="mt-6"
      title="Reward list"
      description="Untick Shown to hide a reward. Limit means once every N days for each student; leave it blank for no limit."
      actions={
        <Button variant="outline" size="sm" onClick={add}>
          <Plus /> Add reward
        </Button>
      }
    >
      <div className="hidden grid-cols-[56px_1fr_2fr_80px_80px_64px_auto] gap-2 px-1 text-xs font-semibold text-muted-foreground md:grid">
        <span>Icon</span>
        <span>Name</span>
        <span>Description</span>
        <span>Cost</span>
        <span>Limit</span>
        <span>Shown</span>
        <span />
      </div>
      <div className="mt-1 space-y-2">
        {rows.map((d) => {
          const dirty = edits[d.id] !== undefined;
          return (
            <div
              key={d.id}
              className={cn(
                "grid gap-2 rounded-md border p-2 md:grid-cols-[56px_1fr_2fr_80px_80px_64px_auto] md:items-center",
                dirty ? "border-primary/60 bg-primary/5" : "border-border",
              )}
            >
              <input
                aria-label="Icon"
                value={d.emoji}
                onChange={(e) => change(d, { emoji: e.target.value })}
                className={cn(field, "text-center text-lg")}
              />
              <input
                aria-label="Name"
                value={d.name}
                placeholder="Reward name"
                onChange={(e) => change(d, { name: e.target.value })}
                className={field}
              />
              <input
                aria-label="Description"
                value={d.description}
                placeholder="What the student gets"
                onChange={(e) => change(d, { description: e.target.value })}
                className={field}
              />
              <input
                aria-label="Cost"
                type="number"
                min={1}
                max={1000}
                value={d.cost}
                onChange={(e) => change(d, { cost: e.target.value })}
                className={field}
              />
              <input
                aria-label="Limit in days"
                type="number"
                min={1}
                max={365}
                value={d.cooldown}
                placeholder="—"
                onChange={(e) => change(d, { cooldown: e.target.value })}
                className={field}
              />
              <label className="flex items-center gap-2 text-sm md:justify-center">
                <input
                  type="checkbox"
                  checked={d.active}
                  onChange={(e) => change(d, { active: e.target.checked })}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                <span className="md:hidden">Shown</span>
              </label>
              <Button size="sm" disabled={!dirty || busyId === d.id} onClick={() => void save(d)}>
                <Save /> Save
              </Button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
