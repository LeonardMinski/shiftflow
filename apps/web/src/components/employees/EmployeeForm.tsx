"use client";

import type { Employee } from "@/types";
import { Field } from "@/components/ui/Field";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

type EmployeeFormProps = {
  name: string;
  email: string;
  editingEmployee: Employee | null;
  creating: boolean;
  updating: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
};

export function EmployeeForm({
  name,
  email,
  editingEmployee,
  creating,
  updating,
  onNameChange,
  onEmailChange,
  onSubmit,
  onCancelEdit,
}: EmployeeFormProps) {
  return (
    <aside id="employee-form" className="scroll-mt-28 xl:sticky xl:top-28 xl:self-start">
      <div className="border border-[#c6cbc2] bg-[#f6f3ed] p-6 md:p-7">
        <SectionLabel className="text-[#52642b]">
          {editingEmployee ? "Edit person" : "Add person"}
        </SectionLabel>

        <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
          {editingEmployee ? "Edit employee" : "New employee"}
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#3f433c]">
          {editingEmployee
            ? "Update this employee's details."
            : "Add a team member to the shared directory."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-7">
          <Field
            id="name"
            label="Name"
            value={name}
            placeholder="Bob Hope"
            onChange={onNameChange}
          />

          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            placeholder="name@company.com"
            onChange={onEmailChange}
          />

          <Button
            type="submit"
            disabled={creating || updating}
            className="
              mt-2 flex h-11 w-full items-center justify-between
              bg-[#171717] px-5 py-3.5
              text-sm font-medium text-white
              transition
              hover:bg-[#173f27]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#092514]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-[#f6f3ed]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span>
              {creating || updating
                ? editingEmployee
                  ? "Updating employee…"
                  : "Creating employee…"
                : editingEmployee
                  ? "Save changes"
                  : "Add employee"}
            </span>

            <span aria-hidden="true">→</span>
          </Button>

          {editingEmployee && (
            <Button
              type="button"
              onClick={onCancelEdit}
              className="w-full bg-transparent text-sm text-[#52642b] transition hover:text-[#092514]"
            >
              Cancel edit
            </Button>
          )}
        </form>
      </div>
    </aside>
  );
}
