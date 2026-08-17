import { Employee } from "@/types/employee";

export type Shift = {
  employeeId: string;
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  employee: Employee | null;
};

export type GetShiftsData = {
  shifts: Shift[];
};

export type CreateShiftData = {
  createShift: Shift;
};

export type CreateShiftVariables = {
  input: {
    title: string;
    startTime: string;
    endTime: string;
    employeeId?: string;
  };
};

export type UpdateShiftData = {
  updateShift: Shift;
};

export type UpdateShiftVariables = {
  id: string;
  input: {
    title?: string;
    startTime?: string;
    endTime?: string;
    employeeId?: string;
  };
};

export type DeleteShiftData = {
  deleteShift: {
    id: string;
  };
};

export type DeleteShiftVariables = {
  id: string;
};