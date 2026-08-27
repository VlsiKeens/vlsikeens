"use client";

interface PriceCardProps {
  title: string;
  description: string;
  duration: number;
  price: number;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}

export default function PriceCard({
  title,
  description,
  duration,
  price,
  selected,
  onClick,
  badge,
}: PriceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-2xl border p-6 text-left transition-all duration-200 ${
        selected
          ? "border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-100"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
      }`}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      <div className="pr-20">
        <h3 className="text-xl font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-5">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Duration
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {duration} minutes
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-500">
            Price
          </p>

          <p className="mt-1 text-2xl font-bold text-indigo-600">
            ₹{price}
          </p>
        </div>
      </div>

      {selected && (
        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
            ✓
          </span>

          Selected
        </div>
      )}
    </button>
  );
}
