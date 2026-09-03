"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@apollo/client/react";

import AvailabilityForm from "@/components/availability/availabilityForm";
import AvailabilityList from "@/components/availability/availabilityList";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { GetEmployeesData } from "@/types";
import { getInitials } from "@/lib/utils";

export default function Availability() {
  const {
    data: employeesData,
    loading: employeesDataLoading,
    error: employeesDataError,
  } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  if (employeesDataLoading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          Availability
        </h1>
        <p className="text-base text-muted-foreground">Loading employees...</p>
      </main>
    );
  }

  if (employeesDataError) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          Availability
        </h1>
        <p className="mt-4 text-base text-destructive">
          Failed to load employees.
        </p>
      </main>
    );
  }

  if (!employeesData) {
    return null;
  }

  const employees = employeesData.employees;
  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ??
    employees[0];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <div className="max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold tracking-[-0.04em]">
            Availability
          </h1>

          {employees.length > 0 && (
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground"
                aria-hidden
              >
                {getInitials(selectedEmployee.name)}
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Viewing availability for
              </span>

              <div className="relative">
                <select
                  aria-label="Viewing availability for"
                  value={selectedEmployee.id}
                  onChange={(event) =>
                    setSelectedEmployeeId(event.target.value)
                  }
                  className="appearance-none rounded-lg bg-transparent py-1 pr-6 text-sm font-semibold text-foreground outline-none"
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
          )}
        </header>

        {employees.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <p className="text-lg font-semibold">No employees available.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add employees before recording weekly availability.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <AvailabilityList employee={selectedEmployee} />
            <AvailabilityForm employee={selectedEmployee} />
          </div>
        )}
      </div>
    </main>
  );
}
