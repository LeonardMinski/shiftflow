import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import MyAvailabilityView from "./MyAvailabilityView";
import { GET_MY_AVAILABILITY } from "@/graphql/user/queries";

const availabilityMock = {
  request: { query: GET_MY_AVAILABILITY },
  result: {
    data: {
      me: {
        id: "user-1",
        role: "EMPLOYEE" as const,
        employee: {
          id: "employee-1",
          name: "Ada Lovelace",
          availability: [
            {
              id: "avail-1",
              employeeId: "employee-1",
              dayOfWeek: "Thursday",
              available: true,
              startTime: "09:00",
              endTime: "14:00",
            },
          ],
        },
      },
    },
  },
};

describe("MyAvailabilityView", () => {
  it("reads the authenticated employee's own availability, not fabricated values", async () => {
    render(
      <MockedProvider mocks={[availabilityMock]}>
        <MyAvailabilityView />
      </MockedProvider>,
    );

    await screen.findByRole("button", { name: "Save Availability" });

    expect(screen.getByDisplayValue("09:00")).toBeVisible();
    expect(screen.getByDisplayValue("14:00")).toBeVisible();
    expect(screen.getAllByText("Unavailable")).toHaveLength(6);

    // no manager-only controls should be reachable from this screen
    expect(
      screen.queryByRole("button", { name: /Publish Rota/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a fallback message when the account has no linked employee record", async () => {
    const noEmployeeMock = {
      request: { query: GET_MY_AVAILABILITY },
      result: {
        data: {
          me: { id: "user-2", role: "MANAGER" as const, employee: null },
        },
      },
    };

    render(
      <MockedProvider mocks={[noEmployeeMock]}>
        <MyAvailabilityView />
      </MockedProvider>,
    );

    expect(
      await screen.findByText(/isn't linked to an employee record/i),
    ).toBeVisible();
  });

  it("blocks saving and shows a validation error when a day is marked available with no times", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[availabilityMock]}>
        <MyAvailabilityView />
      </MockedProvider>,
    );

    await screen.findByRole("button", { name: "Save Availability" });

    // Monday starts Unavailable with no record - flip it available without
    // filling in times, matching the "employee available" switches shown
    // for every day.
    const mondaySwitch = screen.getByRole("switch", {
      name: "Monday available",
    });
    await user.click(mondaySwitch);

    await user.click(
      screen.getByRole("button", { name: "Save Availability" }),
    );

    expect(
      await screen.findByText("Start and end time are required."),
    ).toBeVisible();

    // no network call should have been attempted - MockedProvider only has
    // the initial read mock, so a stray mutation call would surface as an
    // Apollo "no more mocked responses" error instead of this success text.
    expect(screen.queryByText(/saved successfully/i)).not.toBeInTheDocument();
  });
});
