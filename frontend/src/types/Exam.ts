export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED';

export interface Exam {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  passScore: number;
  status: ExamStatus;
  createdById?: number;
  createdByName?: string;
  totalQuestions?: number;
  startTime?: string;
  endTime?: string;
  assignedStudentIds?: number[];
  assignedStudentNames?: string[];
  assignedClassroomIds?: number[];
  assignedClassroomNames?: string[];
  createdAt?: string;
}

export interface CreateExamDto {
  title: string;
  description: string;
  durationMinutes: number;
  passScore: number;
  status?: ExamStatus;
  startTime?: string;
  endTime?: string;
  assignedStudentIds?: number[];
  assignedClassroomIds?: number[];
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  durationMinutes?: number;
  passScore?: number;
  status?: ExamStatus;
  startTime?: string;
  endTime?: string;
  assignedStudentIds?: number[];
  assignedClassroomIds?: number[];
}
