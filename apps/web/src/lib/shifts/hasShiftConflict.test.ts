import { describe, expect, it } from "vitest";
import type { Shift } from "@/types";
import { hasShiftConflict } from "./hasShiftConflict";

const makeShift = (overrides: Partial<Shift> = {}): Shift => ({
  id: "shift-1",
  title: "Morning shift",
  startTime: "2026-08-26T09:00:00.000Z",
  endTime: "2026-08-26T13:00:00.000Z",
  employeeId: "employee-1",
  employee: {
    id: "employee-1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    availability: [],
  },
  ...overrides,
});

describe("hasShiftConflict", () => {
  it("detects overlapping ISO datetime shifts for the same employee", () => {
    expect(
      hasShiftConflict(
        [makeShift()],
        "employee-1",
        "2026-08-26T12:00",
        "2026-08-26T16:00",
      ),
    ).toBe(true);
  });

  it("allows back-to-back shifts", () => {
    expect(
      hasShiftConflict(
        [makeShift()],
        "employee-1",
        "2026-08-26T14:00",
        "2026-08-26T16:00",
      ),
    ).toBe(false);
  });

  it("ignores the shift currently being edited", () => {
    expect(
      hasShiftConflict(
        [makeShift()],
        "employee-1",
        "2026-08-26T12:00",
        "2026-08-26T16:00",
        "shift-1",
      ),
    ).toBe(false);
  });
});
