/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,dayOfWeek]` on the table `EmployeeAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAvailability_employeeId_dayOfWeek_key" ON "EmployeeAvailability"("employeeId", "dayOfWeek");
