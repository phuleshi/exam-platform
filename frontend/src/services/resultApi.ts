import api from './api';
import { Result, SubmitExamDto } from '../types/Result';
import { ApiResponse } from '../types/api';

export const resultApi = {
  submitExam: (data: SubmitExamDto): Promise<ApiResponse<Result>> =>
    api.post('/submissions', data),
  getMyResults: (): Promise<ApiResponse<Result[]>> =>
    api.get('/results/my-results'),
  getResultsByExam: (examId: number): Promise<ApiResponse<Result[]>> =>
    api.get(`/results/exam/${examId}`),
  getResultById: (id: number): Promise<ApiResponse<Result>> =>
    api.get(`/results/${id}`),
};
