import { Prisma } from "@/lib/generated/prisma/client";

import {
  findActiveReservationsInRange,
  findInterviewerAvailabilityInRange,
} from "../repositories/availability.repository";
import { expireHeldReservations } from "../repositories/reservation.repository";
import { releaseCouponHoldsForExpiredReservations } from "@/modules/coupons/services/coupon-hold.service";

export class AvailabilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvailabilityValidationError";
  }
}

export async function getInterviewerAvailability(
  prisma: Prisma.TransactionClient,
  interviewerId: string,
  rangeStart: Date,
  rangeEnd: Date,
) {
  if (rangeStart >= rangeEnd) {
    throw new AvailabilityValidationError(
      "The availability range must have a valid start and end.",
    );
  }

  const now = new Date();

  await expireHeldReservations(prisma, now);
  await releaseCouponHoldsForExpiredReservations(prisma);

  const [availabilityWindows, reservations] = await Promise.all([
    findInterviewerAvailabilityInRange(
      prisma,
      interviewerId,
      rangeStart,
      rangeEnd,
    ),
    findActiveReservationsInRange(
      prisma,
      interviewerId,
      rangeStart,
      rangeEnd,
    ),
  ]);

  return {
    interviewerId,
    rangeStart,
    rangeEnd,
    availabilityWindows,
    reservations,
  };
}
