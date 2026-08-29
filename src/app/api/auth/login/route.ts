import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return jsonError("Enter a valid email and password");

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return jsonError("Incorrect email or password", 401);
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
