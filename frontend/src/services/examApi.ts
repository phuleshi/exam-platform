import api from './api';
import { Exam, CreateExamDto } from '../types/Exam';
import { ApiResponse } from '../types/api';

export const examApi = {
  getExams: (status?: string): Promise<ApiResponse<Exam[]>> => 
    api.get('/exams', { params: { status } }),
  getExamById: (id: number): Promise<ApiResponse<Exam>> => 
    api.get(`/exams/${id}`),
  getTeacherExams: (): Promise<ApiResponse<Exam[]>> => 
    api.get('/exams/teacher'),
  getStudentExams: (): Promise<ApiResponse<Exam[]>> => 
    api.get('/exams/student'),
  createExam: (data: CreateExamDto): Promise<ApiResponse<Exam>> => 
    api.post('/exams', data),
  updateExam: (id: number, data: Partial<CreateExamDto>): Promise<ApiResponse<Exam>> => 
    api.put(`/exams/${id}`, data),
  deleteExam: (id: number): Promise<void> => 
    api.delete(`/exams/${id}`),
};
