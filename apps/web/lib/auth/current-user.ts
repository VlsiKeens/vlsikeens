import { prisma } from "@/lib/prisma/client";

import { getSessionUser } from "./session";

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
    },
  });
}
