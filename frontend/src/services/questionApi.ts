import api from './api';
import { Question, CreateQuestionDto } from '../types/Question';
import { ApiResponse } from '../types/api';

export const questionApi = {
  getQuestionsByExamId: (examId: number): Promise<ApiResponse<Question[]>> =>
    api.get(`/questions/exam/${examId}`),
  createQuestion: (data: CreateQuestionDto): Promise<ApiResponse<Question>> =>
    api.post('/questions', data),
  deleteQuestion: (id: number): Promise<void> =>
    api.delete(`/questions/${id}`),
};
