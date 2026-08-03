import { z } from "zod";

const createEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
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

  type Mutation {
   createEmployee(input: CreateEmployeeInput!):Employee!
  }
`;

const employees = [
  { id: "1", name: "Bob", email: "bob@email.co.uk" },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@email.co.uk",
  },
];

type EmployeeArgs = {
  id: string;
};

type CreateEmployeeArgs = {
  input: {
    name: string;
    email: string;
  };
};

export const resolvers = {
  Query: {
    employees: () => employees,

    employee: (_parent: unknown, args: EmployeeArgs) =>
      employees.find((employee) => employee.id === args.id),
  },

  Mutation: {
    createEmployee: (_parent: unknown, args: CreateEmployeeArgs) => {
      const result = createEmployeeSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Invalid name or email");
      }

      const data = result.data;

      const emailExists = employees.some(
        (employee) => employee.email === data.email,
      );

      if (emailExists) {
        throw new Error("This email already exists");
      }

      const newEmployee = {
        id: String(employees.length + 1),
        name: data.name,
        email: data.email,
      };

      employees.push(newEmployee);

      return newEmployee;
    },
  },
};
