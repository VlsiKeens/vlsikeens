"use client";

interface ExperienceCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function ExperienceCard({
  title,
  description,
  selected,
  onClick,
}: ExperienceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-6 text-left transition
      ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 hover:border-blue-400"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-slate-600">
        {description}
      </p>
    </button>
  );
}
