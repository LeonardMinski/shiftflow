import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import MyScheduleView from "./MyScheduleView";
import { GET_MY_SCHEDULE } from "@/graphql/user/queries";
import { GET_WEEK_PUBLICATION } from "@/graphql/rota/queries";
import { getStartOfTheWeek, toWeekStartKey } from "@/lib/rota/rota";

const weekStart = getStartOfTheWeek(new Date());
const weekStartIso = toWeekStartKey(weekStart);

const shiftDay = new Date(weekStart);
shiftDay.setDate(shiftDay.getDate() + 2);
shiftDay.setHours(9, 0, 0, 0);
const shiftEnd = new Date(shiftDay);
shiftEnd.setHours(13, 0, 0, 0);

const scheduleMock = {
  request: { query: GET_MY_SCHEDULE },
  result: {
    data: {
      me: {
        id: "user-1",
        role: "EMPLOYEE" as const,
        employee: {
          id: "employee-1",
          name: "Ada Lovelace",
          shifts: [
            {
              id: "shift-1",
              title: "Morning Shift",
              startTime: shiftDay.toISOString(),
              endTime: shiftEnd.toISOString(),
              employeeId: "employee-1",
            },
          ],
        },
      },
    },
  },
};

const publishedMock = {
  request: {
    query: GET_WEEK_PUBLICATION,
    variables: { weekStart: weekStartIso },
  },
  result: {
    data: {
      weekPublication: {
        id: "pub-1",
        weekStart: weekStartIso,
        publishedAt: new Date().toISOString(),
      },
    },
  },
};

describe("MyScheduleView", () => {
  it("renders the authenticated employee's own shift and no manager controls", async () => {
    render(
      <MockedProvider mocks={[scheduleMock, publishedMock]}>
        <MyScheduleView />
      </MockedProvider>,
    );

    expect(await screen.findByText("Morning Shift")).toBeVisible();
    expect(screen.getByText("Published")).toBeVisible();

    expect(
      screen.queryByRole("button", { name: /Publish Rota/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Add Shift/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Employees")).not.toBeInTheDocument();
  });

  it("shows 'No shift' for days without a shift", async () => {
    render(
      <MockedProvider mocks={[scheduleMock, publishedMock]}>
        <MyScheduleView />
      </MockedProvider>,
    );

    await screen.findByText("Morning Shift");
    expect(screen.getAllByText("No shift").length).toBe(6);
  });

  it("shows a fallback message when the account has no linked employee record", async () => {
    const noEmployeeMock = {
      request: { query: GET_MY_SCHEDULE },
      result: {
        data: {
          me: { id: "user-2", role: "MANAGER" as const, employee: null },
        },
      },
    };

    render(
      <MockedProvider mocks={[noEmployeeMock]}>
        <MyScheduleView />
      </MockedProvider>,
    );

    expect(
      await screen.findByText(/isn't linked to an employee record/i),
    ).toBeVisible();
  });
});
