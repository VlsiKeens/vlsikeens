import { Prisma } from "@/lib/generated/prisma/client";

import {
  createReservation,
  expireHeldReservations,
  findActiveReservations,
  findReservationById,
} from "../repositories/reservation.repository";
import { releaseCouponHoldsForExpiredReservations } from "@/modules/coupons/services/coupon-hold.service";

const HOLD_DURATION_MINUTES = 10;

export class ReservationConflictError extends Error {
  constructor(message = "The selected time slot is no longer available.") {
    super(message);
    this.name = "ReservationConflictError";
  }
}

export class ReservationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReservationValidationError";
  }
}

export interface CreateReservationRequest {
  interviewerId: string;
  userId?: string;
  startAt: Date;
  endAt: Date;
}

export async function createHeldReservation(
  prisma: Prisma.TransactionClient,
  input: CreateReservationRequest,
) {
  const now = new Date();

  if (input.startAt >= input.endAt) {
    throw new ReservationValidationError(
      "Reservation end time must be after start time.",
    );
  }

  if (input.startAt <= now) {
    throw new ReservationValidationError(
      "Reservation must start in the future.",
    );
  }

  await expireHeldReservations(prisma, now);
  await releaseCouponHoldsForExpiredReservations(prisma);

  const existingReservations = await findActiveReservations(
    prisma,
    input.interviewerId,
    input.startAt,
    input.endAt,
  );

  if (existingReservations.length > 0) {
    throw new ReservationConflictError();
  }

  const expiresAt = new Date(
    now.getTime() + HOLD_DURATION_MINUTES * 60 * 1000,
  );

  try {
    return await createReservation(prisma, {
      interviewerId: input.interviewerId,
      userId: input.userId,
      startAt: input.startAt,
      endAt: input.endAt,
      expiresAt,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ReservationConflictError();
    }

    throw error;
  }
}

export async function getReservation(
  prisma: Prisma.TransactionClient,
  reservationId: string,
) {
  return findReservationById(prisma, reservationId);
}
