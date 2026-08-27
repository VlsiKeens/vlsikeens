"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function BookingSuccess() {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
      <h1 className="text-3xl font-bold text-green-600">
        Booking Confirmed 🎉
      </h1>

      <p className="mt-4 text-slate-600">
        Your mock interview has been booked successfully.
      </p>

      <Link href="/dashboard">
        <Button className="mt-8">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
