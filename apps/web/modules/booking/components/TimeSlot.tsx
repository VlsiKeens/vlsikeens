"use client";

interface TimeSlotProps {
  time: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function TimeSlot({
  time,
  selected,
  onClick,
  disabled = false,
}: TimeSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : selected
            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
            : "border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
      }`}
    >
      {time}
    </button>
  );
}
