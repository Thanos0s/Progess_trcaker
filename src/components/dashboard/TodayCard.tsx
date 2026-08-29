"use client";

import { Check, ListChecks, RotateCcw } from "lucide-react";
import type { DailyTask } from "@/data";

type Props = {
  tasks: DailyTask[];
  done: Set<string>;
  prettyDate: string;
  onToggle: (taskId: string) => void;
  onMarkAll: () => void;
  onReset: () => void;
};

export function TodayCard({ tasks, done, prettyDate, onToggle, onMarkAll, onReset }: Props) {
  const isWeekendSet = tasks.length > 3;

  return (
    <section className="panel-glow p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label text-accent">Today&apos;s plan</p>
          <h2 className="mt-1 text-lg font-semibold">{isWeekendSet ? "Weekend deep-work set" : "Weekday set"}</h2>
          <p className="text-sm text-muted">{prettyDate}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn text-xs" onClick={onMarkAll}>
            <ListChecks size={14} /> Mark all
          </button>
          <button className="btn text-xs text-muted" onClick={onReset}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {tasks.map((task) => {
          const isDone = done.has(task.id);
          return (
            <li key={task.id}>
              <button
                onClick={() => onToggle(task.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  isDone
                    ? "border-accent2/30 bg-accent2/10"
                    : "border-border bg-surface hover:border-accent/50"
                }`}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    isDone ? "border-accent2 bg-accent2 text-bg" : "border-border"
                  }`}
                >
                  {isDone ? <Check size={13} strokeWidth={3} /> : null}
                </span>
                <span className="flex-1">
                  <span className={`block text-sm ${isDone ? "text-accent2 line-through" : ""}`}>{task.text}</span>
                  <span className="block text-xs text-muted">{task.meta}</span>
                </span>
                <span className="chip bg-surface font-mono text-muted">{task.time}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
