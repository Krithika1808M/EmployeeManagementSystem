import React, { useState, useEffect, useCallback } from "react";
import "./OrgChart.css";

interface Employee {
  id: string;
  name: string;
  designation: string;
  managerId: string | null;
  team: string;
  children?: Employee[];
}

interface OrgChartProps {
  employees: Employee[];
  onUpdateManager: (employeeId: string, newManagerId: string | null) => void;
}

const transformToTree = (employees: Employee[]): Employee[] => {
  const employeeMap = new Map<string, Employee & { children: Employee[] }>();

  employees.forEach((emp) => {
    employeeMap.set(emp.id, { ...emp, children: [] });
  });

  const roots: Employee[] = [];

  employees.forEach((emp) => {
    if (emp.managerId && employeeMap.has(emp.managerId)) {
      employeeMap.get(emp.managerId)!.children.push(employeeMap.get(emp.id)!);
    } else {
      roots.push(employeeMap.get(emp.id)!);
    }
  });

  return roots;
};

const OrgNode: React.FC<{
  employee: Employee;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
  onDragOver: (event: React.DragEvent) => void;
}> = ({ employee, onDragStart, onDrop, onDragOver }) => {
  //using this to generate random profile pictures for the employees in org chart
  const imageUrl = `https://randomuser.me/api/portraits/men/${
    parseInt(employee.id) % 50
  }.jpg`;

  return (
    <div className="org-node-container">
      <div
        className="org-node"
        draggable
        onDragStart={() => onDragStart(employee.id)}
        onDrop={() => onDrop(employee.id)}
        onDragOver={onDragOver}
      >
        <img src={imageUrl} alt={employee.name} className="employee-photo" />
        <div className="employee-info">
          <p className="org-name">{employee.name}</p>
          <p className="org-designation">{employee.designation}</p>
        </div>
      </div>

      {employee.children && employee.children.length > 0 && (
        <div className="org-children">
          {employee.children.length > 1 && (
            <div className="org-horizontal-line"></div>
          )}
          {employee.children.map((child) => (
            <div className="org-child-wrapper" key={child.id}>
              <div className="org-vertical-line"></div>
              <OrgNode
                employee={child}
                onDragStart={onDragStart}
                onDrop={onDrop}
                onDragOver={onDragOver}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrgChart: React.FC<OrgChartProps> = ({ employees, onUpdateManager }) => {
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string | null>(
    null
  );
  const [tree, setTree] = useState<Employee[]>([]);

  useEffect(() => {
    setTree(transformToTree(employees));
  }, [employees]);

  const handleDragStart = useCallback((id: string) => {
    setDraggedEmployeeId(id);
  }, []);

  const handleDrop = useCallback(
    (newManagerId: string) => {
      if (!draggedEmployeeId || draggedEmployeeId === newManagerId) return;

      const isChild = (managerId: string | null, empId: string): boolean => {
        if (!managerId) return false;
        if (managerId === empId) return true;
        const manager = employees.find((emp) => emp.id === managerId);
        return manager ? isChild(manager.managerId, empId) : false;
      };

      if (isChild(newManagerId, draggedEmployeeId)) return;

      onUpdateManager(draggedEmployeeId, newManagerId);

      setDraggedEmployeeId(null);
    },
    [draggedEmployeeId, employees, onUpdateManager]
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  if (tree.length === 0) return <p>No employees found</p>;

  return (
    <div className="org-chart">
      {tree.map((root) => (
        <OrgNode
          key={root.id}
          employee={root}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      ))}
    </div>
  );
};

export default OrgChart;
