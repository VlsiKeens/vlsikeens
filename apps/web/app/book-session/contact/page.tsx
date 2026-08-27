"use client";

import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function ContactPage() {
  const router = useRouter();

  const { booking, updateBooking } = useBooking();

  const { fullName, email, phone } =
    booking.candidate;

  const isValid =
    fullName.trim().length >= 2 &&
    email.trim().length > 3 &&
    email.includes("@") &&
    phone.trim().length >= 10;

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    router.push(BOOKING_ROUTES.REVIEW);
  };

  return (
    <BookingLayout
      currentStep={5}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() =>
        router.push(BOOKING_ROUTES.SCHEDULE)
      }
      onNext={handleNext}
      nextDisabled={!isValid}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Your Contact Details
          </h2>

          <p className="mt-2 text-slate-600">
            Enter your details so we can send your
            booking confirmation and session information.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                updateBooking({
                  candidate: {
                    ...booking.candidate,
                    fullName: event.target.value,
                  },
                })
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                updateBooking({
                  candidate: {
                    ...booking.candidate,
                    email: event.target.value,
                  },
                })
              }
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                updateBooking({
                  candidate: {
                    ...booking.candidate,
                    phone: event.target.value,
                  },
                })
              }
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Your contact information will be used for
            booking-related communication and session
            updates.
          </p>
        </div>
      </div>
    </BookingLayout>
  );
}
