"use client";

import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateShiftData,
  CreateShiftVariables,
  DeleteShiftData,
  DeleteShiftVariables,
  GetShiftsData,
  Errors,
  Shift,
  UpdateShiftData,
  UpdateShiftVariables,
} from "@/types";
import { GetEmployeesData } from "@/types/employee";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useState } from "react";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import {
  CREATE_SHIFT,
  DELETE_SHIFT,
  UPDATE_SHIFT,
} from "@/graphql/shifts/mutations";
import { toDateTimeLocal } from "@/lib/date";
import ShiftForm from "@/components/shift/shiftForm";
import ShiftList from "@/components/shift/shiftList";
import ShiftFilter from "@/components/shift/shiftFilter";
import { filterShifts } from "@/lib/shifts/filterShifts";
import { validateShift } from "@/lib/shifts/validateShift";

export default function DisplayShifts() {
  const { loading, error, data } = useQuery<GetShiftsData>(GET_SHIFTS);

  const {
    data: employeesData,
    loading: employeesDataLoading,
    error: employeesDataError,
  } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [deletingShiftId, setDeletingShiftId] = useState<string | null>(null);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Errors>({
    title: "",
    startTime: "",
    endTime: "",
  });

  const [createShift, { loading: creating }] = useMutation<
    CreateShiftData,
    CreateShiftVariables
  >(CREATE_SHIFT, {
    refetchQueries: [{ query: GET_SHIFTS }],
  });

  const [updateShift, { loading: updating }] = useMutation<
    UpdateShiftData,
    UpdateShiftVariables
  >(UPDATE_SHIFT, {
    refetchQueries: [{ query: GET_SHIFTS }],
  });

  const [deleteShift] = useMutation<DeleteShiftData, DeleteShiftVariables>(
    DELETE_SHIFT,
    {
      refetchQueries: [{ query: GET_SHIFTS }],
    },
  );

  const handleEdit = (shift: Shift) => {
    setEditShift(shift);
    setTitle(shift.title);
    setStartTime(toDateTimeLocal(shift.startTime));
    setEndTime(toDateTimeLocal(shift.endTime));
    setEmployeeId(shift.employee?.id ?? "");
  };

  const handleDelete = async (id: string) => {
    setDeletingShiftId(id);
    try {
      await deleteShift({
        variables: {
          id,
        },
      });

      if (editShift?.id === id) {
        setEditShift(null);
        setTitle("");
        setStartTime("");
        setEndTime("");
        setEmployeeId("");
      }
    } finally {
      setDeletingShiftId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validateShift(
      employeesData?.employees ?? [],
      data?.shifts ?? [],
      title,
      startTime,
      endTime,
      employeeId,
      editShift?.id,
    );

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (message) => message !== "",
    );

    if (hasErrors) {
      return;
    }

    if (editShift) {
      await updateShift({
        variables: {
          id: editShift.id,
          input: {
            title: title.trim(),
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            employeeId: employeeId || undefined,
          },
        },
      });

      setEditShift(null);
    } else {
      await createShift({
        variables: {
          input: {
            title: title.trim(),
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            employeeId: employeeId || undefined,
          },
        },
      });
    }

    setTitle("");
    setStartTime("");
    setEndTime("");
    setEmployeeId("");

    setErrors({
      title: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (errors.title) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        title: "",
      }));
    }
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      startTime: "",
      endTime:
        currentErrors.endTime === "End time must be after start time." ||
        currentErrors.endTime ===
          "Shift is outside this employee's availability"
          ? ""
          : currentErrors.endTime,
    }));
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);

    if (errors.endTime) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endTime: "",
      }));
    }
  };

  const handleEmployeeChange = (value: string) => {
    setEmployeeId(value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      endTime:
        currentErrors.endTime ===
        "This employee already has an overlapping shift."
          ? ""
          : currentErrors.endTime,
    }));
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Shifts</h1>
          <SectionLabel>Shift / Directory</SectionLabel>
          <p className="mt-6 text-lg text-[#3f433c]">Loading shifts...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-red-700">
            We couldn&apos;t load the shift directory.
          </p>

          <p className="mt-2 font-mono text-sm text-red-700">{error.message}</p>
        </div>
      </main>
    );
  }

  if (employeesDataLoading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Shifts</h1>
          <SectionLabel>Employee / Directory</SectionLabel>
          <p className="mt-6 text-lg text-[#3f433c]">Loading employees...</p>
        </div>
      </main>
    );
  }

  if (employeesDataError) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-red-700">
            We couldn&apos;t load the employee directory.
          </p>

          <p className="mt-2 font-mono text-sm text-red-700">
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
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] text-[#051f12]">
      <div className="max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 border-b border-[#c6cbc2] pb-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Shifts
            </h1>
            <p className="mt-2 text-base text-[#3f433c]">
              Create, assign, edit, and filter scheduled shifts.
            </p>
          </div>

          <div className="xl:min-w-[520px]">
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
            updating={updating}
            deletingShiftId={deletingShiftId}
          />
          <ShiftForm
            title={title}
            errors={errors}
            startTime={startTime}
            endTime={endTime}
            employeeId={employeeId}
            employees={employeesData.employees}
            creating={creating}
            updating={updating}
            editShift={editShift}
            onTitleChange={handleTitleChange}
            onStartTimeChange={handleStartTimeChange}
            onEndTimeChange={handleEndTimeChange}
            onEmployeeChange={handleEmployeeChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}
