import {
  SetEmployeeAvailabilityData,
  SetEmployeeAvailabilityVariables,
} from "@/types/availability";

import {
  SET_EMPLOYEE_AVAILABILITY,
} from "@/graphql/availability/mutations";
import { useMutation } from "@apollo/client/react";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { useState } from "react";
import { Employee } from "@/types/employee";
import { Save } from "lucide-react";

type AvailabilityFormProps = {
  employee: Employee;
};

export default function AvailabilityForm({ employee }: AvailabilityFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [available, setAvailable] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [setEmployeeAvailability, { loading: creating }] = useMutation<
    SetEmployeeAvailabilityData,
    SetEmployeeAvailabilityVariables
  >(SET_EMPLOYEE_AVAILABILITY, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dayOfWeek === "") return;

    if (available && (startTime === "" || endTime === "")) {
      return;
    }

    await setEmployeeAvailability({
      variables: {
        input: {
          available,
          employeeId: employee.id,
          dayOfWeek,
          ...(available && {
            startTime,
            endTime,
          }),
        },
      },
    });

    setAvailable(false);
    setDayOfWeek("");
    setEndTime("");
    setStartTime("");
  };

  return (
    <section className="rounded-lg border border-border bg-muted p-6 md:p-7 xl:sticky xl:top-28 xl:self-start">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Availability / Editor
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">
          Set availability
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Define whether {employee.name} is available for a particular day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="dayOfWeek"
            className="mb-2 block text-sm font-semibold text-muted-foreground"
          >
            Day of week
          </label>

          <select
            name="dayOfWeek"
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
          >
            <option value="">Select day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div className="flex items-center justify-between border-y border-border py-4">
          <div>
            <label htmlFor="available" className="block text-sm font-semibold">
              Employee available
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              Enable this to add working hours.
            </p>
          </div>

          <input
            type="checkbox"
            name="available"
            id="available"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="size-5 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {available && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block text-sm font-semibold text-muted-foreground"
              >
                Start time
              </label>

              <input
                id="startTime"
                type="time"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="mb-2 block text-sm font-semibold text-muted-foreground"
              >
                End time
              </label>

              <input
                id="endTime"
                type="time"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save className="size-4" aria-hidden />
          {creating ? "Saving..." : "Save Schedule"}
        </button>
      </form>
    </section>
  );
}
