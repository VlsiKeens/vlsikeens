import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma/client";
import { getSafeReturnPath } from "@/lib/auth/redirect";
import { verifyPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";

interface LoginBody {
  email?: unknown;
  password?: unknown;
  next?: unknown;
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      fullName: true,
      email: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await setSession(user);

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    next: getSafeReturnPath(body.next),
  });
}
