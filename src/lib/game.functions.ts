import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { publishGame, type PublishReport } from "./gamification/publish";

/** Teacher action: work out the game for every student and publish what students may see. */
export const publishGameData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PublishReport> => {
    const { data: allowed, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "teacher",
    });
    if (error) throw new Error(`Could not check teacher access: ${error.message}`);
    if (!allowed) throw new Error("Only teacher accounts can publish game data");
    return publishGame(context.supabase);
  });
