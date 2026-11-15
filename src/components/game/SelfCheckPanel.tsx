import { useState } from "react";
import { Square, SquareCheck } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/PageParts";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-store";
import { objectivesFor } from "@/lib/gamification/catalog";
import { cn } from "@/lib/utils";

/** "I can…" statements for one chapter. Ticking them fills 40% of the chapter's progress bar. */
export function SelfCheckPanel({ chapter }: { chapter: number }) {
  const { me, role, selfChecks, readOnly, refresh, gameError } = useApp();
  const [busy, setBusy] = useState<string | null>(null);
  const objectives = objectivesFor(chapter);
  const done = objectives.filter((o) => selfChecks.includes(o.id)).length;
  const canEdit = role === "student" && Boolean(me.id) && !readOnly && gameError === null;

  const toggle = async (id: string, checked: boolean) => {
    setBusy(id);
    try {
      const { error } = checked
        ? await supabase
            .from("chapter_self_checks")
            .delete()
            .eq("student_id", me.id)
            .eq("objective_id", id)
        : await supabase
            .from("chapter_self_checks")
            .insert({ student_id: me.id, chapter, objective_id: id });
      if (error) throw new Error(error.message);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save your self-check");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Panel
      tone="green"
      className="mt-6"
      title="Self-check"
      description={`${done} of ${objectives.length} ticked. Tick what you can do confidently.`}
    >
      <ul className="space-y-2">
        {objectives.map((o) => {
          const checked = selfChecks.includes(o.id);
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={!canEdit || busy !== null}
                onClick={() => void toggle(o.id, checked)}
                aria-pressed={checked}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                  checked
                    ? "border-success/50 bg-success/10"
                    : "border-border hover:border-success/40",
                )}
              >
                {checked ? (
                  <SquareCheck className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                ) : (
                  <Square className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
                <span className={cn("flex-1", checked && "font-semibold")}>{o.text}</span>
                {busy === o.id ? (
                  <span className="text-xs text-muted-foreground">Saving…</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {readOnly ? (
        <p className="mt-3 text-xs text-muted-foreground">Preview only: ticks cannot be changed.</p>
      ) : null}
    </Panel>
  );
}
