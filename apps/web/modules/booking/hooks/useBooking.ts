"use client";

import { useContext } from "react";

import { BookingContext } from "../context/BookingContext";
import type { BookingContextValue } from "../types/booking.types";

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);

  if (context === null) {
    throw new Error(
      "useBooking must be used within a BookingProvider."
    );
  }

  return context;
}
