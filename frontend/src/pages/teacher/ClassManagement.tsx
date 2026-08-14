import React, { useEffect, useState } from 'react';
import { Classroom } from '../../types/Classroom';
import { userApi } from '../../services/userApi';
import { classroomApi } from '../../services/classroomApi';
import { Users, BookOpen, Search, UserCheck, ShieldCheck } from 'lucide-react';
import { User } from '../../types/User';

export const ClassManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, userRes] = await Promise.all([
        classroomApi.getTeacherClassrooms(),
        userApi.getAllUsers().catch(() => ({ data: [] })),
      ]);
      if (classRes.success && classRes.data) {
        setClassrooms(classRes.data);
      }
      if (userRes.data) {
        setStudents(userRes.data.filter((u: User) => u.role === 'STUDENT'));
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách lớp học:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassrooms = classrooms.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClassStudents = (cls: Classroom) => {
    if (!cls.studentIds) return [];
    return students.filter((s) => cls.studentIds.includes(s.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-blue-700" size={28} /> Danh Sách Lớp Học Phụ Trách
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem thông tin các lớp học được phân công và danh sách sinh viên từng lớp để giao bài thi.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-md text-xs font-semibold flex items-center gap-2">
          <ShieldCheck size={16} /> Chế độ xem dành cho Giáo viên
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mã lớp học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm text-slate-900 focus:outline-hidden bg-transparent"
        />
      </div>

      {/* Class List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Đang tải danh sách lớp học...</div>
      ) : filteredClassrooms.length === 0 ? (
        <div className="bg-white p-12 rounded-md border border-slate-200 text-center space-y-3">
          <BookOpen size={48} className="mx-auto text-slate-300" />
          <p className="text-slate-600 font-semibold">Chưa có lớp học nào được phân công</p>
          <p className="text-xs text-slate-400">Liên hệ Quản trị viên (Admin) để khởi tạo lớp và phân công giảng dạy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((cls) => (
            <div key={cls.id} className="bg-white border border-slate-200 rounded-md p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    Mã: {cls.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">{cls.name}</h3>
                {cls.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cls.description}</p>}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Giáo viên phụ trách:</span>
                  <span className="font-bold text-slate-800">{cls.teacherName || 'Tôi'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" /> {cls.studentCount} Sinh viên
                  </span>
                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <UserCheck size={14} /> Xem danh sách SV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Students in Class */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-lg w-full max-h-[80vh] flex flex-col shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900">Danh Sách Sinh Viên - {selectedClass.name}</h2>
                <p className="text-xs text-slate-500">Mã lớp: {selectedClass.code} | {selectedClass.studentCount} sinh viên</p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {selectedClass.studentNames && selectedClass.studentNames.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {selectedClass.studentNames.map((name, idx) => (
                    <li key={idx} className="py-2.5 text-xs flex items-center gap-2 font-medium text-slate-700">
                      <span className="w-5 text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">Chưa có sinh viên nào trong lớp này.</p>
              )}
            </div>

            <div className="p-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
