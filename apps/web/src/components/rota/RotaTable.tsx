import Link from "next/link";
import { AlertTriangle, CalendarPlus } from "lucide-react";

import { formatShiftTime, getShiftsForEmployeeOnDay } from "@/lib/rota/rota";

import { Employee, Shift } from "@/types";

type RotaTableProps = {
  employees: Employee[];
  shifts: Shift[];
  weekDays: Date[];
};

export default function RotaTable({
  employees,
  shifts,
  weekDays,
}: RotaTableProps) {
  const today = new Date();
  const hasVisibleShifts = employees.some((employee) =>
    weekDays.some(
      (day) => getShiftsForEmployeeOnDay(employee.id, day, shifts).length > 0,
    ),
  );

  return (
    <div className="relative min-h-[calc(100vh-10.5rem)] overflow-x-auto bg-[#fbfaf7]">
      <table className="min-w-[1120px] w-full border-collapse">
        <thead>
          <tr className="border-b border-[#c6cbc2]">
            <th className="w-48 bg-[#f6f3ed] p-5 text-left">
              <span className="text-sm font-medium uppercase tracking-[0.08em] text-[#52642b]">
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
                  className="w-40 border-l border-[#c6cbc2] bg-[#f6f3ed] p-5 text-center"
                >
                  <span className="block text-sm font-medium uppercase tracking-[0.08em] text-[#52642b]">
                    {day.toLocaleDateString("en-GB", {
                      weekday: "short",
                    })}{" "}
                    {day.toLocaleDateString("en-GB", {
                      day: "2-digit",
                    })}
                  </span>

                  {isToday && (
                    <span className="mt-1 block text-xs font-extrabold uppercase text-[#092514]">
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
              className="border-b border-[#c6cbc2] last:border-b-0"
            >
              <td className="bg-[#fbfaf7] p-5 align-middle">
                <div className="flex items-center gap-4">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffdda8] text-sm font-medium text-[#051f12]"
                    aria-hidden
                  >
                    {employee.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-medium tracking-[-0.01em]">
                      {employee.name}
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-[#52642b]">
                      Team member
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
                    className="h-28 border-l border-[#c6cbc2] bg-white p-3 align-top"
                  >
                    {matchingShifts.length > 0 ? (
                      <div className="space-y-2">
                        {matchingShifts.map((shift) => (
                          <div
                            key={shift.id}
                            className="
                              border border-[#c6cbc2] bg-[#ffdda8]
                              p-3 text-left transition
                              hover:border-[#092514]
                            "
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium leading-5">
                                {shift.title}
                              </p>

                              {shift.employeeId === null && (
                                <AlertTriangle
                                  className="size-4 shrink-0 text-red-700"
                                  aria-label="Unassigned shift"
                                />
                              )}
                            </div>

                            <p className="mt-2 font-mono text-sm text-[#051f12]">
                              {formatShiftTime(shift.startTime)}-
                              {formatShiftTime(shift.endTime)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="sr-only">No shifts scheduled</span>
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
          <div className="pointer-events-auto w-full max-w-xl border border-[#c6cbc2] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#f6f3ed]">
              <CalendarPlus className="size-9 text-[#092514]" aria-hidden />
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-[-0.03em]">
              No shifts scheduled
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#3f433c]">
              No shifts scheduled this week. Add the first shift from the shift
              manager.
            </p>
            <Link
              href="/shifts"
              className="mt-8 inline-flex h-11 items-center gap-2 bg-[#052311] px-5 text-sm font-bold text-white transition hover:bg-[#173f27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514] focus-visible:ring-offset-2"
            >
              <CalendarPlus className="size-4" aria-hidden />
              Add Shift
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
