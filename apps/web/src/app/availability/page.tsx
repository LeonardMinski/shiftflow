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
    return <p>Loading employees...</p>;
  }

  if (employeesDataError) {
    return <p>Failed to load employees.</p>;
  }

  if (!employeesData) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      <div className="md:px-10 md:py-14">
        <AvailabilityList employees={employeesData.employees} />
      </div>

      <div className="md:px-10 md:py-14">
        <AvailabilityForm employees={employeesData.employees} />
      </div>
    </div>
  );
}
