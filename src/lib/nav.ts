import {
  Archive,
  BookOpen,
  ClipboardList,
  Dices,
  Gift,
  LayoutDashboard,
  Medal,
  Sparkles,
  Store,
  Timer,
  Trophy,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Pages that exist today. Add a path here when its route file is created. */
export type LiveRoute =
  | "/dashboard"
  | "/courses"
  | "/homework"
  | "/awards"
  | "/teacher"
  | "/activity"
  | "/upload"
  | "/leaderboard"
  | "/profile"
  | "/shop"
  | "/badges"
  | "/mistake-vault"
  | "/gacha";

/**
 * A navigation entry. "soon" entries are pages planned for the next steps: real students
 * never see them, a teacher previewing the student site sees them greyed out.
 */
export type NavItem =
  | { status: "live"; to: LiveRoute; label: string; icon: LucideIcon }
  | { status: "soon"; path: string; label: string; icon: LucideIcon };

export const STUDENT_NAV: NavItem[] = [
  { status: "live", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { status: "live", to: "/courses", label: "Chapters", icon: BookOpen },
  { status: "live", to: "/homework", label: "Homework", icon: ClipboardList },
  { status: "live", to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { status: "live", to: "/mistake-vault", label: "Mistake Vault", icon: Archive },
  { status: "live", to: "/badges", label: "Badges", icon: Medal },
  { status: "live", to: "/shop", label: "Shop", icon: Store },
  { status: "live", to: "/gacha", label: "Gacha", icon: Sparkles },
];

export const TEACHER_NAV: NavItem[] = [
  { status: "live", to: "/teacher", label: "Analytics", icon: Users },
  { status: "live", to: "/homework", label: "Homework", icon: ClipboardList },
  { status: "live", to: "/activity", label: "Class activity", icon: Dices },
  { status: "live", to: "/upload", label: "Content", icon: Upload },
  { status: "live", to: "/mistake-vault", label: "Exam dates", icon: Timer },
  { status: "live", to: "/awards", label: "Awards", icon: Gift },
  { status: "live", to: "/leaderboard", label: "Rankings", icon: Trophy },
];

export function navKey(item: NavItem): string {
  return item.status === "live" ? item.to : item.path;
}

/** Real students only see pages that exist; a teacher previewing also sees what is coming. */
export function visibleNav(items: readonly NavItem[], showSoon: boolean): NavItem[] {
  return showSoon ? [...items] : items.filter((i) => i.status === "live");
}
