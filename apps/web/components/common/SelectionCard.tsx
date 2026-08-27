"use client";

import type { ReactNode } from "react";

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SelectionCard({
  title,
  description,
  icon,
  badge,
  selected = false,
  disabled = false,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        w-full
        rounded-2xl
        border
        p-6
        text-left
        transition-all
        duration-200

        ${
          selected
            ? "border-indigo-600 bg-indigo-50 shadow-lg ring-2 ring-indigo-100"
            : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
        }

        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }
      `}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={`
              flex h-12 w-12 items-center justify-center rounded-xl text-xl

              ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }
            `}
          >
            {icon}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {selected && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            ✓
          </div>
        )}
      </div>
    </button>
  );
}
