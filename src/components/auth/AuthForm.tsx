"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BRANCHES, BRANCH_LABEL, type Branch } from "@/data";

const AVATARS = ["🚀", "🔥", "🧠", "⚡", "🦉", "🐉", "🎯", "🛠️"];
const COLORS = ["#6c63ff", "#00d4a0", "#f5a623", "#ff5c5c", "#60a5fa", "#f472b6"];

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [branch, setBranch] = useState<Branch>("CSE");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const url = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const body = mode === "signup" ? { email, password, displayName, avatar, color, branch } : { email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError((await res.json()).error ?? "Something went wrong");
      setBusy(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel-glow p-6">
      <div className="mb-5 flex rounded-xl border border-border bg-surface p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === m ? "bg-accent/20 text-accent" : "text-muted hover:text-text"
            }`}
          >
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <label className="flex flex-col gap-1.5">
            <span className="label">Display name</span>
            <input
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Krish"
              required
              minLength={2}
              maxLength={32}
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="label">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
            required
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="label">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={mode === "signup" ? 6 : 1}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>

        {mode === "signup" && (
          <>
            <div className="flex flex-col gap-1.5">
              <span className="label">Avatar &amp; colour</span>
              <div className="flex flex-wrap gap-1.5">
                {AVATARS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={`grid h-9 w-9 place-items-center rounded-lg border text-lg transition ${
                      avatar === emoji ? "border-accent bg-accent/15" : "border-border bg-surface"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    aria-label={`Colour ${c}`}
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full border-2 transition ${color === c ? "scale-110" : ""}`}
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
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${
                      branch === b ? "border-accent bg-accent/10" : "border-border bg-surface"
                    }`}
                  >
                    <span className="block font-mono text-sm font-bold">{b}</span>
                    <span className="block text-[11px] text-muted">{BRANCH_LABEL[b]}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {error ? <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p> : null}

        <button className="btn-primary" disabled={busy}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account & start" : "Sign in"}
        </button>
        <p className="text-center text-[11px] text-muted">No email confirmation — you are in instantly.</p>
      </form>
    </motion.div>
  );
}
