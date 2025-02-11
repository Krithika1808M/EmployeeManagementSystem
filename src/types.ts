export interface Employee {
    id: string;
    name: string;
    designation: string;
    team: string;
    managerId: string | null;
    photoUrl: string;  // New: Employee profile picture URL
    contact?: string;  // New: Optional contact number
    email?: string;    // New: Optional email address
  }
  