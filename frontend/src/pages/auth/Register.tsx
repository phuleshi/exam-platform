import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Role } from '../../types/User';
import { GraduationCap, UserPlus } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.register({ fullName, email, password, role });
      if (res.success && res.data) {
        setAuth(
          {
            id: res.data.id,
            fullName: res.data.fullName,
            email: res.data.email,
            role: res.data.role,
          },
          res.data.token
        );

        if (res.data.role === 'TEACHER') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err: any) {
      setError(err || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-md bg-blue-900 flex items-center justify-center text-white font-black text-2xl shadow-sm mb-3">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">ĐĂNG KÝ TÀI KHOẢN</h2>
          <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">Tạo Hồ Sơ Thi Trực Tuyến Mới</p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 rounded-md bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Vai Trò Người Dùng
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2.5 rounded-md border text-xs font-bold transition-all ${
                  role === 'STUDENT'
                    ? 'bg-blue-900 border-blue-950 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Học Sinh / Thí Sinh
              </button>
              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`py-2.5 rounded-md border text-xs font-bold transition-all ${
                  role === 'TEACHER'
                    ? 'bg-blue-900 border-blue-950 text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Giáo Viên / Cán Bộ
              </button>
            </div>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-4 py-2.5">
            <UserPlus size={18} />
            <span>Hoàn Tất Đăng Ký</span>
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-blue-900 hover:underline transition-colors">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
