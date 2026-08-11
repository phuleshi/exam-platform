import api from './api';
import { User } from '../types/User';
import { ApiResponse } from '../types/api';

export const userApi = {
  getAllUsers: (): Promise<ApiResponse<User[]>> => api.get('/users'),
};
