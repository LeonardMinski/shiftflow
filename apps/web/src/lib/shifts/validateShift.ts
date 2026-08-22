import type { Employee, Errors, Shift } from "@/types";
import { hasShiftConflict } from "./hasShiftConflict";
import { isShiftWithinAvailability } from "@/lib/availability/isShiftWithAvailability";

export function validateShift(
  employees: Employee[],
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

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId,
  );

  if (
    selectedEmployee &&
    startTime &&
    endTime &&
    new Date(endTime) > new Date(startTime) &&
    !isShiftWithinAvailability(selectedEmployee, startTime, endTime)
  ) {
    errors.endTime = "Shift is outside this employee's availability";
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
