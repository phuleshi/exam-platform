export interface Classroom {
  id: number;
  name: string;
  code: string;
  description?: string;
  teacherId: number;
  teacherName: string;
  studentIds: number[];
  studentNames: string[];
  studentCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassroomDto {
  name: string;
  code: string;
  description?: string;
  teacherId?: number;
  studentIds?: number[];
}

export interface UpdateClassroomDto {
  name: string;
  code: string;
  description?: string;
  teacherId?: number;
  studentIds?: number[];
}
