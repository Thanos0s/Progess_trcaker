import { NextResponse } from "next/server";
import { currentUser, type SessionUser } from "./auth";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await currentUser();
  if (!user) return jsonError("Not authenticated", 401);
  return user;
}

export function isResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
