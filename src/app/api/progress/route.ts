import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isResponse, jsonError, requireUser } from "@/lib/api";
import { lookupTopic } from "@/data";
import { dayKey } from "@/lib/day";
import { recomputeDailyScore } from "@/lib/score";

const schema = z.object({ topicId: z.string(), done: z.boolean() });

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError("Invalid payload");

  const entry = lookupTopic(parsed.data.topicId);
  if (!entry) return jsonError("Unknown topic", 404);

  const today = dayKey();
  let affectedDay = today;

  if (parsed.data.done) {
    await prisma.topicProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId: entry.topic.id } },
      create: {
        userId: user.id,
        topicId: entry.topic.id,
        branch: entry.branch,
        subjectId: entry.subject.id,
        day: today,
      },
      update: {},
    });
  } else {
    const existing = await prisma.topicProgress.findUnique({
      where: { userId_topicId: { userId: user.id, topicId: entry.topic.id } },
      select: { day: true },
    });
    if (!existing) return NextResponse.json({ ok: true });
    affectedDay = existing.day;
    await prisma.topicProgress.delete({
      where: { userId_topicId: { userId: user.id, topicId: entry.topic.id } },
    });
  }

  const totals = await recomputeDailyScore(user.id, affectedDay);
  if (affectedDay !== today) await recomputeDailyScore(user.id, today);
  return NextResponse.json({ ok: true, totals });
}
