import React, { useState } from "react";
import Select from "react-select";
import { useEmployees } from "../context/EmployeeContext";
import { FaFilter, FaLaptopCode, FaUserTie, FaUsers } from "react-icons/fa";
import "./EmployeeList.css";

interface EmployeeListProps {
  onSelect: (id: string) => void;
}

const teamOptions = [
  { value: "", label: "All Teams", icon: <FaUsers /> },
  { value: "Engineering", label: "Engineering", icon: <FaLaptopCode /> },
  { value: "Leadership", label: "Leadership", icon: <FaUserTie /> },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: "36px",
    height: "36px",
    fontSize: "14px",
    borderRadius: "6px",
    padding: "0 8px",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: "36px",
    display: "flex",
    alignItems: "center",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: "4px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    color: "black",
    backgroundColor: state.isFocused ? "#f0f0f0" : "white",
    padding: "8px",
    cursor: "pointer",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    color: "black",
  }),
};

const EmployeeList: React.FC<EmployeeListProps> = ({ onSelect }) => {
  const { employees, isLoading } = useEmployees();
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  if (isLoading) return <p>Loading...</p>;

  const findManagerName = (managerId: string | null) => {
    if (!managerId) return "No Manager";
    const manager = employees.find((emp) => emp.id === managerId);
    return manager ? manager.name : `ID: ${managerId}`;
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) &&
      (teamFilter ? emp.team === teamFilter : true)
  );

  return (
    <div className="employee-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="team-filter">
          <FaFilter className="filter-icon" color="black" />
          <label>Filter by Teams:</label>
          <Select
            aria-label="Filter by Teams"
            options={teamOptions}
            value={teamOptions.find((option) => option.value === teamFilter)}
            onChange={(selectedOption) => {
              setTeamFilter(selectedOption?.value || "");
              onSelect(selectedOption?.value || "");
            }}
            styles={customStyles}
            className="custom-dropdown"
            getOptionLabel={(e) => e.label}
            formatOptionLabel={(e) => (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {e.icon} {e.label}
              </div>
            )}
          />
        </div>
      </div>

      <ul className="employee-list">
        {filteredEmployees.map((employee) => (
          <li
            key={employee.id}
            className="employee-item"
            onClick={() => onSelect(employee.id)}
            data-testid={`employee-item-${employee.id}`}
          >
            <div
              className="employee-name"
              data-testid={`employee-name-${employee.id}`}
            >
              {employee.name}
            </div>
            <div className="employee-details">
              {employee.designation} - {employee.team}
            </div>
            <div
              className="employee-manager"
              data-testid={`manager-name-${employee.id}`}
            >
              Manager: <strong>{findManagerName(employee.managerId)}</strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
