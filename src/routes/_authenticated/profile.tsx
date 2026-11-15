import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Notice, PageHeader, Panel } from "@/components/PageParts";
import { AvatarBadge, TitleTag } from "@/components/game/AvatarBadge";
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
  titleById,
} from "@/lib/gamification/catalog";
import { TONES } from "@/lib/tones";
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
  const { role, me, cosmeticsOf, gameSnapshot, myUnlocks, readOnly, refresh, gameError } = useApp();
  const saved = cosmeticsOf(me.id);
  const [avatarId, setAvatarId] = useState(avatarById(saved.avatarId).id);
  const [frameId, setFrameId] = useState(frameById(saved.equippedFrameId).id);
  const [titleId, setTitleId] = useState<string | null>(titleById(saved.equippedTitle)?.id ?? null);
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

  const unlockedFrames = new Set([DEFAULT_FRAME_ID, ...myUnlocks.frames]);
  const unlockedTitles = new Set(myUnlocks.titles);
  const exp = me.game?.exp ?? me.xp;
  const level = me.game?.level ?? Math.floor(exp / EXP_PER_LEVEL) + 1;
  const changed =
    avatarId !== avatarById(saved.avatarId).id ||
    frameId !== frameById(saved.equippedFrameId).id ||
    titleId !== (titleById(saved.equippedTitle)?.id ?? null);
  const canSave = !readOnly && gameError === null && changed && !busy;

  const save = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("equip_cosmetics", {
        _avatar: avatarId,
        _frame: frameId === DEFAULT_FRAME_ID ? null : frameId,
        _title: titleId,
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

  return (
    <AppShell>
      <PageHeader
        title="My profile"
        description="Pick your avatar, frame and title. Classmates see them on the leaderboard."
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
            <TitleTag titleId={titleId} className="bg-white/90" />
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
            const on = a.id === avatarId;
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => setAvatarId(a.id)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-transform hover:-translate-y-0.5",
                  on ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-full text-3xl",
                    TONES[a.tone].flat,
                  )}
                >
                  {a.emoji}
                </span>
                <span className="text-center text-xs font-bold leading-tight">{a.name}</span>
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
        </div>
      </Panel>

      <Panel tone="blue" className="mt-6" title="Title">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setTitleId(null)}
            aria-pressed={titleId === null}
            className={cn(
              "rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold",
              titleId === null ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            No title
          </button>
          {TITLES.map((t) => {
            const open = unlockedTitles.has(t.id);
            const on = t.id === titleId;
            return (
              <button
                type="button"
                key={t.id}
                disabled={!open}
                onClick={() => setTitleId(t.id)}
                aria-pressed={on}
                className={cn(
                  "rounded-xl border-2 px-3 py-2.5 text-left",
                  on ? "border-primary bg-primary/5" : "border-border",
                  !open && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  {open ? null : <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{t.requirement}</span>
              </button>
            );
          })}
        </div>
      </Panel>
    </AppShell>
  );
}
