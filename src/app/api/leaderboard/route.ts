import { NextRequest, NextResponse } from "next/server";
import { getDailyWinners, getLeaderboard, type LeaderRange } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const rangeParam = params.get("range");
  const range: LeaderRange = rangeParam === "week" || rangeParam === "all" ? rangeParam : "today";
  const branchParam = params.get("branch");
  const branch = branchParam === "CSE" || branchParam === "ECE" ? branchParam : null;

  const [rows, winners] = await Promise.all([getLeaderboard(range, branch), getDailyWinners()]);
  return NextResponse.json({ range, branch, rows, winners });
}
