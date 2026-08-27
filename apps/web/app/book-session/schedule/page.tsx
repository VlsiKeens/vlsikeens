"use client";

import { useMemo } from "react";
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
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Schedule Your Session
          </h2>

          <p className="mt-2 text-slate-600">
            Choose a convenient date and available
            time for your session.
          </p>
        </div>

        {selectedSession && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700">
                  Selected session
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedSession.name}
                </p>
              </div>

              <div className="text-sm text-slate-600">
                {selectedSession.duration} minutes
                {" · "}
                ₹{selectedSession.price}
              </div>
            </div>
          </div>
        )}

        <Calendar
          selectedDate={selectedDate}
          onSelectDate={handleDateSelect}
        />

        {isDateSelected && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-medium text-indigo-600">
                Select a time
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Available time slots
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Availability shown here is currently
                based on the configured session slots.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
        )}
      </div>
    </BookingLayout>
  );
}
