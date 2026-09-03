import { createClerkClient } from "@clerk/backend";
import { GraphQLError } from "graphql";
import { prisma } from "@shiftflow/database";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export type ShiftFlowUser = {
  id: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
  employeeId: string | null;
};

export type GraphQLContext = {
  clerkUserId: string | null;
  user: ShiftFlowUser | null;
};

const toShiftFlowUser = (user: {
  id: string;
  email: string;
  role: "MANAGER" | "EMPLOYEE";
  employeeId: string | null;
}): ShiftFlowUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  employeeId: user.employeeId,
});

const getVerifiedPrimaryEmail = async (
  clerkUserId: string,
): Promise<string | null> => {
  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const primaryEmail = clerkUser.emailAddresses.find(
    (emailAddress) =>
      emailAddress.id === clerkUser.primaryEmailAddressId &&
      emailAddress.verification?.status === "verified",
  );

  return primaryEmail ? primaryEmail.emailAddress.toLowerCase() : null;
};

/**
 * Resolves a verified Clerk session to a ShiftFlow User, provisioning one
 * on first sign-in only when a verified email matches an existing Employee.
 * Never grants MANAGER automatically - managers are provisioned manually.
 */
export const resolveShiftFlowUser = async (
  clerkUserId: string,
): Promise<ShiftFlowUser | null> => {
  const existingUser = await prisma.user.findUnique({
    where: { authProviderId: clerkUserId },
  });

  if (existingUser) {
    return toShiftFlowUser(existingUser);
  }

  const verifiedEmail = await getVerifiedPrimaryEmail(clerkUserId);

  if (!verifiedEmail) {
    return null;
  }

  const matchingEmployee = await prisma.employee.findUnique({
    where: { email: verifiedEmail },
  });

  if (!matchingEmployee) {
    return null;
  }

  try {
    const provisionedUser = await prisma.user.create({
      data: {
        authProviderId: clerkUserId,
        email: verifiedEmail,
        role: "EMPLOYEE",
        employeeId: matchingEmployee.id,
      },
    });

    return toShiftFlowUser(provisionedUser);
  } catch {
    // Another concurrent request may have provisioned this user first.
    const raceUser = await prisma.user.findUnique({
      where: { authProviderId: clerkUserId },
    });

    return raceUser ? toShiftFlowUser(raceUser) : null;
  }
};

export const requireUser = (context: GraphQLContext): ShiftFlowUser => {
  if (!context.user) {
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return context.user;
};

export const requireManager = (context: GraphQLContext): ShiftFlowUser => {
  const user = requireUser(context);

  if (user.role !== "MANAGER") {
    throw new GraphQLError("Managers only", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return user;
};

/** Allows a manager to act on any employee, or an employee to act only on their own record. */
export const requireManagerOrOwnEmployee = (
  context: GraphQLContext,
  employeeId: string,
): ShiftFlowUser => {
  const user = requireUser(context);

  if (user.role === "MANAGER") {
    return user;
  }

  if (user.employeeId !== employeeId) {
    throw new GraphQLError("Forbidden", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  return user;
};
