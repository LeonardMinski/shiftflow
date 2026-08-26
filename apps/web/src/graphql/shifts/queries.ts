import { gql, TypedDocumentNode } from "@apollo/client";
import { GetShiftsData } from "@/types/shifts";

export const GET_SHIFTS: TypedDocumentNode<
  GetShiftsData,
  Record<string, never>
> = gql`
  query GetShifts {
    shifts {
      id
      title
      startTime
      endTime
      employeeId
      employee {
        id
        name
      }
    }
  }
`;
