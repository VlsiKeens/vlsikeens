import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma/client";
import { runExpirySweep } from "@/modules/booking/services/expiry.sweeper";

export const runtime = "nodejs";

// Timing-safe comparison of a caller-supplied secret against the configured one.
// Both sides are hashed to a fixed length first, so timingSafeEqual never throws
// on length mismatch and does not reveal the secret's length.
function secretMatches(provided: string, expected: string): boolean {
  const providedDigest = crypto.createHash("sha256").update(provided).digest();
  const expectedDigest = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(providedDigest, expectedDigest);
}

async function isAdminSession(): Promise<boolean> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return false;
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { role: true },
  });
  return dbUser?.role === "ADMIN";
}

export async function POST(request: Request) {
  const configuredSecret = process.env.EXPIRY_SWEEP_SECRET;
  const providedSecret = request.headers.get("x-expiry-sweep-secret") ?? "";

  const secretValid =
    !!configuredSecret && providedSecret !== "" && secretMatches(providedSecret, configuredSecret);
  const adminValid = await isAdminSession();

  // A single generic response avoids revealing which mechanism failed.
  if (!secretValid && !adminValid) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { ran } = await runExpirySweep();
    return NextResponse.json({ ok: true, ran });
  } catch (error) {
    console.error("Expiry sweep failed:", error);
    return NextResponse.json({ error: "Expiry sweep failed." }, { status: 500 });
  }
}
