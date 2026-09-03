import type { Employee, Shift } from "@/types";
import { getAvailabilityForShift } from "@/lib/availability/isShiftWithAvailability";
import { findConflictingShift } from "@/lib/shifts/hasShiftConflict";

export type AvailabilityStatus =
  | { kind: "incomplete" }
  | { kind: "unknown" }
  | { kind: "available"; startTime: string; endTime: string }
  | { kind: "unavailable" }
  | { kind: "outside-availability"; startTime: string; endTime: string }
  | { kind: "conflict"; startTime: string; endTime: string };

/**
 * Live, informational read of an in-progress shift draft against the selected
 * employee's availability and existing shifts - the same rules `validateShift`
 * enforces at submit time, surfaced early so a manager sees the reason before
 * they hit an error.
 */
export function getAvailabilityStatus(
  employees: Employee[],
  shifts: Shift[],
  employeeId: string,
  startTime: string,
  endTime: string,
  editingShiftId?: string,
): AvailabilityStatus {
  const employee = employees.find((candidate) => candidate.id === employeeId);

  if (!employee || !startTime || !endTime || new Date(endTime) <= new Date(startTime)) {
    return { kind: "incomplete" };
  }

  const matchingAvailability = getAvailabilityForShift(employee, startTime);

  if (!matchingAvailability) {
    return { kind: "unknown" };
  }

  if (!matchingAvailability.available) {
    return { kind: "unavailable" };
  }

  if (
    matchingAvailability.startTime === null ||
    matchingAvailability.endTime === null
  ) {
    return { kind: "unavailable" };
  }

  const shiftStartTime = startTime.slice(11);
  const shiftEndTime = endTime.slice(11);

  const withinAvailability =
    shiftStartTime >= matchingAvailability.startTime &&
    shiftEndTime <= matchingAvailability.endTime;

  if (!withinAvailability) {
    return {
      kind: "outside-availability",
      startTime: matchingAvailability.startTime,
      endTime: matchingAvailability.endTime,
    };
  }

  const conflictingShift = findConflictingShift(
    shifts,
    employeeId,
    startTime,
    endTime,
    editingShiftId,
  );

  if (conflictingShift) {
    return {
      kind: "conflict",
      startTime: conflictingShift.startTime,
      endTime: conflictingShift.endTime,
    };
  }

  return {
    kind: "available",
    startTime: matchingAvailability.startTime,
    endTime: matchingAvailability.endTime,
  };
}
