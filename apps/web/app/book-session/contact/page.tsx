import { redirect } from "next/navigation";

import { BOOKING_ROUTES } from "@/modules/booking/constants/booking.routes";

export default function ContactPage() {
  redirect(BOOKING_ROUTES.REVIEW);
}
