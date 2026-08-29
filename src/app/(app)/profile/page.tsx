import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dayKey } from "@/lib/day";
import { bestStreak, streakForUser } from "@/lib/score";
import { subjectsFor, type Branch } from "@/data";
import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata: Metadata = {
  title: "Profile",
  description: "Edit your tracker profile and review your personal GATE 2027 study stats.",
};

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/auth");

  const today = dayKey();
  const branch = (user.branch === "ECE" ? "ECE" : "CSE") as Branch;
  const subjects = subjectsFor(branch);

  const [progress, sessions, scores, streak] = await Promise.all([
    prisma.topicProgress.findMany({ where: { userId: user.id, branch }, select: { subjectId: true } }),
    prisma.studySession.findMany({ where: { userId: user.id }, select: { minutes: true } }),
    prisma.dailyScore.findMany({ where: { userId: user.id }, select: { day: true, score: true } }),
    streakForUser(user.id, today),
  ]);

  const doneBySubject = new Map<string, number>();
  for (const row of progress) doneBySubject.set(row.subjectId, (doneBySubject.get(row.subjectId) ?? 0) + 1);

  return (
    <ProfileClient
      user={user}
      stats={{
        topicsDone: progress.length,
        topicsTotal: subjects.reduce((sum, s) => sum + s.topics.length, 0),
        hours: Math.round((sessions.reduce((sum, s) => sum + s.minutes, 0) / 60) * 10) / 10,
        totalScore: scores.reduce((sum, s) => sum + s.score, 0),
        activeDays: scores.filter((s) => s.score > 0).length,
        streak,
        bestStreak: bestStreak(scores.filter((s) => s.score > 0).map((s) => s.day)),
        breakdown: subjects.map((s) => ({
          name: s.name,
          short: s.name.length > 16 ? `${s.name.slice(0, 15)}…` : s.name,
          pct: Math.round(((doneBySubject.get(s.id) ?? 0) / s.topics.length) * 100),
          color: s.color,
        })),
      }}
    />
  );
}
