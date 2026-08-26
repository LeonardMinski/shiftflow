import { gql, TypedDocumentNode } from "@apollo/client";
import { GetEmployeesData } from "@/types/employee";

export const GET_EMPLOYEES: TypedDocumentNode<
  GetEmployeesData,
  Record<string, never>
> = gql`
  query GetEmployees {
    employees {
      id
      name
      email
      availability {
        id
        employeeId
        dayOfWeek
        available
        startTime
        endTime
      }
    }
  }
`;
