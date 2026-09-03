"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import { ME } from "@/graphql/user/queries";
import type { CurrentUser } from "@/types/user";

export type CurrentUserState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "not-provisioned" }
  | { status: "error"; message: string }
  | { status: "authenticated"; user: CurrentUser };

const getErrorCode = (error: unknown): string | undefined => {
  if (!CombinedGraphQLErrors.is(error)) {
    return undefined;
  }

  return error.errors[0]?.extensions?.code as string | undefined;
};

export function useCurrentUser(options?: { skip?: boolean }): CurrentUserState {
  const { isLoaded, isSignedIn } = useAuth();

  // Clerk's client-side session hydrates asynchronously after mount. Firing
  // the `me` query before it's ready means `getToken()` resolves to null for
  // that one request, and Apollo won't retry it - so wait for Clerk itself
  // to confirm loaded/signed-in state before querying.
  const shouldSkip = Boolean(options?.skip) || !isLoaded || !isSignedIn;

  const { data, loading, error } = useQuery(ME, {
    errorPolicy: "all",
    skip: shouldSkip,
  });

  if (options?.skip) {
    return { status: "signed-out" };
  }

  if (!isLoaded) {
    return { status: "loading" };
  }

  if (!isSignedIn) {
    return { status: "signed-out" };
  }

  if (loading) {
    return { status: "loading" };
  }

  const code = getErrorCode(error);

  if (code === "UNAUTHENTICATED") {
    return { status: "signed-out" };
  }

  if (code === "ACCOUNT_NOT_PROVISIONED") {
    return { status: "not-provisioned" };
  }

  if (error) {
    return { status: "error", message: error.message };
  }

  if (!data?.me) {
    return {
      status: "error",
      message: "Unable to resolve the signed-in user.",
    };
  }

  return { status: "authenticated", user: data.me };
}
