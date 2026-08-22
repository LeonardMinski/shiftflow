export type Employee = {
  id: string;
  name: string;
  email: string ;
  availability: EmployeeAvailability[]
};

export type EmployeeAvailability = {
  id: string;
  employeeId: string;
  dayOfWeek: string;
  available: boolean;
  startTime: string | null;
  endTime: string | null;
};

export type GetEmployeesData = {
  employees: Employee[];
};

export type CreateEmployeeData = {
  createEmployee: Employee;
};

export type CreateEmployeeVariables = {
  input: {
    name: string;
    email: string;
  };
};

export type UpdateEmployeeData = {
  updateEmployee: Employee;
};

export type UpdateEmployeeVariables = {
  id: string;
  input: {
    name: string;
    email: string;
  };
};

export type DeleteEmployeeData = {
  deleteEmployee: {
    id: string;
  };
};

export type DeleteEmployeeVariables = {
  id: string;
};
