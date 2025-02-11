import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Employee } from "../types";

const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await fetch("/api/employees");
  if (!response.ok) throw new Error("Failed to fetch employees");

  const result = await response.json();
  console.log("Fetched employees:", result);

  return result.employees;
};

const updateEmployeeRequest = async ({
  employeeId,
  updates,
}: {
  employeeId: string;
  updates: Partial<Employee>;
}) => {
  const response = await fetch(`/api/employees/${employeeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Failed to update employee");

  return response.json();
};

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const { data: employees = [], ...queryResult } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });
  const updateEmployee = useMutation({
    mutationFn: updateEmployeeRequest,
    onMutate: async ({ employeeId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });

      const previousEmployees = queryClient.getQueryData(["employees"]);

      queryClient.setQueryData(["employees"], (oldEmployees: Employee[]) => {
        return oldEmployees.map((emp) =>
          emp.id === employeeId ? { ...emp, ...updates } : emp
        );
      });

      return { previousEmployees };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["employees"], context?.previousEmployees);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    employees,
    updateEmployee: updateEmployee.mutateAsync,
    ...queryResult,
  };
};
