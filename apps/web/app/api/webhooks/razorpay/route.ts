import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { cancelPendingPayment, confirmWebhookPayment } from "@/modules/payments/services/payment.service";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  const event = JSON.parse(raw) as { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id || !payment.id) return NextResponse.json({ received: true });
  const orderId = payment.order_id;
  const paymentId = payment.id;
  if (event.event === "payment.failed") await prisma.$transaction(async (tx) => { const record = await tx.payment.findUnique({ where: { providerOrderId: orderId } }); if (record) await cancelPendingPayment(tx, record.bookingId); });
  if (event.event === "payment.captured" || event.event === "payment.authorized") await prisma.$transaction((tx) => confirmWebhookPayment(tx, orderId, paymentId), { isolationLevel: "Serializable" });
  return NextResponse.json({ received: true });
}
