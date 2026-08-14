import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { Classroom } from '../../types/Classroom';
import { userApi } from '../../services/userApi';
import { classroomApi } from '../../services/classroomApi';
import { GraduationCap, Search, UserCheck, BookOpen } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, classRes] = await Promise.all([
        userApi.getAllUsers(),
        classroomApi.getAllClassrooms(),
      ]);

      if (userRes.data) {
        setStudents(userRes.data.filter((u) => u.role === 'STUDENT'));
      }
      if (classRes.success && classRes.data) {
        setClassrooms(classRes.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách sinh viên:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentClassrooms = (studentId: number) => {
    return classrooms.filter((cls) => cls.studentIds && cls.studentIds.includes(studentId));
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-blue-700" size={28} /> Quản Lý Sinh Viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản trị viên quản lý danh sách sinh viên trong hệ thống và phân bổ lớp học.
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 font-bold flex items-center gap-2">
          <UserCheck size={16} /> Tổng số sinh viên: {students.length}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sinh viên theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm text-slate-900 focus:outline-hidden bg-transparent"
        />
      </div>

      {/* Student List Table */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Đang tải danh sách sinh viên...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-12 rounded-md border border-slate-200 text-center space-y-2">
          <GraduationCap size={48} className="mx-auto text-slate-300" />
          <p className="text-slate-600 font-semibold">Không tìm thấy sinh viên nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Họ Và Tên</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Lớp Đã Tham Gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.map((student) => {
                const joinedClasses = getStudentClassrooms(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">#{student.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{student.fullName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{student.email}</td>
                    <td className="py-3.5 px-4">
                      {joinedClasses.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Chưa thuộc lớp nào</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {joinedClasses.map((cls) => (
                            <span
                              key={cls.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                            >
                              <BookOpen size={12} /> {cls.name} ({cls.code})
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
