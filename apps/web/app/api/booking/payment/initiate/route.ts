import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma/client";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/razorpay/client";
import { CouponValidationError } from "@/modules/coupons/services/coupon.service";
import { cancelPendingPayment, initiatePayment, PaymentConfigurationError, PaymentSelection, PaymentValidationError } from "@/modules/payments/services/payment.service";
import { ReservationConflictError } from "@/modules/booking/services/reservation.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null) as PaymentSelection | null;
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  let initiated: Awaited<ReturnType<typeof initiatePayment>> | null = null;
  try {
    // Preflight: validate Razorpay configuration before any DB writes, so an
    // unconfigured provider cannot create a reservation/booking/coupon/payment
    // record that then has to be rolled back. getRazorpayClient() throws when
    // credentials are missing (handled as a 503 below).
    const razorpay = getRazorpayClient();
    initiated = await prisma.$transaction((tx) => initiatePayment(tx, user.id, body), { isolationLevel: "Serializable" });
    const order = await razorpay.orders.create({ amount: initiated.quote.finalAmount, currency: "INR", receipt: initiated.booking.id });
    await prisma.payment.update({ where: { id: initiated.payment.id }, data: { providerOrderId: order.id } });
    return NextResponse.json({ bookingId: initiated.booking.id, orderId: order.id, keyId: getRazorpayKeyId(), amount: initiated.quote.finalAmount, currency: "INR", name: "VLSIKeens" });
  } catch (error) {
    if (initiated) await prisma.$transaction((tx) => cancelPendingPayment(tx, initiated!.booking.id));
    if (error instanceof CouponValidationError || error instanceof PaymentValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof ReservationConflictError) return NextResponse.json({ error: error.message, code: "SLOT_UNAVAILABLE" }, { status: 409 });
    if (error instanceof PaymentConfigurationError || (error instanceof Error && error.message === "Razorpay is not configured.")) return NextResponse.json({ error: "Payment is not configured yet." }, { status: 503 });
    console.error("Unable to initiate payment:", error);
    return NextResponse.json({ error: "Unable to start payment." }, { status: 500 });
  }
}
