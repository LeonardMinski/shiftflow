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

import { SectionLabel } from "@/components/ui/SectionLabel";
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
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>People / Directory</SectionLabel>
          <p className="mt-6 text-lg text-black/50">Loading team…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F4F0E8] px-6 py-12 text-black">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Something went wrong</SectionLabel>

          <p className="mt-6 max-w-xl text-lg text-black/60">
            We couldn&apos;t load the employee directory.
          </p>

          <p className="mt-2 font-mono text-sm text-red-700">{error.message}</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#171717]">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <header
          className="
            mb-14 grid gap-10
            border-b border-black/10 pb-10
            md:grid-cols-[1.35fr_0.65fr]
            md:items-end
          "
        >
          <div>
            <SectionLabel>People / Directory</SectionLabel>

            <h1
              className="
                mt-4 max-w-3xl text-5xl font-semibold
                leading-[0.95] tracking-tighter
                sm:text-6xl md:text-7xl
              "
            >
              Your team,
              <br />
              without the noise.
            </h1>
          </div>

          <div className="max-w-md md:justify-self-end">
            <p className="text-base leading-7 text-black/55">
              A lightweight employee directory focused on clarity, accessibility
              and maintainable frontend architecture.
            </p>

            <div className="mt-6 flex gap-6 font-mono text-xs uppercase tracking-[0.12em] text-black/35">
              <span>React</span>
              <span>TypeScript</span>
              <span>GraphQL</span>
            </div>
          </div>
        </header>

        <div className="grid gap-14 lg:grid-cols-[1.45fr_0.75fr]">
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
