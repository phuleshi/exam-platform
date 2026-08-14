import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FileSpreadsheet, Award, PlusCircle, HelpCircle, Users, GraduationCap, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isAdmin, isTeacher } = useAuth();

  const adminLinks = [
    { to: '/admin/classes', label: 'Quản Lý Lớp Học', icon: Users },
    { to: '/admin/students', label: 'Quản Lý Sinh Viên', icon: GraduationCap },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { to: '/teacher/classes', label: 'Xem Lớp Học', icon: Users },
    { to: '/teacher/exams', label: 'Quản Lý Bài Thi', icon: FileSpreadsheet },
    { to: '/teacher/exams/create', label: 'Tạo Bài Thi Mới', icon: PlusCircle },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { to: '/student/exams', label: 'Danh Sách Bài Thi', icon: FileSpreadsheet },
    { to: '/student/results', label: 'Kết Quả Của Tôi', icon: Award },
  ];

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;
  const categoryLabel = isAdmin ? 'Danh Mục Quản Trị' : isTeacher ? 'Danh Mục Giáo Viên' : 'Danh Mục Sinh Viên';

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 px-3 mb-2 text-slate-500">
          {isAdmin ? <Shield size={14} className="text-purple-600" /> : null}
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {categoryLabel}
          </span>
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <HelpCircle size={16} className="text-blue-800" />
          <span>Hỗ Trợ Kỹ Thuật</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Liên hệ hỗ trợ hệ thống thi trực tuyến 24/7</p>
      </div>
    </aside>
  );
};
