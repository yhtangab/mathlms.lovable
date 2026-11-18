import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type Reward, type ShopItem } from "@/lib/app-store";
import { COIN_NAME, redemptionStatus } from "@/lib/coins";
import { displayCoins } from "@/lib/gamification/rules";
import { LooksEditor } from "@/components/teacher/LooksEditor";
import { TeacherPrivileges } from "@/routes/_authenticated/awards";
import { avatarById, itemKind } from "@/lib/gamification/catalog";
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

const SHOP_CSS = `
.shop-page{background:
  radial-gradient(circle at 12% 18%, rgba(255,255,255,.7), transparent 18%),
  radial-gradient(circle at 88% 8%, rgba(186,230,253,.8), transparent 22%),
  linear-gradient(180deg,#d7ecfb 0%,#e7f3ff 40%,#f3e7cf 100%);
  min-height:70vh}
.shop-page .shop-doodle{position:absolute;font-weight:900;color:rgba(138,90,50,.35);font-size:1.6rem;pointer-events:none}
.shop-banner{background-image:linear-gradient(180deg,rgba(255,250,240,.2),transparent 40%),repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(138,90,50,.05) 18px,rgba(138,90,50,.05) 19px)}
.shop-wood{background:linear-gradient(180deg,#a56b3c,#7a4a28 45%,#5c341c);border:4px solid #4a2914;box-shadow:inset 0 2px 0 rgba(255,220,160,.35),0 8px 0 #3d2112}
.shop-scroll{display:flex;align-items:center;justify-content:center;min-height:3rem;margin-inline:auto;max-width:34rem;border-radius:999px;background:linear-gradient(#f6e2b8,#e7c98a);border:3px solid #8a5a32;color:#3b2414;font-weight:900;text-align:center;padding:.4rem 1.5rem;box-shadow:0 5px 0 #6b3e22}
.shop-card{background:linear-gradient(180deg,#fffaf0,#f4e2c4);border:4px solid #8a5a32;box-shadow:0 7px 0 #6b3e22}
`;

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-HK", { day: "numeric", month: "short" });
}

function ShopPage() {
  const { role } = useApp();
  return <AppShell>{role === "teacher" ? <TeacherShop /> : <StudentShop />}</AppShell>;
}

type ShopTab = "all" | "avatar" | "title" | "frame" | "gifts";

const SHOP_TABS: { id: ShopTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "avatar", label: "Avatar" },
  { id: "title", label: "Title" },
  { id: "frame", label: "Frame" },
  { id: "gifts", label: "Gifts" },
];

const LOOK_ORDER = { avatar: 0, title: 1, frame: 2 } as const;

function looksForTab(items: readonly ShopItem[], tab: ShopTab): ShopItem[] {
  return items
    .filter(
      (item) =>
        item.active && item.grants.length === 1 && (tab === "all" || itemKind(item) === tab),
    )
    .sort((a, b) => {
      const byKind = LOOK_ORDER[itemKind(a)] - LOOK_ORDER[itemKind(b)];
      if (tab === "all" && byKind !== 0) return byKind;
      return a.position - b.position;
    });
}

