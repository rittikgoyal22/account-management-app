// ─── Employee Models ─────────────────────────────────────────────────────────

export interface EmployeeRequestDTO {
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  emailAddress: string;
  role: 'HR' | 'Employee' | 'TravelDeskExe';
  password?: string;
  currentGradeId: number;
  accessGranted?: boolean;
}

export interface EmployeeResponseDTO {
  employeeId: number;
  firstName: string;
  emailAddress: string;
  role: 'HR' | 'Employee' | 'TravelDeskExe';
  accessGranted: boolean;
  gradeName: string;
}

export interface ErrorDTO {
  message: string;
  fieldName: string | null;
  status: string;
}
