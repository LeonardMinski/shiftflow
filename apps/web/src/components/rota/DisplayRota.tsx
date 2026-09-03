"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import RotaTable from "@/components/rota/RotaTable";
import WeekNavigation from "@/components/rota/WeeklyNavigation";
import ShiftSheet from "@/components/rota/ShiftSheet";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { GET_WEEK_PUBLICATION } from "@/graphql/rota/queries";
import { PUBLISH_WEEK } from "@/graphql/rota/mutations";
import { getStartOfTheWeek, getWeekDays, toWeekStartKey } from "@/lib/rota/rota";
import { useShiftForm } from "@/lib/shifts/useShiftForm";
import type { Employee, Shift } from "@/types";

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

  const weekStartIso = useMemo(() => toWeekStartKey(weekStart), [weekStart]);

  const { data: publicationData, loading: publicationLoading } = useQuery(
    GET_WEEK_PUBLICATION,
    { variables: { weekStart: weekStartIso } },
  );

  const [publishWeek, { loading: publishing }] = useMutation(PUBLISH_WEEK, {
    refetchQueries: [{ query: GET_WEEK_PUBLICATION, variables: { weekStart: weekStartIso } }],
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSession, setSheetSession] = useState(0);
  const [sheetInitialDate, setSheetInitialDate] = useState<string | undefined>(
    undefined,
  );

  const employees = employeesData?.employees ?? [];
  const shifts = shiftsData?.shifts ?? [];
  const weekDays = getWeekDays(weekStart);

  const shiftForm = useShiftForm({
    employees,
    shifts,
    onSaved: () => setSheetOpen(false),
  });

  const openSheet = () => {
    setSheetSession((current) => current + 1);
    setSheetOpen(true);
  };

  const handleAddShift = () => {
    shiftForm.loadDraft();
    setSheetInitialDate(undefined);
    openSheet();
  };

  const handleAddShiftFor = (employee: Employee, day: Date) => {
    shiftForm.loadDraft({ employeeId: employee.id });
    setSheetInitialDate(day.toISOString().slice(0, 10));
    openSheet();
  };

  const handleEditShift = (shift: Shift) => {
    shiftForm.loadShift(shift);
    setSheetInitialDate(undefined);
    openSheet();
  };

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

  const handlePublish = async () => {
    await publishWeek({ variables: { weekStart: weekStartIso } });
  };

  if (employeesLoading || shiftsLoading) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <p className="text-base text-muted-foreground">Loading rota...</p>
      </div>
    );
  }

  if (employeesError || shiftsError) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <p className="mt-4 max-w-xl text-base text-destructive">
          We couldn&apos;t load the rota.
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">Rota</h1>
        <div className="mt-10 max-w-xl border border-border bg-card p-8 text-center">
          <p className="text-lg font-semibold">
            No employees have been added yet.
          </p>
          <Link
            href="/employees"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Add Employee
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = Boolean(publicationData?.weekPublication?.publishedAt);

  return (
    <div className="min-w-0">
      <WeekNavigation
        weekStart={weekStart}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        isPublished={isPublished}
        publicationLoading={publicationLoading}
        publishing={publishing}
        onPublish={handlePublish}
        onAddShift={handleAddShift}
      />

      <RotaTable
        employees={employees}
        shifts={shifts}
        weekDays={weekDays}
        onAddShift={handleAddShiftFor}
        onEditShift={handleEditShift}
      />

      <ShiftSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        sessionKey={String(sheetSession)}
        employees={employees}
        shifts={shifts}
        shiftForm={shiftForm}
        initialDate={sheetInitialDate}
      />
    </div>
  );
}
