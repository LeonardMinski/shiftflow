import Link from "next/link";
import { AlertTriangle, CalendarPlus, Plus } from "lucide-react";

import { formatShiftTime, getShiftsForEmployeeOnDay } from "@/lib/rota/rota";
import { getInitials } from "@/lib/utils";

import { Employee, Shift } from "@/types";

type RotaTableProps = {
  employees: Employee[];
  shifts: Shift[];
  weekDays: Date[];
  onAddShift: (employee: Employee, day: Date) => void;
  onEditShift: (shift: Shift) => void;
};

export default function RotaTable({
  employees,
  shifts,
  weekDays,
  onAddShift,
  onEditShift,
}: RotaTableProps) {
  const today = new Date();
  const hasVisibleShifts = employees.some((employee) =>
    weekDays.some(
      (day) => getShiftsForEmployeeOnDay(employee.id, day, shifts).length > 0,
    ),
  );

  return (
    <div className="relative min-h-[calc(100vh-10.5rem)] overflow-x-auto bg-background">
      <table className="min-w-280 w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="w-48 bg-muted p-5 text-left">
              <span className="text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Employees
              </span>
            </th>

            {weekDays.map((day) => {
              const isToday =
                day.getFullYear() === today.getFullYear() &&
                day.getMonth() === today.getMonth() &&
                day.getDate() === today.getDate();

              return (
                <th
                  key={day.toISOString()}
                  className={`w-40 border-l border-border p-5 text-center ${
                    isToday ? "bg-accent" : "bg-muted"
                  }`}
                >
                  <span
                    className={`block text-sm font-medium uppercase tracking-[0.08em] ${
                      isToday ? "text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {day.toLocaleDateString("en-GB", {
                      weekday: "short",
                    })}{" "}
                    {day.toLocaleDateString("en-GB", {
                      day: "2-digit",
                    })}
                  </span>

                  {isToday && (
                    <span className="mt-1 flex items-center justify-center gap-1 text-xs font-extrabold uppercase text-accent-foreground">
                      <span
                        className="inline-block size-1.5 rounded-full bg-primary"
                        aria-hidden
                      />
                      Today
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-border last:border-b-0"
            >
              <td className="bg-card p-5 align-middle">
                <div className="flex items-center gap-4">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
                    aria-hidden
                  >
                    {getInitials(employee.name)}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-medium tracking-[-0.01em]">
                      {employee.name}
                    </p>
                  </div>
                </div>
              </td>

              {weekDays.map((day) => {
                const matchingShifts = getShiftsForEmployeeOnDay(
                  employee.id,
                  day,
                  shifts,
                );

                return (
                  <td
                    key={day.toISOString()}
                    className="group h-28 border-l border-border bg-card p-3 align-top"
                  >
                    {matchingShifts.length > 0 ? (
                      <div className="space-y-2">
                        {matchingShifts.map((shift) => (
                          <button
                            key={shift.id}
                            type="button"
                            onClick={() => onEditShift(shift)}
                            className="
                              w-full rounded-lg border border-primary/30 bg-accent
                              p-3 text-left transition
                              hover:border-primary focus-visible:outline-none
                              focus-visible:ring-2 focus-visible:ring-ring
                            "
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium leading-5 text-accent-foreground">
                                {shift.title}
                              </p>

                              {shift.employeeId === null && (
                                <AlertTriangle
                                  className="size-4 shrink-0 text-destructive"
                                  aria-label="Unassigned shift"
                                />
                              )}
                            </div>

                            <p className="mt-2 font-mono text-sm text-accent-foreground">
                              {formatShiftTime(shift.startTime)}-
                              {formatShiftTime(shift.endTime)}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddShift(employee, day)}
                        aria-label={`Add shift for ${employee.name} on ${day.toLocaleDateString(
                          "en-GB",
                          { weekday: "long", day: "numeric", month: "long" },
                        )}`}
                        className="
                          flex h-full w-full items-center justify-center rounded-lg
                          text-transparent transition
                          hover:bg-muted hover:text-muted-foreground
                          focus-visible:bg-muted focus-visible:text-muted-foreground
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                          group-hover:text-muted-foreground/60
                        "
                      >
                        <Plus className="size-5" aria-hidden />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {!hasVisibleShifts && (
        <div className="pointer-events-none absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-center lg:inset-x-10">
          <div className="pointer-events-auto w-full max-w-xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
              <CalendarPlus className="size-9 text-primary" aria-hidden />
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-[-0.03em]">
              No shifts scheduled
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
              No shifts scheduled this week. Use the + on any cell, or Add
              Shift above, to get started.
            </p>
            <Link
              href="/employees"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CalendarPlus className="size-4" aria-hidden />
              View Employees
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
