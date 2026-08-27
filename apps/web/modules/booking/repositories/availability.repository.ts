import { Prisma } from "@/lib/generated/prisma/client";

export async function findActiveReservationsInRange(
  tx: Prisma.TransactionClient,
  interviewerId: string,
  rangeStart: Date,
  rangeEnd: Date,
) {
  return tx.reservation.findMany({
    where: {
      interviewerId,
      status: {
        in: ["HELD", "CONFIRMED"],
      },
      startAt: {
        lt: rangeEnd,
      },
      endAt: {
        gt: rangeStart,
      },
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      status: true,
      expiresAt: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });
}

export async function findInterviewerAvailabilityInRange(
  tx: Prisma.TransactionClient,
  interviewerId: string,
  rangeStart: Date,
  rangeEnd: Date,
) {
  return tx.interviewerAvailability.findMany({
    where: {
      interviewerId,
      isAvailable: true,
      startAt: {
        lt: rangeEnd,
      },
      endAt: {
        gt: rangeStart,
      },
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
    },
    orderBy: {
      startAt: "asc",
    },
  });
}
