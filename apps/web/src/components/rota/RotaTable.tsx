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
  return (
    <div className="overflow-x-auto border border-black/10 bg-[#EAE4D9]">
      <table className="min-w-225 w-full border-collapse">
        <thead>
          <tr className="border-b border-black/10">
            <th className="min-w-40 bg-[#EAE4D9] p-5 text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">
                Employee
              </span>
            </th>

            {weekDays.map((day) => (
              <th
                key={day.toISOString()}
                className="min-w-27.5 border-l border-black/10 bg-[#EAE4D9] p-5 text-left"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">
                  {day.toLocaleDateString("en-GB", {
                    weekday: "short",
                  })}
                </span>

                <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                  {day.toLocaleDateString("en-GB", {
                    day: "numeric",
                  })}
                </p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-black/10 last:border-b-0"
            >
              <td className="bg-[#EAE4D9] p-5 align-top">
                <p className="font-semibold tracking-[-0.02em]">
                  {employee.name}
                </p>

                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-black/35">
                  Team member
                </p>
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
                    className="border-l border-black/10 bg-[#F4F0E8] p-3 align-top"
                  >
                    {matchingShifts.length > 0 ? (
                      <div className="space-y-2">
                        {matchingShifts.map((shift) => (
                          <div
                            key={shift.id}
                            className="
                              border border-black/10
                              bg-[#EAE4D9]
                              p-3
                              transition
                              hover:border-[#FF5A36]/50
                            "
                          >
                            <p className="text-sm font-semibold tracking-[-0.02em]">
                              {shift.title}
                            </p>

                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black/45">
                              {formatShiftTime(shift.startTime)} –{" "}
                              {formatShiftTime(shift.endTime)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-black/25">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
