export interface Answer {
  id?: number;
  content: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  examId: number;
  content: string;
  score: number;
  answers: Answer[];
}

export interface CreateQuestionDto {
  examId: number;
  content: string;
  score: number;
  answers: { content: string; isCorrect: boolean }[];
}
