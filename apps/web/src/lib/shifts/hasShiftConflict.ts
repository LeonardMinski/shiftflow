import { Shift } from "@/types";

export function hasShiftConflict(
  shifts: Shift[],
  employeeId: string,
  newStartTime: string,
  newEndTime: string,
  shiftId?: string,
): boolean {
  return shifts.some((shift) => {
    const sameEmployee = shift.employee?.id === employeeId;
    const isSameShift = shiftId === shift.id;
    const existingEnd = new Date(Number(shift.endTime));
    const existingStart = new Date(Number(shift.startTime));
    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);
    const shiftOverlap = newStart < existingEnd && newEnd > existingStart;

    return sameEmployee && !isSameShift && shiftOverlap;
  });
}
