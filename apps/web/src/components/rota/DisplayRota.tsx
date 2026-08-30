"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import RotaTable from "@/components/rota/RotaTable";
import WeekNavigation from "@/components/rota/WeeklyNavigation";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { getStartOfTheWeek, getWeekDays } from "@/lib/rota/rota";

export default function DisplayRota() {
  const [weekStart, setWeekStart] = useState(() =>
    getStartOfTheWeek(new Date()),
  );

  const {
    data: employeesData,
    loading: employeesLoading,
    error: employeesError,
  } = useQuery(GET_EMPLOYEES);

  const {
    data: shiftsData,
    loading: shiftsLoading,
    error: shiftsError,
  } = useQuery(GET_SHIFTS);

  const employees = employeesData?.employees ?? [];
  const shifts = shiftsData?.shifts ?? [];
  const weekDays = getWeekDays(weekStart);

  const handleNextWeek = () => {
    const weekStartCopy = new Date(weekStart);

    weekStartCopy.setDate(weekStartCopy.getDate() + 7);

    setWeekStart(weekStartCopy);
  };

  const handlePreviousWeek = () => {
    const weekStartCopy = new Date(weekStart);

    weekStartCopy.setDate(weekStartCopy.getDate() - 7);

    setWeekStart(weekStartCopy);
  };

  if (employeesLoading || shiftsLoading) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <p className="text-base text-[#3f433c]">Loading rota...</p>
      </div>
    );
  }

  if (employeesError || shiftsError) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <p className="mt-4 max-w-xl text-base text-red-700">
          We couldn&apos;t load the rota.
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <div className="mt-10 max-w-xl border border-[#c6cbc2] bg-white p-8 text-center">
          <p className="text-lg font-semibold">
            No employees have been added yet.
          </p>
          <Link
            href="/employees"
            className="mt-6 inline-flex h-11 items-center justify-center bg-[#052311] px-5 text-sm font-bold text-white transition hover:bg-[#173f27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514] focus-visible:ring-offset-2"
          >
            Add Employee
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <WeekNavigation
        weekStart={weekStart}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <RotaTable employees={employees} shifts={shifts} weekDays={weekDays} />
    </div>
  );
}
