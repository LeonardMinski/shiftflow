import { gql } from "@apollo/client";

export const CREATE_SHIFT = gql`
  mutation CreateShift($input: CreateShiftInput!) {
    createShift(input: $input) {
      id
      title
      startTime
      endTime
      employee {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_SHIFT = gql`
  mutation UpdateShift($id: ID!, $input: UpdateShiftInput!) {
    updateShift(id: $id, input: $input) {
      id
      employee {
        name
        email
        id
      }
      startTime
      endTime
      title
    }
  }
`;

export const DELETE_SHIFT = gql`
  mutation DeleteShift($id: ID!) {
    deleteShift(id: $id) {
      id
    }
  }
`;
