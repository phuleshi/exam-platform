import api from './api';
import { User, Role } from '../types/User';
import { ApiResponse } from '../types/api';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  studentId?: string;
  password: string;
  role?: Role;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    id: number;
    fullName: string;
    email: string;
    studentId?: string;
    role: Role;
  };
}

export const authApi = {
  login: (params: LoginParams): Promise<AuthResponse> => api.post('/auth/login', params),
  register: (params: RegisterParams): Promise<AuthResponse> => api.post('/auth/register', params),
  getCurrentUser: (): Promise<ApiResponse<User>> => api.get('/users/me'),
};
