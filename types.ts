export type Role = 'employee' | 'manager';

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  HALF_DAY = 'Half Day',
  ON_LEAVE = 'On Leave'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeId: string;
  department: string;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO Date string YYYY-MM-DD
  checkInTime: string | null; // ISO Date string
  checkOutTime: string | null; // ISO Date string
  status: AttendanceStatus;
  totalHours: number;
}

export interface DashboardStats {
  present: number;
  absent: number;
  late: number;
  totalHours: number;
}
