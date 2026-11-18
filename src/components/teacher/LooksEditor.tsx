import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
import { Panel, Notice } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type ShopItem } from "@/lib/app-store";
import { itemKind } from "@/lib/gamification/catalog";
import { cn } from "@/lib/utils";

const field =
  "w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary";

function singleLook(item: ShopItem): boolean {
  return item.id !== "shop-title-pack" && item.grants.length === 1;
}

/** Teacher prices and publishes the built-in frames and titles. */
export function LooksEditor({ kind = "all" }: { kind?: "all" | "avatar" | "frame" | "title" }) {
  const { shopItems, refresh, cosmeticsOf, me } = useApp();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const rows = shopItems.filter(singleLook).sort((a, b) => a.position - b.position);

  const priceOf = (item: ShopItem) => prices[item.id] ?? String(item.price);
  const shownOf = (item: ShopItem) => shown[item.id] ?? item.active;
  const dirty = (item: ShopItem) =>
    priceOf(item) !== String(item.price) || shownOf(item) !== item.active;

  const save = async (item: ShopItem) => {
    const price = Number(priceOf(item));
    if (!Number.isInteger(price) || price < 1 || price > 1000) {
      toast.error("Price must be a whole number from 1 to 1000");
      return;
    }
    setBusyId(item.id);
    try {
      const { error } = await supabase
        .from("shop_items")
        .update({ price, active: shownOf(item) })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
      await refresh();
      setPrices(({ [item.id]: _price, ...rest }) => rest);
      setShown(({ [item.id]: _shown, ...rest }) => rest);
      toast.success(`${item.name} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save this look");
    } finally {
      setBusyId(null);
    }
  };

  const list = (section: "avatar" | "frame" | "title") =>
    rows.filter((item) => itemKind(item) === section);

  return (
    <Panel
      className="mt-6"
      title="Looks"
      description="Students buy each avatar, frame or title on its own. Change the price or hide it. Names stay as they are."
    >
      {!shopItems.some((item) => item.id === "shop-avatar-robot") ? (
        <div className="mb-3">
          <Notice tone="info">
            Shop avatars, new frames and separate titles appear after you run
            supabase/sql/0018_shop_avatars.sql in the Supabase SQL Editor.
          </Notice>
        </div>
      ) : null}
      {(["avatar", "frame", "title"] as const)
        .filter((section) => kind === "all" || kind === section)
        .map((section) => (
          <div key={section} className="mt-3">
            <h3 className="text-sm font-bold">
              {section === "avatar" ? "Avatars" : section === "frame" ? "Frames" : "Titles"}
            </h3>
            <ul className="mt-2 space-y-2">
              {list(section).map((item) => {
                const grant = item.grants[0] ?? "";
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "grid items-center gap-3 rounded-md border p-2 md:grid-cols-[4.5rem_minmax(0,1fr)_6rem_7rem_auto]",
                      dirty(item) ? "border-primary/60 bg-primary/5" : "border-border",
                    )}
                  >
                    <span className="grid h-14 place-items-center">
                      {section === "frame" ? (
                        <AvatarBadge
                          avatarId={cosmeticsOf(me.id).avatarId}
                          frameId={grant}
                          size="md"
                        />
                      ) : section === "avatar" ? (
                        <AvatarBadge avatarId={grant} frameId={null} size="md" />
                      ) : (
                        <TitleTag titleId={grant} />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{item.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <label className="text-xs font-semibold">
                      MC
                      <input
                        aria-label={`${item.name} price`}
                        type="number"
                        min={1}
                        max={1000}
                        value={priceOf(item)}
                        onChange={(event) =>
                          setPrices((current) => ({ ...current, [item.id]: event.target.value }))
                        }
                        className={cn(field, "mt-1")}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={shownOf(item)}
                        onChange={(event) =>
                          setShown((current) => ({ ...current, [item.id]: event.target.checked }))
                        }
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                      Published
                    </label>
                    <Button
                      size="sm"
                      disabled={!dirty(item) || busyId === item.id}
                      onClick={() => void save(item)}
                    >
                      <Save /> Save
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </Panel>
  );
}
