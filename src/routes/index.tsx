import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import { DEMO_EMAIL } from "@/lib/data";

const DEMO_PASSWORD = "HlcMath2026!";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — HLC Math" },
      { name: "description", content: "Sign in to your HLC Mathematics records." },
      { property: "og:title", content: "Sign in — HLC Math" },
      { property: "og:description", content: "School Mathematics marks and chapter progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

/** An error Supabase or Google sends back in the address after a sign-in that did not finish. */
function readAuthError(): string {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return (
    hash.get("error_description") ??
    query.get("error_description") ??
    hash.get("error") ??
    query.get("error") ??
    ""
  );
}

/** True while the page is finishing a Google sign-in (tokens or a code in the address). */
function isReturningFromGoogle(): boolean {
  return /access_token=|[?&]code=/.test(`${window.location.hash}${window.location.search}`);
}

/** Four big flat shapes behind the sign-in card. */
function Shapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute -left-12 top-16 h-32 w-32 rotate-45 rounded-3xl bg-sky/85 md:h-44 md:w-44" />
      <span className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-gold/90 md:left-28 md:h-48 md:w-48" />
      <span className="absolute -right-10 top-20 h-36 w-36 bg-berry/90 [clip-path:polygon(50%_0%,100%_100%,0%_100%)] md:h-52 md:w-52" />
      <span className="absolute -bottom-14 -right-6 h-32 w-32 -rotate-12 rounded-3xl bg-success/90 md:h-44 md:w-44" />
    </div>
  );
}

function Login() {
  const { session, ready, role } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    const err = readAuthError();
    if (err) setMessage(`Google sign-in did not finish: ${err}`);
    else setReturning(isReturningFromGoogle());
  }, []);

  useEffect(() => {
    if (ready && session) {
      void navigate({ to: role === "teacher" ? "/teacher" : "/dashboard", replace: true });
    }
  }, [ready, session, role, navigate]);

  const signInWithGoogle = async () => {
    setMessage("");
    setBusy(true);
    // Supabase sends the browser to Google and back to this page. The address must be listed
    // under Supabase > Authentication > URL Configuration > Redirect URLs.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { hd: "hlc.edu.hk", prompt: "select_account" },
      },
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  };

  const signInDemo = async () => {
    setMessage("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) setMessage(error.message);
    setBusy(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-nav">
      <Shapes />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border-2 border-border bg-card p-8 shadow-pop">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-accent-foreground shadow-chunky-gold">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold leading-tight">HLC Mathematics</p>
              <p className="text-sm text-muted-foreground">Learning management system</p>
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your school Google account (@hlc.edu.hk).
          </p>

          {returning && !message ? (
            <p role="status" className="mt-6 text-sm font-medium">
              Finishing sign-in…
            </p>
          ) : null}

          <div className="mt-6 space-y-3">
            <Button
              className="google-auth h-11 w-full"
              variant="outline"
              disabled={busy}
              onClick={() => void signInWithGoogle()}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              variant="secondary"
              className="h-11 w-full"
              disabled={busy}
              onClick={() => void signInDemo()}
            >
              View the demo student account
            </Button>
          </div>

          {message && (
            <p
              role="alert"
              className="mt-5 rounded-lg border-2 border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {message}
            </p>
          )}

          <p className="mt-8 text-xs text-muted-foreground">
            Cannot sign in? Ask your Mathematics teacher to check that your school email is on the
            class list.
          </p>
        </div>
      </div>
    </main>
  );
}
