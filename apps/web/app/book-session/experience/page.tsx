"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import SelectionStep from "@/modules/booking/components/steps/SelectionStep";
import {
  EXPERIENCE_OPTIONS,
} from "@/modules/booking/constants/booking.constants";
import {
  BOOKING_ROUTES,
  TOTAL_BOOKING_STEPS,
} from "@/modules/booking/constants/booking.routes";
import { useBooking } from "@/modules/booking/hooks/useBooking";

export default function ExperiencePage() {
  const router = useRouter();

  const { booking, updateBooking } = useBooking();
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const selectedId = EXPERIENCE_OPTIONS.find(
    (option) => option.label === booking.interview.experience,
  )?.id;

  const handleSelect = (id: string) => {
    const option = EXPERIENCE_OPTIONS.find(
      (item) => item.id === id
    );

    if (!option || selectingId) {
      return;
    }

    updateBooking({
      interview: {
        ...booking.interview,
        experience: option.label,
      },
    });
    setSelectingId(id);

    window.setTimeout(() => router.push(BOOKING_ROUTES.DOMAIN), 250);
  };

  return (
    <BookingLayout
      currentStep={1}
      totalSteps={TOTAL_BOOKING_STEPS}
      hideNavigation
    >
      <SelectionStep
        title="Choose Your Experience"
        subtitle="Select the option that best matches your current level."
        options={EXPERIENCE_OPTIONS.map((item) => ({
          id: item.id,
          title: item.label,
          description:
            item.description ??
            `Suitable for candidates at the ${item.label} level.`,
          badge: item.badge,
        }))}
        selectedValue={selectingId ?? selectedId}
        onSelect={handleSelect}
      />
    </BookingLayout>
  );
}
