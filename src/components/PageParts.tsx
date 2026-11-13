import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page title row used at the top of every page. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end gap-3 border-b border-border pb-4">
      <div className="mr-auto min-w-0">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** A white section with an optional title bar. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card shadow-chunky", className)}>
      {title || actions ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
          <div className="mr-auto min-w-0">
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
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
      ? "border-destructive/30 bg-destructive/5 text-destructive"
      : tone === "info"
        ? "border-primary/25 bg-primary/5 text-foreground"
        : "border-gold/50 bg-gold/10 text-foreground";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-3 py-2 text-sm", cls)}
    >
      {children}
    </div>
  );
}
