import { Prisma } from "@/lib/generated/prisma/client";

export class CouponValidationError extends Error {}

export function normalizeCouponCode(code: string) {
  return code.trim().toUpperCase();
}

export async function getCouponQuote(
  tx: Prisma.TransactionClient,
  userId: string,
  baseAmount: number,
  couponCode?: string,
) {
  if (!Number.isInteger(baseAmount) || baseAmount <= 0) {
    throw new CouponValidationError("Invalid session price.");
  }

  if (!couponCode) {
    return {
      baseAmount,
      discountAmount: 0,
      finalAmount: baseAmount,
      coupon: null,
    };
  }

  const code = normalizeCouponCode(couponCode);
  const coupon = await tx.coupon.findUnique({ where: { code } });
  const now = new Date();

  if (
    !coupon ||
    !coupon.isActive ||
    (coupon.startsAt && coupon.startsAt > now) ||
    (coupon.expiresAt && coupon.expiresAt <= now)
  ) {
    throw new CouponValidationError("This coupon is invalid or unavailable.");
  }

  if (coupon.minimumAmount > baseAmount) {
    throw new CouponValidationError("This coupon is not eligible for this booking.");
  }

  if (
    coupon.discountValue <= 0 ||
    (coupon.discountType === "PERCENTAGE" && coupon.discountValue > 100)
  ) {
    throw new CouponValidationError("This coupon is not configured correctly.");
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageCount >= coupon.usageLimit
  ) {
    throw new CouponValidationError("This coupon has reached its usage limit.");
  }

  if (coupon.perUserLimit !== null) {
    const used = await tx.couponRedemption.count({
      where: {
        couponId: coupon.id,
        userId,
        status: { in: ["HELD", "REDEEMED"] },
      },
    });

    if (used >= coupon.perUserLimit) {
      throw new CouponValidationError("You have already used this coupon.");
    }
  }

  const rawDiscount =
    coupon.discountType === "PERCENTAGE"
      ? Math.floor((baseAmount * coupon.discountValue) / 100)
      : coupon.discountValue;

  const discountAmount = Math.min(rawDiscount, baseAmount);

  return {
    baseAmount,
    discountAmount,
    finalAmount: baseAmount - discountAmount,
    coupon,
  };
}
