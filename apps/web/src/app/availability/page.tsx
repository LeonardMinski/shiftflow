"use client";

import AvailabilityForm from "@/components/availability/availabilityForm";
import AvailabilityList from "@/components/availability/availabilityList";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { GetEmployeesData } from "@/types";
import { useQuery } from "@apollo/client/react";

export default function Availability() {
  const {
    data: employeesData,
    loading: employeesDataLoading,
    error: employeesDataError,
  } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  if (employeesDataLoading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          Availability
        </h1>
        <p className="text-base text-[#3f433c]">Loading employees...</p>
      </main>
    );
  }

  if (employeesDataError) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          Availability
        </h1>
        <p className="mt-4 text-base text-red-700">
          Failed to load employees.
        </p>
      </main>
    );
  }

  if (!employeesData) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] text-[#051f12]">
      <div className="max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Availability
            </h1>
            <p className="mt-2 text-base text-[#3f433c]">
              Review and manage employee availability schedules.
            </p>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <AvailabilityList employees={employeesData.employees} />

          <AvailabilityForm employees={employeesData.employees} />
        </div>
      </div>
    </main>
  );
}
