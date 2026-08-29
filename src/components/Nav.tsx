"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LayoutDashboard, LogOut, Trophy, UserRound } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compete", label: "Compete", icon: Trophy },
  { href: "/profile", label: "Profile", icon: UserRound },
];

type Props = {
  displayName: string;
  avatar: string;
  color: string;
  branch: string;
  streak: number;
};

export function Nav({ displayName, avatar, color, branch, streak }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 font-mono text-xs font-bold text-accent">
            G27
          </span>
          <span className="hidden font-mono text-sm font-bold sm:block">GATE Tracker</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active ? "bg-accent/20 text-accent" : "text-muted hover:text-text"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="chip bg-warn/10 font-mono text-warn">
            <Flame size={13} /> {streak}d
          </span>
          <span
            className="grid h-8 w-8 place-items-center rounded-full border text-sm"
            style={{ borderColor: color, background: `${color}22` }}
            title={`${displayName} · ${branch}`}
          >
            {avatar}
          </span>
          <button onClick={signOut} className="btn px-2 py-1.5 text-muted" aria-label="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
