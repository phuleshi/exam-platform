import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { Dashboard as StudentDashboard } from '../pages/student/Dashboard';
import { ExamList as StudentExamList } from '../pages/student/ExamList';
import { ExamDetail as StudentExamDetail } from '../pages/student/ExamDetail';
import { ExamTaking as StudentExamTaking } from '../pages/student/ExamTaking';
import { ResultPage as StudentResultPage } from '../pages/student/ResultPage';

import { Dashboard as TeacherDashboard } from '../pages/teacher/Dashboard';
import { ExamManagement as TeacherExamManagement } from '../pages/teacher/ExamManagement';
import { CreateExam as TeacherCreateExam } from '../pages/teacher/CreateExam';
import { EditExam as TeacherEditExam } from '../pages/teacher/EditExam';
import { QuestionManagement as TeacherQuestionManagement } from '../pages/teacher/QuestionManagement';
import { ExamResults as TeacherExamResults } from '../pages/teacher/ExamResults';
import { ClassManagement as TeacherClassManagement } from '../pages/teacher/ClassManagement';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isTeacher } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

      {/* Main Layout Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            isTeacher ? <Navigate to="/teacher/dashboard" replace /> : <Navigate to="/student/dashboard" replace />
          }
        />

        {/* Student Routes */}
        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentExamList />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentExamDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams/:id/taking"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentExamTaking />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
              <StudentResultPage />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/classes"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherExamManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/create"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherCreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherEditExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/questions"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherQuestionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/results"
          element={
            <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
              <TeacherExamResults />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
