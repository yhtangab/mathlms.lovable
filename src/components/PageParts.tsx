import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { TONES, toneForPath, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

/** Each page has its own colour, shared with its link in the navigation. */
function useRouteTone(): Tone {
  return useRouterState({ select: (state) => toneForPath(state.location.pathname) });
}

/** Colour banner used at the top of every page. */
export function PageHeader({
  title,
  description,
  actions,
  tone,
  eyebrow,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: Tone;
  eyebrow?: string;
}) {
  const routeTone = useRouteTone();
  const style = TONES[tone ?? routeTone];
  return (
    <header
      className={cn("relative overflow-hidden rounded-xl px-5 py-4 md:px-6 md:py-5", style.solid)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-7 h-28 w-28 rotate-12 rounded-3xl bg-white/10"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-9 right-24 h-20 w-20 rounded-full bg-white/10"
      />
      <div className="relative flex flex-wrap items-end gap-3">
        <div className="mr-auto min-w-0">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">{eyebrow}</p>
          ) : null}
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

/** A white section with a coloured marker and an optional title bar. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  tone,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  tone?: Tone;
}) {
  const routeTone = useRouteTone();
  const style = TONES[tone ?? routeTone];
  return (
    <section className={cn("rounded-xl border-2 border-border bg-card shadow-chunky", className)}>
      {title || actions ? (
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-border px-5 py-3">
          <div className="mr-auto flex min-w-0 items-center gap-2.5">
            {title ? (
              <span
                aria-hidden="true"
                className={cn("h-6 w-1.5 shrink-0 rounded-full", style.bar)}
              />
            ) : null}
            <div className="min-w-0">
              {title ? <h2 className="text-base font-bold">{title}</h2> : null}
              {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
            </div>
          </div>
          {actions}
        </div>
      ) : null}
      <div className={bodyClassName ?? "px-5 py-4"}>{children}</div>
    </section>
  );
}

/** A short message box for set-up problems or information. */
export function Notice({
  tone = "warning",
  children,
}: {
  tone?: "warning" | "error" | "info";
  children: ReactNode;
}) {
  const cls =
    tone === "error"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : tone === "info"
        ? "border-primary/30 bg-primary/10 text-foreground"
        : "border-gold/70 bg-gold/20 text-foreground";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-lg border-2 px-3 py-2 text-sm font-medium", cls)}
    >
      {children}
    </div>
  );
}

/** A solid coloured number card, used for the main figures on a page. */
export function StatCard({
  label,
  value,
  suffix,
  note,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: ReactNode;
  tone: Tone;
}) {
  return (
    <div className={cn("h-full rounded-xl p-4", TONES[tone].solid)}>
      <p className="text-sm font-semibold opacity-90">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {value}
        {suffix ? <span className="text-sm font-semibold opacity-80"> {suffix}</span> : null}
      </p>
      {note ? <div className="mt-1 text-xs font-medium opacity-90">{note}</div> : null}
    </div>
  );
}
