import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isStudent = user?.role === 'STUDENT';

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    logout,
  };
};
