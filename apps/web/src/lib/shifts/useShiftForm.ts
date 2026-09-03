"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { GET_SHIFTS } from "@/graphql/shifts/queries";
import {
  CREATE_SHIFT,
  UPDATE_SHIFT,
} from "@/graphql/shifts/mutations";
import { toDateTimeLocal } from "@/lib/date";
import { validateShift } from "@/lib/shifts/validateShift";
import type {
  CreateShiftData,
  CreateShiftVariables,
  Employee,
  Errors,
  Shift,
  UpdateShiftData,
  UpdateShiftVariables,
} from "@/types";

const emptyErrors: Errors = {
  title: "",
  startTime: "",
  endTime: "",
};

export type ShiftDraft = {
  employeeId?: string;
};

export type UseShiftFormOptions = {
  employees: Employee[];
  shifts: Shift[];
  onSaved?: (shift: Shift) => void;
};

/**
 * Single source of truth for creating/editing a shift: form state, live
 * validation, and the create/update mutations. Shared by the standalone
 * /shifts page and the Rota Add/Edit Shift sheet so there is one
 * implementation of shift business logic, not two.
 */
export function useShiftForm({ employees, shifts, onSaved }: UseShiftFormOptions) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [errors, setErrors] = useState<Errors>(emptyErrors);

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

  const reset = () => {
    setTitle("");
    setStartTime("");
    setEndTime("");
    setEmployeeId("");
    setEditShift(null);
    setErrors(emptyErrors);
  };

  const loadShift = (shift: Shift) => {
    setEditShift(shift);
    setTitle(shift.title);
    setStartTime(toDateTimeLocal(shift.startTime));
    setEndTime(toDateTimeLocal(shift.endTime));
    setEmployeeId(shift.employee?.id ?? "");
    setErrors(emptyErrors);
  };

  const loadDraft = (draft: ShiftDraft = {}) => {
    setEditShift(null);
    setTitle("");
    setStartTime("");
    setEndTime("");
    setEmployeeId(draft.employeeId ?? "");
    setErrors(emptyErrors);
  };

  const onTitleChange = (value: string) => {
    setTitle(value);

    if (errors.title) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        title: "",
      }));
    }
  };

  const onStartTimeChange = (value: string) => {
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

  const onEndTimeChange = (value: string) => {
    setEndTime(value);

    if (errors.endTime) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        endTime: "",
      }));
    }
  };

  const onEmployeeChange = (value: string) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validateShift(
      employees,
      shifts,
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

    const input = {
      title: title.trim(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      employeeId: employeeId || undefined,
    };

    let savedShift: Shift | undefined;

    if (editShift) {
      const result = await updateShift({
        variables: { id: editShift.id, input },
      });

      savedShift = result.data?.updateShift;
    } else {
      const result = await createShift({ variables: { input } });

      savedShift = result.data?.createShift;
    }

    reset();

    if (savedShift) {
      onSaved?.(savedShift);
    }
  };

  return {
    title,
    startTime,
    endTime,
    employeeId,
    editShift,
    errors,
    creating,
    updating,
    onTitleChange,
    onStartTimeChange,
    onEndTimeChange,
    onEmployeeChange,
    handleSubmit,
    loadShift,
    loadDraft,
    reset,
  };
}
