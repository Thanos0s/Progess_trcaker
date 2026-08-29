"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlarmClock, CalendarClock, Flame, Gauge, RefreshCw, Target, TrendingUp } from "lucide-react";
import { ProgressRing } from "@/components/ProgressRing";
import { useToast } from "@/components/Toast";
import { BRANCH_LABEL, type Branch } from "@/data";
import type { DashboardData } from "@/lib/dashboard";
import type { SessionUser } from "@/lib/auth";
import { shortDay } from "@/lib/day";
import { TodayCard } from "./TodayCard";
import { SessionLogger, type LoggedSession } from "./SessionLogger";
import { FocusTimer } from "./FocusTimer";
import { SyllabusAccordion } from "./SyllabusAccordion";

async function post(url: string, body: unknown, method = "POST") {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "DELETE" ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something went wrong");
  return res.json();
}

export function DashboardClient({ user, data }: { user: SessionUser; data: DashboardData }) {
  const router = useRouter();
  const toast = useToast();

  const [checked, setChecked] = useState<Set<string>>(new Set(data.checkedTopics));
  const [tasksDone, setTasksDone] = useState<Set<string>>(new Set(data.tasksDone));
  const [sessions, setSessions] = useState<LoggedSession[]>(data.sessions);

  const minutesToday = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const totalTopics = data.totals.total;
  const donePct = totalTopics ? Math.round((checked.size / totalTopics) * 100) : 0;

  const sync = useCallback(() => router.refresh(), [router]);

  const toggleTopic = useCallback(
    async (topicId: string) => {
      const done = !checked.has(topicId);
      setChecked((prev) => {
        const next = new Set(prev);
        if (done) next.add(topicId);
        else next.delete(topicId);
        return next;
      });
      try {
        await post("/api/progress", { topicId, done });
        if (done) toast("+10 pts · topic checked off");
        sync();
      } catch (err) {
        toast((err as Error).message);
      }
    },
    [checked, sync, toast],
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      const done = !tasksDone.has(taskId);
      setTasksDone((prev) => {
        const next = new Set(prev);
        if (done) next.add(taskId);
        else next.delete(taskId);
        return next;
      });
      await post("/api/tasks", { action: "toggle", taskId, done }).catch((e) => toast(e.message));
      sync();
    },
    [tasksDone, sync, toast],
  );

  const markAll = useCallback(async () => {
    setTasksDone(new Set(data.tasks.map((t) => t.id)));
    await post("/api/tasks", { action: "markAll" }).catch((e) => toast(e.message));
    toast("🎉 Today marked complete — +15 bonus");
    sync();
  }, [data.tasks, sync, toast]);

  const resetTasks = useCallback(async () => {
    setTasksDone(new Set());
    await post("/api/tasks", { action: "reset" }).catch((e) => toast(e.message));
    toast("↺ Today reset");
    sync();
  }, [sync, toast]);

  const logSession = useCallback(
    async (input: { subjectId: string; minutes: number; note?: string }) => {
      try {
        await post("/api/sessions", input);
        toast(`+${Math.round((input.minutes / 60) * 8)} pts · ${(input.minutes / 60).toFixed(2)}h logged`);
        setSessions((prev) => [
          {
            id: `tmp-${Date.now()}`,
            subjectId: input.subjectId,
            subjectName: data.subjects.find((s) => s.id === input.subjectId)?.name ?? input.subjectId,
            minutes: input.minutes,
            note: input.note ?? null,
          },
          ...prev,
        ]);
        sync();
      } catch (err) {
        toast((err as Error).message);
      }
    },
    [data.subjects, sync, toast],
  );

  const deleteSession = useCallback(
    async (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      await post(`/api/sessions?id=${id}`, null, "DELETE").catch((e) => toast(e.message));
      sync();
    },
    [sync, toast],
  );

  const maxHeat = useMemo(() => Math.max(50, ...data.heat.map((h) => h.score)), [data.heat]);

  return (
    <div className="flex flex-col gap-5">
      <section className="panel flex flex-wrap items-center gap-5 p-5">
        <ProgressRing pct={donePct} size={84} label="syllabus" />
        <div className="min-w-[180px] flex-1">
          <p className="label">{BRANCH_LABEL[data.branch as Branch]}</p>
          <h1 className="mt-1 font-mono text-xl font-bold">Hey {user.displayName.split(" ")[0]} 👋</h1>
          <p className="text-sm text-muted">
            {checked.size}/{totalTopics} topics done · {totalTopics - checked.size} remaining
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat icon={<Flame size={14} className="text-warn" />} value={`${data.streak}d`} label="streak" />
          <Stat icon={<TrendingUp size={14} className="text-accent2" />} value={data.todayScore} label="today pts" />
          <Stat icon={<CalendarClock size={14} className="text-accent" />} value={data.daysLeft} label="days to GATE" />
          <Stat icon={<Gauge size={14} className="text-danger" />} value={data.pacePerDay} label="topics/day" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">
          <TodayCard
            tasks={data.tasks}
            done={tasksDone}
            prettyDate={data.prettyDate}
            onToggle={toggleTask}
            onMarkAll={markAll}
            onReset={resetTasks}
          />
          <SessionLogger
            subjects={data.subjects}
            sessions={sessions}
            minutesToday={minutesToday}
            onLog={logSession}
            onDelete={deleteSession}
          />
        </div>

        <div className="flex flex-col gap-5">
          <FocusTimer subjects={data.subjects} onComplete={logSession} />

          <section className="panel p-5">
            <p className="label">Last 7 days</p>
            <div className="mt-3 flex items-end gap-1.5">
              {data.heat.map((cell) => (
                <div key={cell.day} className="flex flex-1 flex-col items-center gap-1.5" title={`${cell.score} pts`}>
                  <div
                    className="w-full rounded-md transition-all"
                    style={{
                      height: `${8 + (cell.score / maxHeat) * 52}px`,
                      background:
                        cell.score > 0 ? `hsl(var(--accent2) / ${0.25 + (cell.score / maxHeat) * 0.75})` : "hsl(var(--border))",
                    }}
                  />
                  <span className="font-mono text-[9px] text-muted">{shortDay(cell.day).split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </section>

          {data.weakest && (
            <section className="panel p-5">
              <p className="label">Weakest started subject</p>
              <div className="mt-2 flex items-center gap-3">
                <Target size={18} style={{ color: data.weakest.color }} />
                <div>
                  <p className="text-sm font-medium">{data.weakest.name}</p>
                  <p className="text-xs text-muted">{data.weakest.pct}% complete — give it the next slot</p>
                </div>
              </div>
            </section>
          )}

          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="label">Revision queue</p>
              <span className="chip bg-surface font-mono text-muted">
                <RefreshCw size={11} /> {data.revise.length}
              </span>
            </div>
            {data.revise.length === 0 ? (
              <p className="mt-2 text-xs text-muted">Nothing older than 21 days yet. Keep going.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {data.revise.map((item) => (
                  <li key={item.topicId} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                    <span className="truncate">{item.name}</span>
                    <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">{item.daysAgo}d</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <AlarmClock size={12} /> Topics finished 21+ days ago resurface here.
            </p>
          </section>
        </div>
      </div>

      <SyllabusAccordion subjects={data.subjects} checked={checked} onToggleTopic={toggleTopic} />
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
      <div className="flex items-center justify-center gap-1 font-mono text-base font-bold">
        {icon}
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
