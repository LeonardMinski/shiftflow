import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { resolvers, typeDefs } from "./schema.js";

export async function startServer(): Promise<void> {
  console.log("creating Apollo server");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  console.log("Apollo server created");

  const port = Number(process.env.PORT ?? 4000);

  console.log(`attempting port ${port}`);

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`GraphQL API running at ${url}`);
}
