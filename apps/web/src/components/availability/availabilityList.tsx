import { DELETE_EMPLOYEE_AVAILABILITY } from "@/graphql/availability/mutations";
import { GET_EMPLOYEES } from "@/graphql/employees/queries";
import { Employee } from "@/types";
import { DeleteEmployeeAvailabilityData, DeleteEmployeeAvailabilityVariables } from "@/types/availability";
import { useMutation } from "@apollo/client/react";

type AvailabilityListProps = {
  employees: Employee[];
};

export default function AvailabilityList({ employees }: AvailabilityListProps) {

 const [deleteEmployeeAvailability] = useMutation<
   DeleteEmployeeAvailabilityData,
   DeleteEmployeeAvailabilityVariables
 >(DELETE_EMPLOYEE_AVAILABILITY, {
   refetchQueries: [{ query: GET_EMPLOYEES }],
 });

 const handleDelete = async (id: string) => {
    await deleteEmployeeAvailability({
      variables: {
        id,
      },
    });
 };

  return (
    <section className="border border-black">
      <div className="border-b border-black px-6 py-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">
          Availability / Directory
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Employee availability
        </h2>
      </div>

      {employees.map((employee) => (
        <div
          key={employee.id}
          className="border-b border-black/20 px-6 py-6 last:border-b-0 md:px-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{employee.name}</h3>

            <span className="font-mono text-xs uppercase tracking-wider text-black/40">
              {employee.availability.length} days
            </span>
          </div>

          {employee.availability.length === 0 ? (
            <p className="text-sm text-black/40">No availability recorded.</p>
          ) : (
            <div className="grid gap-px border border-black bg-black sm:grid-cols-2">
              {employee.availability.map((availability) => (
                <div
                  key={availability.id}
                  className="flex items-center justify-between bg-[#F4F0E8] px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {availability.dayOfWeek}
                    </p>

                    <p className="mt-1 font-mono text-xs text-black/50">
                      {availability.available
                        ? `${availability.startTime} - ${availability.endTime}`
                        : "Unavailable"}
                    </p>
                  </div>

                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      availability.available
                        ? "bg-black"
                        : "border border-black/30"
                    }`}
                  />
                  <button 
                  type="button"
                  onClick={() => handleDelete(availability.id)} >Delete</button>
                </div>
              ))}


            </div>
          )}
        </div>
      ))}
    </section>
  );
}
