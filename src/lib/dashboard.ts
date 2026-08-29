import { prisma } from "./prisma";
import { dayKey, lastDays, prettyDay, shiftDay } from "./day";
import { dailyTaskSet, streakFrom } from "./score";
import { daysToExam, lookupTopic, subjectStatus, subjectsFor, type Branch, type DailyTask, type Subject, type SubjectStatus } from "@/data";
import type { SessionUser } from "./auth";

export const REVISION_AFTER_DAYS = 21;

export type SubjectView = Subject & {
  status: SubjectStatus;
  doneCount: number;
  pct: number;
};

export type DashboardData = {
  today: string;
  prettyDate: string;
  branch: Branch;
  subjects: SubjectView[];
  checkedTopics: string[];
  tasks: DailyTask[];
  tasksDone: string[];
  sessions: { id: string; subjectId: string; subjectName: string; minutes: number; note: string | null }[];
  minutesToday: number;
  streak: number;
  todayScore: number;
  totalScore: number;
  heat: { day: string; score: number }[];
  revise: { topicId: string; name: string; subjectName: string; color: string; daysAgo: number }[];
  totals: { done: number; total: number; pct: number };
  weakest: { name: string; pct: number; color: string } | null;
  daysLeft: number;
  pacePerDay: number;
};

export async function getDashboard(user: SessionUser): Promise<DashboardData> {
  const today = dayKey();
  const branch = (user.branch === "ECE" ? "ECE" : "CSE") as Branch;
  const subjects = subjectsFor(branch);

  const [progress, tasksDoneRows, sessionRows, scores] = await Promise.all([
    prisma.topicProgress.findMany({ where: { userId: user.id, branch }, select: { topicId: true, day: true } }),
    prisma.dailyTaskDone.findMany({ where: { userId: user.id, day: today }, select: { taskId: true } }),
    prisma.studySession.findMany({
      where: { userId: user.id, day: today },
      orderBy: { createdAt: "desc" },
      select: { id: true, subjectId: true, minutes: true, note: true },
    }),
    prisma.dailyScore.findMany({ where: { userId: user.id }, select: { day: true, score: true } }),
  ]);

  const checked = new Set(progress.map((p) => p.topicId));
  const subjectViews: SubjectView[] = subjects.map((s) => {
    const doneCount = s.topics.filter((t) => checked.has(t.id)).length;
    return {
      ...s,
      status: subjectStatus(s, today),
      doneCount,
      pct: Math.round((doneCount / s.topics.length) * 100),
    };
  });

  const total = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const done = checked.size;
  const scoreByDay = new Map(scores.map((s) => [s.day, s.score]));
  const positiveDays = new Set(scores.filter((s) => s.score > 0).map((s) => s.day));

  const started = subjectViews.filter((s) => s.doneCount > 0 && s.pct < 100);
  const weakest = started.length
    ? started.reduce((min, s) => (s.pct < min.pct ? s : min))
    : subjectViews.find((s) => s.status === "current") ?? null;

  const cutoff = shiftDay(today, -REVISION_AFTER_DAYS);
  const revise = progress
    .filter((p) => p.day <= cutoff)
    .map((p) => {
      const entry = lookupTopic(p.topicId);
      return {
        topicId: p.topicId,
        name: entry?.topic.name ?? p.topicId,
        subjectName: entry?.subject.name ?? "",
        color: entry?.subject.color ?? "#6c63ff",
        daysAgo: Math.round(
          (new Date(`${today}T00:00:00Z`).getTime() - new Date(`${p.day}T00:00:00Z`).getTime()) / 86_400_000,
        ),
      };
    })
    .sort((a, b) => b.daysAgo - a.daysAgo)
    .slice(0, 8);

  const daysLeft = daysToExam(today);
  const remaining = total - done;

  return {
    today,
    prettyDate: prettyDay(today),
    branch,
    subjects: subjectViews,
    checkedTopics: [...checked],
    tasks: dailyTaskSet(today),
    tasksDone: tasksDoneRows.map((t) => t.taskId),
    sessions: sessionRows.map((s) => ({
      ...s,
      subjectName: subjects.find((x) => x.id === s.subjectId)?.name ?? s.subjectId,
    })),
    minutesToday: sessionRows.reduce((sum, s) => sum + s.minutes, 0),
    streak: streakFrom(positiveDays, today),
    todayScore: scoreByDay.get(today) ?? 0,
    totalScore: scores.reduce((sum, s) => sum + s.score, 0),
    heat: lastDays(7, today).map((day) => ({ day, score: scoreByDay.get(day) ?? 0 })),
    revise,
    totals: { done, total, pct: total ? Math.round((done / total) * 100) : 0 },
    weakest: weakest ? { name: weakest.name, pct: weakest.pct, color: weakest.color } : null,
    daysLeft,
    pacePerDay: daysLeft > 0 ? Math.round((remaining / daysLeft) * 10) / 10 : remaining,
  };
}
