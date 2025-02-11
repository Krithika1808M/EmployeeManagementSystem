import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { useEmployees } from "../context/EmployeeContext";

import OrgChart from "../components/OrgChart";
import EmployeeList from "../components/EmployeesList";

import "./Home.css";

// a simple header suitable for the application
const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>HappyFox Employee Management System</h1>
    </header>
  );
};

// this component will return the sidebar and the org chart
const Home: React.FC = () => {
  const { employees, updateEmployee } = useEmployees();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateManager = async (
    employeeId: string,
    newManagerId: string | null
  ) => {
    if (employeeId === newManagerId) {
      console.warn("An employee cannot be their own manager");
      return;
    }

    try {
      await updateEmployee({
        employeeId,
        updates: { managerId: newManagerId },
      });
    } catch (error) {
      console.error("Failed to update manager:", error);
    }
  };

  const filteredEmployees: Employee[] = selectedTeam
    ? employees.filter((emp) => emp.team === selectedTeam)
    : employees;

  return (
    <div className="home-wrapper">
      <Header />
      {showWelcome && (
        <div className="welcome-message">Welcome to HappyFox!</div>
      )}

      <div className="home-container">
        <div className="sidebar">
          <EmployeeList onSelect={setSelectedTeam} />
        </div>
        <div className="org-chart-section">
          {filteredEmployees.length > 0 ? (
            <OrgChart
              employees={filteredEmployees}
              onUpdateManager={handleUpdateManager}
            />
          ) : (
            <p>
              {selectedTeam
                ? `No employees found in ${selectedTeam} team.`
                : "No employees available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
