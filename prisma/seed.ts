import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SYLLABUS, type Branch } from "../src/data";
import { dayKey, lastDays } from "../src/lib/day";
import { recomputeDailyScore, dailyTaskSet } from "../src/lib/score";

const prisma = new PrismaClient();

const DEMO = [
  { email: "krish@demo.dev", displayName: "Krish", avatar: "🚀", color: "#6c63ff", branch: "CSE" as Branch, pace: 3 },
  { email: "aarav@demo.dev", displayName: "Aarav", avatar: "🔥", color: "#f5a623", branch: "CSE" as Branch, pace: 2 },
  { email: "isha@demo.dev", displayName: "Isha", avatar: "🧠", color: "#00d4a0", branch: "ECE" as Branch, pace: 4 },
  { email: "dev@demo.dev", displayName: "Dev", avatar: "⚡", color: "#f472b6", branch: "ECE" as Branch, pace: 1 },
];

const PASSWORD = "gate2027";

async function main() {
  const today = dayKey();
  const days = lastDays(14, today);
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  for (const demo of DEMO) {
    const { pace, ...profile } = demo;
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      create: { ...profile, passwordHash },
      update: { ...profile, passwordHash },
    });

    await prisma.topicProgress.deleteMany({ where: { userId: user.id } });
    await prisma.dailyTaskDone.deleteMany({ where: { userId: user.id } });
    await prisma.studySession.deleteMany({ where: { userId: user.id } });
    await prisma.dailyScore.deleteMany({ where: { userId: user.id } });

    const topics = SYLLABUS[demo.branch].flatMap((s) => s.topics.map((t) => ({ ...t, subjectId: s.id })));
    let cursor = 0;

    for (const day of days) {
      const count = Math.max(0, pace + ((day.charCodeAt(9) + pace) % 3) - 1);
      const slice = topics.slice(cursor, cursor + count);
      cursor += count;

      for (const topic of slice) {
        await prisma.topicProgress.create({
          data: { userId: user.id, topicId: topic.id, branch: demo.branch, subjectId: topic.subjectId, day },
        });
      }

      const tasks = dailyTaskSet(day);
      const taskCount = Math.min(tasks.length, pace);
      for (const task of tasks.slice(0, taskCount)) {
        await prisma.dailyTaskDone.create({ data: { userId: user.id, day, taskId: task.id } });
      }

      if (count > 0) {
        await prisma.studySession.create({
          data: {
            userId: user.id,
            day,
            subjectId: slice[0]?.subjectId ?? SYLLABUS[demo.branch][0].id,
            minutes: 45 * pace,
            note: "Seeded study block",
          },
        });
      }

      await recomputeDailyScore(user.id, day);
    }

    console.log(`seeded ${demo.displayName} (${demo.email})`);
  }

  console.log(`\nAll demo accounts use the password: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
