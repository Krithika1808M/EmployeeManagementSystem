import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useEmployees } from "../context/EmployeeContext";
import EmployeeList from "../components/EmployeesList";

jest.mock("../context/EmployeeContext");

const mockOnSelect = jest.fn();

const mockEmployees = [
  {
    id: "1",
    name: "Alice",
    team: "Engineering",
    designation: "Developer",
    managerId: "3",
  },
  {
    id: "2",
    name: "Charlie",
    team: "Engineering",
    designation: "Tester",
    managerId: "3",
  },
  {
    id: "3",
    name: "Bob",
    team: "Leadership",
    designation: "Manager",
    managerId: null,
  },
];

describe("EmployeeList Component", () => {
  beforeEach(() => {
    (useEmployees as jest.Mock).mockReturnValue({
      employees: mockEmployees,
      isLoading: false,
    });

    render(
      <EmployeeList
        onSelect={mockOnSelect}
        onHover={function (id: string | null): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  });

  test("displays all employees correctly", () => {
    expect(screen.getByTestId("employee-name-1")).toHaveTextContent("Alice");
    expect(screen.getByTestId("employee-name-2")).toHaveTextContent("Charlie");
    expect(screen.getByTestId("employee-name-3")).toHaveTextContent("Bob");
  });

  test("shows correct manager names", () => {
    expect(screen.getByTestId("manager-name-1")).toHaveTextContent(
      "Manager: Bob"
    );
    expect(screen.getByTestId("manager-name-2")).toHaveTextContent(
      "Manager: Bob"
    );
    expect(screen.getByTestId("manager-name-3")).toHaveTextContent(
      "Manager: No Manager"
    );
  });

  test("filters employees by search", () => {
    const searchInput = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(searchInput, { target: { value: "Charlie" } });

    expect(screen.getByTestId("employee-name-2")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-name-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("employee-name-3")).not.toBeInTheDocument();
  });

  test("filters employees by team", () => {
    const teamFilter = screen.getByLabelText("Filter by Teams");

    fireEvent.mouseDown(teamFilter);

    fireEvent.click(screen.getByText("Engineering"));

    expect(screen.getByTestId("employee-name-1")).toBeInTheDocument();
    expect(screen.getByTestId("employee-name-2")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-name-3")).not.toBeInTheDocument();
  });
});
