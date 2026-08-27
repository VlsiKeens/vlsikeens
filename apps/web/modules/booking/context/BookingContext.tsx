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

const STORAGE_KEY = "vlsikeens-booking-draft";

function getStoredBooking(): Booking {
  if (typeof window === "undefined") {
    return DEFAULT_BOOKING;
  }

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_BOOKING;
    }

    const parsed = JSON.parse(stored) as Partial<Booking>;

    return {
      ...DEFAULT_BOOKING,
      interview: {
        ...DEFAULT_BOOKING.interview,
        ...(parsed.interview ?? {}),
      },
      schedule: {
        ...DEFAULT_BOOKING.schedule,
        ...(parsed.schedule ?? {}),
      },
      metadata: {
        ...DEFAULT_BOOKING.metadata,
        ...(parsed.metadata ?? {}),
      },
    };
  } catch {
    return DEFAULT_BOOKING;
  }
}

function getPersistedBooking(booking: Booking) {
  return {
    interview: booking.interview,
    schedule: booking.schedule,
    metadata: {
      notes: booking.metadata.notes,
      domainAvailabilityAcknowledged:
        booking.metadata.domainAvailabilityAcknowledged,
    },
  };
}

export function BookingProvider({
  children,
  user,
}: BookingProviderProps) {
  const [booking, setBooking] =
    useState<Booking>(getStoredBooking);

  const updateBooking = (
    updates: Partial<Booking>,
  ) => {
    setBooking((previous) => {
      const next: Booking = {
        ...previous,
        ...updates,
      };

      try {
        window.sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(getPersistedBooking(next)),
        );
      } catch {
        // Ignore storage failures; booking continues in memory.
      }

      return next;
    });
  };

  const resetBooking = () => {
    setBooking(DEFAULT_BOOKING);

    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  const value = useMemo<BookingContextValue>(
    () => ({
      booking,
      user,
      updateBooking,
      resetBooking,
    }),
    [booking, user],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
