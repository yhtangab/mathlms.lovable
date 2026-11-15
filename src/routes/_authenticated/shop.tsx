import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShoppingBag, Ticket } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type Reward, type ShopItem } from "@/lib/app-store";
import { COIN_NAME, redemptionStatus } from "@/lib/coins";
import { displayCoins } from "@/lib/gamification/rules";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/shop")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Shop — HLC Math" },
      { name: "description", content: "Spend Math Coins on frames, titles and class rewards." },
      { property: "og:title", content: "Shop — HLC Math" },
      {
        property: "og:description",
        content: "Spend Math Coins on frames, titles and class rewards.",
      },
    ],
  }),
  component: ShopPage,
});

const DAY_MS = 86_400_000;

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-HK", { day: "numeric", month: "short" });
}

function ShopPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherNote /> : <StudentShop />}</AppShell>;
}

function TeacherNote() {
  return (
    <>
      <PageHeader title="Shop" />
      <div className="mt-6">
        <Notice tone="info">
          The Shop is for students. Approve their redemption tickets on the{" "}
          <Link to="/awards" className="font-bold underline">
            Awards
          </Link>{" "}
          page, or use Preview student version to see the Shop as a student.
        </Notice>
      </div>
    </>
  );
}

function StudentShop() {
  const {
    me,
    rewards,
    redemptions,
    shopItems,
    ownedItems,
    gameSnapshot,
    cosmeticsOf,
    readOnly,
    refresh,
    extrasError,
    coinsError,
  } = useApp();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const balance = displayCoins(me);
  const cosmetics = cosmeticsOf(me.id);
  const earned = new Set([
    ...(gameSnapshot?.unlocks.frames ?? []),
    ...(gameSnapshot?.unlocks.titles ?? []),
  ]);
  const tickets = redemptions.filter((r) => r.student_id === me.id);
  const gifts = rewards.filter((r) => r.active);
  const rewardCoins = me.game?.rewardsSpendable ? me.game.rewardCoins : (me.rewardCoins ?? 0);

  const buy = async (item: ShopItem) => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("buy_shop_item", { _item_id: item.id });
      if (error) throw new Error(error.message);
      await refresh();
      setConfirming(null);
      toast.success(`${item.name} unlocked! Equip it on your profile page.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not buy this item");
    } finally {
      setBusy(false);
    }
  };

  const redeem = async (reward: Reward) => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("redeem_reward", { _reward_id: reward.id });
      if (error) throw new Error(error.message);
      await refresh();
      setConfirming(null);
      toast.success(`Ticket for ${reward.name} sent. Your teacher will approve it.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create the ticket");
    } finally {
      setBusy(false);
    }
  };

  const nextAvailable = (reward: Reward): Date | null => {
    if (!reward.cooldown_days) return null;
    const last = tickets.find((t) => t.reward_id === reward.id && t.status !== "rejected");
    if (!last) return null;
    const next = new Date(new Date(last.created_at).getTime() + reward.cooldown_days * DAY_MS);
    return next.getTime() > Date.now() ? next : null;
  };

  /** The confirm-then-spend button shared by both kinds of item. */
  const spendButton = (key: string, price: number, label: string, onConfirm: () => void) => {
    if (readOnly) {
      return (
        <Button disabled variant="outline" className="w-full">
          Preview only
        </Button>
      );
    }
    if (balance < price) {
      return (
        <Button disabled variant="outline" className="w-full">
          {price - balance} more needed
        </Button>
      );
    }
    if (confirming === key) {
      return (
        <div className="flex gap-2">
          <Button disabled={busy} className="flex-1" onClick={onConfirm}>
            <Check /> Spend {price}
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => setConfirming(null)}>
            Cancel
          </Button>
        </div>
      );
    }
    return (
      <Button className="w-full" onClick={() => setConfirming(key)}>
        {label} · 🪙 {price}
      </Button>
    );
  };

  return (
    <>
      <PageHeader
        title="Shop"
        description={`Spend your ${COIN_NAME} on new looks and class rewards.`}
      />
      {extrasError ? (
        <div className="mt-4">
          <Notice tone="info">The Shop is not open yet.</Notice>
        </div>
      ) : null}
      {coinsError ? (
        <div className="mt-4">
          <Notice tone="error">{coinsError}</Notice>
        </div>
      ) : null}

      <section className="mt-6 flex flex-wrap items-center gap-6 rounded-xl bg-nav p-6 text-nav-foreground shadow-pop">
        <span
          className="grid h-16 w-16 place-items-center rounded-full bg-gold text-3xl shadow-coin"
          aria-hidden="true"
        >
          🪙
        </span>
        <div className="mr-auto">
          <p className="text-sm font-semibold opacity-80">Your balance</p>
          <p className="text-5xl font-bold tabular-nums">
            {balance} <span className="text-xl font-semibold opacity-80">MC</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs font-bold">
          <li className="rounded-full bg-white/15 px-3 py-1">Lessons {me.dailyMarks ?? 0}</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Videos {me.videoMarks ?? 0}</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Quiz rewards {rewardCoins}</li>
          <li className="rounded-full bg-white/15 px-3 py-1">Check-ins {me.checkinCoins ?? 0}</li>
          <li className="rounded-full bg-white/15 px-3 py-1">
            Spent {(me.coinsSpent ?? 0) + (me.shopSpent ?? 0)}
          </li>
        </ul>
      </section>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
        <ShoppingBag className="h-5 w-5 text-primary" aria-hidden="true" /> Looks (unlock straight
        away)
      </h2>
      {shopItems.filter((i) => i.active).length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Nothing for sale yet.</p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopItems
            .filter((i) => i.active)
            .map((item) => {
              const owned = ownedItems.includes(item.id);
              const alreadyEarned = item.grants.every((g) => earned.has(g));
              const frame = item.grants.find((g) => g.startsWith("frame-"));
              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-xl border-2 border-border bg-card p-4 shadow-chunky"
                >
                  <div className="grid h-28 place-items-center rounded-lg bg-muted/60">
                    {frame ? (
                      <AvatarBadge avatarId={cosmetics.avatarId} frameId={frame} size="lg" />
                    ) : (
                      <div className="flex flex-wrap justify-center gap-1.5 px-2">
                        {item.grants.map((g) => (
                          <TitleTag key={g} titleId={g} />
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold">{item.name}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-4">
                    {owned ? (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/profile">
                          <Check /> Owned, equip on your profile
                        </Link>
                      </Button>
                    ) : alreadyEarned ? (
                      <Button disabled variant="outline" className="w-full">
                        Already unlocked by an achievement
                      </Button>
                    ) : (
                      spendButton(`item:${item.id}`, item.price, "Buy", () => void buy(item))
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
        <Ticket className="h-5 w-5 text-primary" aria-hidden="true" /> Privileges and gifts (your
        teacher approves)
      </h2>
      {gifts.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No rewards have been added yet.</p>
      ) : (
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((r) => {
            const next = nextAvailable(r);
            return (
              <div
                key={r.id}
                className="flex flex-col rounded-xl border-2 border-border bg-card p-4 shadow-chunky"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted text-2xl">
                    {r.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-tight">{r.name}</h3>
                    <p className="text-sm font-semibold text-gold-deep">🪙 {r.cost} MC</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm">{r.description}</p>
                {r.cooldown_days ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Once every {r.cooldown_days} days
                  </p>
                ) : null}
                <div className="mt-4">
                  {next && !readOnly ? (
                    <Button disabled variant="outline" className="w-full">
                      Available again {formatDate(next)}
                    </Button>
                  ) : (
                    spendButton(`gift:${r.id}`, r.cost, "Get ticket", () => void redeem(r))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Panel
        tone="gold"
        className="mt-8"
        title="My redemption tickets"
        description="Show an approved ticket to your teacher to collect it."
      >
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tickets yet.</p>
        ) : (
          <ul className="divide-y-2 divide-border">
            {tickets.map((t) => {
              const st = redemptionStatus(t.status);
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{t.reward_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(t.created_at)}, {t.cost} MC
                    </span>
                  </span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", st.cls)}>
                    {st.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
