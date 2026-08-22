import { gql } from "@apollo/client";

export const SET_EMPLOYEE_AVAILABILITY = gql`
  mutation SetEmployeeAvailability($input: EmployeeAvailabilityInput!) {
    setEmployeeAvailability(input: $input) {
      id
      employeeId
      dayOfWeek
      available
      startTime
      endTime
    }
  }
`;

export const DELETE_EMPLOYEE_AVAILABILITY = gql`
mutation DeleteEmployeeAvailability($id: ID!){
  deleteEmployeeAvailability(id: $id){
    id
  }
}
`;
