import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { STUDENTS, type Student } from "./data";

type Role = "student" | "teacher";
interface Session {
  email: string;
  name: string;
}
interface Store {
  session: Session | null;
  role: Role;
  students: Student[];
  me: Student;
  login: (s: Session) => void;
  logout: () => void;
  setRole: (r: Role) => void;
  setStudents: (s: Student[]) => void;
}

// Keep one context instance across hot reloads so provider and consumers always match.
const g = globalThis as unknown as { __hlcAppCtx?: React.Context<Store | null> };
const Ctx = (g.__hlcAppCtx ??= createContext<Store | null>(null));

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [students, setStudents] = useState<Student[]>(STUDENTS);

  useEffect(() => {
    const s = localStorage.getItem("hlc-session");
    if (s) setSession(JSON.parse(s));
    const r = localStorage.getItem("hlc-role") as Role | null;
    if (r) setRole(r);
  }, []);

  const me = students.find((s) => s.email === session?.email) ?? students[0]!;

  return (
    <Ctx.Provider
      value={{
        session,
        role,
        students,
        me,
        login: (s) => {
          localStorage.setItem("hlc-session", JSON.stringify(s));
          setSession(s);
        },
        logout: () => {
          localStorage.removeItem("hlc-session");
          setSession(null);
        },
        setRole: (r) => {
          localStorage.setItem("hlc-role", r);
          setRole(r);
        },
        setStudents,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
