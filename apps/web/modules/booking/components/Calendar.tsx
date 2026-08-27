"use client";

import { useMemo, useState } from "react";

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

interface CalendarDay {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date | null {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() + (6 - day));
  result.setHours(0, 0, 0, 0);

  return result;
}

export default function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: CalendarProps) {
  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const minimumDate = useMemo(() => {
    if (minDate) {
      const parsed = parseDate(minDate);

      if (parsed) {
        return parsed;
      }
    }

    return today;
  }, [minDate, today]);

  const maximumDate = useMemo(() => {
    if (maxDate) {
      const parsed = parseDate(maxDate);

      if (parsed) {
        return parsed;
      }
    }

    const date = new Date(minimumDate);

    date.setDate(date.getDate() + 60);

    return date;
  }, [maxDate, minimumDate]);

  const initialMonth = useMemo(() => {
    const selected = parseDate(selectedDate);

    if (selected) {
      return new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      );
    }

    return new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1
    );
  }, [selectedDate, minimumDate]);

  const [visibleMonth, setVisibleMonth] =
    useState<Date>(initialMonth);

  const monthOptions = useMemo(() => {
    const months: Date[] = [];

    const current = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1
    );

    const last = new Date(
      maximumDate.getFullYear(),
      maximumDate.getMonth(),
      1
    );

    while (current <= last) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }, [minimumDate, maximumDate]);

  const visibleMonthKey = getMonthKey(visibleMonth);

  const monthIndex = monthOptions.findIndex(
    (month) => getMonthKey(month) === visibleMonthKey
  );

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const monthStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1
    );

    const monthEnd = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0
    );

    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days: CalendarDay[] = [];
    const current = new Date(calendarStart);

    while (current <= calendarEnd) {
      const date = new Date(current);

      days.push({
        date,
        dateKey: formatDateKey(date),
        isCurrentMonth:
          date.getMonth() === visibleMonth.getMonth() &&
          date.getFullYear() ===
            visibleMonth.getFullYear(),
        isDisabled:
          date < minimumDate || date > maximumDate,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [visibleMonth, minimumDate, maximumDate]);

  const handleMonthChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = monthOptions.find(
      (month) => getMonthKey(month) === event.target.value
    );

    if (selected) {
      setVisibleMonth(selected);
    }
  };

  const handlePreviousMonth = () => {
    if (monthIndex <= 0) {
      return;
    }

    setVisibleMonth(
      monthOptions[monthIndex - 1]
    );
  };

  const handleNextMonth = () => {
    if (
      monthIndex === -1 ||
      monthIndex >= monthOptions.length - 1
    ) {
      return;
    }

    setVisibleMonth(
      monthOptions[monthIndex + 1]
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Select a date
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Choose your preferred day
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousMonth}
            disabled={monthIndex <= 0}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>

          <select
            value={visibleMonthKey}
            onChange={handleMonthChange}
            className="h-10 min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            aria-label="Select month"
          >
            {monthOptions.map((month) => (
              <option
                key={getMonthKey(month)}
                value={getMonthKey(month)}
              >
                {getMonthLabel(month)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={
              monthIndex ===
              monthOptions.length - 1
            }
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 pb-3">
        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day) => {
          const selected =
            day.dateKey === selectedDate;

          return (
            <button
              key={day.dateKey}
              type="button"
              disabled={
                day.isDisabled ||
                !day.isCurrentMonth
              }
              onClick={() =>
                onSelectDate(day.dateKey)
              }
              className={`flex aspect-square min-h-10 items-center justify-center rounded-lg text-sm font-medium transition sm:min-h-12 ${
                !day.isCurrentMonth
                  ? "cursor-default text-slate-300"
                  : day.isDisabled
                    ? "cursor-not-allowed text-slate-300"
                    : selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>
          Select a date to view available times.
        </span>

        <span>
          {getMonthLabel(visibleMonth)}
        </span>
      </div>
    </div>
  );
}
