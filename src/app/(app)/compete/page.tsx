import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getDailyWinners, getLeaderboard } from "@/lib/leaderboard";
import { CompeteClient } from "@/components/compete/CompeteClient";

export const metadata: Metadata = {
  title: "Compete",
  description: "Daily, weekly and all-time GATE 2027 leaderboards — see who is winning today.",
};

export default async function ComparePage() {
  const user = await currentUser();
  if (!user) redirect("/auth");

  const [rows, winners] = await Promise.all([getLeaderboard("today", null), getDailyWinners()]);
  return <CompeteClient meId={user.id} initialRows={rows} winners={winners} />;
}
