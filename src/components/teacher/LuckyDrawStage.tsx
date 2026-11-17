import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useApp } from "@/lib/app-store";
import { COIN_NAME, deleteMarks, giveCoins } from "@/lib/coins";
import type { Student } from "@/lib/data";
import { mountLuckyDraw, type LuckyDrawHandle } from "./lucky-draw-machine";

/** Class lucky draw: the 3D machine, then one Math Coin for each winner. */
export function LuckyDrawStage({ list }: { list: Student[] }) {
  const host = useRef<HTMLDivElement>(null);
  const machine = useRef<LuckyDrawHandle | null>(null);
  const listRef = useRef(list);
  listRef.current = list;
  const { refresh } = useApp();
  const [rewardHost, setRewardHost] = useState<HTMLElement | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [awarded, setAwarded] = useState<Record<string, true>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const namesKey = list.map((student) => `${student.id}:${student.name}`).join("|");

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const handle = mountLuckyDraw(el, {
      names: listRef.current.map((student) => student.name),
      onWinners: setWinners,
    });
    machine.current = handle;
    const slot = el.querySelector(".ld-rewards");
    setRewardHost(slot instanceof HTMLElement ? slot : null);
    return () => {
      handle.dispose();
      machine.current = null;
      setRewardHost(null);
    };
  }, []);

  useEffect(() => {
    machine.current?.setNames(listRef.current.map((student) => student.name));
  }, [namesKey]);

  useEffect(() => {
    setAwarded({});
  }, [winners]);

  const award = async (student: Student) => {
    setBusyId(student.id);
    try {
      const ids = await giveCoins({
        studentIds: [student.id],
        marks: 1,
        reason: "correct_answer",
        note: "Lucky draw",
      });
      await refresh();
      setAwarded((prev) => ({ ...prev, [student.id]: true }));
      toast.success(`+1 ${COIN_NAME} for ${student.name}`, {
        action: {
          label: "Undo",
          onClick: () => {
            void undo(student.id, ids);
          },
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    } finally {
      setBusyId(null);
    }
  };

  const undo = async (studentId: string, ids: string[]) => {
    try {
      await deleteMarks(ids);
      await refresh();
      setAwarded((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      toast.success("Undone");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not undo");
    }
  };

  const matched = matchWinners(winners, list);

  return (
    <div className="relative mt-6 h-[calc(100dvh-8.5rem)] min-h-[680px] overflow-hidden rounded-3xl bg-[#07050f]">
      <div ref={host} className="h-full w-full" />
      {rewardHost
        ? createPortal(
            matched.map((item) => {
              const student = item.student;
              if (!student) {
                return (
                  <span key={item.key} className="ld-small">
                    {item.name}
                  </span>
                );
              }
              const done = awarded[student.id] === true;
              return (
                <button
                  type="button"
                  key={item.key}
                  className="ld-coin"
                  disabled={busyId === student.id || done}
                  onClick={() => void award(student)}
                >
                  {done ? `${item.name} ✓` : `${item.name} +1 MC`}
                </button>
              );
            }),
            rewardHost,
          )
        : null}
    </div>
  );
}

function matchWinners(names: string[], students: Student[]) {
  const pools = new Map<string, Student[]>();
  for (const student of students) {
    const group = pools.get(student.name) ?? [];
    group.push(student);
    pools.set(student.name, group);
  }
  return names.map((name, index) => {
    const student = pools.get(name)?.shift() ?? null;
    return { name, student, key: student?.id ?? `${name}-${index}` };
  });
}
