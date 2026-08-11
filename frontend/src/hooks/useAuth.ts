import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isTeacher = user?.role === 'TEACHER' || user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  return {
    user,
    token,
    isAuthenticated,
    isTeacher,
    isStudent,
    logout,
  };
};
