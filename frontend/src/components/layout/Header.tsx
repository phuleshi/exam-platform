import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon, GraduationCap, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-md bg-blue-900 flex items-center justify-center text-white font-black text-xl shadow-sm">
            <GraduationCap size={22} />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">EXAM<span className="text-blue-800">HUB</span></span>
            <span className="text-[10px] block font-bold text-slate-500 tracking-widest uppercase -mt-1">Cổng Thi Trực Tuyến</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-md bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold text-sm">
                <UserIcon size={16} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800">{user.fullName}</p>
                  {user.studentId && (
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                      {user.studentId}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-900 border-purple-200'
                      : user.role === 'TEACHER'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                  }`}
                >
                  {user.role === 'ADMIN' ? 'Quản Trị Viên' : user.role === 'TEACHER' ? 'Giáo Viên' : 'Sinh Viên'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsChangePassOpen(true)}
              title="Đổi mật khẩu"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md text-slate-700 hover:text-blue-900 hover:bg-blue-50 border border-slate-200 transition-all"
            >
              <KeyRound size={15} className="text-slate-500" />
              <span className="hidden md:inline">Đổi mật khẩu</span>
            </button>

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-2 rounded-md text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </header>

      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
      />
    </>
  );
};
