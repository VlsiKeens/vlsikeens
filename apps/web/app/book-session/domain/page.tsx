"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BookingLayout from "@/modules/booking/components/BookingLayout";
import DomainAvailabilityModal from "@/modules/booking/components/DomainAvailabilityModal";
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
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(
    !booking.metadata.domainAvailabilityAcknowledged,
  );

  const selectedId = DOMAIN_OPTIONS.find(
    (option) => option.label === booking.interview.domain,
  )?.id;

  const handleSelect = (id: string) => {
    const option = DOMAIN_OPTIONS.find((item) => item.id === id);

    if (!option || !option.available || selectingId) return;

    updateBooking({
      interview: {
        ...booking.interview,
        domain: option.label,
      },
    });
    setSelectingId(id);
    window.setTimeout(() => router.push(BOOKING_ROUTES.SESSION), 250);
  };

  return (
    <>
      <BookingLayout currentStep={2} totalSteps={TOTAL_BOOKING_STEPS} hideNavigation>
        <SelectionStep
          title="Choose Your Domain"
          subtitle="Design Verification sessions are currently available."
          options={DOMAIN_OPTIONS.map((item) => ({
            id: item.id,
            title: item.label,
            description: item.description,
            badge: item.badge,
            disabled: !item.available,
          }))}
          selectedValue={selectingId ?? selectedId}
          onSelect={handleSelect}
          unavailableMessage="This domain is under development."
        />
      </BookingLayout>
      <DomainAvailabilityModal
        open={isAvailabilityOpen}
        onClose={() => {
          updateBooking({
            metadata: {
              ...booking.metadata,
              domainAvailabilityAcknowledged: true,
            },
          });
          setIsAvailabilityOpen(false);
        }}
      />
    </>
  );
}
