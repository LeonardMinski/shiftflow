import { describe, expect, it } from "vitest";
import type { Shift } from "@/types";
import {
  formatShiftTime,
  getShiftsForEmployeeOnDay,
  getStartOfTheWeek,
  getWeekDays,
  isSameDay,
  toWeekStartKey,
} from "./rota";

const makeShift = (overrides: Partial<Shift>): Shift => ({
  id: "shift-1",
  title: "Morning shift",
  startTime: "2026-08-24T09:00",
  endTime: "2026-08-24T17:00",
  employeeId: "employee-1",
  employee: {
    id: "employee-1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    availability: [],
  },
  ...overrides,
});

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

describe("rota helpers", () => {
  describe("isSameDay", () => {
    it("returns true for the same date and same time", () => {
      expect(
        isSameDay(
          new Date("2026-08-24T09:00"),
          new Date("2026-08-24T09:00"),
        ),
      ).toBe(true);
    });

    it("returns true for the same calendar date with different times", () => {
      expect(
        isSameDay(
          new Date("2026-08-24T09:00"),
          new Date("2026-08-24T22:30"),
        ),
      ).toBe(true);
    });

    it("returns false for a different day", () => {
      expect(
        isSameDay(
          new Date("2026-08-24T23:59"),
          new Date("2026-08-25T00:00"),
        ),
      ).toBe(false);
    });

    it("returns false for a different month", () => {
      expect(
        isSameDay(
          new Date("2026-08-31T09:00"),
          new Date("2026-09-01T09:00"),
        ),
      ).toBe(false);
    });

    it("returns false for a different year", () => {
      expect(
        isSameDay(
          new Date("2026-12-31T09:00"),
          new Date("2027-12-31T09:00"),
        ),
      ).toBe(false);
    });
  });

  describe("getShiftsForEmployeeOnDay", () => {
    it("returns a shift for a matching employee and matching date", () => {
      const selectedShift = makeShift({ id: "selected" });

      expect(
        getShiftsForEmployeeOnDay("employee-1", new Date("2026-08-24"), [
          selectedShift,
        ]),
      ).toEqual([selectedShift]);
    });

    it("excludes another employee's shift", () => {
      const selectedShift = makeShift({ id: "selected" });
      const otherEmployeeShift = makeShift({
        id: "other-employee",
        employeeId: "employee-2",
      });

      expect(
        getShiftsForEmployeeOnDay("employee-1", new Date("2026-08-24"), [
          selectedShift,
          otherEmployeeShift,
        ]),
      ).toEqual([selectedShift]);
    });

    it("excludes the same employee's shift on another date", () => {
      const selectedShift = makeShift({ id: "selected" });
      const otherDayShift = makeShift({
        id: "other-day",
        startTime: "2026-08-25T09:00",
      });

      expect(
        getShiftsForEmployeeOnDay("employee-1", new Date("2026-08-24"), [
          selectedShift,
          otherDayShift,
        ]),
      ).toEqual([selectedShift]);
    });

    it("returns multiple shifts for the same employee and day", () => {
      const morningShift = makeShift({
        id: "morning",
        startTime: "2026-08-24T09:00",
      });
      const afternoonShift = makeShift({
        id: "afternoon",
        startTime: "2026-08-24T13:00",
      });

      expect(
        getShiftsForEmployeeOnDay("employee-1", new Date("2026-08-24"), [
          morningShift,
          afternoonShift,
        ]),
      ).toEqual([morningShift, afternoonShift]);
    });

    it("returns an empty array when no shifts match", () => {
      expect(
        getShiftsForEmployeeOnDay("employee-1", new Date("2026-08-24"), [
          makeShift({
            id: "other-day",
            startTime: "2026-08-25T09:00",
          }),
        ]),
      ).toEqual([]);
    });
  });

  describe("getWeekDays", () => {
    it("returns exactly seven dates", () => {
      const date = new Date("2026-08-24T12:00");

      expect(getWeekDays(date)).toHaveLength(7);
    });

    it("uses the supplied date as the first date", () => {
      const date = new Date("2026-08-24T12:00");
      const days = getWeekDays(date);

      expect(days[0]).toEqual(date);
      expect(days[0]).not.toBe(date);
    });

    it("does not mutate the supplied date", () => {
      const date = new Date("2026-08-24T12:00");
      const originalTime = date.getTime();

      getWeekDays(date);

      expect(date.getTime()).toBe(originalTime);
    });

    it("returns consecutive dates", () => {
      const days = getWeekDays(new Date("2026-08-24T12:00"));

      expect(days.map(localDateKey)).toEqual([
        "2026-08-24",
        "2026-08-25",
        "2026-08-26",
        "2026-08-27",
        "2026-08-28",
        "2026-08-29",
        "2026-08-30",
      ]);
    });

    it("handles month boundaries", () => {
      const days = getWeekDays(new Date("2026-01-29T12:00"));

      expect(days.map(localDateKey)).toEqual([
        "2026-01-29",
        "2026-01-30",
        "2026-01-31",
        "2026-02-01",
        "2026-02-02",
        "2026-02-03",
        "2026-02-04",
      ]);
    });
  });

  describe("getStartOfTheWeek", () => {
    it("returns Monday for a Monday date", () => {
      expect(localDateKey(getStartOfTheWeek(new Date("2026-08-24T12:00"))))
        .toBe("2026-08-24");
    });

    it("does not mutate the supplied date", () => {
      const date = new Date("2026-08-26T12:00");
      const originalTime = date.getTime();

      getStartOfTheWeek(date);

      expect(date.getTime()).toBe(originalTime);
    });

    it("returns the previous Monday for a midweek date", () => {
      expect(localDateKey(getStartOfTheWeek(new Date("2026-08-26T12:00"))))
        .toBe("2026-08-24");
    });

    it("returns the previous Monday for a Sunday date", () => {
      expect(localDateKey(getStartOfTheWeek(new Date("2026-08-30T12:00"))))
        .toBe("2026-08-24");
    });

    it("handles month-boundary behavior", () => {
      expect(localDateKey(getStartOfTheWeek(new Date("2026-09-01T12:00"))))
        .toBe("2026-08-31");
    });

    it("handles year-boundary behavior", () => {
      expect(localDateKey(getStartOfTheWeek(new Date("2027-01-01T12:00"))))
        .toBe("2026-12-28");
    });
  });

  describe("toWeekStartKey", () => {
    it("reinterprets the local calendar date as UTC midnight, regardless of the runtime's timezone", () => {
      // A naive `weekStart.toISOString()` would convert local midnight to
      // UTC, shifting the calendar date by a day for any non-UTC-zero
      // timezone - silently breaking week-boundary comparisons (e.g.
      // publish state) for anyone not on UTC. This locks in the fix: the
      // key must always be the *local* Y/M/D, not the UTC-shifted instant.
      const localMonday = new Date(2026, 7, 24, 0, 0, 0, 0);

      expect(toWeekStartKey(localMonday)).toBe("2026-08-24T00:00:00.000Z");
    });

    it("pads single-digit months and days", () => {
      const localMonday = new Date(2026, 0, 5, 0, 0, 0, 0);

      expect(toWeekStartKey(localMonday)).toBe("2026-01-05T00:00:00.000Z");
    });

    it("is stable even when the time-of-day is not midnight", () => {
      const localMondayAfternoon = new Date(2026, 7, 24, 15, 30, 0, 0);

      expect(toWeekStartKey(localMondayAfternoon)).toBe(
        "2026-08-24T00:00:00.000Z",
      );
    });
  });

  describe("formatShiftTime", () => {
    it("formats a datetime-local value as a two-digit UK time", () => {
      expect(formatShiftTime("2026-08-24T09:05")).toBe("09:05");
    });

    it("formats afternoon times without relying on a timezone offset", () => {
      expect(formatShiftTime("2026-08-24T17:30")).toBe("17:30");
    });
  });
});
