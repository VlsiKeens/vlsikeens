import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma/client";
import { getSafeReturnPath } from "@/lib/auth/redirect";
import { hashPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";

interface RegisterBody {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
  next?: unknown;
}

function parseRegistration(body: RegisterBody) {
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2) {
    return { error: "Please enter your full name." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  return { fullName, email, password };
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const registration = parseRegistration(body);

  if ("error" in registration) {
    return NextResponse.json({ error: registration.error }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: registration.email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: {
      fullName: registration.fullName,
      email: registration.email,
      passwordHash: await hashPassword(registration.password),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  await setSession(user);

  return NextResponse.json({
    user,
    next: getSafeReturnPath(body.next),
  });
}
