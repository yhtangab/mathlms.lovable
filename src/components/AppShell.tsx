import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardList,
  Dices,
  Gift,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Trophy,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/app-store";
import { coinBalance } from "@/lib/coins";
import { TONES, toneForPath } from "@/lib/tones";
import { cn } from "@/lib/utils";

interface NavLink {
  to:
    | "/dashboard"
    | "/courses"
    | "/homework"
    | "/awards"
    | "/teacher"
    | "/activity"
    | "/upload"
    | "/leaderboard";
  label: string;
  icon: LucideIcon;
}

const STUDENT_LINKS: NavLink[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Chapters", icon: BookOpen },
  { to: "/homework", label: "Homework", icon: ClipboardList },
  { to: "/awards", label: "Awards", icon: Gift },
];

const TEACHER_LINKS: NavLink[] = [
  { to: "/teacher", label: "Analytics", icon: Users },
  { to: "/homework", label: "Homework", icon: ClipboardList },
  { to: "/activity", label: "Class activity", icon: Dices },
  { to: "/upload", label: "Content", icon: Upload },
  { to: "/awards", label: "Awards", icon: Gift },
  { to: "/leaderboard", label: "Rankings", icon: Trophy },
];

/** The student's Math Coins balance, shown in the top bar. */
function CoinChip({ amount }: { amount: number }) {
  return (
    <Link
      to="/awards"
      title="Math Coins"
      className="flex items-center gap-1.5 rounded-full bg-gold/30 py-1 pl-1 pr-3 text-sm font-bold text-gold-deep transition-transform hover:-translate-y-0.5"
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground shadow-coin"
      >
        M
      </span>
      <span className="tabular-nums">{amount}</span>
      <span className="sr-only">Math Coins</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, logout, ready, error, me } = useApp();
  const navigate = useNavigate();
  const links = role === "student" ? STUDENT_LINKS : TEACHER_LINKS;
  const home = role === "teacher" ? "/teacher" : "/dashboard";
  const context = role === "teacher" ? "Teacher" : me.id ? `${me.set}` : "Student";
  const showCoins = role === "student" && Boolean(me.id);
  const coins = coinBalance(me);

  const signOut = async () => {
    await logout();
    await navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background md:pl-[88px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col bg-nav text-nav-foreground md:flex">
        <Link
          to={home}
          aria-label="HLC Math home"
          className="flex h-[72px] shrink-0 items-center justify-center"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-accent-foreground shadow-chunky-gold">
            <GraduationCap className="h-6 w-6" />
          </span>
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-1">
          {links.map((l) => {
            const tone = TONES[toneForPath(l.to)];
            return (
              <Link
                key={l.to}
                to={l.to}
                className="group flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-center text-[11px] font-bold leading-tight"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl transition-transform group-hover:-translate-y-0.5",
                        isActive ? tone.solid : cn(tone.dim, "text-nav-foreground"),
                      )}
                    >
                      <l.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={
                        isActive
                          ? "text-nav-foreground"
                          : "text-nav-foreground/70 group-hover:text-nav-foreground"
                      }
                    >
                      {l.label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="group mx-2 mb-3 flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold text-nav-foreground/70 transition-colors hover:text-nav-foreground"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 group-hover:bg-white/20">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </span>
          Sign out
        </button>
      </aside>

      <header className="sticky top-0 z-30 bg-nav text-nav-foreground md:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Link to={home} className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-accent-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            HLC Mathematics
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {showCoins ? <CoinChip amount={coins} /> : null}
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Sign out"
              className="rounded-lg p-2 text-nav-foreground/80 hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav aria-label="Main" className="flex gap-1.5 overflow-x-auto px-3 pb-3">
          {links.map((l) => {
            const tone = TONES[toneForPath(l.to)];
            return (
              <Link key={l.to} to={l.to} className="shrink-0">
                {({ isActive }) => (
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold",
                      isActive ? tone.flat : "bg-white/10 text-nav-foreground/85",
                    )}
                  >
                    <l.icon className="h-4 w-4" aria-hidden="true" />
                    {l.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="hidden h-14 items-center gap-3 border-b-2 border-border bg-card px-8 md:flex">
        <p className="flex items-center gap-2 text-sm">
          <span className="font-bold">HLC Mathematics</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary-deep">
            {context}
          </span>
        </p>
        <div className="ml-auto flex items-center gap-3">
          {showCoins ? <CoinChip amount={coins} /> : null}
          <p className="truncate text-sm text-muted-foreground">{session?.email}</p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading your records…</p>
        ) : error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : !session ? (
          <Link to="/" className="text-primary underline">
            Sign in
          </Link>
        ) : role === "student" && !me.id ? (
          <p className="text-sm">
            Your school account is not linked to a student record yet. Please contact your
            Mathematics teacher.
          </p>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export function TeacherOnly({ children }: { children: ReactNode }) {
  const { role } = useApp();
  return role === "teacher" ? children : <p>Teacher access required.</p>;
}

export function scoreTone(s: number | null) {
  return s === null
    ? "bg-muted text-muted-foreground"
    : s >= 85
      ? "bg-success/15 text-success-deep"
      : s >= 60
        ? "bg-primary/10 text-primary-deep"
        : "bg-destructive/12 text-destructive";
}

export const CHAPTER_STATUS = {
  Completed: { cls: "bg-success/15 text-success-deep", icon: CheckCircle2 },
  "In Progress": { cls: "bg-gold/30 text-gold-deep", icon: PlayCircle },
  "Not Started": { cls: "bg-muted text-muted-foreground", icon: Circle },
};
