import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { cancelPendingPayment, confirmWebhookPayment } from "@/modules/payments/services/payment.service";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try {
    event = JSON.parse(raw) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id || !payment.id) return NextResponse.json({ received: true });
  const orderId = payment.order_id;
  const paymentId = payment.id;

  if (event.event === "payment.failed") {
    await prisma.$transaction(async (tx) => {
      const record = await tx.payment.findUnique({ where: { providerOrderId: orderId } });
      if (record) await cancelPendingPayment(tx, record.bookingId);
    });
  }

  // Only a captured payment confirms the booking. The Razorpay API fetch
  // happens BEFORE opening the Serializable transaction so no external
  // network call is made while a DB transaction is held. If the fetch or
  // validation fails, no local DB state is mutated.
  if (event.event === "payment.captured") {
    const providerPayment = await getRazorpayClient().payments.fetch(paymentId);
    await prisma.$transaction((tx) => confirmWebhookPayment(tx, orderId, paymentId, providerPayment), { isolationLevel: "Serializable" });
  }

  return NextResponse.json({ received: true });
}
