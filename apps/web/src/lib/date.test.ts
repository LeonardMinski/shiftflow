import { describe, expect, it } from "vitest";
import {
  combineShiftDateAndTime,
  formatTime,
  splitDateTimeLocal,
  toDateTimeLocal,
} from "./date";

describe("date helpers", () => {
  it("formats an ISO datetime string for datetime-local inputs", () => {
    expect(toDateTimeLocal("2026-08-26T09:30:00.000Z")).toBe(
      "2026-08-26T10:30",
    );
  });

  it("formats an ISO datetime string as a two-digit UK time", () => {
    expect(formatTime("2026-08-26T13:05:00.000Z")).toBe("14:05");
  });

  it("splits a datetime-local value into date and time parts", () => {
    expect(splitDateTimeLocal("2026-08-26T09:00")).toEqual({
      date: "2026-08-26",
      time: "09:00",
    });
  });

  it("splits an empty value into empty parts", () => {
    expect(splitDateTimeLocal("")).toEqual({ date: "", time: "" });
  });

  describe("combineShiftDateAndTime", () => {
    it("combines a same-day start and end time", () => {
      expect(combineShiftDateAndTime("2026-08-26", "09:00", "17:00")).toEqual(
        {
          startTime: "2026-08-26T09:00",
          endTime: "2026-08-26T17:00",
        },
      );
    });

    it("rolls the end date forward when the shift crosses midnight", () => {
      expect(combineShiftDateAndTime("2026-08-28", "23:00", "07:00")).toEqual(
        {
          startTime: "2026-08-28T23:00",
          endTime: "2026-08-29T07:00",
        },
      );
    });

    it("rolls the end date forward across a month boundary", () => {
      expect(combineShiftDateAndTime("2026-08-31", "22:00", "06:00")).toEqual(
        {
          startTime: "2026-08-31T22:00",
          endTime: "2026-09-01T06:00",
        },
      );
    });

    it("leaves the end time blank until a date and end time are chosen", () => {
      expect(combineShiftDateAndTime("2026-08-26", "09:00", "")).toEqual({
        startTime: "2026-08-26T09:00",
        endTime: "",
      });
    });
  });
});
