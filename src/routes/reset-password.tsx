import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — HLC Math" },
      { name: "description", content: "Recover your HLC Math account password." },
      { property: "og:title", content: "Reset password — HLC Math" },
      { property: "og:description", content: "Secure password recovery for your school account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reset,
});
function Reset() {
  const [recovery, setRecovery] = useState(false);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    setRecovery(window.location.hash.includes("type=recovery"));
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <main className="mx-auto max-w-sm space-y-5 px-4 py-16">
      <h1 className="text-2xl font-semibold">
        {recovery ? "Set a new password" : "Reset password"}
      </h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const r = recovery
            ? await supabase.auth.updateUser({ password: value })
            : await supabase.auth.resetPasswordForEmail(value, {
                redirectTo: `${window.location.origin}/reset-password`,
              });
          setMessage(
            r.error?.message ??
              (recovery ? "Password updated." : "Check your email for a reset link."),
          );
        }}
      >
        <label className="block">
          {recovery ? "New password" : "School email"}
          <input
            className="mt-2 w-full rounded-md border border-input p-3"
            required
            type={recovery ? "password" : "email"}
            minLength={recovery ? 8 : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <Button type="submit">{recovery ? "Update password" : "Send reset link"}</Button>
      </form>
      <p role="status">{message}</p>
      <Link to="/">Back to sign in</Link>
    </main>
  );
}
