import { gql } from "@apollo/client";

export const GET_SHIFTS = gql`
  query GetShifts {
    shifts {
      id
      title
      endTime
      startTime
      employee {
        id
        name
        email
      }
    }
  }
`;
