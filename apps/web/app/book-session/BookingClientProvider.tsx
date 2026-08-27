"use client";

import type { ReactNode } from "react";

import { BookingProvider } from "@/modules/booking/context/BookingContext";
import type { BookingUser } from "@/modules/booking/types/booking.types";

interface BookingClientProviderProps {
  children: ReactNode;
  user: BookingUser;
}

export default function BookingClientProvider({
  children,
  user,
}: BookingClientProviderProps) {
  return <BookingProvider user={user}>{children}</BookingProvider>;
}
