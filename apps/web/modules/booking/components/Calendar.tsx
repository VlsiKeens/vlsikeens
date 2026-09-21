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
  isToday: boolean;
}

// Monday-first week, as is standard on Indian calendars.
const WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

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

// "Today" as seen in Asia/Kolkata, since all slots are booked in IST.
function todayInIST(): Date {
  const ist = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  ist.setHours(0, 0, 0, 0);

  return ist;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function formatSelectedDate(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  // Monday-first offset: Sunday (0) becomes 6, Monday (1) becomes 0.
  const offset = (result.getDay() + 6) % 7;

  result.setDate(result.getDate() - offset);
  result.setHours(0, 0, 0, 0);

  return result;
}

function endOfWeek(date: Date): Date {
  const result = startOfWeek(date);

  result.setDate(result.getDate() + 6);

  return result;
}

export default function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: CalendarProps) {
  const today = useMemo(() => todayInIST(), []);
  const todayKey = formatDateKey(today);

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
        1,
      );
    }

    return new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1,
    );
  }, [selectedDate, minimumDate]);

  const [visibleMonth, setVisibleMonth] =
    useState<Date>(initialMonth);

  const currentMonth = useMemo(
    () =>
      new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  );

  const monthOptions = useMemo(() => {
    const months: Date[] = [];

    const current = new Date(
      minimumDate.getFullYear(),
      minimumDate.getMonth(),
      1,
    );

    const last = new Date(
      maximumDate.getFullYear(),
      maximumDate.getMonth(),
      1,
    );

    while (current <= last) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }, [minimumDate, maximumDate]);

  const visibleMonthKey = getMonthKey(visibleMonth);

  const monthIndex = monthOptions.findIndex(
    (month) => getMonthKey(month) === visibleMonthKey,
  );

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const monthStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );

    const monthEnd = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    );

    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days: CalendarDay[] = [];
    const current = new Date(calendarStart);

    while (current <= calendarEnd) {
      const date = new Date(current);
      const dateKey = formatDateKey(date);

      days.push({
        date,
        dateKey,
        isCurrentMonth:
          date.getMonth() === visibleMonth.getMonth() &&
          date.getFullYear() ===
            visibleMonth.getFullYear(),
        isDisabled:
          date < minimumDate || date > maximumDate,
        isToday: dateKey === todayKey,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [visibleMonth, minimumDate, maximumDate, todayKey]);

  const handlePreviousMonth = () => {
    if (monthIndex <= 0) {
      return;
    }

    setVisibleMonth(monthOptions[monthIndex - 1]);
  };

  const handleNextMonth = () => {
    if (
      monthIndex === -1 ||
      monthIndex >= monthOptions.length - 1
    ) {
      return;
    }

    setVisibleMonth(monthOptions[monthIndex + 1]);
  };

  const handleToday = () => {
    if (currentMonth >= minimumDate) {
      setVisibleMonth(new Date(currentMonth));
    } else {
      setVisibleMonth(
        new Date(
          minimumDate.getFullYear(),
          minimumDate.getMonth(),
          1,
        ),
      );
    }
  };

  const isCurrentMonthVisible =
    getMonthKey(currentMonth) === visibleMonthKey;

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-600">
            Select a date
          </p>

          <h2 className="mt-0.5 text-base font-bold text-slate-900">
            {getMonthLabel(visibleMonth)}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            disabled={isCurrentMonthVisible}
            className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Today
          </button>

          <button
            type="button"
            onClick={handlePreviousMonth}
            disabled={monthIndex <= 0}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={
              monthIndex === -1 ||
              monthIndex === monthOptions.length - 1
            }
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 pb-1.5">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 justify-items-center gap-y-1">
        {calendarDays.map((day) => {
          const selected = day.dateKey === selectedDate;

          return (
            <button
              key={day.dateKey}
              type="button"
              disabled={
                day.isDisabled || !day.isCurrentMonth
              }
              onClick={() => onSelectDate(day.dateKey)}
              aria-label={day.date.toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${
                !day.isCurrentMonth
                  ? "cursor-default text-slate-300"
                  : day.isDisabled
                    ? "cursor-not-allowed text-slate-300"
                    : selected
                      ? "bg-indigo-600 font-semibold text-white shadow-sm"
                      : day.isToday
                        ? "font-bold text-indigo-700 hover:bg-indigo-50"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {day.date.getDate()}

              {day.isToday && !selected && (
                <span
                  aria-hidden
                  className="absolute bottom-0.5 h-1 w-1 rounded-full bg-indigo-500"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-col gap-0.5 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
        <span className="font-medium text-slate-700">
          {selectedDate
            ? formatSelectedDate(selectedDate)
            : "Select a date to view available times."}
        </span>

        <span>All times in IST (UTC+5:30)</span>
      </div>
    </div>
  );
}
