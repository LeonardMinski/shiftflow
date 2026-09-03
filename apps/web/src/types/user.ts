import type { EmployeeAvailability } from "@/types/employee";

export type Role = "MANAGER" | "EMPLOYEE";

export type MyShift = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  employeeId: string | null;
};

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  employeeId: string | null;
  employee: {
    id: string;
    name: string;
  } | null;
};

export type MeData = {
  me: CurrentUser | null;
};

export type MyScheduleData = {
  me: {
    id: string;
    role: Role;
    employee: {
      id: string;
      name: string;
      shifts: MyShift[];
    } | null;
  } | null;
};

export type MyAvailabilityData = {
  me: {
    id: string;
    role: Role;
    employee: {
      id: string;
      name: string;
      availability: EmployeeAvailability[];
    } | null;
  } | null;
};
