import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@/lib/generated/prisma/client";
import { expireHeldReservations } from "../repositories/reservation.repository";
import { releaseCouponHoldsForExpiredReservations } from "@/modules/coupons/services/coupon-hold.service";
import { cancelPendingPayment } from "@/modules/payments/services/payment.service";

// Best-effort single-flight guard so overlapping sweep runs do not execute
// concurrently. The underlying operations are idempotent and run inside a single
// transaction, so any individual overlap is also safe.
let sweepInFlight = false;

export async function sweepExpiredBookings(tx: Prisma.TransactionClient) {
  const now = new Date();

  // 1) Expire HELD reservations whose hold window has passed.
  await expireHeldReservations(tx, now);

  // 2) Release coupon holds tied to EXPIRED/CANCELLED reservations, decrementing
  //    usage exactly once per HELD -> RELEASED transition.
  await releaseCouponHoldsForExpiredReservations(tx);

  // 3) Genuinely abandoned PENDING payments (their reservation is already
  //    EXPIRED) can never be verified or webhook-confirmed, so fail them via the
  //    existing cancelPendingPayment path: reservation CANCELLED (no-op if
  //    already EXPIRED), redemption RELEASED (no-op if already RELEASED),
  //    payment FAILED, booking CANCELLED. usageCount is not decremented again.
  const stale = await tx.payment.findMany({
    where: {
      status: "PENDING",
      booking: { reservation: { status: "EXPIRED" } },
    },
    select: { bookingId: true },
  });

  for (const payment of stale) {
    await cancelPendingPayment(tx, payment.bookingId);
  }
}

export async function runExpirySweep(): Promise<{ ran: boolean }> {
  if (sweepInFlight) return { ran: false };
  sweepInFlight = true;
  try {
    await prisma.$transaction((tx) => sweepExpiredBookings(tx));
    return { ran: true };
  } finally {
    sweepInFlight = false;
  }
}
