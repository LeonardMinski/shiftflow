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

const createShiftSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(100),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    employeeId: z.string().trim().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const updateShiftSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    employeeId: z.string().trim().optional(),
  })
  .refine(
    (input) =>
      input.title !== undefined ||
      input.endTime !== undefined ||
      input.startTime !== undefined ||
      input.employeeId !== undefined,
    {
      message: "Provide at least one field to update",
    },
  );

const inputEmployeeAvailabilitySchema = z
  .object({
    employeeId: z.string().trim().min(1),
    dayOfWeek: z.string().trim().min(1).max(9),
    available: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (input) => {
      if (input.available === false) {
        return input.startTime === undefined && input.endTime === undefined;
      } else {
        return (
          Boolean(input.endTime && input.startTime) &&
          input.startTime! < input.endTime!
        );
      }
    },
    {
      message: "Invalid availability times",
      path: ["endTime"],
    },
  );

export const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    email: String!
    availability: [EmployeeAvailability!]!
  }

  type Shift {
  id: ID!
  title: String!
  startTime: String!
  endTime: String!
  employee: Employee
}

type EmployeeAvailability {
  id: ID!
  employeeId: ID!
  dayOfWeek: String!
  available:  Boolean!
  startTime: String
  endTime: String
}

type Query {
  employees: [Employee!]!
  employee(id: ID!): Employee
  shifts: [Shift!]!
  shift(id: ID!): Shift
}

  input CreateEmployeeInput {
    name: String!
    email: String!
  }

  input UpdateEmployeeInput {
    name: String
    email: String
  }

  input CreateShiftInput {
    title: String!
    startTime: String!
    endTime: String!
    employeeId: ID
  }

  input UpdateShiftInput {
    title: String
    startTime: String
    endTime: String
    employeeId: ID
  }

  input EmployeeAvailabilityInput {
    employeeId: ID!
    available: Boolean!
    dayOfWeek: String!
    startTime: String
    endTime: String
  }
  
  type Mutation {
   createEmployee(input: CreateEmployeeInput!):Employee!
   updateEmployee(id: ID!, input: UpdateEmployeeInput!):Employee!
   deleteEmployee(id: ID! ):Employee!

   createShift(input: CreateShiftInput!): Shift!
   updateShift(id: ID!, input: UpdateShiftInput!): Shift!
   deleteShift(id: ID!): Shift!

   setEmployeeAvailability(input: EmployeeAvailabilityInput!): EmployeeAvailability!
   deleteEmployeeAvailability(id: ID!): EmployeeAvailability!
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

type ShiftArgs = {
  id: string;
};

type CreateShiftArgs = {
  input: {
    title: string;
    startTime: string;
    endTime: string;
    employeeId?: string;
  };
};

type UpdateShiftArgs = {
  id: string;
  input: {
    title?: string;
    startTime?: string;
    endTime?: string;
    employeeId?: string;
  };
};

type EmployeeAvailabilityArgs = {
  input: {
    employeeId: string;
    dayOfWeek: string;
    available: boolean;
    startTime?: string;
    endTime?: string;
  };
};

type DeleteEmployeeAvailabilityArgs = {
  id: string
}

export const resolvers = {
  Query: {
    employees: async () =>
      prisma.employee.findMany({
        include: {
          availability: true,
        },
      }),

    employee: async (_parent: unknown, args: EmployeeArgs) =>
      prisma.employee.findUnique({
        where: {
          id: args.id,
        },

        include: {
          availability: true,
        },
      }),

    shifts: async () =>
      prisma.shift.findMany({
        include: {
          employee: true,
        },
      }),

    shift: async (_parent: unknown, args: ShiftArgs) =>
      prisma.shift.findUnique({
        where: {
          id: args.id,
        },
        include: {
          employee: true,
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

    createShift: async (_parent: unknown, args: CreateShiftArgs) => {
      const result = createShiftSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Invalid shift data");
      }

      const data = result.data;

      if (data.employeeId !== undefined) {
        const existingEmployee = await prisma.employee.findUnique({
          where: {
            id: data.employeeId,
          },
        });
        if (!existingEmployee) {
          throw new Error("Employee not found");
        }
      }

      return prisma.shift.create({
        data: {
          title: data.title,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          employeeId: data.employeeId,
        },
        include: {
          employee: true,
        },
      });
    },

    updateShift: async (_parent: unknown, args: UpdateShiftArgs) => {
      const result = updateShiftSchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Provide valid update data");
      }

      const data = result.data;

      const existingShift = await prisma.shift.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!existingShift) {
        throw new Error("Shift not found");
      }

      if (data.employeeId !== undefined) {
        const existingEmployee = await prisma.employee.findUnique({
          where: {
            id: data.employeeId,
          },
        });

        if (!existingEmployee) {
          throw new Error("Employee not found");
        }
      }

      const finalStartTime =
        data.startTime !== undefined
          ? new Date(data.startTime)
          : existingShift.startTime;

      const finalEndTime =
        data.endTime !== undefined
          ? new Date(data.endTime)
          : existingShift.endTime;

      if (finalEndTime <= finalStartTime) {
        throw new Error("End time must be after start time");
      }

      return prisma.shift.update({
        where: {
          id: args.id,
        },
        data: {
          title: data.title,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
          employeeId: data.employeeId,
        },
        include: {
          employee: true,
        },
      });
    },

    deleteShift: async (_parent: unknown, args: ShiftArgs) => {
      const existingShift = await prisma.shift.findUnique({
        where: {
          id: args.id,
        },
      });

      if (!existingShift) {
        throw new Error("Shift not found");
      }

      return prisma.shift.delete({
        where: {
          id: args.id,
        },
      });
    },

    setEmployeeAvailability: async (
      _parent: unknown,
      args: EmployeeAvailabilityArgs,
    ) => {
      const result = inputEmployeeAvailabilitySchema.safeParse(args.input);

      if (!result.success) {
        throw new Error("Invalid availability data");
      }

      const data = result.data;

      const existingEmployee = await prisma.employee.findUnique({
        where: {
          id: data.employeeId,
        },
      });
      if (!existingEmployee) {
        throw new Error("Employee not found");
      }

      const availability = await prisma.employeeAvailability.upsert({
        where: {
          employeeId_dayOfWeek: {
            dayOfWeek: data.dayOfWeek,
            employeeId: data.employeeId,
          },
        },
        update: {
          available: data.available,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        create: {
          employeeId: data.employeeId,
          startTime: data.startTime,
          endTime: data.endTime,
          dayOfWeek: data.dayOfWeek,
          available: data.available,
        },
      });

      return availability;
    },

    deleteEmployeeAvailability: async (_parent: unknown, args: DeleteEmployeeAvailabilityArgs ) => {
       const existingEmployeeAvailability = await prisma.employeeAvailability.findUnique({
         where: {
           id: args.id,
         },
       });

       if (!existingEmployeeAvailability) {
         throw new Error("Employee availability not found");
       }

       return prisma.employeeAvailability.delete({
         where: {
           id: args.id,
         },
       });
    }
  },
};
