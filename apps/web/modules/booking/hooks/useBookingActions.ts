"use client";

import { useBooking } from "./useBooking";

import type {
  CandidateDetails,
  InterviewDetails,
  ScheduleDetails,
  PaymentDetails,
  BookingMetadata,
} from "../types/booking.types";

export function useBookingActions() {
  const {
    booking,
    updateBooking,
    resetBooking,
  } = useBooking();

  const updateCandidate = (
    values: Partial<CandidateDetails>,
  ) => {
    updateBooking({
      candidate: {
        ...booking.candidate,
        ...values,
      },
    });
  };

  const updateInterview = (
    values: Partial<InterviewDetails>,
  ) => {
    updateBooking({
      interview: {
        ...booking.interview,
        ...values,
      },
    });
  };

  const updateSchedule = (
    values: Partial<ScheduleDetails>,
  ) => {
    updateBooking({
      schedule: {
        ...booking.schedule,
        ...values,
      },
    });
  };

  const updatePayment = (
    values: Partial<PaymentDetails>,
  ) => {
    updateBooking({
      payment: {
        ...booking.payment,
        ...values,
      },
    });
  };

  const updateMetadata = (
    values: Partial<BookingMetadata>,
  ) => {
    updateBooking({
      metadata: {
        ...booking.metadata,
        ...values,
      },
    });
  };

  return {
    booking,
    updateCandidate,
    updateInterview,
    updateSchedule,
    updatePayment,
    updateMetadata,
    resetBooking,
  };
}
