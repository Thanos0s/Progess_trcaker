"use client";

import { useState } from "react";
import { Plus, Timer, Trash2 } from "lucide-react";
import type { SubjectView } from "@/lib/dashboard";

export type LoggedSession = {
  id: string;
  subjectId: string;
  subjectName: string;
  minutes: number;
  note: string | null;
};

type Props = {
  subjects: SubjectView[];
  sessions: LoggedSession[];
  minutesToday: number;
  onLog: (input: { subjectId: string; minutes: number; note?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function SessionLogger({ subjects, sessions, minutesToday, onLog, onDelete }: Props) {
  const [subjectId, setSubjectId] = useState(subjects.find((s) => s.status === "current")?.id ?? subjects[0]?.id ?? "");
  const [hours, setHours] = useState("1");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const minutes = Math.round(parseFloat(hours) * 60);
    if (!subjectId || !Number.isFinite(minutes) || minutes <= 0) return;
    setBusy(true);
    await onLog({ subjectId, minutes, note: note.trim() || undefined });
    setNote("");
    setBusy(false);
  }

  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="label">Study log</p>
          <h2 className="mt-1 text-base font-semibold">Log a session</h2>
        </div>
        <span className="chip bg-accent2/10 font-mono text-accent2">
          <Timer size={13} /> {(minutesToday / 60).toFixed(1)} h today
        </span>
      </div>

      <form onSubmit={submit} className="grid gap-2 sm:grid-cols-[1.4fr_0.6fr_auto]">
        <select className="input" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          step="0.25"
          min="0.25"
          max="16"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          aria-label="Hours studied"
        />
        <button className="btn-primary" disabled={busy}>
          <Plus size={15} /> Add
        </button>
        <input
          className="input sm:col-span-3"
          placeholder="Optional note — what did you cover?"
          value={note}
          maxLength={160}
          onChange={(e) => setNote(e.target.value)}
        />
      </form>

      {sessions.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
              <span className="font-mono text-xs text-accent2">{(s.minutes / 60).toFixed(2)}h</span>
              <span className="truncate text-sm">{s.subjectName}</span>
              {s.note ? <span className="truncate text-xs text-muted">— {s.note}</span> : null}
              <button
                className="ml-auto text-muted transition hover:text-danger"
                onClick={() => onDelete(s.id)}
                aria-label="Delete session"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
