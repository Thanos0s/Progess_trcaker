import { prisma } from "./prisma";
import { DAILY_TASKS } from "@/data";
import { isWeekend, shiftDay } from "./day";

export const POINTS = {
  perTopic: 10,
  perTask: 5,
  perHour: 8,
  allTasksBonus: 15,
};

export function dailyTaskSet(day: string) {
  return isWeekend(day) ? DAILY_TASKS.weekend : DAILY_TASKS.weekday;
}

export function computeScore(input: { topicsDone: number; tasksDone: number; minutesLogged: number; day: string }) {
  const taskTotal = dailyTaskSet(input.day).length;
  const base =
    input.topicsDone * POINTS.perTopic +
    input.tasksDone * POINTS.perTask +
    Math.round((input.minutesLogged / 60) * POINTS.perHour);
  const bonus = taskTotal > 0 && input.tasksDone >= taskTotal ? POINTS.allTasksBonus : 0;
  return base + bonus;
}

/** Recomputes and persists the cached daily score so leaderboard reads stay cheap. */
export async function recomputeDailyScore(userId: string, day: string) {
  const [topicsDone, tasksDone, sessions] = await Promise.all([
    prisma.topicProgress.count({ where: { userId, day } }),
    prisma.dailyTaskDone.count({ where: { userId, day } }),
    prisma.studySession.findMany({ where: { userId, day }, select: { minutes: true } }),
  ]);
  const minutesLogged = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const score = computeScore({ topicsDone, tasksDone, minutesLogged, day });
  const data = { score, topicsDone, tasksDone, minutesLogged };

  await prisma.dailyScore.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, ...data },
    update: data,
  });
  return data;
}

/** Consecutive days (ending today or yesterday) with a positive score. */
export function streakFrom(days: Set<string>, today: string): number {
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  if (!days.has(cursor)) return 0;
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export async function streakForUser(userId: string, today: string) {
  const rows = await prisma.dailyScore.findMany({
    where: { userId, score: { gt: 0 } },
    select: { day: true },
  });
  return streakFrom(new Set(rows.map((r) => r.day)), today);
}

export function bestStreak(days: string[]): number {
  const set = new Set(days);
  let best = 0;
  for (const day of set) {
    if (set.has(shiftDay(day, -1))) continue;
    let len = 0;
    let cursor = day;
    while (set.has(cursor)) {
      len += 1;
      cursor = shiftDay(cursor, 1);
    }
    best = Math.max(best, len);
  }
  return best;
}
