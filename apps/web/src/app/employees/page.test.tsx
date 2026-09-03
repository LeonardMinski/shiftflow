import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";

import DisplayEmployees from "./page";
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
            {
              id: "avail-2",
              employeeId: "employee-1",
              dayOfWeek: "Tuesday",
              available: false,
              startTime: null,
              endTime: null,
            },
          ],
        },
        {
          id: "employee-2",
          name: "Grace Hopper",
          email: "grace@example.com",
          availability: [],
        },
      ],
    },
  },
};

describe("Employees page", () => {
  it("renders employees with an availability summary derived from real records", async () => {
    render(
      <MockedProvider mocks={[employeesMock]}>
        <DisplayEmployees />
      </MockedProvider>,
    );

    expect(await screen.findByText("Ada Lovelace")).toBeVisible();
    expect(screen.getByText("ada@example.com")).toBeVisible();
    expect(screen.getByText("Grace Hopper")).toBeVisible();

    // Ada has one *available* record (the unavailable Tuesday record
    // shouldn't inflate the count) - Grace has none.
    expect(screen.getByText("Available 1 day")).toBeVisible();
    expect(screen.getByText("Available 0 days")).toBeVisible();
  });

  it("preserves Add/Edit/Delete CRUD affordances", async () => {
    render(
      <MockedProvider mocks={[employeesMock]}>
        <DisplayEmployees />
      </MockedProvider>,
    );

    await screen.findByText("Ada Lovelace");

    expect(screen.getByRole("link", { name: "Add employee" })).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2);
    expect(screen.getByLabelText("Name")).toBeVisible();
    expect(screen.getByLabelText("Email")).toBeVisible();
  });
});
