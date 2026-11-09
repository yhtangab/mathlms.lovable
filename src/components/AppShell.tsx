import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Trophy, Upload, Users } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, setRole, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem("hlc-session")) navigate({ to: "/" });
    }, 50);
    return () => clearTimeout(t);
  }, [session, navigate]);

  const links =
    role === "student"
      ? [
          { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/courses", label: "Course Hub", icon: BookOpen },
          { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
        ]
      : [
          { to: "/teacher", label: "Analytics", icon: Users },
          { to: "/upload", label: "Upload Room", icon: Upload },
          { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
        ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b-2 border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to={role === "student" ? "/dashboard" : "/teacher"} className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-chunky-primary">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold text-foreground">
              HLC <span className="text-primary">Math</span>Quest
            </span>
          </Link>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:ml-6 md:w-auto">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"
                activeProps={{ className: "!bg-primary/10 !text-primary" }}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-2xl bg-muted p-1 text-xs font-bold">
              {(["student", "teacher"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    navigate({ to: r === "student" ? "/dashboard" : "/teacher" });
                  }}
                  className={cn(
                    "rounded-xl px-3 py-1.5 transition",
                    role === r ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {r === "student" ? "Student" : "Teacher"}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/", replace: true });
              }}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
              aria-label="Sign out"
              title={session?.email}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}

export function scoreTone(s: number | null) {
  if (s === null) return "bg-muted text-muted-foreground";
  if (s >= 85) return "bg-success/15 text-success";
  if (s >= 60) return "bg-primary/10 text-primary";
  return "bg-destructive/15 text-destructive";
}
