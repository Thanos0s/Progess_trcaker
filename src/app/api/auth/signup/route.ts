import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().min(2).max(32),
  avatar: z.string().min(1).max(4),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  branch: z.enum(["CSE", "ECE"]),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const { email, password, ...profile } = parsed.data;
  const normalized = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) return jsonError("An account with that email already exists", 409);

  const user = await prisma.user.create({
    data: { email: normalized, passwordHash: await bcrypt.hash(password, 10), ...profile },
    select: { id: true },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
