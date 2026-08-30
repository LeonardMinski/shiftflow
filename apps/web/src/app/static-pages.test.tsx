import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AccountPage from "@/app/account/page";
import HelpPage from "@/app/help/page";

describe("static placeholder pages", () => {
  it("renders the Help Center placeholder content", () => {
    render(<HelpPage />);

    expect(
      screen.getByRole("heading", { name: "Help Center" }),
    ).toBeVisible();
    expect(screen.getByText(/Placeholder help content/)).toBeVisible();
  });

  it("renders the Account placeholder content", () => {
    render(<AccountPage />);

    expect(screen.getByRole("heading", { name: "Account" })).toBeVisible();
    expect(screen.getByText(/Placeholder account page/)).toBeVisible();
  });
});
