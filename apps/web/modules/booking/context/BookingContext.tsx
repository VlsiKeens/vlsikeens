"use client";

import {
  createContext,
  useMemo,
  useState,
} from "react";

import { DEFAULT_BOOKING } from "../constants/booking.constants";
import type {
  Booking,
  BookingContextValue,
  BookingProviderProps,
} from "../types/booking.types";

export const BookingContext =
  createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
}: BookingProviderProps) {
  const [booking, setBooking] =
    useState<Booking>(DEFAULT_BOOKING);

  const updateBooking = (
    updates: Partial<Booking>,
  ) => {
    setBooking((previous) => ({
      ...previous,
      ...updates,
    }));
  };

  const resetBooking = () => {
    setBooking(DEFAULT_BOOKING);
  };

  const value = useMemo<BookingContextValue>(
    () => ({
      booking,
      updateBooking,
      resetBooking,
    }),
    [booking],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
