"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Loader2 } from "lucide-react";
import type { DayWinner, LeaderRange, LeaderRow } from "@/lib/leaderboard";
import { shortDay } from "@/lib/day";

const RANGES: { key: LeaderRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "all", label: "All-time" },
];

const BRANCH_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Everyone" },
  { key: "CSE", label: "CSE" },
  { key: "ECE", label: "ECE" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = {
  meId: string;
  initialRows: LeaderRow[];
  winners: DayWinner[];
};

export function CompeteClient({ meId, initialRows, winners }: Props) {
  const [range, setRange] = useState<LeaderRange>("today");
  const [branch, setBranch] = useState("all");
  const [rows, setRows] = useState<LeaderRow[]>(initialRows);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const query = new URLSearchParams({ range, ...(branch === "all" ? {} : { branch }) });
    fetch(`/api/leaderboard?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRows(data.rows as LeaderRow[]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range, branch]);

  const leader = rows[0];
  const me = rows.find((r) => r.userId === meId);
  const gap = leader && me ? leader.score - me.score : 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="panel-glow flex flex-wrap items-center gap-4 p-5">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-warn/15 text-2xl">
          {leader ? leader.avatar : "🏁"}
        </span>
        <div className="min-w-[200px] flex-1">
          <p className="label text-warn">Who&apos;s winning</p>
          {leader ? (
            <>
              <h1 className="mt-1 text-lg font-semibold">
                {leader.userId === meId ? "You are" : `${leader.displayName} is`} leading{" "}
                <span className="text-muted">
                  ({RANGES.find((r) => r.key === range)?.label.toLowerCase()})
                </span>
              </h1>
              <p className="text-sm text-muted">
                {leader.score} pts
                {me && me.userId !== leader.userId
                  ? ` · you're #${me.rank}, ${gap} pts behind — that's ${Math.ceil(gap / 10)} topics`
                  : " · keep the lead"}
              </p>
            </>
          ) : (
            <h1 className="mt-1 text-lg font-semibold">No scores logged yet — be the first.</h1>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                range === r.key ? "bg-accent/20 text-accent" : "text-muted hover:text-text"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {BRANCH_FILTERS.map((b) => (
            <button
              key={b.key}
              onClick={() => setBranch(b.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                branch === b.key ? "bg-accent2/20 text-accent2" : "text-muted hover:text-text"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        {loading ? <Loader2 size={15} className="animate-spin text-muted" /> : null}
      </div>

      <section className="panel divide-y divide-border overflow-hidden">
        {rows.length === 0 && <p className="p-5 text-sm text-muted">Nobody has scored in this range yet.</p>}
        {rows.map((row, index) => {
          const isMe = row.userId === meId;
          return (
            <motion.div
              key={row.userId}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              className={`flex items-center gap-3 px-4 py-3 ${isMe ? "bg-accent/10" : ""}`}
            >
              <span className="w-7 shrink-0 text-center font-mono text-sm text-muted">
                {index < 3 ? MEDALS[index] : row.rank}
              </span>
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-base"
                style={{ borderColor: row.color, background: `${row.color}22` }}
              >
                {row.avatar}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 truncate text-sm font-medium">
                  {row.displayName}
                  {isMe ? <span className="chip bg-accent/20 text-accent">you</span> : null}
                  {index === 0 && row.score > 0 ? <Crown size={13} className="text-warn" /> : null}
                </span>
                <span className="block font-mono text-[11px] text-muted">
                  {row.branch} · {row.topicsDone} topics · {row.hours}h
                </span>
              </span>
              <span className="chip bg-warn/10 font-mono text-warn">
                <Flame size={12} /> {row.streak}
              </span>
              <span className="w-16 text-right font-mono text-base font-bold">{row.score}</span>
            </motion.div>
          );
        })}
      </section>

      <section className="panel p-5">
        <p className="label">Daily winners · last 14 days</p>
        <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-2">
          {winners.map((w) => (
            <div
              key={w.day}
              className="flex min-w-[74px] flex-col items-center gap-1 rounded-xl border border-border bg-surface px-2 py-3"
              title={w.displayName ? `${w.displayName} · ${w.score} pts` : "No activity"}
            >
              <span className="font-mono text-[10px] text-muted">{shortDay(w.day)}</span>
              <span className="text-lg">{w.avatar ?? "—"}</span>
              <span className="max-w-[64px] truncate text-[10px] text-muted">{w.displayName ?? "no one"}</span>
              <span className="font-mono text-[11px] font-bold text-accent2">{w.score || ""}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
