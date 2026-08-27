import { Prisma } from "@/lib/generated/prisma/client";

export type CreateReservationInput = {
  interviewerId: string;
  userId?: string;
  startAt: Date;
  endAt: Date;
  expiresAt: Date;
};

export async function createReservation(
  tx: Prisma.TransactionClient,
  input: CreateReservationInput,
) {
  return tx.reservation.create({
    data: {
      interviewerId: input.interviewerId,
      userId: input.userId,
      startAt: input.startAt,
      endAt: input.endAt,
      expiresAt: input.expiresAt,
      status: "HELD",
    },
  });
}

export async function findReservationById(
  tx: Prisma.TransactionClient,
  reservationId: string,
) {
  return tx.reservation.findUnique({
    where: {
      id: reservationId,
    },
    include: {
      interviewer: true,
      user: true,
      booking: true,
    },
  });
}

export async function expireHeldReservations(
  tx: Prisma.TransactionClient,
  now: Date,
) {
  return tx.reservation.updateMany({
    where: {
      status: "HELD",
      expiresAt: {
        lte: now,
      },
    },
    data: {
      status: "EXPIRED",
    },
  });
}

export async function findActiveReservations(
  tx: Prisma.TransactionClient,
  interviewerId: string,
  startAt: Date,
  endAt: Date,
) {
  return tx.reservation.findMany({
    where: {
      interviewerId,
      status: {
        in: ["HELD", "CONFIRMED"],
      },
      startAt: {
        lt: endAt,
      },
      endAt: {
        gt: startAt,
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });
}
