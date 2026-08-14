import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

import { AdminClassManagement } from '../pages/admin/ClassManagement';
import { StudentManagement as AdminStudentManagement } from '../pages/admin/StudentManagement';

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
  const { isAuthenticated, isAdmin, isTeacher } = useAuth();

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
            isAdmin ? (
              <Navigate to="/admin/classes" replace />
            ) : isTeacher ? (
              <Navigate to="/teacher/dashboard" replace />
            ) : (
              <Navigate to="/student/dashboard" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/classes"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/students"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminStudentManagement />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentExamList />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentExamDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams/:id/taking"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentExamTaking />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentResultPage />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/classes"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherExamManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/create"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherCreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherEditExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/questions"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherQuestionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="teacher/exams/:id/results"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherExamResults />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
