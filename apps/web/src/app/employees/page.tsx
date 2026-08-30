"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  Employee,
  CreateEmployeeData,
  CreateEmployeeVariables,
  DeleteEmployeeData,
  DeleteEmployeeVariables,
  GetEmployeesData,
  UpdateEmployeeData,
  UpdateEmployeeVariables,
} from "@/types";

import {
  CREATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "@/graphql/employees/mutations";

import { GET_EMPLOYEES } from "@/graphql/employees/queries";

import { EmployeeList } from "@/components/employees/EmployeeList";
import { EmployeeForm } from "@/components/employees/EmployeeForm";

export default function DisplayEmployees() {
  const { loading, error, data } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  const [createEmployee, { loading: creating }] = useMutation<
    CreateEmployeeData,
    CreateEmployeeVariables
  >(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const [updateEmployee, { loading: updating }] = useMutation<
    UpdateEmployeeData,
    UpdateEmployeeVariables
  >(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const [deleteEmployee, { loading: deleting }] = useMutation<
    DeleteEmployeeData,
    DeleteEmployeeVariables
  >(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    if (editingEmployee) {
      await updateEmployee({
        variables: {
          id: editingEmployee.id,
          input: {
            name: name.trim(),
            email: email.trim(),
          },
        },
      });

      setEditingEmployee(null);
    } else {
      await createEmployee({
        variables: {
          input: {
            name: name.trim(),
            email: email.trim(),
          },
        },
      });
    }

    setName("");
    setEmail("");
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
  };

  const handleDelete = async (id: string) => {
    await deleteEmployee({
      variables: {
        id,
      },
    });

    if (editingEmployee?.id === id) {
      setEditingEmployee(null);
      setName("");
      setEmail("");
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setName("");
    setEmail("");
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Employees</h1>
          <p className="text-base text-[#3f433c]">Loading team...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] px-5 py-8 text-[#051f12] sm:px-8 lg:px-10">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-[-0.03em]">Employees</h1>
          <p className="mt-4 max-w-xl text-base text-red-700">
            We couldn&apos;t load the employee directory.
          </p>

          <p className="mt-2 font-mono text-sm text-red-700">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#fbfaf7] text-[#051f12]">
      <div className="max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-5 border-b border-[#c6cbc2] pb-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
              Employees
            </h1>
            <p className="mt-2 text-base text-[#3f433c]">
              Manage staff directory and access controls.
            </p>
          </div>

          <a
            href="#employee-form"
            className="inline-flex h-11 items-center justify-center bg-[#052311] px-5 text-sm font-bold text-white transition hover:bg-[#173f27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#092514] focus-visible:ring-offset-2 xl:self-center"
          >
            Add Employee
          </a>
        </header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <EmployeeList
            employees={data.employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deleting={deleting}
          />

          <EmployeeForm
            name={name}
            email={email}
            editingEmployee={editingEmployee}
            creating={creating}
            updating={updating}
            onNameChange={setName}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </main>
  );
}
