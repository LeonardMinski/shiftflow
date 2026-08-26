import { expect, test } from "@playwright/test";

test("loads the ShiftFlow home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "ShiftFlow" }),
  ).toBeVisible();
});
