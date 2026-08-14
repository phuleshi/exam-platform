import React, { useEffect, useState } from 'react';
import { User } from '../../types/User';
import { Classroom } from '../../types/Classroom';
import { userApi } from '../../services/userApi';
import { classroomApi } from '../../services/classroomApi';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GraduationCap, Search, UserCheck, BookOpen, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [msv, setMsv] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [modalSuccess, setModalSuccess] = useState<string>('');

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

  const resetForm = () => {
    setMsv('');
    setFullName('');
    setEmail('');
    setPassword('');
    setModalError('');
    setModalSuccess('');
  };

  const handleCloseModal = () => {
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!msv.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
      setModalError('Vui lòng điền đầy đủ tất cả thông tin sinh viên!');
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await userApi.createStudent({
        studentId: msv.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
      });

      if (res.success) {
        setModalSuccess('Thêm sinh viên mới thành công!');
        await fetchData();
        setTimeout(() => {
          handleCloseModal();
        }, 1200);
      }
    } catch (err: any) {
      setModalError(err || 'Không thể thêm sinh viên. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStudentClassrooms = (studentId: number) => {
    return classrooms.filter((cls) => cls.studentIds && cls.studentIds.includes(studentId));
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
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
            Quản trị viên thêm sinh viên mới, quản lý danh sách sinh viên trong hệ thống và phân bổ lớp học.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 font-bold flex items-center gap-2">
            <UserCheck size={16} /> Tổng số sinh viên: {students.length}
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={18} />
            <span>Thêm Sinh Viên Mới</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sinh viên theo tên, email hoặc mã sinh viên (MSV)..."
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
                <th className="py-3.5 px-4">Mã Sinh Viên (MSV)</th>
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
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {student.studentId ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          {student.studentId}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal italic">Chưa cấp</span>
                      )}
                    </td>
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

      {/* Modal Thêm Sinh Viên Mới */}
      <Modal isOpen={isAddModalOpen} onClose={handleCloseModal} title="Thêm Sinh Viên Mới">
        <form onSubmit={handleAddStudent} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{modalError}</span>
            </div>
          )}

          {modalSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{modalSuccess}</span>
            </div>
          )}

          <Input
            label="Mã Sinh Viên (MSV)"
            placeholder="Ví dụ: 11210002"
            value={msv}
            onChange={(e) => {
              const val = e.target.value;
              setMsv(val);
              if (val.trim() && (!email || email.endsWith('@st.neu.edu.vn'))) {
                setEmail(`${val.trim()}@st.neu.edu.vn`);
              }
            }}
            required
          />

          <Input
            label="Họ Và Tên Sinh Viên"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Địa chỉ Email (ST NEU)"
            type="email"
            placeholder="Ví dụ: 11210002@st.neu.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Mật khẩu khởi tạo"
            type="password"
            placeholder="Ví dụ: 123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitLoading}>
              Hủy bỏ
            </Button>
            <Button type="submit" isLoading={submitLoading}>
              <UserPlus size={16} />
              <span>Thêm Sinh Viên</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
