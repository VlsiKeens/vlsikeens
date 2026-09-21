"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import Calendar from "@/modules/booking/components/Calendar";
import TimeSlot from "@/modules/booking/components/TimeSlot";

import {
  TIME_SLOTS,
  SESSION_OPTIONS,
} from "@/modules/booking/constants/booking.constants";

import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";

import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function SchedulePage() {
  const router = useRouter();

  const {
    booking,
    updateBooking,
  } = useBooking();

  const selectedDate = booking.schedule.date;
  const selectedTime = booking.schedule.time;

  // Warm up the next step so the transition feels instant, including the
  // dev-server compile on first visit.
  useEffect(() => {
    router.prefetch(BOOKING_ROUTES.REVIEW);
  }, [router]);

  const selectedSession = useMemo(
    () =>
      SESSION_OPTIONS.find(
        (session) =>
          session.name ===
          booking.interview.sessionType
      ),
    [booking.interview.sessionType]
  );

  const handleDateSelect = (date: string) => {
    updateBooking({
      schedule: {
        date,
        time: "",
      },
    });
  };

  const handleTimeSelect = (time: string) => {
    updateBooking({
      schedule: {
        date: selectedDate,
        time,
      },
    });
  };

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    router.push(BOOKING_ROUTES.REVIEW);
  };

  const isDateSelected = selectedDate.length > 0;

  return (
    <BookingLayout
      currentStep={4}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() =>
        router.push(BOOKING_ROUTES.SESSION)
      }
      onNext={handleNext}
      nextDisabled={
        !selectedDate || !selectedTime
      }
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Schedule Your Session
          </h2>

          <p className="mt-1 text-[13px] text-slate-600">
            Choose a convenient date and available
            time for your session.
          </p>
        </div>

        {selectedSession && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  Selected session
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {selectedSession.name} ·{" "}
                  {selectedSession.duration} minutes
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />

          {isDateSelected ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-600">
                  Select a time
                </p>

                <h2 className="mt-0.5 text-sm font-bold text-slate-900">
                  Available time slots
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                {TIME_SLOTS.map((time) => (
                  <TimeSlot
                    key={time}
                    time={time}
                    selected={selectedTime === time}
                    onClick={() =>
                      handleTimeSelect(time)
                    }
                  />
                ))}
              </div>
            </section>
          ) : (
            <section className="hidden rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 text-[13px] text-slate-500 lg:block">
              Select a date on the calendar to view
              available time slots.
            </section>
          )}
        </div>
      </div>
    </BookingLayout>
  );
}
