import { gql } from "@apollo/client";

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      email
      availability {
        id
        startTime
        endTime
        available
        employeeId
        dayOfWeek
      }
    }
  }
`;
