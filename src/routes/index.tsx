import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Flame, Trophy, Star } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { STUDENTS } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — HLC MathQuest S2" },
      { name: "description", content: "Sign in with your @hlc.edu.hk Google account to track S2 Math scores and ranks." },
      { property: "og:title", content: "HLC MathQuest — S2 Math" },
      { property: "og:description", content: "Gamified S2 Mathematics scores, ranks and streaks for HLC." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, setRole } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(STUDENTS[0].email);

  const submit = (asTeacher: boolean) => {
    const e = email.trim().toLowerCase();
    if (!e.endsWith("@hlc.edu.hk")) {
      toast.error("Only @hlc.edu.hk school accounts can sign in.");
      return;
    }
    const st = STUDENTS.find((s) => s.email === e);
    login({ email: e, name: st?.name ?? e.split("@")[0] });
    setRole(asTeacher ? "teacher" : "student");
    navigate({ to: asTeacher ? "/teacher" : "/dashboard" });
  };

  return (
    <div className="bg-hero flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center gap-3 text-3xl">
          <span className="animate-bounce">🧮</span>
          <Flame className="h-9 w-9 text-flame" />
          <Trophy className="h-9 w-9 text-gold" />
          <Star className="h-9 w-9 text-success" />
        </div>
        <div className="rounded-3xl border-2 border-border bg-card p-8 shadow-chunky">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-chunky-primary">
              <GraduationCap className="h-9 w-9" />
            </span>
            <h1 className="text-3xl font-bold text-foreground">HLC MathQuest</h1>
            <p className="mt-1 font-semibold text-muted-foreground">S2 Mathematics · Level up every chapter</p>
          </div>
          <label className="text-sm font-bold text-foreground">School email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border-2 border-input bg-background px-4 py-3 font-semibold outline-none focus:border-primary"
            placeholder="name@hlc.edu.hk"
          />
          <button
            onClick={() => submit(false)}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-3 font-display text-lg font-bold text-primary-foreground shadow-chunky-primary transition active:translate-y-1 active:shadow-none"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-card font-bold text-primary">G</span>
            Continue with Google
          </button>
          <button
            onClick={() => submit(true)}
            className="mt-3 w-full rounded-2xl border-2 border-border py-3 font-display font-bold text-foreground shadow-chunky transition active:translate-y-1 active:shadow-none"
          >
            Sign in as Teacher
          </button>
          <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
            Simulated Google sign-in · restricted to @hlc.edu.hk
          </p>
        </div>
      </div>
    </div>
  );
}
