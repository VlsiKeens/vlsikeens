"use client";

import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import PriceCard from "@/modules/booking/components/PriceCard";

import {
  SESSION_OPTIONS,
} from "@/modules/booking/constants/booking.constants";

import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";

import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function SessionPage() {
  const router = useRouter();

  const {
    booking,
    updateBooking,
  } = useBooking();

  const selectedSession =
    booking.interview.sessionType;

  const handleSelect = (
    sessionId: string
  ) => {
    const session = SESSION_OPTIONS.find(
      (option) => option.id === sessionId
    );

    if (!session) {
      return;
    }

    updateBooking({
      interview: {
        ...booking.interview,
        sessionType: session.name,
      },
      payment: {
        ...booking.payment,
        amount: session.price,
      },
    });
  };

  const handleNext = () => {
    if (!selectedSession) {
      return;
    }

    router.push(BOOKING_ROUTES.SCHEDULE);
  };

  return (
    <BookingLayout
      currentStep={3}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() =>
        router.push(BOOKING_ROUTES.DOMAIN)
      }
      onNext={handleNext}
      nextDisabled={!selectedSession}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Choose Your Session
        </h2>

        <p className="mt-2 text-slate-600">
          Select the session that best matches your
          current needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {SESSION_OPTIONS.map((option) => (
          <PriceCard
            key={option.id}
            title={option.name}
            description={option.description}
            duration={option.duration}
            price={option.price}
            selected={
              selectedSession === option.name
            }
            badge={option.badge}
            onClick={() =>
              handleSelect(option.id)
            }
          />
        ))}
      </div>
    </BookingLayout>
  );
}
