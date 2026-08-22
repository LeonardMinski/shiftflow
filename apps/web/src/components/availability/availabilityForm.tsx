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

type AvailabilityFormProps = {
  employees: Employee[];
};

export default function AvailabilityForm({ employees }: AvailabilityFormProps) {
  const [employeeId, setEmployeeId] = useState("");
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

    if (employeeId === "" || dayOfWeek === "") return;

    if (available && (startTime === "" || endTime === "")) {
      return;
    }

    await setEmployeeAvailability({
      variables: {
        input: {
          available,
          employeeId,
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
    setEmployeeId("");
    setEndTime("");
    setStartTime("");
  };

  return (
    <section className="border border-black bg-[#F4F0E8] p-6 md:p-8">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">
          Availability / Editor
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Set availability
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-black/60">
          Choose an employee and define whether they are available for a
          particular day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="availabilityEmployee"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em]"
          >
            Employee
          </label>

          <select
            name="employee"
            id="availabilityEmployee"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-white"
          >
            <option value="">Select employee</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="dayOfWeek"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em]"
          >
            Day of week
          </label>

          <select
            name="dayOfWeek"
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-white"
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

        <div className="flex items-center justify-between border-y border-black/20 py-4">
          <div>
            <label htmlFor="available" className="block text-sm font-semibold">
              Employee available
            </label>

            <p className="mt-1 text-xs text-black/50">
              Enable this to add working hours.
            </p>
          </div>

          <input
            type="checkbox"
            name="available"
            id="available"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-5 w-5 accent-black"
          />
        </div>

        {available && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startTime"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em]"
              >
                Start time
              </label>

              <input
                id="startTime"
                type="time"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em]"
              >
                End time
              </label>

              <input
                id="endTime"
                type="time"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-black bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-white"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className="w-full bg-black px-5 py-3 text-sm font-semibold text-[#F4F0E8] transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {creating ? "Saving..." : "Save availability"}
        </button>
      </form>
    </section>
  );
}
