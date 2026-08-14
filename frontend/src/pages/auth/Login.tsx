import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GraduationCap, LogIn, ShieldAlert, UserCheck, BookOpen } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        setAuth(
          {
            id: res.data.id,
            fullName: res.data.fullName,
            email: res.data.email,
            studentId: res.data.studentId,
            role: res.data.role,
          },
          res.data.token
        );

        if (res.data.role === 'ADMIN') {
          navigate('/admin/classes');
        } else if (res.data.role === 'TEACHER') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err: any) {
      setError(err || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (accEmail: string, accPass: string = '123456') => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-md bg-blue-900 flex items-center justify-center text-white font-black text-2xl shadow-sm mb-3">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">CỔNG ĐĂNG NHẬP</h2>
          <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Hệ Thống Đánh Giá & Thi Trực Tuyến</p>
        </div>

        {/* Quick login demo accounts */}
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Chọn tài khoản mẫu đăng nhập nhanh:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('admin@exam.com')}
              className="px-2 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldAlert size={12} /> Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('teacher@exam.com')}
              className="px-2 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded flex items-center justify-center gap-1 transition-colors"
            >
              <UserCheck size={12} /> Giáo Viên
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('11210001@st.neu.edu.vn')}
              className="px-2 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded flex items-center justify-center gap-1 transition-colors"
            >
              <BookOpen size={12} /> SV Email
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('11210001')}
              className="px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded flex items-center justify-center gap-1 transition-colors"
            >
              <GraduationCap size={12} /> SV (MSV)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-md bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email hoặc Mã Sinh Viên (MSV)"
            type="text"
            placeholder="Ví dụ: 11210001@st.neu.edu.vn hoặc 11210001"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu tài khoản"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full mt-2 py-2.5">
            <LogIn size={18} />
            <span>Đăng Nhập Hợp Lệ</span>
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
          Chưa có tài khoản thí sinh / giáo viên?{' '}
          <Link to="/register" className="font-bold text-blue-900 hover:underline transition-colors">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
