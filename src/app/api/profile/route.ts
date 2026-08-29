import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isResponse, jsonError, requireUser } from "@/lib/api";

const schema = z.object({
  displayName: z.string().min(2).max(32).optional(),
  avatar: z.string().min(1).max(4).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  branch: z.enum(["CSE", "ECE"]).optional(),
});

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
    select: { displayName: true, avatar: true, color: true, branch: true },
  });
  return NextResponse.json(updated);
}
