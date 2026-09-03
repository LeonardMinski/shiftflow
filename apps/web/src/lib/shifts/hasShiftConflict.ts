import { Shift } from "@/types";

export function findConflictingShift(
  shifts: Shift[],
  employeeId: string,
  newStartTime: string,
  newEndTime: string,
  shiftId?: string,
): Shift | undefined {
  return shifts.find((shift) => {
    const sameEmployee = shift.employee?.id === employeeId;
    const isSameShift = shiftId === shift.id;
    const existingEnd = new Date(shift.endTime);
    const existingStart = new Date(shift.startTime);
    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);
    const shiftOverlap = newStart < existingEnd && newEnd > existingStart;

    return sameEmployee && !isSameShift && shiftOverlap;
  });
}

export function hasShiftConflict(
  shifts: Shift[],
  employeeId: string,
  newStartTime: string,
  newEndTime: string,
  shiftId?: string,
): boolean {
  return (
    findConflictingShift(shifts, employeeId, newStartTime, newEndTime, shiftId) !==
    undefined
  );
}
