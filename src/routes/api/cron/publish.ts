import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/cron/publish")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expected = process.env["CRON_SECRET"]?.trim();
        const header = request.headers.get("authorization") ?? "";
        const given = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
        if (!expected || !sameSecret(given, expected)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"]?.trim();
        if (!serviceKey) {
          return Response.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" }, { status: 500 });
        }
        try {
          const { createServiceRoleClient } = await import("@/integrations/supabase/client.server");
          const { publishGame } = await import("@/lib/gamification/publish");
          const report = await publishGame(createServiceRoleClient());
          return Response.json({ ok: true, ...report });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Publish failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});

function sameSecret(given: string, expected: string): boolean {
  const left = Buffer.from(given);
  const right = Buffer.from(expected);
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}
