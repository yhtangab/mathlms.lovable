import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/gacha")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Card Gacha — HLC Math" },
      { name: "description", content: "Mathematician and formula trading cards are coming soon." },
      { property: "og:title", content: "Card Gacha — HLC Math" },
      {
        property: "og:description",
        content: "Mathematician and formula trading cards are coming soon.",
      },
    ],
  }),
  component: GachaPage,
});

type Rarity = "SSR" | "SR" | "R";

/** The 30 cards planned for the first album. Names stay hidden until a card is discovered. */
const ALBUM: { rarity: Rarity; kind: "Mathematician" | "Formula" }[] = [
  ...Array.from({ length: 3 }, () => ({ rarity: "SSR" as const, kind: "Mathematician" as const })),
  ...Array.from({ length: 2 }, () => ({ rarity: "SSR" as const, kind: "Formula" as const })),
  ...Array.from({ length: 5 }, () => ({ rarity: "SR" as const, kind: "Mathematician" as const })),
  ...Array.from({ length: 5 }, () => ({ rarity: "SR" as const, kind: "Formula" as const })),
  ...Array.from({ length: 8 }, () => ({ rarity: "R" as const, kind: "Mathematician" as const })),
  ...Array.from({ length: 7 }, () => ({ rarity: "R" as const, kind: "Formula" as const })),
];

const RARITY: Record<Rarity, { label: string; card: string; chip: string; odds: string }> = {
  SSR: {
    label: "Super Super Rare",
    card: "bg-gold/30 border-gold-deep",
    chip: "bg-gold text-accent-foreground",
    odds: "3%",
  },
  SR: {
    label: "Super Rare",
    card: "bg-grape/20 border-grape",
    chip: "bg-grape text-white",
    odds: "17%",
  },
  R: { label: "Rare", card: "bg-sky/20 border-sky", chip: "bg-sky text-white", odds: "80%" },
};

const GACHA_CSS = `
.hlc-chest { animation: hlc-chest-bob 2.4s ease-in-out infinite; }
@keyframes hlc-chest-bob { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
.hlc-chest[data-shake="true"] { animation: hlc-chest-shake 0.5s ease-in-out; }
@keyframes hlc-chest-shake { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-12deg); } 40% { transform: rotate(10deg); } 60% { transform: rotate(-6deg); } 80% { transform: rotate(4deg); } }
.hlc-card-shine { background: linear-gradient(110deg, transparent 30%, var(--card) 50%, transparent 70%); background-size: 250% 100%; animation: hlc-shine 3s linear infinite; opacity: 0.35; }
@keyframes hlc-shine { from { background-position: 150% 0; } to { background-position: -100% 0; } }
@media (prefers-reduced-motion: reduce) { .hlc-chest, .hlc-chest[data-shake="true"], .hlc-card-shine { animation: none; } }
`;

function GachaPage() {
  const [shake, setShake] = useState(0);
  const discovered = 0;
  return (
    <AppShell>
      <style>{GACHA_CSS}</style>
      <PageHeader
        title="Card Gacha"
        eyebrow="Coming soon"
        description="Collect mathematician and formula trading cards. Opening chests arrives in a later update."
      />

      <section className="mt-6 grid items-center gap-6 overflow-hidden rounded-xl bg-nav p-6 text-nav-foreground shadow-pop md:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase opacity-80">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Mystery Chest
          </p>
          <h2 className="mt-1 text-3xl font-bold">Who will you discover first?</h2>
          <p className="mt-2 max-w-md text-sm opacity-85">
            Each chest holds one card: a famous mathematician or a formula with its story. Collect
            all 30 to complete the first album.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
            {(Object.keys(RARITY) as Rarity[]).map((r) => (
              <li key={r} className={cn("rounded-full px-3 py-1", RARITY[r].chip)}>
                {r} {RARITY[r].label} · {RARITY[r].odds}
              </li>
            ))}
          </ul>
          <Button size="lg" disabled className="mt-5">
            <Lock /> Opening chests: coming soon
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setShake((n) => n + 1)}
          aria-label="Shake the mystery chest"
          className="mx-auto grid h-56 w-56 place-items-center rounded-full bg-white/10"
        >
          <span
            key={shake}
            data-shake={shake > 0}
            className="hlc-chest text-[120px] leading-none"
            aria-hidden="true"
          >
            🎁
          </span>
        </button>
      </section>

      <Panel
        tone="grape"
        className="mt-6"
        title="Collection album"
        description={`${discovered} / ${ALBUM.length} discovered`}
        actions={
          <div className="h-2.5 w-40 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-grape"
              style={{ width: `${(discovered / ALBUM.length) * 100}%` }}
            />
          </div>
        }
      >
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {ALBUM.map((card, i) => (
            <li
              key={i}
              className={cn(
                "relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-xl border-2",
                RARITY[card.rarity].card,
              )}
            >
              {card.rarity !== "R" ? (
                <span aria-hidden="true" className="hlc-card-shine absolute inset-0" />
              ) : null}
              <span
                className={cn(
                  "absolute left-1.5 top-1.5 rounded px-1.5 text-[10px] font-bold",
                  RARITY[card.rarity].chip,
                )}
              >
                {card.rarity}
              </span>
              <span aria-hidden="true" className="text-4xl font-bold text-foreground/25">
                {card.kind === "Mathematician" ? "👤" : "∑"}
              </span>
              <span className="mt-2 text-xs font-bold text-muted-foreground">???</span>
              <span className="text-[10px] text-muted-foreground">{card.kind}</span>
              <span className="sr-only">
                Undiscovered {RARITY[card.rarity].label} {card.kind} card
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
