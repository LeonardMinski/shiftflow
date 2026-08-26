import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { verifyToken } from "@clerk/backend";
import { GraphQLError } from "graphql";

import { resolvers, typeDefs } from "./schema.js";

export type GraphQLContext = {
  clerkUserId: string | null;
};

export async function startServer(): Promise<void> {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  const port = Number(process.env.PORT ?? 4000);

  const { url } = await startStandaloneServer(server, {
    listen: { port },

    context: async ({ req }): Promise<GraphQLContext> => {
      const authorization = req.headers.authorization;

      if (!authorization?.startsWith("Bearer ")) {
        return {
          clerkUserId: null,
        };
      }

      const token = authorization.replace("Bearer ", "");

      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
          authorizedParties: [
            process.env.WEB_APP_URL ?? "http://localhost:3000",
          ],
        });

        console.log("Authenticated Clerk user:", verifiedToken.sub);

        return {
          clerkUserId: verifiedToken.sub,
        };
      } catch {
        throw new GraphQLError("Unauthenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
    },
  });

  console.log(`GraphQL API running at ${url}`);
}
