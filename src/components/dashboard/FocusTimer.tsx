"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Zap } from "lucide-react";
import type { SubjectView } from "@/lib/dashboard";

const PRESETS = [25, 45, 60];

type Props = {
  subjects: SubjectView[];
  onComplete: (input: { subjectId: string; minutes: number; note?: string }) => Promise<void>;
};

export function FocusTimer({ subjects, onComplete }: Props) {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects.find((s) => s.status === "current")?.id ?? subjects[0]?.id ?? "");
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining > 0 || completedRef.current || !running) return;
    completedRef.current = true;
    setRunning(false);
    void onComplete({ subjectId, minutes, note: `Focus session · ${minutes} min` });
  }, [remaining, running, minutes, subjectId, onComplete]);

  function reset(next = minutes) {
    completedRef.current = false;
    setRunning(false);
    setMinutes(next);
    setRemaining(next * 60);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = 100 - Math.round((remaining / (minutes * 60)) * 100);

  return (
    <section className="panel p-5">
      <p className="label">Focus timer</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono text-4xl font-bold tabular-nums">
          {mm}:{ss}
        </span>
        <span className="text-xs text-muted">auto-logs when it hits zero</span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => reset(preset)}
            className={`chip border ${
              minutes === preset ? "border-accent/60 bg-accent/15 text-accent" : "border-border bg-surface text-muted"
            }`}
          >
            {preset}m
          </button>
        ))}
        <select
          className="input ml-auto max-w-[45%] py-1.5 text-xs"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          aria-label="Focus subject"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="btn-primary flex-1 text-xs" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "Pause" : remaining === minutes * 60 ? "Start focus" : "Resume"}
        </button>
        <button className="btn text-xs text-muted" onClick={() => reset()}>
          <RotateCcw size={14} />
        </button>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
        <Zap size={12} className="text-warn" /> Finished sessions count towards today&apos;s score.
      </p>
    </section>
  );
}
