import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma/client";
import { CouponValidationError } from "@/modules/coupons/services/coupon.service";
import { PaymentConfigurationError, PaymentSelection, PaymentValidationError, quotePayment, validatePaymentSelection } from "@/modules/payments/services/payment.service";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  try {
    validatePaymentSelection(body as PaymentSelection);
    const quote = await prisma.$transaction((tx) =>
      quotePayment(tx, user.id, body as PaymentSelection),
    );
    return NextResponse.json({ quote: { ...quote, coupon: quote.coupon ? { code: quote.coupon.code } : null } });
  } catch (error) {
    if (error instanceof CouponValidationError || error instanceof PaymentValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof PaymentConfigurationError) return NextResponse.json({ error: "Payment is not configured yet." }, { status: 503 });
    console.error("Unable to quote payment:", error);
    return NextResponse.json({ error: "Unable to calculate payment." }, { status: 500 });
  }
}
