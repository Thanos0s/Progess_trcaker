"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LogOut, Save } from "lucide-react";
import { useToast } from "@/components/Toast";
import { BRANCHES, BRANCH_LABEL, type Branch } from "@/data";
import type { SessionUser } from "@/lib/auth";

const AVATARS = ["🚀", "🔥", "🧠", "⚡", "🦉", "🐉", "🎯", "🛠️", "📘", "🌙", "🥷", "🦾"];
const COLORS = ["#6c63ff", "#00d4a0", "#f5a623", "#ff5c5c", "#60a5fa", "#f472b6", "#4ade80", "#e879f9"];

type Stats = {
  topicsDone: number;
  topicsTotal: number;
  hours: number;
  totalScore: number;
  activeDays: number;
  streak: number;
  bestStreak: number;
  breakdown: { name: string; short: string; pct: number; color: string }[];
};

export function ProfileClient({ user, stats }: { user: SessionUser; stats: Stats }) {
  const router = useRouter();
  const toast = useToast();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [color, setColor] = useState(user.color);
  const [branch, setBranch] = useState<Branch>(user.branch === "ECE" ? "ECE" : "CSE");
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, avatar, color, branch }),
    });
    setSaving(false);
    if (!res.ok) {
      toast((await res.json()).error ?? "Could not save profile");
      return;
    }
    toast("Profile saved");
    router.refresh();
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={save} className="panel flex flex-col gap-4 p-5">
        <div>
          <p className="label">Your profile</p>
          <h1 className="mt-1 text-lg font-semibold">Identity &amp; branch</h1>
          <p className="text-xs text-muted">{user.email}</p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="label">Display name</span>
          <input className="input" value={displayName} maxLength={32} onChange={(e) => setDisplayName(e.target.value)} />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="label">Avatar</span>
          <div className="flex flex-wrap gap-1.5">
            {AVATARS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`grid h-9 w-9 place-items-center rounded-lg border text-lg transition ${
                  avatar === emoji ? "border-accent bg-accent/15" : "border-border bg-surface hover:border-accent/50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="label">Accent colour</span>
          <div className="flex flex-wrap gap-1.5">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Colour ${c}`}
                className={`h-7 w-7 rounded-full border-2 transition ${color === c ? "scale-110" : "border-transparent"}`}
                style={{ background: c, borderColor: color === c ? "white" : "transparent" }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="label">Branch</span>
          <div className="grid grid-cols-2 gap-2">
            {BRANCHES.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setBranch(b)}
                className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                  branch === b ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/50"
                }`}
              >
                <span className="block font-mono text-sm font-bold">{b}</span>
                <span className="block text-[11px] text-muted">{BRANCH_LABEL[b]}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted">
            Switching branch swaps your syllabus. Progress on the other branch is kept.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary flex-1" disabled={saving}>
            <Save size={15} /> {saving ? "Saving…" : "Save profile"}
          </button>
          <button type="button" className="btn text-muted" onClick={signOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-5">
        <section className="panel grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          <Stat value={`${stats.topicsDone}/${stats.topicsTotal}`} label="topics done" />
          <Stat value={`${stats.hours}h`} label="hours logged" />
          <Stat value={stats.totalScore} label="total points" />
          <Stat value={`${stats.streak}d`} label="current streak" />
          <Stat value={`${stats.bestStreak}d`} label="best streak" />
          <Stat value={stats.activeDays} label="active days" />
        </section>

        <section className="panel p-5">
          <p className="label">Subject breakdown · {branch}</p>
          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.breakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="short"
                  type="category"
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted))", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--surface))" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value}%`, "complete"]}
                />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]} barSize={12}>
                  {stats.breakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-3 text-center">
      <div className="font-mono text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}
