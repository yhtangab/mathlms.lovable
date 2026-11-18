import { useApp } from "@/lib/app-store";
import { avatarById, frameFromLooks, titleAppearance } from "@/lib/gamification/catalog";
import { TONES } from "@/lib/tones";
import { cn } from "@/lib/utils";

/**
 * Frame looks. Colours come from the theme tokens in src/styles.css. Rendered once by AppShell.
 */
const FRAME_CSS = `
.hlc-frame { position: relative; display: inline-grid; place-items: center; border-radius: 9999px; flex-shrink: 0; isolation: isolate; }
.hlc-frame > .hlc-face { position: relative; z-index: 1; }
.hlc-frame-default > .hlc-face { box-shadow: 0 0 0 2px var(--border); }
.hlc-frame-gold > .hlc-face { box-shadow: 0 0 0 3px var(--gold), 0 0 0 6px var(--gold-deep); }
.hlc-frame-neon > .hlc-face { animation: hlc-neon 1.6s ease-in-out infinite alternate; }
@keyframes hlc-neon {
  from { box-shadow: 0 0 0 3px var(--primary), 0 0 4px 1px var(--sky); }
  to { box-shadow: 0 0 0 3px var(--sky), 0 0 16px 6px var(--primary); }
}
.hlc-frame-prism::before {
  content: ""; position: absolute; inset: -5px; border-radius: 9999px; z-index: 0;
  background: conic-gradient(var(--berry), var(--flame), var(--gold), var(--success), var(--sky), var(--grape), var(--berry));
  animation: hlc-spin 6s linear infinite;
}
@keyframes hlc-spin { to { transform: rotate(360deg); } }
.hlc-frame-poly::before, .hlc-frame-poly::after {
  content: ""; position: absolute; inset: -8px; z-index: 0;
  clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  animation: hlc-spin 8s linear infinite;
}
.hlc-frame-poly::before { background: var(--grape-deep); }
.hlc-frame-poly::after { background: linear-gradient(120deg, var(--sky) 0 33%, var(--grape) 33% 66%, transparent 66%); opacity: 0.85; }
.hlc-frame-orbit::before {
  content: ""; position: absolute; inset: -6px; border-radius: 9999px; z-index: 0;
  border: 3px dashed var(--sky-deep);
  animation: hlc-spin 4s linear infinite;
}
.hlc-frame-spark > .hlc-face { animation: hlc-spark 1.4s ease-in-out infinite; }
@keyframes hlc-spark {
  0%, 100% { box-shadow: 0 0 0 3px var(--gold), 0 0 0 0 var(--gold); }
  50% { box-shadow: 0 0 0 3px var(--gold), 0 0 14px 4px var(--gold); }
}
.hlc-frame-wave::before {
  content: ""; position: absolute; inset: -5px; border-radius: 9999px; z-index: 0;
  background: linear-gradient(120deg, var(--sky), var(--grape), var(--berry), var(--sky));
  background-size: 200% 200%;
  animation: hlc-wave 3s ease-in-out infinite;
}
@keyframes hlc-wave {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.hlc-frame-comet::before {
  content: ""; position: absolute; inset: -6px; border-radius: 9999px; z-index: 0;
  background: conic-gradient(from 0deg, transparent 0 75%, var(--flame) 88%, var(--gold) 100%);
  animation: hlc-spin 2.4s linear infinite;
}
.hlc-frame-aurora::before {
  content: ""; position: absolute; inset: -6px; border-radius: 9999px; z-index: 0;
  background: linear-gradient(90deg, var(--success), var(--sky), var(--grape));
  animation: hlc-aurora 2.8s ease-in-out infinite alternate;
}
@keyframes hlc-aurora {
  from { opacity: 0.55; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1.04); }
}
.hlc-frame-halo > .hlc-face { animation: hlc-halo 1.8s ease-in-out infinite; }
@keyframes hlc-halo {
  0%, 100% { box-shadow: 0 0 0 4px var(--primary); }
  50% { box-shadow: 0 0 0 8px var(--sky); }
}
.hlc-avatar-flame { animation: hlc-avatar-flame 1.2s ease-in-out infinite; }
@keyframes hlc-avatar-flame {
  0%, 100% { box-shadow: 0 0 0 0 var(--flame); }
  50% { box-shadow: 0 0 12px 3px var(--flame); }
}
.hlc-avatar-prism { animation: hlc-avatar-prism 2.4s linear infinite; }
@keyframes hlc-avatar-prism {
  0% { box-shadow: 0 0 0 3px var(--berry); }
  33% { box-shadow: 0 0 0 3px var(--gold); }
  66% { box-shadow: 0 0 0 3px var(--sky); }
  100% { box-shadow: 0 0 0 3px var(--berry); }
}
.hlc-avatar-spark { animation: hlc-spark 1.4s ease-in-out infinite; }
.hlc-avatar-glow { animation: hlc-title-glow 1.6s ease-in-out infinite alternate; }
.hlc-avatar-float { animation: hlc-title-float 2.4s ease-in-out infinite; }
.hlc-title-shimmer {
  background-image: linear-gradient(100deg, var(--primary-deep) 20%, var(--gold) 45%, var(--primary-deep) 70%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: hlc-shimmer 2.2s linear infinite;
}
@keyframes hlc-shimmer { to { background-position: -200% 0; } }
.hlc-title-glow { animation: hlc-title-glow 1.6s ease-in-out infinite alternate; }
@keyframes hlc-title-glow {
  from { text-shadow: 0 0 0 var(--grape); }
  to { text-shadow: 0 0 8px var(--grape); }
}
.hlc-title-bounce { animation: hlc-title-bounce 1.3s ease-in-out infinite; }
@keyframes hlc-title-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.hlc-title-float { animation: hlc-title-float 2.4s ease-in-out infinite; }
@keyframes hlc-title-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.hlc-title-flash { animation: hlc-title-flash 1.5s steps(2, end) infinite; }
@keyframes hlc-title-flash { 50% { opacity: 0.45; } }
@media (prefers-reduced-motion: reduce) {
  .hlc-frame-neon > .hlc-face,
  .hlc-frame-prism::before,
  .hlc-frame-poly::before,
  .hlc-frame-poly::after,
  .hlc-frame-orbit::before,
  .hlc-frame-spark > .hlc-face,
  .hlc-frame-wave::before,
  .hlc-frame-comet::before,
  .hlc-frame-aurora::before,
  .hlc-frame-halo > .hlc-face,
  .hlc-avatar-flame,
  .hlc-avatar-prism,
  .hlc-avatar-spark,
  .hlc-avatar-glow,
  .hlc-avatar-float,
  .hlc-title-shimmer,
  .hlc-title-glow,
  .hlc-title-bounce,
  .hlc-title-float,
  .hlc-title-flash { animation: none; }
}
`;

