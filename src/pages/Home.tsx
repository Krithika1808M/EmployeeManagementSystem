import React, { useState, useEffect } from "react";
import { Employee } from "../types";
import { useEmployees } from "../context/EmployeeContext";

import OrgChart from "../components/OrgChart";
import EmployeeList from "../components/EmployeesList";

import "./Home.css";
import { FaInfoCircle } from "react-icons/fa";
import { Oval } from "react-loader-spinner";

// a simple header suitable for the application
const Header: React.FC = () => (
  <header className="header">
    <h1>HappyFox Employee Management System</h1>
  </header>
);

const WelcomeMessage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="welcome-message">
      <span>Welcome to HappyFox Employee Management System!</span>
    </div>
  );
};

// this component will return the sidebar and the org chart
const Home: React.FC = () => {
  const { employees, updateEmployee } = useEmployees();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredEmployeeId, setHoveredEmployeeId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showWelcome]);

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
    ? employees.filter(
        (emp) => emp.team?.toLowerCase() === selectedTeam.toLowerCase()
      )
    : employees;

  return (
    <div className="home-wrapper">
      <Header />
      {showWelcome && <WelcomeMessage onClose={() => setShowWelcome(false)} />}

      <div className="home-container">
        <div className="sidebar">
          <EmployeeList
            onSelect={setSelectedTeam}
            onHover={setHoveredEmployeeId}
          />
        </div>
        <div className="org-chart-section">
          <div className="org-chart-instruction">
            <FaInfoCircle className="info-icon" />
            <span>
              You can also filter based on teams in the left to view the
              specific team's chart.
            </span>
          </div>

          {filteredEmployees.length > 0 ? (
            <OrgChart
              employees={filteredEmployees}
              onUpdateManager={handleUpdateManager}
              hoveredEmployeeId={hoveredEmployeeId}
            />
          ) : (
            <div className="loading-overlay">
              <Oval
                height={100}
                width={100}
                color="#007bff"
                secondaryColor="#ddd"
              />
              <p>Loading employees...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
