import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { AvatarBadge, TitleTag, TitleTags } from "@/components/game/AvatarBadge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import {
  AVATARS,
  DEFAULT_FRAME_ID,
  FRAMES,
  TITLES,
  avatarById,
  frameById,
  itemKind,
  titleById,
} from "@/lib/gamification/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My profile — HLC Math" },
      { name: "description", content: "Choose your avatar, frame and title." },
      { property: "og:title", content: "My profile — HLC Math" },
      { property: "og:description", content: "Choose your avatar, frame and title." },
    ],
  }),
  component: ProfilePage,
});

const EXP_PER_LEVEL = 1000;

function ProfilePage() {
  const {
    role,
    me,
    cosmeticsOf,
    gameSnapshot,
    myUnlocks,
    readOnly,
    refresh,
    gameError,
    shopItems,
    ownedItems,
  } = useApp();
  const saved = cosmeticsOf(me.id);
  const [avatarId, setAvatarId] = useState(avatarById(saved.avatarId).id);
  const [frameId, setFrameId] = useState(frameById(saved.equippedFrameId).id);
  const equippedTitle = titleById(saved.equippedTitle)?.id ?? saved.equippedTitle ?? null;
  const equippedTitle2 = titleById(saved.equippedTitle2)?.id ?? saved.equippedTitle2 ?? null;
  const [titleId, setTitleId] = useState<string | null>(equippedTitle);
  const [titleId2, setTitleId2] = useState<string | null>(equippedTitle2);
  const [busy, setBusy] = useState(false);

  if (role !== "student") {
    return (
      <AppShell>
        <PageHeader title="My profile" />
        <div className="mt-6">
          <Notice tone="info">
            Profiles belong to students. Use Preview student version to see one.
          </Notice>
        </div>
      </AppShell>
    );
  }

  const ownedGrants = new Set(
    shopItems.filter((item) => ownedItems.includes(item.id)).flatMap((item) => item.grants),
  );
  const unlockedFrames = new Set([DEFAULT_FRAME_ID, ...myUnlocks.frames, ...ownedGrants]);
  const extraFrames = shopItems.filter(
    (item) =>
      item.active &&
      itemKind(item) === "frame" &&
      item.grants[0] &&
      !FRAMES.some((f) => f.id === item.grants[0]),
  );
  const extraTitles = shopItems.filter(
    (item) =>
      item.active &&
      itemKind(item) === "title" &&
      item.grants.length === 1 &&
      item.grants[0] &&
      !TITLES.some((t) => t.id === item.grants[0]),
  );
  const unlockedTitles = new Set([...myUnlocks.titles, ...ownedGrants]);
  const exp = me.game?.exp ?? me.xp;
  const level = me.game?.level ?? Math.floor(exp / EXP_PER_LEVEL) + 1;
  const changed =
    avatarId !== avatarById(saved.avatarId).id ||
    frameId !== frameById(saved.equippedFrameId).id ||
    titleId !== equippedTitle ||
    titleId2 !== equippedTitle2;
  const canSave = !readOnly && gameError === null && changed && !busy;

  const save = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("equip_cosmetics", {
        _avatar: avatarId,
        _frame: frameId === DEFAULT_FRAME_ID ? null : frameId,
        _title: titleId,
        _title2: titleId2,
      });
      if (error) throw new Error(error.message);
      await refresh();
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your profile");
    } finally {
      setBusy(false);
    }
  };

  const chooseTitle = (id: string | null) => {
    if (id === null || id === titleId) {
      setTitleId(titleId2);
      setTitleId2(null);
      return;
    }
    if (id === titleId2) {
      setTitleId2(null);
      return;
    }
    if (!titleId) setTitleId(id);
    else if (!titleId2) setTitleId2(id);
    else setTitleId2(id);
  };

  return (
    <AppShell>
      <PageHeader
        title="My profile"
        description="Pick your avatar, frame and up to two titles. Classmates see them on the leaderboard."
      />

      {readOnly ? (
        <div className="mt-4">
          <Notice tone="info">Preview only: changes cannot be saved.</Notice>
        </div>
      ) : !gameSnapshot ? (
        <div className="mt-4">
          <Notice tone="info">
            Frames and titles unlock after your teacher next publishes the marks.
          </Notice>
        </div>
      ) : null}

      <section className="mt-6 flex flex-wrap items-center gap-6 rounded-xl bg-nav p-6 text-nav-foreground shadow-pop">
        <AvatarBadge avatarId={avatarId} frameId={frameId} size="xl" />
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold">{me.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <TitleTags titles={[titleId, titleId2]} className="bg-white/90" />
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold">
              {me.set} {me.className} {me.classNo}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">
            Level {level}, {exp} EXP
          </p>
          <div className="mt-1 h-3 max-w-sm overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${((exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs opacity-80">
            {EXP_PER_LEVEL - (exp % EXP_PER_LEVEL)} EXP to Level {level + 1}
          </p>
        </div>
        <Button size="lg" disabled={!canSave} onClick={() => void save()}>
          {busy ? "Saving…" : readOnly ? "Preview only" : changed ? "Save profile" : "Saved"}
        </Button>
      </section>

      <p className="mt-4 text-sm text-muted-foreground">
        Want a locked frame or more titles sooner? Some can be bought in the{" "}
        <Link to="/shop" className="font-bold text-primary underline">
          Shop
        </Link>
        .
      </p>

      <Panel tone="berry" className="mt-6" title="Avatar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {AVATARS.map((a) => {
            const open = a.free || ownedGrants.has(a.id);
            const on = a.id === avatarId;
            return (
              <button
                type="button"
                key={a.id}
                disabled={!open}
                onClick={() => setAvatarId(a.id)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-transform hover:-translate-y-0.5",
                  on ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <AvatarBadge avatarId={a.id} frameId={null} size="md" />
                <span className="text-center text-xs font-bold leading-tight">{a.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {open ? (a.free ? "Free" : "Owned") : "Buy in the Shop"}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel tone="grape" className="mt-6" title="Frame">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FRAMES.map((f) => {
            const open = unlockedFrames.has(f.id);
            const on = f.id === frameId;
            return (
              <button
                type="button"
                key={f.id}
                disabled={!open}
                onClick={() => setFrameId(f.id)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center",
                  on ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <AvatarBadge avatarId={avatarId} frameId={f.id} size="lg" />
                <span className="text-xs font-bold">{f.name}</span>
                <span className="flex items-start gap-1 text-[11px] leading-tight text-muted-foreground">
                  {open ? (
                    on ? (
                      <>
                        <Check className="h-3 w-3 shrink-0" /> Equipped
                      </>
                    ) : (
                      "Unlocked"
                    )
                  ) : (
                    <>
                      <Lock className="h-3 w-3 shrink-0" /> {f.requirement}
                    </>
                  )}
                </span>
              </button>
            );
          })}
          {extraFrames.map((item) => {
            const id = item.grants[0] ?? item.id;
            const open = unlockedFrames.has(id);
            const on = id === frameId;
            return (
              <button
                type="button"
                key={item.id}
                disabled={!open}
                onClick={() => setFrameId(id)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center",
                  on ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <AvatarBadge avatarId={avatarId} frameId={id} size="lg" />
                <span className="text-xs font-bold">{item.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {open ? (on ? "Equipped" : "Unlocked") : "Buy it in the Shop"}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel tone="blue" className="mt-6" title="Titles">
        <p className="mb-3 text-sm text-muted-foreground">
          Choose up to two. Both appear on the leaderboard. Press a chosen title again to remove it.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => chooseTitle(null)}
            aria-pressed={titleId === null && titleId2 === null}
            className={cn(
              "rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold",
              titleId === null && titleId2 === null
                ? "border-primary bg-primary/5"
                : "border-border",
            )}
          >
            No titles
          </button>
          {TITLES.map((t) => {
            const open = unlockedTitles.has(t.id);
            const slot = t.id === titleId ? "Title 1" : t.id === titleId2 ? "Title 2" : null;
            return (
              <button
                type="button"
                key={t.id}
                disabled={!open}
                onClick={() => chooseTitle(t.id)}
                aria-pressed={slot !== null}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left",
                  slot ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  {open ? null : <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                  {t.label}
                  {slot ? <span className="text-xs text-primary">{slot}</span> : null}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t.requirement}</span>
              </button>
            );
          })}
          {extraTitles.map((item) => {
            const id = item.grants[0] ?? item.id;
            const open = unlockedTitles.has(id);
            const slot = id === titleId ? "Title 1" : id === titleId2 ? "Title 2" : null;
            return (
              <button
                type="button"
                key={item.id}
                disabled={!open}
                onClick={() => chooseTitle(id)}
                aria-pressed={slot !== null}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left",
                  slot ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <TitleTag titleId={id} />
                {slot ? <span className="ml-2 text-xs font-bold text-primary">{slot}</span> : null}
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {open ? "Bought in the Shop" : "Buy it in the Shop"}
                </span>
              </button>
            );
          })}
        </div>
      </Panel>
    </AppShell>
  );
}
