export interface Result {
  id: number;
  submissionId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  examId: number;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passScore: number;
  isPassed: boolean;
  createdAt: string;
}

export interface SubmitAnswerDto {
  questionId: number;
  selectedAnswerId?: number;
}

export interface SubmitExamDto {
  examId: number;
  answers: SubmitAnswerDto[];
}
