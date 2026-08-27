import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";

import BookingClientProvider from "./BookingClientProvider";

interface BookSessionLayoutProps {
  children: ReactNode;
}

export default async function BookSessionLayout({
  children,
}: BookSessionLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/book-session/experience");
  }

  return (
    <BookingClientProvider user={user}>
      {children}
    </BookingClientProvider>
  );
}
