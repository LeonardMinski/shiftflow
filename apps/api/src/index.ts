import { startServer } from "./server.js";

console.log("Starting GraphQL API");

startServer()
  .then(() => {
    console.log("startServer resolved");
  })
  .catch((error: unknown) => {
    console.error("Failed to start GraphQL API", error);
    process.exit(1);
  });
