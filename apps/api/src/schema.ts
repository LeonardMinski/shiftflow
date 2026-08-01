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
`;

const employees = [
  { id: "1", 
    name: "Bob", 
    email: "bob@email.co.uk",
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@email.co.uk",
  },
];

type EmployeeArgs = {
  id: string;
};


export const resolvers = {
  Query: {
    employees: () => employees,

    employee: (_parent: unknown, args: EmployeeArgs) =>
      employees.find((employee) => employee.id === args.id),
  }
};
