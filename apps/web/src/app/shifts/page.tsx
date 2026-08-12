"use client";

import { GET_SHIFTS } from "@/graphql/shifts/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateShiftData,
  CreateShiftVariables,
  DeleteShiftData,
  DeleteShiftVariables,
  GetShiftsData,
  Shift,
  UpdateShiftData,
  UpdateShiftVariables,
} from "@/types/shifts";
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

export default function DisplayShifts() {
  const { 
    loading, 
    error, 
    data 
  } = useQuery<GetShiftsData>(GET_SHIFTS);

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

  const [deleteShift] = useMutation<
    DeleteShiftData,
    DeleteShiftVariables
  >(DELETE_SHIFT, {
    refetchQueries: [{ query: GET_SHIFTS }],
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !startTime || !endTime) {
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
  };

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

  return (
    <>
      <ShiftList
        shifts={data.shifts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        updating={updating}
        deletingShiftId={deletingShiftId}
      />
      <ShiftForm
        title={title}
        startTime={startTime}
        endTime={endTime}
        employeeId={employeeId}
        employees={employeesData.employees}
        creating={creating}
        updating={updating}
        editShift={editShift}
        onTitleChange={setTitle}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onEmployeeChange={setEmployeeId}
        onSubmit={handleSubmit}
      />
    </>
  );
}
