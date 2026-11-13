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

export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, logout, ready, error, me } = useApp();
  const navigate = useNavigate();
  const links = role === "student" ? STUDENT_LINKS : TEACHER_LINKS;
  const home = role === "teacher" ? "/teacher" : "/dashboard";
  const context = role === "teacher" ? "Teacher" : me.id ? `${me.set}` : "Student";

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
          className="flex h-16 items-center justify-center border-b border-nav-foreground/10"
        >
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
        </Link>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-0.5 px-1.5 py-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-center text-[11px] font-medium leading-tight transition-colors"
              activeProps={{ className: "bg-card text-primary" }}
              inactiveProps={{
                className:
                  "text-nav-foreground/80 hover:bg-nav-foreground/10 hover:text-nav-foreground",
              }}
            >
              <l.icon className="h-5 w-5" aria-hidden="true" />
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mx-1.5 mb-3 flex flex-col items-center gap-1 rounded-md px-1 py-2.5 text-[11px] font-medium text-nav-foreground/80 transition-colors hover:bg-nav-foreground/10 hover:text-nav-foreground"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sign out
        </button>
      </aside>

      <header className="sticky top-0 z-30 bg-nav text-nav-foreground md:hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Link to={home} className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            HLC Mathematics
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            aria-label="Sign out"
            className="ml-auto rounded-md p-2 text-nav-foreground/80 hover:bg-nav-foreground/10"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-2 pb-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
              activeProps={{ className: "bg-card text-primary" }}
              inactiveProps={{ className: "text-nav-foreground/80" }}
            >
              <l.icon className="h-4 w-4" aria-hidden="true" />
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="hidden h-12 items-center gap-3 border-b border-border bg-card px-8 md:flex">
        <p className="text-sm">
          <span className="font-semibold">HLC Mathematics</span>
          <span className="text-muted-foreground"> / {context}</span>
        </p>
        <p className="ml-auto truncate text-sm text-muted-foreground">{session?.email}</p>
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
      ? "bg-success/15 text-success"
      : s >= 60
        ? "bg-primary/10 text-primary"
        : "bg-destructive/15 text-destructive";
}

export const CHAPTER_STATUS = {
  Completed: { cls: "bg-success/15 text-success", icon: CheckCircle2 },
  "In Progress": { cls: "bg-gold/25 text-gold-deep", icon: PlayCircle },
  "Not Started": { cls: "bg-muted text-muted-foreground", icon: Circle },
};