/** Adds the frame styles to the page. AppShell renders this once. */
export function FrameStyles() {
  return <style>{FRAME_CSS}</style>;
}

type Size = "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, string> = {
  sm: "h-8 w-8 text-base",
  md: "h-12 w-12 text-2xl",
  lg: "h-16 w-16 text-3xl",
  xl: "h-28 w-28 text-6xl",
};

/** An avatar inside its frame. Unknown ids fall back to the owl and the classic frame. */
export function AvatarBadge({
  avatarId,
  frameId,
  size = "md",
  className,
}: {
  avatarId: string | null;
  frameId: string | null;
  size?: Size;
  className?: string;
}) {
  const { shopItems } = useApp();
  const avatar = avatarById(avatarId);
  const frame = frameFromLooks(frameId, shopItems);
  return (
    <span
      className={cn("hlc-frame", `hlc-frame-${frame.style}`, className)}
      title={`${avatar.name}, ${frame.name} frame`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "hlc-face grid place-items-center rounded-full leading-none",
          TONES[avatar.tone].flat,
          avatar.effect !== "none" && `hlc-avatar-${avatar.effect}`,
          SIZES[size],
        )}
      >
        {avatar.emoji}
      </span>
      {frame.style === "gold" && size !== "sm" ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 z-10 grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] shadow-coin"
        >
          🧭
        </span>
      ) : null}
      <span className="sr-only">{avatar.name}</span>
    </span>
  );
}

/** The equipped title as a small pill; nothing when no title is equipped. */
export function TitleTag({ titleId, className }: { titleId: string | null; className?: string }) {
  const { shopItems } = useApp();
  const title = titleAppearance(titleId, shopItems);
  if (!title) return null;
  return (
    <span
      className={cn(
        "hlc-title inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary-deep",
        title.motion !== "none" && `hlc-title-${title.motion}`,
        className,
      )}
      style={
        title.motion === "none" && (title.ink || title.paper)
          ? {
              ...(title.ink ? { color: title.ink } : {}),
              ...(title.paper ? { backgroundColor: title.paper } : {}),
            }
          : undefined
      }
    >
      {title.label}
    </span>
  );
}

/** Equipped titles, up to two, in the order the student chose. */
export function TitleTags({
  titles,
  className,
}: {
  titles: readonly (string | null | undefined)[];
  className?: string;
}) {
  const ids = titles.filter((id): id is string => Boolean(id));
  if (ids.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {ids.map((id) => (
        <TitleTag key={id} titleId={id} {...(className ? { className } : {})} />
      ))}
    </span>
  );
}

/** Anonymous card face for students below 10th on a leaderboard. */
export function AnonymousAvatar({ size = "sm" }: { size?: Size }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-muted text-muted-foreground leading-none",
        SIZES[size],
      )}
    >
      ?
    </span>
  );
}