function ShopTabs({ value, onChange }: { value: ShopTab; onChange: (tab: ShopTab) => void }) {
  return (
    <div className="mt-5 flex justify-center">
      <div
        role="group"
        aria-label="Shop sections"
        className="inline-flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border-2 border-border bg-card p-2 shadow-sm"
      >
        {SHOP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={value === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-xl border-2 px-5 py-2 text-base font-bold",
              value === tab.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TeacherShop() {
  const [tab, setTab] = useState<ShopTab>("all");
  return (
    <>
      <PageHeader
        title="Shop"
        description="Looks unlock straight away. Privileges and gifts wait for your approval."
      />
      <ShopTabs value={tab} onChange={setTab} />
      {tab === "gifts" ? null : <LooksEditor kind={tab === "all" ? "all" : tab} />}
      {tab === "all" || tab === "gifts" ? <TeacherPrivileges /> : null}
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
  const [tab, setTab] = useState<ShopTab>("all");
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
    <div className="shop-page relative -mx-2 overflow-hidden rounded-3xl px-2 pb-8 pt-2 md:-mx-4 md:px-4">
      <style>{SHOP_CSS}</style>
      <header className="shop-banner relative overflow-hidden rounded-3xl border-4 border-[#8a5a32] bg-[#fff4d8] px-6 py-5 shadow-[0_8px_0_#6b3e22]">
        <p className="shop-doodle left-4 top-3" aria-hidden="true">
          π
        </p>
        <p className="shop-doodle right-6 top-4 text-3xl" aria-hidden="true">
          √
        </p>
        <p className="shop-doodle bottom-3 left-1/3" aria-hidden="true">
          △
        </p>
        <h1 className="text-4xl font-black text-[#3b2414]">Shop</h1>
        <p className="mt-1 max-w-md text-sm font-semibold text-[#6b4a2e]">
          Spend your {COIN_NAME} on new looks and class rewards.
        </p>
      </header>
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

      <section className="shop-wood mt-5 flex flex-wrap items-center gap-4 rounded-2xl px-5 py-4 text-[#fff6e4]">
        <span
          className="grid h-16 w-16 place-items-center rounded-full border-4 border-[#f3d27a] bg-[#e7b53a] text-xl font-black text-[#5a3a12] shadow-[0_4px_0_#8a6420]"
          aria-hidden="true"
        >
          MC
        </span>
        <div className="mr-auto">
          <p className="text-sm font-bold text-[#f3d7a2]">Your balance</p>
          <p className="text-5xl font-black tabular-nums">
            {balance} <span className="text-xl">MC</span>
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs font-bold">
          <li className="rounded-full bg-black/25 px-3 py-1">Lessons {me.dailyMarks ?? 0}</li>
          <li className="rounded-full bg-black/25 px-3 py-1">Videos +{me.videoMarks ?? 0} MC</li>
          <li className="rounded-full bg-black/25 px-3 py-1">Quiz rewards {rewardCoins}</li>
          <li className="rounded-full bg-black/25 px-3 py-1">Check-ins {me.checkinCoins ?? 0}</li>
          <li className="rounded-full bg-black/25 px-3 py-1">
            Spent {(me.coinsSpent ?? 0) + (me.shopSpent ?? 0)}
          </li>
        </ul>
      </section>

      <ShopTabs value={tab} onChange={setTab} />

      {tab === "gifts" ? null : (
        <>
          <h2 className="shop-scroll mt-4">Looks (unlock straight away)</h2>
          {looksForTab(shopItems, tab).length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nothing for sale yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {looksForTab(shopItems, tab).map((item) => {
                const owned = ownedItems.includes(item.id);
                const alreadyEarned = item.grants.every((g) => earned.has(g));
                const grant = item.grants[0];
                const kind = itemKind(item);
                const face = grant ? avatarById(grant) : null;
                return (
                  <div key={item.id} className="shop-card flex flex-col rounded-xl p-2.5">
                    <div className="grid h-16 place-items-center rounded-lg bg-muted/60">
                      {kind === "frame" && grant ? (
                        <AvatarBadge avatarId={cosmetics.avatarId} frameId={grant} size="md" />
                      ) : kind === "avatar" && face ? (
                        <span className="text-4xl leading-none" aria-hidden="true">
                          {face.emoji}
                        </span>
                      ) : (
                        <TitleTag titleId={grant ?? null} />
                      )}
                    </div>
                    <h3 className="mt-2 text-sm font-bold leading-tight">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-4">
                      {owned ? (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/profile">
                            <Check /> Equip
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
        </>
      )}

      {tab === "all" || tab === "gifts" ? (
        <>
          <h2 className="shop-scroll mt-8">Privileges and gifts (your teacher approves)</h2>
          {gifts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No rewards have been added yet.</p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {gifts.map((r) => {
                const next = nextAvailable(r);
                return (
                  <div key={r.id} className="shop-card flex flex-col rounded-2xl p-4">
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
        </>
      ) : null}

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
    </div>
  );
}
