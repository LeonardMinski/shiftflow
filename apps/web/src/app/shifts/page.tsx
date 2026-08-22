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
import AvailabilityForm from "@/components/availability/availabilityForm";
import AvailabilityList from "@/components/availability/availabilityList";

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
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Shift / Directory</SectionLabel>
          <p className="mt-6 text-lg text-black/50">Loading shifts…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-black/60">
            We couldn&apos;t load the shift directory.
          </p>

          <p className="mt-2 font-mono text-sm text-red-700">{error.message}</p>
        </div>
      </main>
    );
  }

  if (employeesDataLoading) {
    return (
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Employee / Directory</SectionLabel>
          <p className="mt-6 text-lg text-black/50">Loading employees…</p>
        </div>
      </main>
    );
  }

  if (employeesDataError) {
    return (
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-black/60">
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
    <>
      <main className="min-h-screen bg-[#F4F0E8] text-[#171717]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
          <div className="mb-8">
            <ShiftFilter
              selectedEmployeeFilter={selectedEmployeeFilter}
              employees={employeesData.employees}
              searchTerm={searchTerm}
              onFilterChange={setSelectedEmployeeFilter}
              onSearchChange={setSearchTerm}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
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
          <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
            <AvailabilityList employees={employeesData.employees} />
          </div>

          <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
            <AvailabilityForm employees={employeesData.employees} />
          </div>
        </div>
      </main>
    </>
  );
}
