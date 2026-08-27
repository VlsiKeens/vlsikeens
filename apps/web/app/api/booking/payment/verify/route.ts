import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma/client";
import { PaymentConfigurationError, PaymentValidationError, verifyAndConfirmPayment } from "@/modules/payments/services/payment.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.razorpay_order_id !== "string" || typeof body.razorpay_payment_id !== "string" || typeof body.razorpay_signature !== "string") return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
  try {
    const bookingId = await prisma.$transaction((tx) => verifyAndConfirmPayment(tx, user.id, body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature), { isolationLevel: "Serializable" });
    return NextResponse.json({ bookingId });
  } catch (error) {
    if (error instanceof PaymentValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof PaymentConfigurationError) return NextResponse.json({ error: "Payment is not configured yet." }, { status: 503 });
    console.error("Unable to verify payment:", error);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
