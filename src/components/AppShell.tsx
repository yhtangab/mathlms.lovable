import { Link, useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { BookOpen, CheckCircle2, Circle, GraduationCap, PlayCircle, LayoutDashboard, LogOut, Trophy, Upload, Users } from 'lucide-react';
import { useApp } from '@/lib/app-store';
import { Button } from '@/components/ui/button';
export function AppShell({ children }: { children: ReactNode }) {
  const { session, role, logout, ready, error, me } = useApp();
  const navigate = useNavigate();
  const links = role === 'student' ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/courses', label: 'Chapter', icon: BookOpen }] : [{ to: '/teacher', label: 'Analytics', icon: Users }, { to: '/upload', label: 'Chapter content', icon: Upload }, { to: '/leaderboard', label: 'Leaderboard', icon: Trophy }];
  return <div className="min-h-screen bg-background"><header className="sticky top-0 z-30 border-b border-border bg-card"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3"><Link to={role === 'teacher' ? '/teacher' : '/dashboard'} className="flex items-center gap-2 font-display text-xl font-semibold"><GraduationCap className="h-6 w-6 text-primary" />HLC Math</Link><nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:ml-6 md:w-auto">{links.map(l => <Link key={l.to} to={l.to} className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground" activeProps={{ className: 'bg-muted text-primary' }}><l.icon className="h-4 w-4" />{l.label}</Link>)}</nav><div className="ml-auto flex items-center gap-2"><span className="text-sm capitalize text-muted-foreground">{role}</span><Button variant="ghost" size="icon" aria-label="Sign out" title={session?.email} onClick={async () => { await logout(); await navigate({ to: '/', replace: true }); }}><LogOut /></Button></div></div></header><main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{!ready ? <p>Loading your records…</p> : error ? <p role="alert" className="text-destructive">{error}</p> : !session ? <Link to="/">Sign in</Link> : role === 'student' && !me.id ? <p>Your school account is not linked to a student record yet. Please contact your teacher.</p> : children}</main></div>;
}
export function TeacherOnly({ children }: { children: ReactNode }) { const { role } = useApp(); return role === 'teacher' ? children : <p>Teacher access required.</p>; }
export function scoreTone(s: number | null) { return s === null ? 'bg-muted text-muted-foreground' : s >= 85 ? 'bg-success/15 text-success' : s >= 60 ? 'bg-primary/10 text-primary' : 'bg-destructive/15 text-destructive'; }
export const CHAPTER_STATUS = {
  Completed: { cls: 'bg-success/15 text-success', icon: CheckCircle2 },
  'In Progress': { cls: 'bg-gold/25 text-gold-deep', icon: PlayCircle },
  'Not Started': { cls: 'bg-muted text-muted-foreground', icon: Circle },
};
