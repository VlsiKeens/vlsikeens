"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import {
  DOMAIN_OPTIONS,
  EXPERIENCE_OPTIONS,
  SESSION_OPTIONS,
} from "@/modules/booking/constants/booking.constants";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function ReviewPage() {
  const router = useRouter();

  const { booking } = useBooking();

  const experience = useMemo(
    () =>
      EXPERIENCE_OPTIONS.find(
        (option) =>
          option.label ===
          booking.interview.experience
      ),
    [booking.interview.experience]
  );

  const domain = useMemo(
    () =>
      DOMAIN_OPTIONS.find(
        (option) =>
          option.label ===
          booking.interview.domain
      ),
    [booking.interview.domain]
  );

  const session = useMemo(
    () =>
      SESSION_OPTIONS.find(
        (option) =>
          option.name ===
          booking.interview.sessionType
      ),
    [booking.interview.sessionType]
  );

  const isComplete =
    Boolean(booking.interview.experience) &&
    Boolean(booking.interview.domain) &&
    Boolean(booking.interview.sessionType) &&
    Boolean(booking.schedule.date) &&
    Boolean(booking.schedule.time) &&
    Boolean(booking.candidate.fullName) &&
    Boolean(booking.candidate.email) &&
    Boolean(booking.candidate.phone);

  const handleNext = () => {
    if (!isComplete) {
      return;
    }

    router.push(BOOKING_ROUTES.PAYMENT);
  };

  return (
    <BookingLayout
      currentStep={6}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() =>
        router.push(BOOKING_ROUTES.CONTACT)
      }
      onNext={handleNext}
      nextDisabled={!isComplete}
      nextLabel="Proceed to Payment"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Review Your Booking
          </h2>

          <p className="mt-2 text-slate-600">
            Please verify your details before
            proceeding to payment.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Interview Details
            </h3>

            <button
              type="button"
              onClick={() =>
                router.push(
                  BOOKING_ROUTES.EXPERIENCE
                )
              }
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Edit
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ReviewItem
              label="Experience"
              value={
                experience?.label ??
                "Not selected"
              }
            />

            <ReviewItem
              label="Technical Domain"
              value={
                domain?.label ??
                "Not selected"
              }
            />

            <ReviewItem
              label="Session"
              value={
                session?.name ??
                "Not selected"
              }
            />

            <ReviewItem
              label="Duration"
              value={
                session
                  ? `${session.duration} minutes`
                  : "—"
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Schedule
            </h3>

            <button
              type="button"
              onClick={() =>
                router.push(
                  BOOKING_ROUTES.SCHEDULE
                )
              }
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Edit
            </button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <ReviewItem
              label="Date"
              value={
                booking.schedule.date ||
                "Not selected"
              }
            />

            <ReviewItem
              label="Time"
              value={
                booking.schedule.time ||
                "Not selected"
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Contact Details
            </h3>

            <button
              type="button"
              onClick={() =>
                router.push(
                  BOOKING_ROUTES.CONTACT
                )
              }
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Edit
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <ReviewItem
              label="Full Name"
              value={
                booking.candidate.fullName ||
                "Not provided"
              }
            />

            <ReviewItem
              label="Email"
              value={
                booking.candidate.email ||
                "Not provided"
              }
            />

            <ReviewItem
              label="Phone"
              value={
                booking.candidate.phone ||
                "Not provided"
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-indigo-700">
                Total Amount
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                ₹{session?.price ?? booking.payment.amount}
              </p>
            </div>

            {session && (
              <div className="text-right text-sm text-slate-600">
                <p>{session.name}</p>
                <p className="mt-1">
                  {session.duration} minutes
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-800">
            Your selected time is not permanently
            reserved yet. The time slot will be secured
            through a temporary reservation when the
            booking process reaches the reservation and
            payment stage.
          </p>
        </div>
      </div>
    </BookingLayout>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({
  label,
  value,
}: ReviewItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
