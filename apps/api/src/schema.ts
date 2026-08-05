import { z } from "zod";
import { prisma } from "@shiftflow/database";

const createEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
});

const updateEmployeeSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
  })
  .refine((input) => input.name !== undefined || input.email !== undefined, {
    message: "Provide at least one field to update",
  });

export const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
  }

  input UpdateEmployeeInput {
    name: String
    email: String
  }
  
  type Mutation {
   createEmployee(input: CreateEmployeeInput!):Employee!
   updateEmployee(id: ID!, input: UpdateEmployeeInput!):Employee!
   deleteEmployee(id: ID! ):Employee!
  }
`;

type EmployeeArgs = {
  id: string;
};

type CreateEmployeeArgs = {
  input: {
    name: string;
    email: string;
  };
};

type UpdateEmployeeArgs = {
  id: string;
  input: {
    name?: string;
    email?: string;
  };
};

export const resolvers = {
  Query: {
    employees: async () => prisma.employee.findMany(),

    employee: async (_parent: unknown, args: EmployeeArgs) =>
      prisma.employee.findUnique({
        where: {
          id: args.id,
        },
      }),
  },

  Mutation: {
    createEmployee: async (_parent: unknown, args: CreateEmployeeArgs) => {
      const result = createEmployeeSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Invalid name or email");
      }

      const data = result.data;

      const existingEmployee = await prisma.employee.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingEmployee) {
        throw new Error("This email already exists");
      }

      return prisma.employee.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
    },

    updateEmployee: async (_parent: unknown, args: UpdateEmployeeArgs) => {
      const result = updateEmployeeSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Provide valid update data");
      }

      const data = result.data;

      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!existingEmployee) {
        throw new Error("Employee not found");
      }

      if (data.email !== undefined) {
        const employeeWithEmail = await prisma.employee.findUnique({
          where: {
            email: data.email,
          },
        });

        if (employeeWithEmail && employeeWithEmail.id !== args.id) {
          throw new Error("This email already belongs to another employee");
        }
      }

      return prisma.employee.update({
        where: {
          id: args.id,
        },
        data: {
          name: data.name,
          email: data.email,
        },
      });
    },

    deleteEmployee: async (_parent: unknown, args: EmployeeArgs) => {
      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!existingEmployee) {
        throw new Error("Employee not found");
      }

      return prisma.employee.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
