console.log("index loaded");

import { startServer } from "./server.js";

console.log("calling startServer");

startServer().catch((error: unknown) => {
  console.error("Failed to start GraphQL API", error);
  process.exit(1);
});

console.log("index.ts is executing");