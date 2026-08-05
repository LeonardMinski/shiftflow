import { z } from "zod";

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

const employees = [
  { id: "1", name: "Bob", email: "bob@email.co.uk" },
  { id: "2", name: "Sarah", email: "sarah@email.co.uk" },
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

type UpdateEmployeeArgs = {
  id: string;
  input: {
    name?: string;
    email?: string;
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

    updateEmployee: (_parent: unknown, args: UpdateEmployeeArgs) => {
      const result = updateEmployeeSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Provide valid update data");
      }

      const data = result.data;

      const employeeIndex = employees.findIndex(
        (employee) => employee.id === args.id,
      );

      if (employeeIndex === -1) {
        throw new Error("Employee not found");
      }

      if (data.email !== undefined) {
        const emailExists = employees.some(
          (employee) =>
            employee.id !== args.id && employee.email === data.email,
        );

        if (emailExists) {
          throw new Error("This email already belongs to another employee");
        }
      }

      const existingEmployee = employees[employeeIndex];

      const updatedEmployee = {
        ...existingEmployee,
        name: data.name ?? existingEmployee.name,
        email: data.email ?? existingEmployee.email,
      };

      employees[employeeIndex] = updatedEmployee;

      return updatedEmployee;
    },

    deleteEmployee: (_parent: unknown, args: EmployeeArgs) => {
      const employeeIndex = employees.findIndex(
        (employee) => employee.id === args.id,
      );

      if (employeeIndex === -1) {
        throw new Error("Employee not found");
      }

      const [deletedEmployee] = employees.splice(employeeIndex, 1);

      return deletedEmployee;
    },
  },
};
