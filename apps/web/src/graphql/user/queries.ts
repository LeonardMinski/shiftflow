import { gql, TypedDocumentNode } from "@apollo/client";

import {
  MeData,
  MyAvailabilityData,
  MyScheduleData,
} from "@/types/user";

export const ME: TypedDocumentNode<MeData, Record<string, never>> = gql`
  query Me {
    me {
      id
      email
      role
      employeeId
      employee {
        id
        name
      }
    }
  }
`;

export const GET_MY_SCHEDULE: TypedDocumentNode<
  MyScheduleData,
  Record<string, never>
> = gql`
  query GetMySchedule {
    me {
      id
      role
      employee {
        id
        name
        shifts {
          id
          title
          startTime
          endTime
          employeeId
        }
      }
    }
  }
`;

export const GET_MY_AVAILABILITY: TypedDocumentNode<
  MyAvailabilityData,
  Record<string, never>
> = gql`
  query GetMyAvailability {
    me {
      id
      role
      employee {
        id
        name
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
  }
`;
