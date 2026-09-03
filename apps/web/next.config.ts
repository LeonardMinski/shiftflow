import type { NextConfig } from "next";

const graphqlApiUrl = process.env.GRAPHQL_API_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: graphqlApiUrl,
      },
    ];
  },
};

export default nextConfig;
