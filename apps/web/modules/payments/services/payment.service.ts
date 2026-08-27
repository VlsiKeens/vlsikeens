import crypto from "node:crypto";

import { Prisma } from "@/lib/generated/prisma/client";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { CouponValidationError, getCouponQuote, normalizeCouponCode } from "@/modules/coupons/services/coupon.service";
import { createHeldReservation } from "@/modules/booking/services/reservation.service";
import { expireHeldReservations } from "@/modules/booking/repositories/reservation.repository";
import { releaseCouponHoldsForExpiredReservations } from "@/modules/coupons/services/coupon-hold.service";

export class PaymentValidationError extends Error {}
export class PaymentConfigurationError extends Error {}

export interface PaymentSelection {
  experience: string;
  domain: string;
  sessionType: string;
  date: string;
  time: string;
  couponCode?: string;
}

export function validatePaymentSelection(input: PaymentSelection) {
  if (input.domain !== "Design Verification" || !input.experience || !input.sessionType) throw new PaymentValidationError("Invalid booking selection.");
  slotStart(input.date, input.time);
}

function slotStart(date: string, time: string) {
  if (process.env.BOOKING_TIME_ZONE !== "Asia/Kolkata") throw new PaymentConfigurationError("BOOKING_TIME_ZONE must be Asia/Kolkata.");
  const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(time);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !match) throw new PaymentValidationError("Invalid booking schedule.");
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute > 59) throw new PaymentValidationError("Invalid booking schedule.");
  if (match[3] === "PM" && hour !== 12) hour += 12;
  if (match[3] === "AM" && hour === 12) hour = 0;
  const value = new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`);
  if (Number.isNaN(value.getTime()) || value <= new Date()) throw new PaymentValidationError("Please select a future time slot.");
  return value;
}

async function claimCoupon(tx: Prisma.TransactionClient, userId: string, bookingId: string, baseAmount: number, code: string | undefined, expiresAt: Date) {
  const quote = await getCouponQuote(tx, userId, baseAmount, code);
  if (!quote.coupon) return quote;
  const where: Prisma.CouponWhereInput = quote.coupon.usageLimit === null
    ? { id: quote.coupon.id }
    : { id: quote.coupon.id, usageCount: { lt: quote.coupon.usageLimit } };
  const claimed = await tx.coupon.updateMany({ where, data: { usageCount: { increment: 1 } } });
  if (!claimed.count) throw new CouponValidationError("This coupon has reached its usage limit.");
  try {
    await tx.couponRedemption.create({ data: { couponId: quote.coupon.id, userId, bookingId, discountAmount: quote.discountAmount, expiresAt } });
  } catch (error) {
    await tx.coupon.update({ where: { id: quote.coupon.id }, data: { usageCount: { decrement: 1 } } });
    throw error;
  }
  return quote;
}

export async function quotePayment(
  tx: Prisma.TransactionClient,
  userId: string,
  input: PaymentSelection,
) {
  validatePaymentSelection(input);

  if (input.sessionType !== "Mock Interview") {
    throw new PaymentValidationError("This session is currently unavailable.");
  }

  const sessionType = await tx.sessionType.findFirst({
    where: {
      name: input.sessionType,
      isActive: true,
    },
    select: {
      price: true,
    },
  });

  if (!sessionType) {
    throw new PaymentValidationError("This session is currently unavailable.");
  }

  return getCouponQuote(
    tx,
    userId,
    sessionType.price,
    input.couponCode,
  );
}

export async function initiatePayment(prisma: Prisma.TransactionClient, userId: string, input: PaymentSelection) {
  const interviewerId = process.env.DEFAULT_INTERVIEWER_ID;
  if (!interviewerId) throw new PaymentConfigurationError("DEFAULT_INTERVIEWER_ID is not configured.");
  validatePaymentSelection(input);

  if (input.sessionType !== "Mock Interview") {
    throw new PaymentValidationError("This session is currently unavailable.");
  }

  const sessionType = await prisma.sessionType.findFirst({
    where: {
      name: input.sessionType,
      isActive: true,
    },
    select: {
      id: true,
      price: true,
      durationMin: true,
    },
  });

  if (!sessionType) {
    throw new PaymentValidationError("This session is currently unavailable.");
  }

  const startAt = slotStart(input.date, input.time);
  const endAt = new Date(
    startAt.getTime() + sessionType.durationMin * 60 * 1000,
  );

  const now = new Date();
  await expireHeldReservations(prisma, now);
  await releaseCouponHoldsForExpiredReservations(prisma);

  const interviewer = await prisma.interviewer.findFirst({
    where: { id: interviewerId, isActive: true },
    select: { id: true },
  });

  if (!interviewer) {
    throw new PaymentConfigurationError(
      "The configured interviewer is unavailable.",
    );
  }

  const reservation = await createHeldReservation(prisma, {
    interviewerId: interviewer.id,
    userId,
    startAt,
    endAt,
  });

  const booking = await prisma.booking.create({
    data: {
      userId,
      sessionTypeId: sessionType.id,
      reservationId: reservation.id,
      experience: input.experience,
      domain: input.domain,
    },
  });
  const quote = await claimCoupon(prisma, userId, booking.id, sessionType.price, input.couponCode ? normalizeCouponCode(input.couponCode) : undefined, reservation.expiresAt!);
  const payment = await prisma.payment.create({ data: { bookingId: booking.id, amount: quote.finalAmount, currency: "INR", provider: "RAZORPAY" } });
  return { booking, reservation, payment, quote };
}

export async function cancelPendingPayment(tx: Prisma.TransactionClient, bookingId: string) {
  const payment = await tx.payment.findUnique({ where: { bookingId }, include: { booking: { include: { reservation: true, couponRedemption: true } } } });
  if (!payment || payment.status !== "PENDING") return;
  await tx.reservation.updateMany({ where: { id: payment.booking.reservationId, status: "HELD" }, data: { status: "CANCELLED" } });
  const redemption = payment.booking.couponRedemption;
  if (redemption) {
    const released = await tx.couponRedemption.updateMany({ where: { id: redemption.id, status: "HELD" }, data: { status: "RELEASED" } });
    if (released.count) await tx.coupon.update({ where: { id: redemption.couponId }, data: { usageCount: { decrement: 1 } } });
  }
  await tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
  await tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new PaymentConfigurationError("Razorpay is not configured.");
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function verifyAndConfirmPayment(tx: Prisma.TransactionClient, userId: string, orderId: string, paymentId: string, signature: string) {
  if (!verifyRazorpaySignature(orderId, paymentId, signature)) throw new PaymentValidationError("Payment verification failed.");
  const payment = await tx.payment.findUnique({ where: { providerOrderId: orderId }, include: { booking: { include: { reservation: true, couponRedemption: true } } } });
  if (!payment || payment.booking.userId !== userId) throw new PaymentValidationError("Payment was not found.");
  if (payment.status === "PAID") return payment.booking.id;
  if (payment.status !== "PENDING" || payment.booking.reservation.status !== "HELD" || (payment.booking.reservation.expiresAt && payment.booking.reservation.expiresAt <= new Date())) throw new PaymentValidationError("This payment is no longer available.");
  const providerPayment = await getRazorpayClient().payments.fetch(paymentId);
  if (providerPayment.order_id !== orderId || providerPayment.amount !== payment.amount || !["authorized", "captured"].includes(providerPayment.status)) throw new PaymentValidationError("Razorpay payment details could not be verified.");
  await tx.payment.update({ where: { id: payment.id }, data: { status: "PAID", providerPaymentId: paymentId, providerSignature: signature } });
  await tx.reservation.update({ where: { id: payment.booking.reservationId }, data: { status: "CONFIRMED", expiresAt: null } });
  await tx.booking.update({ where: { id: payment.booking.id }, data: { status: "CONFIRMED" } });
  if (payment.booking.couponRedemption) await tx.couponRedemption.updateMany({ where: { id: payment.booking.couponRedemption.id, status: "HELD" }, data: { status: "REDEEMED" } });
  return payment.booking.id;
}

export async function confirmWebhookPayment(tx: Prisma.TransactionClient, orderId: string, paymentId: string) {
  const payment = await tx.payment.findUnique({ where: { providerOrderId: orderId }, include: { booking: { include: { reservation: true, couponRedemption: true } } } });
  if (!payment || payment.status === "PAID") return;
  const providerPayment = await getRazorpayClient().payments.fetch(paymentId);
  if (providerPayment.order_id !== orderId || providerPayment.amount !== payment.amount || !["authorized", "captured"].includes(providerPayment.status)) throw new PaymentValidationError("Razorpay payment details could not be verified.");
  if (payment.booking.reservation.status !== "HELD") return;
  await tx.payment.update({ where: { id: payment.id }, data: { status: "PAID", providerPaymentId: paymentId } });
  await tx.reservation.update({ where: { id: payment.booking.reservationId }, data: { status: "CONFIRMED", expiresAt: null } });
  await tx.booking.update({ where: { id: payment.booking.id }, data: { status: "CONFIRMED" } });
  if (payment.booking.couponRedemption) await tx.couponRedemption.updateMany({ where: { id: payment.booking.couponRedemption.id, status: "HELD" }, data: { status: "REDEEMED" } });
}
