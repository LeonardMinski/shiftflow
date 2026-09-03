"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_MY_SCHEDULE } from "@/graphql/user/queries";
import { GET_WEEK_PUBLICATION } from "@/graphql/rota/queries";
import {
  formatShiftTime,
  getShiftsForEmployeeOnDay,
  getStartOfTheWeek,
  getWeekDays,
  isSameDay,
  toWeekStartKey,
} from "@/lib/rota/rota";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MyScheduleView() {
  const [weekStart, setWeekStart] = useState(() =>
    getStartOfTheWeek(new Date()),
  );

  const { data, loading, error } = useQuery(GET_MY_SCHEDULE);

  const weekStartIso = useMemo(() => toWeekStartKey(weekStart), [weekStart]);
  const { data: publicationData } = useQuery(GET_WEEK_PUBLICATION, {
    variables: { weekStart: weekStartIso },
  });

  const handlePreviousWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() - 7);
    setWeekStart(next);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  const handleToday = () => setWeekStart(getStartOfTheWeek(new Date()));

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">My Schedule</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Loading your schedule...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">My Schedule</h1>
        <p className="mt-4 max-w-xl text-base text-destructive">
          We couldn&apos;t load your schedule.
        </p>
      </main>
    );
  }

  const employee = data?.me?.employee ?? null;

  if (!employee) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">My Schedule</h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          This account isn&apos;t linked to an employee record, so there is
          no personal schedule to show.
        </p>
      </main>
    );
  }

  const weekDays = getWeekDays(weekStart);
  const weekEnd = weekDays[6];
  const today = new Date();
  const isPublished = Boolean(publicationData?.weekPublication?.publishedAt);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <header className="border-b border-border bg-background px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-[-0.04em]">
              My Schedule
            </h1>
            {isPublished && (
              <span className="rounded-full bg-success/15 px-3 py-1 text-sm font-medium uppercase tracking-[0.04em] text-success">
                Published
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePreviousWeek}
              aria-label="Previous week"
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>

            <p className="min-w-40 text-center text-lg font-medium">
              {weekStart.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
              {" - "}
              {weekEnd.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <button
              type="button"
              onClick={handleNextWeek}
              aria-label="Next week"
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Today
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-bold tracking-[-0.02em]">
              Shift Overview
            </h2>
          </div>

          {weekDays.map((day) => {
            const isToday = isSameDay(day, today);
            const shifts = getShiftsForEmployeeOnDay(
              employee.id,
              day,
              employee.shifts,
            );

            return (
              <div
                key={day.toISOString()}
                className={`flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0 ${
                  isToday ? "bg-accent/60" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {day.toLocaleDateString("en-GB", { weekday: "long" })}
                    {isToday && " (Today)"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {day.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {isToday && (
                    <span
                      className="inline-block size-1.5 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </div>

                {shifts.length > 0 ? (
                  <div className="flex flex-col items-end gap-1">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="text-right">
                        <span className="inline-flex rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                          {shift.title}
                        </span>
                        <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                          {formatShiftTime(shift.startTime)} -{" "}
                          {formatShiftTime(shift.endTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No shift
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
