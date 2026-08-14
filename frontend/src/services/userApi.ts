import api from './api';
import { User } from '../types/User';
import { ApiResponse } from '../types/api';

export interface CreateStudentParams {
  studentId: string;
  fullName: string;
  email: string;
  password: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export const userApi = {
  getAllUsers: (): Promise<ApiResponse<User[]>> => api.get('/users'),
  createStudent: (params: CreateStudentParams): Promise<ApiResponse<User>> => api.post('/users/students', params),
  changePassword: (params: ChangePasswordParams): Promise<ApiResponse<void>> => api.post('/users/change-password', params),
};
