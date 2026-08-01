import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { resolvers, typeDefs } from "./schema.js";

export async function startServer(): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = Number(process.env.PORT ?? 4000);

  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`GraphQL API running at ${url}`);
}
