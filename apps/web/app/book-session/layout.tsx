"use client";

import type { ReactNode } from "react";

import { BookingProvider } from "@/modules/booking/context/BookingContext";

interface BookSessionLayoutProps {
  children: ReactNode;
}

export default function BookSessionLayout({
  children,
}: BookSessionLayoutProps) {
  return <BookingProvider>{children}</BookingProvider>;
}
