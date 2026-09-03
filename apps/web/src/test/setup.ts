import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest's `globals` option isn't enabled in this project (tests import
// `describe`/`it`/`expect` explicitly), so Testing Library's automatic
// afterEach(cleanup) - which detects a *global* `afterEach` - never
// registers on its own. Without this, DOM from one test can still be
// present when the next test in the same file runs.
afterEach(() => {
  cleanup();
});
