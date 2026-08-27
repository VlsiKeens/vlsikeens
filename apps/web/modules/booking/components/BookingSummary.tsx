"use client";

interface BookingSummaryProps {
  experience: string;
  domain: string;
  date: string;
  time: string;
}

export default function BookingSummary({
  experience,
  domain,
  date,
  time,
}: BookingSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Booking Summary
      </h2>

      <div className="space-y-4">
        <p>
          <strong>Experience:</strong> {experience}
        </p>

        <p>
          <strong>Domain:</strong> {domain}
        </p>

        <p>
          <strong>Date:</strong> {date}
        </p>

        <p>
          <strong>Time:</strong> {time}
        </p>
      </div>
    </div>
  );
}
