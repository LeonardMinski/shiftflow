import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import Availability from "./page";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";

const employeesMock = {
  request: { query: GET_EMPLOYEES },
  result: {
    data: {
      employees: [
        {
          id: "employee-1",
          name: "Ada Lovelace",
          email: "ada@example.com",
          availability: [
            {
              id: "avail-1",
              employeeId: "employee-1",
              dayOfWeek: "Monday",
              available: true,
              startTime: "09:00",
              endTime: "17:00",
            },
          ],
        },
        {
          id: "employee-2",
          name: "Grace Hopper",
          email: "grace@example.com",
          availability: [
            {
              id: "avail-2",
              employeeId: "employee-2",
              dayOfWeek: "Friday",
              available: true,
              startTime: "13:00",
              endTime: "21:00",
            },
          ],
        },
      ],
    },
  },
};

describe("Manager Availability page", () => {
  it("shows one selected employee's week at a time, defaulting to the first employee", async () => {
    render(
      <MockedProvider mocks={[employeesMock]}>
        <Availability />
      </MockedProvider>,
    );

    expect(await screen.findByText("Viewing availability for")).toBeVisible();

    const selector = screen.getByLabelText("Viewing availability for");
    expect(selector).toHaveValue("employee-1");
    expect(screen.getByText("09:00 - 17:00")).toBeVisible();
    expect(screen.queryByText("13:00 - 21:00")).not.toBeInTheDocument();
  });

  it("switches the displayed week when a different employee is selected, without touching any authenticated-account concept", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[employeesMock]}>
        <Availability />
      </MockedProvider>,
    );

    const selector = await screen.findByLabelText("Viewing availability for");

    await user.selectOptions(selector, "employee-2");

    expect(screen.getByText("13:00 - 21:00")).toBeVisible();
    expect(screen.queryByText("09:00 - 17:00")).not.toBeInTheDocument();
    expect(
      screen.getByText(/Define whether Grace Hopper is available/i),
    ).toBeVisible();
  });
});
