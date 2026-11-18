import { useState } from "react";
import { GripVertical, Minus, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { AvatarBadge } from "@/components/game/AvatarBadge";
import { Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type ShopItem } from "@/lib/app-store";
import { FRAME_STYLES, itemKind, type FrameStyle } from "@/lib/gamification/catalog";
import { cn } from "@/lib/utils";

interface Draft {
  id: string;
  grant: string;
  emoji: string;
  name: string;
  description: string;
  price: string;
  kind: "frame" | "title";
  ink: string;
  paper: string;
  style: FrameStyle;
  active: boolean;
  position: number;
  isNew: boolean;
}

const field =
  "w-full min-w-0 rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus:border-primary";

function slug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

function toDraft(item: ShopItem): Draft {
  const kind = itemKind(item);
  const style = FRAME_STYLES.find((s) => s === item.style) ?? "gold";
  return {
    id: item.id,
    grant: item.grants[0] ?? (kind === "title" ? "title-unknown" : "frame-unknown"),
    emoji: item.emoji || "✨",
    name: item.name,
    description: item.description,
    price: String(item.price),
    kind,
    ink: item.ink || "#5b21b6",
    paper: item.paper || "#ede9fe",
    style,
    active: item.active,
    position: item.position,
    isNew: false,
  };
}

/** Teacher editor for frames and titles sold in Looks. */
export function LooksEditor() {
  const { shopItems, refresh, cosmeticsOf, me } = useApp();
  const [edits, setEdits] = useState<Record<string, Draft>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const rows = [
    ...shopItems.map((item) => edits[item.id] ?? toDraft(item)),
    ...Object.values(edits).filter((d) => d.isNew && !shopItems.some((item) => item.id === d.id)),
  ].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));

  const change = (d: Draft, patch: Partial<Draft>) =>
    setEdits((current) => ({ ...current, [d.id]: { ...d, ...patch } }));

  const add = (kind: "frame" | "title") => {
    const id = slug();
    const draft: Draft = {
      id: `shop-${id}`,
      grant: `${kind === "title" ? "title" : "frame"}-${id}`,
      emoji: kind === "title" ? "Σ" : "🧭",
      name: "",
      description: "",
      price: kind === "title" ? "5" : "8",
      kind,
      ink: "#5b21b6",
      paper: "#ede9fe",
      style: "gold",
      active: true,
      position: Math.max(0, ...rows.map((d) => d.position)) + 1,
      isNew: true,
    };
    setEdits((current) => ({ ...current, [draft.id]: draft }));
  };

  const save = async (d: Draft) => {
    const price = Number(d.price);
    if (!d.name.trim()) {
      toast.error("Give the look a name");
      return;
    }
    if (!Number.isInteger(price) || price < 1 || price > 1000) {
      toast.error("Price must be a whole number from 1 to 1000");
      return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(d.ink) || !/^#[0-9a-fA-F]{6}$/.test(d.paper)) {
      toast.error("Colours must be like #5b21b6");
      return;
    }
    setBusyId(d.id);
    try {
      const { error } = await supabase.from("shop_items").upsert({
        id: d.id,
        name: d.name.trim(),
        description: d.description.trim(),
        price,
        grants: [d.grant],
        active: d.active,
        position: d.position,
        kind: d.kind,
        emoji: d.emoji.trim() || "✨",
        ink: d.ink,
        paper: d.paper,
        style: d.kind === "frame" ? d.style : null,
      });
      if (error) throw new Error(error.message);
      await refresh();
      setEdits(({ [d.id]: _saved, ...rest }) => rest);
      toast.success(`${d.name.trim()} saved`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not save this look";
      toast.error(
        message.includes("kind") || message.includes("schema")
          ? "Run supabase/sql/0015_looks_badges.sql in the Supabase SQL Editor, then save again."
          : message,
      );
    } finally {
      setBusyId(null);
    }
  };

  const persistOrder = async (positioned: Draft[]) => {
    setEdits((current) => {
      const copy = { ...current };
      for (const d of positioned) copy[d.id] = d;
      return copy;
    });
    try {
      const saved = positioned.filter((d) => shopItems.some((item) => item.id === d.id));
      for (const d of saved) {
        const { error } = await supabase
          .from("shop_items")
          .update({ position: d.position })
          .eq("id", d.id);
        if (error) throw new Error(error.message);
      }
      await refresh();
      setEdits((current) => {
        const copy = { ...current };
        for (const d of saved) {
          const draft = copy[d.id];
          if (draft && !draft.isNew) delete copy[d.id];
        }
        return copy;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not reorder the looks");
    }
  };

  const dropOn = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = rows.findIndex((d) => d.id === dragId);
    const to = rows.findIndex((d) => d.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    void persistOrder(next.map((d, i) => ({ ...d, position: i + 1 })));
    setDragId(null);
  };

  const remove = async (d: Draft) => {
    if (!window.confirm(`Remove "${d.name || "this look"}"?`)) return;
    if (d.isNew) {
      setEdits(({ [d.id]: _gone, ...rest }) => rest);
      return;
    }
    setBusyId(d.id);
    try {
      const { error } = await supabase.from("shop_items").delete().eq("id", d.id);
      if (error) throw new Error(error.message);
      await refresh();
      setEdits(({ [d.id]: _gone, ...rest }) => rest);
      toast.success("Look removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove this look");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Panel
      className="mt-6"
      title="Looks"
      description="Each row is one frame or one title. Students buy them straight away. Drag a row to change the order."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => add("frame")}>
            <Plus /> Add frame
          </Button>
          <Button variant="outline" size="sm" onClick={() => add("title")}>
            <Plus /> Add title
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        {rows.map((d) => {
          const dirty = edits[d.id] !== undefined;
          return (
            <div
              key={d.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropOn(d.id)}
              className={cn(
                "rounded-md border p-2",
                dirty ? "border-primary/60 bg-primary/5" : "border-border",
              )}
            >
              <div className="grid items-center gap-2 md:grid-cols-[2rem_3.25rem_minmax(0,1.4fr)_6rem_7rem_4.5rem_3.25rem_auto]">
                <button
                  type="button"
                  draggable
                  aria-label={`Drag ${d.name || "look"}`}
                  className="grid h-9 w-8 cursor-grab place-items-center text-muted-foreground"
                  onDragStart={() => setDragId(d.id)}
                  onDragEnd={() => setDragId(null)}
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                <input
                  aria-label="Icon"
                  value={d.emoji}
                  onChange={(e) => change(d, { emoji: e.target.value })}
                  className={cn(field, "text-center text-lg")}
                />
                <input
                  aria-label="Name"
                  value={d.name}
                  placeholder={d.kind === "title" ? "Title name" : "Frame name"}
                  onChange={(e) => change(d, { name: e.target.value })}
                  className={field}
                />
                <select
                  aria-label="Kind"
                  value={d.kind}
                  disabled={!d.isNew}
                  onChange={(e) => {
                    const kind = e.target.value === "title" ? "title" : "frame";
                    const suffix = d.grant.replace(/^(title|frame)-/, "");
                    change(d, { kind, grant: `${kind}-${suffix}` });
                  }}
                  className={field}
                >
                  <option value="frame">Frame</option>
                  <option value="title">Title</option>
                </select>
                <input
                  aria-label="Price"
                  type="number"
                  min={1}
                  max={1000}
                  value={d.price}
                  onChange={(e) => change(d, { price: e.target.value })}
                  className={field}
                />
                <label className="flex items-center justify-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={d.active}
                    onChange={(e) => change(d, { active: e.target.checked })}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  <span className="md:sr-only">Shown</span>
                </label>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    disabled={!dirty || busyId === d.id}
                    onClick={() => void save(d)}
                  >
                    <Save /> Save
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Remove ${d.name || "look"}`}
                    disabled={busyId === d.id}
                    onClick={() => void remove(d)}
                  >
                    <Minus />
                  </Button>
                </div>
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
                <input
                  aria-label="Description"
                  value={d.description}
                  placeholder="What the student reads on the card"
                  onChange={(e) => change(d, { description: e.target.value })}
                  className={field}
                />
                {d.kind === "title" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1 text-xs font-semibold">
                      Text
                      <input
                        aria-label="Text colour"
                        type="color"
                        value={d.ink}
                        onChange={(e) => change(d, { ink: e.target.value })}
                      />
                    </label>
                    <label className="flex items-center gap-1 text-xs font-semibold">
                      Background
                      <input
                        aria-label="Background colour"
                        type="color"
                        value={d.paper}
                        onChange={(e) => change(d, { paper: e.target.value })}
                      />
                    </label>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{ color: d.ink, backgroundColor: d.paper }}
                    >
                      {d.name || "Title"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Frame style"
                      value={d.style}
                      onChange={(e) => {
                        const style = FRAME_STYLES.find((s) => s === e.target.value) ?? "gold";
                        change(d, { style });
                      }}
                      className={field}
                    >
                      {FRAME_STYLES.filter((s) => s !== "default").map((style) => (
                        <option key={style} value={style}>
                          {style}
                        </option>
                      ))}
                    </select>
                    <AvatarBadge
                      avatarId={cosmeticsOf(me.id).avatarId}
                      frameId={d.grant}
                      size="md"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
