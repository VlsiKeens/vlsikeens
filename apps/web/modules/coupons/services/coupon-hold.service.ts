import { Prisma } from "@/lib/generated/prisma/client";

// Reservation status is the only expiry authority for coupon holds.
export async function releaseCouponHoldsForExpiredReservations(tx: Prisma.TransactionClient) {
  const expired = await tx.couponRedemption.findMany({ where: { status: "HELD", booking: { reservation: { status: { in: ["EXPIRED", "CANCELLED"] } } } }, select: { id: true, couponId: true } });
  for (const redemption of expired) {
    const released = await tx.couponRedemption.updateMany({ where: { id: redemption.id, status: "HELD" }, data: { status: "RELEASED" } });
    if (released.count) await tx.coupon.update({ where: { id: redemption.couponId }, data: { usageCount: { decrement: 1 } } });
  }
}
