interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage =
    total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Booking Progress
        </span>

        {showPercentage && (
          <span className="text-sm font-semibold text-indigo-600">
            {percentage}%
          </span>
        )}
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
