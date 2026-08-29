import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isResponse, jsonError, requireUser } from "@/lib/api";
import { dayKey } from "@/lib/day";
import { recomputeDailyScore } from "@/lib/score";

const schema = z.object({
  subjectId: z.string().min(1),
  minutes: z.number().int().min(1).max(24 * 60),
  note: z.string().max(160).optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const day = dayKey();
  await prisma.studySession.create({ data: { userId: user.id, day, ...parsed.data } });
  const totals = await recomputeDailyScore(user.id, day);
  return NextResponse.json({ ok: true, totals });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return jsonError("Missing session id");

  const session = await prisma.studySession.findUnique({ where: { id }, select: { userId: true, day: true } });
  if (!session || session.userId !== user.id) return jsonError("Not found", 404);

  await prisma.studySession.delete({ where: { id } });
  const totals = await recomputeDailyScore(user.id, session.day);
  return NextResponse.json({ ok: true, totals });
}
