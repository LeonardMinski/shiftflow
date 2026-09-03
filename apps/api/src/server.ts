import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { verifyToken } from "@clerk/backend";

import { resolvers, typeDefs } from "./schema.js";
import { resolveShiftFlowUser, type GraphQLContext } from "./auth.js";

export type { GraphQLContext };

const getAuthorizedParties = (): string[] | undefined => {
  if (process.env.NODE_ENV !== "production") {
    return undefined;
  }

  const parties = process.env.WEB_APP_URL?.split(",")
    .map((party) => party.trim())
    .filter((party) => party.length > 0);

  return parties && parties.length > 0 ? parties : undefined;
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
          user: null,
        };
      }

      const token = authorization.replace("Bearer ", "");

      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
          authorizedParties: getAuthorizedParties(),
        });

        const user = await resolveShiftFlowUser(verifiedToken.sub);

        return {
          clerkUserId: verifiedToken.sub,
          user,
        };
      } catch (error) {
        console.warn("Ignoring invalid Clerk token", error);

        return {
          clerkUserId: null,
          user: null,
        };
      }
    },
  });

  console.log(`GraphQL API running at ${url}`);
}
