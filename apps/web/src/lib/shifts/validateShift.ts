import type { Errors, Shift } from "@/types";
import { hasShiftConflict } from "./hasShiftConflict";

export function validateShift(
  shifts: Shift[],
  title: string,
  startTime: string,
  endTime: string,
  employeeId: string,
  editingShiftId?: string,
): Errors {
  const errors: Errors = {
    title: "",
    startTime: "",
    endTime: "",
  };

  if (!title.trim()) {
    errors.title = "Title is required.";
  }

  if (!startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!endTime) {
    errors.endTime = "End time is required.";
  }

  if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
    errors.endTime = "End time must be after start time.";
  }

  if (
    employeeId &&
    startTime &&
    endTime &&
    new Date(endTime) > new Date(startTime) &&
    hasShiftConflict(shifts, employeeId, startTime, endTime, editingShiftId)
  ) {
    errors.endTime = "This employee already has an overlapping shift.";
  }

  return errors;
}
