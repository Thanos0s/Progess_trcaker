import { prisma } from "./prisma";
import { dayKey, lastDays, weekStart } from "./day";
import { streakFrom } from "./score";

export type LeaderRange = "today" | "week" | "all";

export type LeaderRow = {
  userId: string;
  displayName: string;
  avatar: string;
  color: string;
  branch: string;
  score: number;
  topicsDone: number;
  hours: number;
  streak: number;
  rank: number;
};

export type DayWinner = {
  day: string;
  displayName: string | null;
  avatar: string | null;
  score: number;
};

function rangeStart(range: LeaderRange, today: string): string | null {
  if (range === "today") return today;
  if (range === "week") return weekStart(today);
  return null;
}

export async function getLeaderboard(
  range: LeaderRange,
  branch: string | null,
  today: string = dayKey(),
): Promise<LeaderRow[]> {
  const start = rangeStart(range, today);
  const users = await prisma.user.findMany({
    where: branch ? { branch } : undefined,
    select: {
      id: true,
      displayName: true,
      avatar: true,
      color: true,
      branch: true,
      dailyScores: {
        select: { day: true, score: true, topicsDone: true, minutesLogged: true },
      },
    },
  });

  const rows = users.map((user) => {
    const inRange = start ? user.dailyScores.filter((d) => d.day >= start) : user.dailyScores;
    const positiveDays = new Set(user.dailyScores.filter((d) => d.score > 0).map((d) => d.day));
    return {
      userId: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
      color: user.color,
      branch: user.branch,
      score: inRange.reduce((sum, d) => sum + d.score, 0),
      topicsDone: inRange.reduce((sum, d) => sum + d.topicsDone, 0),
      hours: Math.round((inRange.reduce((sum, d) => sum + d.minutesLogged, 0) / 60) * 10) / 10,
      streak: streakFrom(positiveDays, today),
      rank: 0,
    };
  });

  rows.sort((a, b) => b.score - a.score || b.topicsDone - a.topicsDone || a.displayName.localeCompare(b.displayName));
  rows.forEach((row, i) => {
    row.rank = i + 1;
  });
  return rows;
}

export async function getDailyWinners(count = 14, today: string = dayKey()): Promise<DayWinner[]> {
  const days = lastDays(count, today);
  const scores = await prisma.dailyScore.findMany({
    where: { day: { in: days }, score: { gt: 0 } },
    select: {
      day: true,
      score: true,
      user: { select: { displayName: true, avatar: true } },
    },
    orderBy: { score: "desc" },
  });

  return days.map((day) => {
    const top = scores.find((s) => s.day === day);
    return {
      day,
      displayName: top?.user.displayName ?? null,
      avatar: top?.user.avatar ?? null,
      score: top?.score ?? 0,
    };
  });
}
