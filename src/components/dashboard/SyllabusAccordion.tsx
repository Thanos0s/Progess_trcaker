"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import type { SubjectView } from "@/lib/dashboard";
import type { Importance, SubjectStatus } from "@/data";

const IMP_STYLES: Record<Importance, string> = {
  high: "bg-danger/10 text-danger",
  med: "bg-warn/10 text-warn",
  low: "bg-muted/10 text-muted",
};

function StatusBadge({ status, dates }: { status: SubjectStatus; dates: string }) {
  if (status === "done") return <span className="chip bg-accent2/10 text-accent2">✓ done</span>;
  if (status === "current") return <span className="chip bg-warn/10 text-warn">▶ now</span>;
  return <span className="chip bg-muted/10 text-muted">{dates.split("–")[0].trim()}</span>;
}

type Props = {
  subjects: SubjectView[];
  checked: Set<string>;
  onToggleTopic: (topicId: string) => void;
};

export function SyllabusAccordion({ subjects, checked, onToggleTopic }: Props) {
  const [open, setOpen] = useState<string[]>(subjects.filter((s) => s.status === "current").map((s) => s.id));

  function toggle(id: string) {
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <section className="flex flex-col gap-3">
      {subjects.map((subject) => {
        const doneCount = subject.topics.filter((t) => checked.has(t.id)).length;
        const pct = Math.round((doneCount / subject.topics.length) * 100);
        const isOpen = open.includes(subject.id);

        return (
          <div
            key={subject.id}
            className={`panel overflow-hidden ${subject.status === "current" ? "border-accent/40" : ""}`}
          >
            <button
              onClick={() => toggle(subject.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface/60"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: subject.color }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{subject.name}</span>
                <span className="block font-mono text-[11px] text-muted">
                  {subject.dates} · {subject.weight}
                </span>
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                <span className="font-mono text-xs text-muted">{pct}%</span>
                <span className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: subject.color }}
                  />
                </span>
              </span>
              <StatusBadge status={subject.status} dates={subject.dates} />
              <ChevronRight
                size={16}
                className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col gap-1.5 border-t border-border px-3 py-3">
                    {subject.topics.map((topic) => {
                      const isDone = checked.has(topic.id);
                      return (
                        <li key={topic.id}>
                          <button
                            onClick={() => onToggleTopic(topic.id)}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                              isDone
                                ? "border-accent2/30 bg-accent2/10"
                                : "border-border bg-surface hover:border-accent/50"
                            }`}
                          >
                            <span
                              className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                                isDone ? "border-accent2 bg-accent2 text-bg" : "border-border"
                              }`}
                            >
                              {isDone ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                            <span className={`flex-1 text-[13px] ${isDone ? "text-accent2" : ""}`}>{topic.name}</span>
                            <span className={`chip ${IMP_STYLES[topic.imp]}`}>{topic.imp}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}
