import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useApp } from '@/lib/app-store';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Sign in — HLC Math' },
      { name: 'description', content: 'Sign in to your private HLC Mathematics records.' },
      { property: 'og:title', content: 'Sign in — HLC Math' },
      { property: 'og:description', content: 'School mathematics scores and chapter progress.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }),
  component: Login
});

function Login() {
  const { session, ready, role } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (ready && session) void navigate({ to: role === 'teacher' ? '/teacher' : '/dashboard' });
  }, [ready, session, role, navigate]);

  const social = async (provider: 'google') => {
    setMessage('');
    
    // 💡 Why we do this: This routes the Google Sign-In pop-up directly 
    // to your private Supabase database instead of Lovable's servers.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          hd: 'hlc.edu.hk', // Keeps logins restricted to your school domain!
          prompt: 'select_account'
        }
      }
    });

    if (error) setMessage(error.message);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm py-12">
        <GraduationCap className="mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-semibold">HLC Math</h1>
        <p className="mb-8 mt-2 text-muted-foreground">S2 Mathematics</p>
        
        <form
          className="space-y-4"
          onSubmit={async e => {
            e.preventDefault();
            setBusy(true);
            setMessage('');
            try {
              const normalized = email.trim().toLowerCase();
              if (signup && !normalized.endsWith('@hlc.edu.hk')) {
                throw new Error('Use your @hlc.edu.hk school email.');
              }
              
              const r = signup
                ? await supabase.auth.signUp({
                    email: normalized,
                    password,
                    options: {
                      emailRedirectTo: window.location.origin,
                      data: { full_name: name }
                    }
                  })
                : await supabase.auth.signInWithPassword({
                    email: normalized,
                    password
                  });

              if (r.error) throw r.error;
              if (signup && !r.data.session) {
                setMessage('Check your email to confirm your account before signing in.');
              }
            } catch (err) {
              setMessage(err instanceof Error ? err.message : 'Sign-in failed');
            } finally {
              setBusy(false);
            }
          }}
        >
          {signup && (
            <label className="block text-sm font-medium">
              Name
              <input
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-card p-3"
              />
            </label>
          )}
          
          <label className="block text-sm font-medium">
            School email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-card p-3"
            />
          </label>
          
          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              required
              minLength={8}
              autoComplete={signup ? 'new-password' : 'current-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-card p-3"
            />
          </label>
          
          <Button className="w-full" disabled={busy} type="submit">
            {busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <Button
          variant="link"
          onClick={() => {
            setSignup(!signup);
            setMessage('');
          }}
        >
          {signup ? 'Already have an account? Sign in' : 'Create a school account'}
        </Button>
        
        <Link to="/reset-password" className="block text-sm text-primary">
          Forgot password?
        </Link>
        
        <div className="mt-6 space-y-3">
          <Button
            className="google-auth w-full"
            variant="outline"
            onClick={() => social('google')}
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

          <Button
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setMessage('');
              const r = await supabase.auth.signInWithPassword({
                email: 'demo.student@hlc.edu.hk',
                password: 'HlcMath2026!'
              });
              if (r.error) setMessage(r.error.message);
              setBusy(false);
            }}
          >
            Try demo student (no login)
          </Button>
        </div>
        
        {message && (
          <p role="status" className="mt-5 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
