"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import {
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import {
  SESSION_OPTIONS,
} from "@/modules/booking/constants/booking.constants";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function ConfirmationPage() {
  const router = useRouter();

  const { booking, user } = useBooking();

  const session = useMemo(
    () =>
      SESSION_OPTIONS.find(
        (option) =>
          option.name ===
          booking.interview.sessionType
      ),
    [booking.interview.sessionType]
  );

  const isPrototypeConfirmation =
    booking.payment.status === "Pending";

  return (
    <BookingLayout
      currentStep={7}
      totalSteps={TOTAL_BOOKING_STEPS}
      nextLabel="Back to Home"
      nextDisabled={false}
      onNext={() => router.push("/")}
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <span className="text-2xl font-bold text-indigo-600">
              ✓
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Booking Request Received
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
            Your booking details have been captured
            successfully.
          </p>

          {isPrototypeConfirmation && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
              <p className="font-semibold text-amber-900">
                Prototype mode
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Payment has not actually been processed
                yet. In the production flow, your selected
                slot will first be temporarily reserved,
                followed by payment verification before
                the booking becomes confirmed.
              </p>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
            <h3 className="font-bold text-slate-900">
              Session Details
            </h3>

            <div className="mt-5 space-y-4">
              <DetailRow
                label="Name"
                value={
                  user.fullName
                }
              />

              <DetailRow
                label="Email"
                value={
                  user.email
                }
              />

              <DetailRow
                label="Session"
                value={session?.name ?? "—"}
              />

              <DetailRow
                label="Duration"
                value={
                  session
                    ? `${session.duration} minutes`
                    : "—"
                }
              />

              <DetailRow
                label="Date"
                value={
                  booking.schedule.date || "—"
                }
              />

              <DetailRow
                label="Time"
                value={
                  booking.schedule.time || "—"
                }
              />

              <DetailRow
                label="Amount"
                value={`₹${
                  session?.price ??
                  booking.payment.amount
                }`}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
