"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

import { createApolloClient } from "@/lib/apollo-client";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getToken } = useAuth();

  const apolloClient = useMemo(() => createApolloClient(getToken), [getToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
