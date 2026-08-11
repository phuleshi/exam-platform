import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User as UserIcon, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-md bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold text-sm">
              <UserIcon size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">{user.fullName}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase">
                {user.role === 'TEACHER' ? 'Giáo Viên' : user.role === 'ADMIN' ? 'Quản Trị' : 'Học Sinh'}
              </span>
            </div>
          </div>

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
  );
};
