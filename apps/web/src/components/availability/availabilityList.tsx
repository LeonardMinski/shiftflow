import { Ban, CheckCircle2, Trash2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";

import { DELETE_EMPLOYEE_AVAILABILITY } from "@/graphql/availability/mutations";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { Employee } from "@/types";
import {
  DeleteEmployeeAvailabilityData,
  DeleteEmployeeAvailabilityVariables,
} from "@/types/availability";

type AvailabilityListProps = {
  employees: Employee[];
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function AvailabilityList({ employees }: AvailabilityListProps) {
  const [deleteEmployeeAvailability] = useMutation<
    DeleteEmployeeAvailabilityData,
    DeleteEmployeeAvailabilityVariables
  >(DELETE_EMPLOYEE_AVAILABILITY, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const handleDelete = async (id: string) => {
    await deleteEmployeeAvailability({
      variables: {
        id,
      },
    });
  };

  return (
    <section aria-labelledby="availability-list-heading">
      <h2 id="availability-list-heading" className="sr-only">
        Employee availability
      </h2>

      {employees.length === 0 ? (
        <div className="border border-[#c6cbc2] bg-white p-10 text-center">
          <p className="text-lg font-semibold">No employees available.</p>
          <p className="mt-2 text-sm text-[#3f433c]">
            Add employees before recording weekly availability.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {employees.map((employee) => (
            <article
              key={employee.id}
              className="border border-[#c6cbc2] bg-white p-5 sm:p-6"
            >
              <div className="mb-5 flex flex-col gap-2 border-b border-[#c6cbc2] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-[-0.03em]">
                    {employee.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#3f433c]">
                    {employee.email}
                  </p>
                </div>

                <p className="text-sm font-medium text-[#52642b]">
                  {employee.availability.length}{" "}
                  {employee.availability.length === 1 ? "entry" : "entries"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {daysOfWeek.map((day) => {
                  const availability = employee.availability.find(
                    (item) => item.dayOfWeek === day,
                  );
                  const available = availability?.available === true;

                  return (
                    <div
                      key={day}
                      className={`min-h-36 border p-5 ${
                        availability
                          ? "border-[#c6cbc2] bg-[#fbfaf7]"
                          : "border-dashed border-[#c6cbc2] bg-[#f6f3ed]"
                      } ${availability && !available ? "opacity-75" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-[#c6cbc2] pb-3">
                        <p className="font-mono text-sm text-[#3f433c]">
                          {day}
                        </p>
                        {available ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium">
                            <CheckCircle2 className="size-4" aria-hidden />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-[#3f433c]">
                            <Ban className="size-4" aria-hidden />
                            Unavailable
                          </span>
                        )}
                      </div>

                      <div className="mt-7 flex items-center justify-between gap-3">
                        <p className="font-mono text-xl font-semibold tracking-[0.04em]">
                          {available
                            ? `${availability?.startTime ?? ""} - ${
                                availability?.endTime ?? ""
                              }`
                            : "No hours"}
                        </p>

                        {availability && (
                          <button
                            type="button"
                            onClick={() => handleDelete(availability.id)}
                            aria-label={`Delete ${employee.name}'s ${day} availability`}
                            className="flex size-9 shrink-0 items-center justify-center text-[#3f433c] transition hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
                          >
                            <Trash2 className="size-5" aria-hidden />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
