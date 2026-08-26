"use client";

import RotaTable from "@/components/rota/RotaTable";
import WeekNavigation from "@/components/rota/WeeklyNavigation";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { getStartOfTheWeek, getWeekDays } from "@/lib/rota/rota";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";

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
    return <p>Loading rota...</p>;
  }

  if (employeesError || shiftsError) {
    return <p>We couldn&apos;t load the rota.</p>;
  }

  if (employees.length === 0) {
    return <p>No employees have been added yet.</p>;
  }

  return (
    <>
      <WeekNavigation
        weekStart={weekStart}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      <RotaTable 
      employees={employees} 
      shifts={shifts} 
      weekDays={weekDays} 
      />
    </>
  );
}
