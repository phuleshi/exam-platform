export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  studentId?: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
