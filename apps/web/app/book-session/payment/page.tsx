"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import {
  SESSION_OPTIONS,
} from "@/modules/booking/constants/booking.constants";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function PaymentPage() {
  const router = useRouter();

  const {
    booking,
    updateBooking,
  } = useBooking();

  const session = useMemo(
    () =>
      SESSION_OPTIONS.find(
        (option) =>
          option.name ===
          booking.interview.sessionType
      ),
    [booking.interview.sessionType]
  );

  const amount =
    session?.price ?? booking.payment.amount;

  const isReady =
    Boolean(booking.candidate.fullName) &&
    Boolean(booking.candidate.email) &&
    Boolean(booking.candidate.phone) &&
    Boolean(booking.interview.experience) &&
    Boolean(booking.interview.domain) &&
    Boolean(booking.interview.sessionType) &&
    Boolean(booking.schedule.date) &&
    Boolean(booking.schedule.time);

  const handlePayment = () => {
    if (!isReady) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * This is intentionally only a frontend prototype.
     *
     * The real implementation will:
     *
     * 1. Ask the backend to create a temporary
     *    reservation for the selected slot.
     *
     * 2. The backend atomically checks whether the
     *    slot is still available.
     *
     * 3. If another student already reserved it,
     *    this request fails.
     *
     * 4. If successful, the reservation receives a
     *    short expiration window.
     *
     * 5. Payment is then initiated.
     *
     * 6. Successful payment converts the reservation
     *    into a confirmed booking.
     *
     * 7. Failed/expired payment releases the slot.
     */

    updateBooking({
      payment: {
        amount,
        status: "Pending",
      },
      metadata: {
        ...booking.metadata,
        bookingStatus: "Pending",
      },
    });

    router.push(BOOKING_ROUTES.CONFIRMATION);
  };

  return (
    <BookingLayout
      currentStep={7}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() =>
        router.push(BOOKING_ROUTES.REVIEW)
      }
      onNext={handlePayment}
      nextDisabled={!isReady}
      nextLabel={`Pay ₹${amount}`}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Complete Your Payment
          </h2>

          <p className="mt-2 text-slate-600">
            Review the amount below and continue to
            complete your booking.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Payment Summary
          </h3>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Session
              </span>

              <span className="font-semibold text-slate-900">
                {session?.name ?? "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Duration
              </span>

              <span className="font-semibold text-slate-900">
                {session
                  ? `${session.duration} minutes`
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Date
              </span>

              <span className="font-semibold text-slate-900">
                {booking.schedule.date || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">
                Time
              </span>

              <span className="font-semibold text-slate-900">
                {booking.schedule.time || "—"}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-indigo-600">
                  ₹{amount}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            About your time slot
          </h3>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            Your selected time is not permanently
            reserved yet. During the real payment flow,
            we will temporarily reserve the slot before
            starting payment. If payment is not
            completed within the reservation window,
            the slot will automatically become available
            again.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            Payment gateway integration will be connected
            here. No real payment is being processed by
            this prototype.
          </p>
        </section>
      </div>
    </BookingLayout>
  );
}
