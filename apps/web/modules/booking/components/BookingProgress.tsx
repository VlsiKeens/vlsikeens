"use client";

interface BookingProgressProps {
  current: number;
  total: number;
}

export default function BookingProgress({
  current,
  total,
}: BookingProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>
          Step {current} of {total}
        </span>

        <span>{percentage.toFixed(0)}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
