import React, { useState } from "react";
import Select from "react-select";
import { useEmployees } from "../context/EmployeeContext";
import {
  FaFilter,
  FaLaptopCode,
  FaUserTie,
  FaUsers,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import "./EmployeeList.css";

interface EmployeeListProps {
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
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

const EmployeeList: React.FC<EmployeeListProps> = ({ onSelect, onHover }) => {
  const { employees, updateEmployee } = useEmployees();
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const findManagerName = (managerId: string | null) => {
    if (!managerId) return "No Manager";
    const manager = employees.find((emp) => emp.id === managerId);
    return manager ? manager.name : `ID: ${managerId}`;
  };

  const handleSave = async () => {
    if (selectedEmployee) {
      await updateEmployee({
        employeeId: selectedEmployee.id,
        updates: { name: editedName },
      });
      setIsEditing(false);
    }
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
            data-testid={`employee-item-${employee.id}`}
            onClick={() => {
              setSelectedEmployee(employee);
              setEditedName(employee.name);
              setIsEditing(false);
            }}
            onMouseEnter={() => onHover(employee.id)}
            onMouseLeave={() => onHover(null)}
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

      {selectedEmployee && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEmployee(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedEmployee(null)}
            >
              <FaTimes />
            </button>
            <img
              src={`https://randomuser.me/api/portraits/men/${
                parseInt(selectedEmployee.id) % 50
              }.jpg`}
              alt={selectedEmployee.name}
              className="modal-photo"
            />

            <div className="edit-name-container">
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="edit-name-input"
                />
              ) : (
                <h2>
                  {selectedEmployee.name}{" "}
                  <FaEdit
                    className="edit-icon"
                    onClick={() => setIsEditing(true)}
                  />
                </h2>
              )}
            </div>

            {isEditing && (
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
            )}

            <p>
              <strong>Designation:</strong> {selectedEmployee.designation}
            </p>
            <p>
              <strong>Team:</strong> {selectedEmployee.team}
            </p>
            <p>
              <strong>Manager:</strong>{" "}
              {findManagerName(selectedEmployee.managerId)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
