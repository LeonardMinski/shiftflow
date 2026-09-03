import { CheckCircle2, Trash2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";

import { DELETE_EMPLOYEE_AVAILABILITY } from "@/graphql/availability/mutations";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { Employee } from "@/types";
import {
  DeleteEmployeeAvailabilityData,
  DeleteEmployeeAvailabilityVariables,
} from "@/types/availability";

type AvailabilityListProps = {
  employee: Employee;
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

export default function AvailabilityList({ employee }: AvailabilityListProps) {
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
        {employee.name}&apos;s weekly availability
      </h2>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {daysOfWeek.map((day) => {
          const availability = employee.availability.find(
            (record) => record.dayOfWeek === day,
          );
          const available = availability?.available === true;

          return (
            <div
              key={day}
              className={`group flex items-center justify-between gap-4 border-l-4 border-b border-border px-5 py-4 last:border-b-0 ${
                available
                  ? "border-l-primary bg-accent/60"
                  : "border-l-transparent"
              }`}
            >
              <span className="text-sm font-medium text-foreground">
                {day}
              </span>

              <div className="flex items-center gap-3">
                {available ? (
                  <>
                    <span className="font-mono text-sm text-foreground">
                      {availability?.startTime} - {availability?.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                      Available
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unavailable
                  </span>
                )}

                {availability && (
                  <button
                    type="button"
                    onClick={() => handleDelete(availability.id)}
                    aria-label={`Delete ${employee.name}'s ${day} availability`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
