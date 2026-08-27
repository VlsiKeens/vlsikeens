export interface TimeSlot {
  startAt: Date;
  endAt: Date;
  available: boolean;
  reservationId?: string;
}

interface AvailabilityWindow {
  startAt: Date;
  endAt: Date;
}

interface ReservationWindow {
  id: string;
  startAt: Date;
  endAt: Date;
}

export function generateTimeSlots(
  availabilityWindows: AvailabilityWindow[],
  reservations: ReservationWindow[],
  durationMinutes: number,
): TimeSlot[] {
  if (durationMinutes <= 0) {
    throw new Error("Slot duration must be greater than zero.");
  }

  const slotDurationMs = durationMinutes * 60 * 1000;

  const slots: TimeSlot[] = [];

  for (const window of availabilityWindows) {
    let cursor = window.startAt.getTime();
    const windowEnd = window.endAt.getTime();

    while (cursor + slotDurationMs <= windowEnd) {
      const startAt = new Date(cursor);
      const endAt = new Date(cursor + slotDurationMs);

      const conflictingReservation = reservations.find(
        (reservation) =>
          reservation.startAt < endAt &&
          reservation.endAt > startAt,
      );

      slots.push({
        startAt,
        endAt,
        available: !conflictingReservation,
        reservationId: conflictingReservation?.id,
      });

      cursor += slotDurationMs;
    }
  }

  return slots;
}
