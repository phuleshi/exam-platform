import api from './api';
import { ApiResponse } from '../types/api';
import { Classroom, CreateClassroomDto, UpdateClassroomDto } from '../types/Classroom';

export const classroomApi = {
  getAllClassrooms: async (): Promise<ApiResponse<Classroom[]>> => {
    const response = await api.get('/classrooms');
    return response as any;
  },

  getTeacherClassrooms: async (): Promise<ApiResponse<Classroom[]>> => {
    const response = await api.get('/classrooms/teacher');
    return response as any;
  },

  getStudentClassrooms: async (): Promise<ApiResponse<Classroom[]>> => {
    const response = await api.get('/classrooms/student');
    return response as any;
  },

  getClassroomById: async (id: number): Promise<ApiResponse<Classroom>> => {
    const response = await api.get(`/classrooms/${id}`);
    return response as any;
  },

  createClassroom: async (data: CreateClassroomDto): Promise<ApiResponse<Classroom>> => {
    const response = await api.post('/classrooms', data);
    return response as any;
  },

  updateClassroom: async (id: number, data: UpdateClassroomDto): Promise<ApiResponse<Classroom>> => {
    const response = await api.put(`/classrooms/${id}`, data);
    return response as any;
  },

  deleteClassroom: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/classrooms/${id}`);
    return response as any;
  },
};
