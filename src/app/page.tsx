import Link from "next/link";
import { ArrowRight, BarChart3, Flame, ListChecks, Timer, Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/leaderboard";
import { currentUserId } from "@/lib/auth";
import { dayKey } from "@/lib/day";
import { CSE_SUBJECTS, ECE_SUBJECTS, daysToExam } from "@/data";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: ListChecks, title: "Every topic, tracked", body: "Full CSE and EE/ECE GATE 2027 syllabus with importance tags, date windows and per-subject progress." },
  { icon: Trophy, title: "Daily competition", body: "Points for topics, tasks and hours. Today / week / all-time boards with a winner for every single day." },
  { icon: Flame, title: "Streaks that bite", body: "Score anything today and your streak grows. Miss a day and it resets — the leaderboard notices." },
  { icon: Timer, title: "Focus timer", body: "Run a 25/45/60 minute block; the session logs itself and scores automatically when it ends." },
  { icon: BarChart3, title: "Real insights", body: "Weak-subject detection, revision queue for 21-day-old topics, pace-to-exam and a 7-day activity strip." },
];

export default async function LandingPage() {
  const [signedIn, rows] = await Promise.all([currentUserId(), getLeaderboard("today", null)]);
  const top3 = rows.filter((r) => r.score > 0).slice(0, 3);
  const topicCount = CSE_SUBJECTS.concat(ECE_SUBJECTS).reduce((sum, s) => sum + s.topics.length, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-16">
      <section className="flex flex-col items-start gap-6">
        <span className="chip border border-accent/40 bg-accent/10 font-mono text-accent">
          GATE 2027 · {daysToExam(dayKey())} days left
        </span>
        <h1 className="max-w-3xl font-mono text-4xl font-bold leading-tight sm:text-5xl">
          Study tracker with a{" "}
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">scoreboard</span>
        </h1>
        <p className="max-w-2xl text-base text-muted">
          Check off the syllabus, log your hours, keep your streak alive — and watch it all turn into points on a daily
          leaderboard against everyone else prepping for GATE 2027. {topicCount} topics across CSE and EE/ECE.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={signedIn ? "/dashboard" : "/auth"} className="btn-primary">
            {signedIn ? "Open dashboard" : "Start tracking free"} <ArrowRight size={16} />
          </Link>
          <Link href={signedIn ? "/compete" : "/auth"} className="btn">
            See the leaderboard
          </Link>
        </div>
      </section>

      <section className="panel mt-12 p-5">
        <div className="flex items-center justify-between">
          <p className="label text-warn">Top 3 today</p>
          <Link href="/compete" className="text-xs text-muted transition hover:text-accent">
            full board →
          </Link>
        </div>
        {top3.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nobody has scored yet today. First one to log a topic takes #1.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {top3.map((row, i) => (
              <div
                key={row.userId}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3"
                style={i === 0 ? { borderColor: "hsl(var(--warn) / 0.5)" } : undefined}
              >
                <span className="text-xl">{["🥇", "🥈", "🥉"][i]}</span>
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border"
                  style={{ borderColor: row.color, background: `${row.color}22` }}
                >
                  {row.avatar}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{row.displayName}</span>
                  <span className="block font-mono text-[11px] text-muted">
                    {row.branch} · {row.streak}d streak
                  </span>
                </span>
                <span className="font-mono text-lg font-bold text-accent2">{row.score}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="panel p-5">
            <Icon size={18} className="text-accent" />
            <h2 className="mt-3 text-sm font-semibold">{title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>
          </div>
        ))}
        <div className="panel-glow flex flex-col justify-between p-5">
          <div>
            <h2 className="text-sm font-semibold">Scoring</h2>
            <ul className="mt-2 space-y-1 font-mono text-[12px] text-muted">
              <li>topic ×10</li>
              <li>daily task ×5</li>
              <li>hour logged ×8</li>
              <li>all tasks done +15</li>
            </ul>
          </div>
          <Link href="/auth" className="btn-primary mt-4 text-xs">
            Join and climb <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
