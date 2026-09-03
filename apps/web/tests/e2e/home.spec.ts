import { expect, test } from "@playwright/test";

test("redirects a signed-out visitor from the root route to sign in", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/sign-in/);
});
