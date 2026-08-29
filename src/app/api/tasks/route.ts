import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isResponse, jsonError, requireUser } from "@/lib/api";
import { dayKey } from "@/lib/day";
import { dailyTaskSet, recomputeDailyScore } from "@/lib/score";

const schema = z.union([
  z.object({ action: z.literal("toggle"), taskId: z.string(), done: z.boolean() }),
  z.object({ action: z.enum(["markAll", "reset"]) }),
]);

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError("Invalid payload");

  const day = dayKey();
  const tasks = dailyTaskSet(day);
  const body = parsed.data;

  if (body.action === "toggle") {
    if (!tasks.some((t) => t.id === body.taskId)) return jsonError("Unknown task for today", 404);
    if (body.done) {
      await prisma.dailyTaskDone.upsert({
        where: { userId_day_taskId: { userId: user.id, day, taskId: body.taskId } },
        create: { userId: user.id, day, taskId: body.taskId },
        update: {},
      });
    } else {
      await prisma.dailyTaskDone.deleteMany({ where: { userId: user.id, day, taskId: body.taskId } });
    }
  } else if (body.action === "markAll") {
    for (const task of tasks) {
      await prisma.dailyTaskDone.upsert({
        where: { userId_day_taskId: { userId: user.id, day, taskId: task.id } },
        create: { userId: user.id, day, taskId: task.id },
        update: {},
      });
    }
  } else {
    await prisma.dailyTaskDone.deleteMany({ where: { userId: user.id, day } });
  }

  const totals = await recomputeDailyScore(user.id, day);
  return NextResponse.json({ ok: true, totals });
}
