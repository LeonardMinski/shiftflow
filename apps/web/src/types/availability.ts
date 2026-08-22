import { EmployeeAvailability } from "@/types/employee"

export type SetEmployeeAvailabilityData = {
  setEmployeeAvailability: EmployeeAvailability
}

export type SetEmployeeAvailabilityVariables = {
  input: {
    dayOfWeek: string
    available: boolean
    startTime?: string
    endTime?:   string
    employeeId: string
  }
}

export type DeleteEmployeeAvailabilityData = {
  deleteEmployeeAvailability: {
    id: string
  }
};
  
export type DeleteEmployeeAvailabilityVariables = {
  id: string
}

