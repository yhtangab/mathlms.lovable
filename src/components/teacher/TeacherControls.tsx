import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Notice, Panel } from "@/components/PageParts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type Redemption } from "@/lib/app-store";
import { COIN_NAME } from "@/lib/coins";

export function TeacherControls() {
  const {
    systemConfig,
    setDoubleMcEvent,
    showAllRanks,
    setShowAllRanks,
    redemptions,
    students,
    refresh,
    coinsError,
  } = useApp();
  const [eventBusy, setEventBusy] = useState(false);
  const [rankBusy, setRankBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const pending = redemptions.filter((r) => r.status === "pending");
  const names = new Map(students.map((s) => [s.id, `${s.name} · ${s.set}`]));

  const toggleEvent = async (active: boolean) => {
    setEventBusy(true);
    try {
      await setDoubleMcEvent(active);
      toast.success(active ? "2× Math Coins event is on" : "2× Math Coins event is off");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the event");
    } finally {
      setEventBusy(false);
    }
  };

  const toggleRanks = async (active: boolean) => {
    setRankBusy(true);
    try {
      await setShowAllRanks(active);
      toast.success(active ? "Leaderboard shows every name" : "Leaderboard uses the student view");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update the leaderboard switch");
    } finally {
      setRankBusy(false);
    }
  };

  const decide = async (row: Redemption, status: "used" | "rejected") => {
    setBusyId(row.id);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("reward_redemptions")
        .update({
          status,
          decided_at: new Date().toISOString(),
          decided_by: auth.user?.id ?? null,
        })
        .eq("id", row.id);
      if (error) throw new Error(error.message);
      await refresh();
      toast.success(status === "used" ? "Approved and marked used" : "Rejected and coins returned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update this ticket");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Panel title="Class controls" description="These switches apply straight away.">
        <label className="flex items-start justify-between gap-4 py-2">
          <span>
            <span className="block text-sm font-semibold">2× Math Coins revision week</span>
            <span className="text-xs text-muted-foreground">
              Turns the banner on and doubles new game rewards. Rewards already given stay as they
              were.
            </span>
          </span>
          <Switch
            checked={systemConfig.isDoubleMCEventActive}
            disabled={eventBusy}
            onCheckedChange={(v) => void toggleEvent(v)}
            aria-label="2x Math Coins event"
          />
        </label>
        <label className="mt-3 flex items-start justify-between gap-4 border-t border-border py-3">
          <span>
            <span className="block text-sm font-semibold">
              {showAllRanks ? "Show all ranks (teacher view)" : "Top 10 public + anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              Students always see only the top 10 by name. This switch changes the Rankings page for
              teachers.
            </span>
          </span>
          <Switch
            checked={showAllRanks}
            disabled={rankBusy}
            onCheckedChange={(v) => void toggleRanks(v)}
            aria-label="Show all leaderboard ranks"
          />
        </label>
      </Panel>

      <Panel
        title={`Shop redemption queue (${pending.length})`}
        description={`Tickets students bought with ${COIN_NAME}. Approve marks the item used. Reject returns the coins.`}
      >
        {coinsError ? <Notice tone="error">{coinsError}</Notice> : null}
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tickets waiting.</p>
        ) : (
          <ul className="divide-y divide-border">
            {pending.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{row.reward_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {names.get(row.student_id) ?? "Unknown student"} · {row.cost} MC
                  </span>
                </span>
                <Button
                  size="sm"
                  disabled={busyId === row.id}
                  onClick={() => void decide(row, "used")}
                >
                  <Check /> Approve & mark used
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === row.id}
                  onClick={() => void decide(row, "rejected")}
                >
                  <X /> Reject & refund MC
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
