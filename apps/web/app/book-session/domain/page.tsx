"use client";

import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import SelectionStep from "@/modules/booking/components/steps/SelectionStep";
import { DOMAIN_OPTIONS } from "@/modules/booking/constants/booking.constants";
import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function DomainPage() {
  const router = useRouter();
  const { booking, updateBooking } = useBooking();

  return (
    <BookingLayout
      currentStep={2}
      totalSteps={TOTAL_BOOKING_STEPS}
      onBack={() => router.push(BOOKING_ROUTES.EXPERIENCE)}
      onNext={() => router.push(BOOKING_ROUTES.SESSION)}
      nextDisabled={!booking.interview.domain}
    >
      <SelectionStep
        title="Choose Your Domain"
        subtitle="Select the technical area you'd like guidance in."
        options={DOMAIN_OPTIONS.map((item) => ({
          id: item.id,
          title: item.label,
          description: item.description,
          badge: item.badge,
        }))}
        selectedValue={booking.interview.domain ?? undefined}
        onSelect={(id) => {
          const option = DOMAIN_OPTIONS.find(
            (item) => item.id === id
          );

          if (!option) {
            return;
          }

          updateBooking({
            interview: {
              ...booking.interview,
              domain: option.label,
            },
          });
        }}
      />
    </BookingLayout>
  );
}
