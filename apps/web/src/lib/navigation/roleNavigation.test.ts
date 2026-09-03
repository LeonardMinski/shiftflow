import { describe, expect, it } from "vitest";
import { getHomeHref, getNavigation } from "./roleNavigation";

describe("role-aware navigation", () => {
  it("gives managers Rota, Employees, and Availability", () => {
    const hrefs = getNavigation("MANAGER").map((item) => item.href);

    expect(hrefs).toEqual(["/rota", "/employees", "/availability"]);
  });

  it("gives employees only My Schedule and My Availability", () => {
    const hrefs = getNavigation("EMPLOYEE").map((item) => item.href);

    expect(hrefs).toEqual(["/my-schedule", "/my-availability"]);
  });

  it("never renders an employee-only route in the manager navigation", () => {
    const hrefs = getNavigation("MANAGER").map((item) => item.href);

    expect(hrefs).not.toContain("/my-schedule");
    expect(hrefs).not.toContain("/my-availability");
  });

  it("never renders a manager-only route in the employee navigation", () => {
    const hrefs = getNavigation("EMPLOYEE").map((item) => item.href);

    expect(hrefs).not.toContain("/rota");
    expect(hrefs).not.toContain("/employees");
    expect(hrefs).not.toContain("/availability");
  });

  it("sends a manager home to the Rota", () => {
    expect(getHomeHref("MANAGER")).toBe("/rota");
  });

  it("sends an employee home to My Schedule", () => {
    expect(getHomeHref("EMPLOYEE")).toBe("/my-schedule");
  });
});
