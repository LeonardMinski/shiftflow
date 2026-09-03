"use client";

import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  DeleteShiftData,
  DeleteShiftVariables,
  GetShiftsData,
  Shift,
} from "@/types";
import { GetEmployeesData } from "@/types/employee";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useState } from "react";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { DELETE_SHIFT } from "@/graphql/shifts/mutations";
import ShiftForm from "@/components/shift/shiftForm";
import ShiftList from "@/components/shift/shiftList";
import ShiftFilter from "@/components/shift/shiftFilter";
import { filterShifts } from "@/lib/shifts/filterShifts";
import { useShiftForm } from "@/lib/shifts/useShiftForm";

export default function DisplayShifts() {
  const { loading, error, data } = useQuery<GetShiftsData>(GET_SHIFTS);

  const {
    data: employeesData,
    loading: employeesDataLoading,
    error: employeesDataError,
  } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  const [deletingShiftId, setDeletingShiftId] = useState<string | null>(null);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const shiftForm = useShiftForm({
    employees: employeesData?.employees ?? [],
    shifts: data?.shifts ?? [],
  });

  const [deleteShift] = useMutation<DeleteShiftData, DeleteShiftVariables>(
    DELETE_SHIFT,
    {
      refetchQueries: [{ query: GET_SHIFTS }],
    },
  );

  const handleEdit = (shift: Shift) => {
    shiftForm.loadShift(shift);
  };

  const handleDelete = async (id: string) => {
    setDeletingShiftId(id);
    try {
      await deleteShift({
        variables: {
          id,
        },
      });

      if (shiftForm.editShift?.id === id) {
        shiftForm.reset();
      }
    } finally {
      setDeletingShiftId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Shifts</h1>
          <SectionLabel>Shift / Directory</SectionLabel>
          <p className="mt-6 text-lg text-muted-foreground">Loading shifts...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-destructive">
            We couldn&apos;t load the shift directory.
          </p>

          <p className="mt-2 font-mono text-sm text-destructive">{error.message}</p>
        </div>
      </main>
    );
  }

  if (employeesDataLoading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Shifts</h1>
          <SectionLabel>Employee / Directory</SectionLabel>
          <p className="mt-6 text-lg text-muted-foreground">Loading employees...</p>
        </div>
      </main>
    );
  }

  if (employeesDataError) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-background px-5 py-8 text-foreground sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-destructive">
            We couldn&apos;t load the employee directory.
          </p>

          <p className="mt-2 font-mono text-sm text-destructive">
            {employeesDataError.message}
          </p>
        </div>
      </main>
    );
  }

  if (!data || !employeesData) {
    return null;
  }

  const filteredShifts = filterShifts(
    data.shifts,
    selectedEmployeeFilter,
    searchTerm,
  );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <div className="max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Shifts
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Create, assign, edit, and filter scheduled shifts.
            </p>
          </div>

          <div className="xl:min-w-130">
            <ShiftFilter
              selectedEmployeeFilter={selectedEmployeeFilter}
              employees={employeesData.employees}
              searchTerm={searchTerm}
              onFilterChange={setSelectedEmployeeFilter}
              onSearchChange={setSearchTerm}
            />
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <ShiftList
            shifts={filteredShifts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            updating={shiftForm.updating}
            deletingShiftId={deletingShiftId}
          />
          <ShiftForm
            title={shiftForm.title}
            errors={shiftForm.errors}
            startTime={shiftForm.startTime}
            endTime={shiftForm.endTime}
            employeeId={shiftForm.employeeId}
            employees={employeesData.employees}
            creating={shiftForm.creating}
            updating={shiftForm.updating}
            editShift={shiftForm.editShift}
            onTitleChange={shiftForm.onTitleChange}
            onStartTimeChange={shiftForm.onStartTimeChange}
            onEndTimeChange={shiftForm.onEndTimeChange}
            onEmployeeChange={shiftForm.onEmployeeChange}
            onSubmit={shiftForm.handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
