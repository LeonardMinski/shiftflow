import "dotenv/config";

import { startServer } from "./server.js";

startServer().catch((error: unknown) => {
  console.error("Failed to start GraphQL API", error);
  process.exit(1);
});
