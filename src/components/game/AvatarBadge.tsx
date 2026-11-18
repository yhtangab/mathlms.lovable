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
}
.hlc-frame-poly::before { background: var(--grape-deep); }
.hlc-frame-poly::after { inset: -8px; background: linear-gradient(120deg, var(--sky) 0 33%, var(--grape) 33% 66%, transparent 66%); opacity: 0.85; }
@media (prefers-reduced-motion: reduce) {
  .hlc-frame-neon > .hlc-face, .hlc-frame-prism::before { animation: none; }
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
        "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary-deep",
        className,
      )}
      style={
        title.ink || title.paper ? { color: title.ink, backgroundColor: title.paper } : undefined
      }
    >
      {title.label}
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
