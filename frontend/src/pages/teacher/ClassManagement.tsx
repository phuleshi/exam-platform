import React, { useEffect, useState } from 'react';
import { Classroom, CreateClassroomDto } from '../../types/Classroom';
import { User } from '../../types/User';
import { classroomApi } from '../../services/classroomApi';
import { userApi } from '../../services/userApi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Users, Plus, Edit2, Trash2, BookOpen, Search, X, CheckSquare, Square, ShieldAlert } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [formData, setFormData] = useState<CreateClassroomDto>({
    name: '',
    code: '',
    description: '',
    teacherId: undefined,
    studentIds: [],
  });
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, userRes] = await Promise.all([
        isAdmin ? classroomApi.getAllClassrooms() : classroomApi.getTeacherClassrooms(),
        userApi.getAllUsers(),
      ]);
      if (classRes.success && classRes.data) {
        setClassrooms(classRes.data);
      }
      if (userRes.data) {
        setStudents(userRes.data.filter((u: User) => u.role === 'STUDENT'));
        setTeachers(userRes.data.filter((u: User) => u.role === 'TEACHER'));
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lớp học:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      code: `LOP-${Math.floor(1000 + Math.random() * 9000)}`,
      description: '',
      teacherId: teachers.length > 0 ? teachers[0].id : undefined,
      studentIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: Classroom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      code: cls.code,
      description: cls.description || '',
      teacherId: cls.teacherId,
      studentIds: cls.studentIds || [],
    });
    setIsModalOpen(true);
  };

  const handleStudentToggle = (studentId: number) => {
    setFormData((prev) => {
      const currentIds = prev.studentIds || [];
      if (currentIds.includes(studentId)) {
        return { ...prev, studentIds: currentIds.filter((id) => id !== studentId) };
      } else {
        return { ...prev, studentIds: [...currentIds, studentId] };
      }
    });
  };

  const handleSelectAllStudents = () => {
    if ((formData.studentIds || []).length === filteredStudentsInModal.length) {
      setFormData((prev) => ({ ...prev, studentIds: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        studentIds: filteredStudentsInModal.map((s) => s.id),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Vui lòng nhập tên và mã lớp học!');
      return;
    }

    const payload: CreateClassroomDto = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description?.trim(),
      teacherId: formData.teacherId && formData.teacherId > 0 ? Number(formData.teacherId) : undefined,
      studentIds: formData.studentIds || [],
    };

    setSubmitting(true);
    try {
      if (editingClass) {
        const res = await classroomApi.updateClassroom(editingClass.id, payload);
        if (res.success) {
          alert('Cập nhật lớp học thành công!');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await classroomApi.createClassroom(payload);
        if (res.success) {
          alert('Tạo lớp học mới thành công!');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      console.error('Lỗi Submit Lớp Học:', err);
      const msg = typeof err === 'string' ? err : err?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${name}"?`)) return;
    try {
      const res = await classroomApi.deleteClassroom(id);
      if (res.success) {
        alert('Xóa lớp học thành công!');
        fetchData();
      }
    } catch (err: any) {
      console.error('Lỗi Xóa Lớp Học:', err);
      const msg = typeof err === 'string' ? err : err?.message || 'Xóa lớp học thất bại!';
      alert(msg);
    }
  };

  const filteredClassrooms = classrooms.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudentsInModal = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-blue-700" size={28} /> Quản Lý Lớp Học & Đơn Vị
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Tài khoản Quản Trị Viên (Admin): Khởi tạo lớp học, phân công giáo viên quản lý và thêm/bớt sinh viên vào lớp.'
              : 'Danh sách các lớp học bạn được phân công quản lý và giao đề thi.'}
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreateModal} className="flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} /> Tạo Lớp Học Mới
        </Button>
      </div>

      {isAdmin && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-900 flex items-center gap-2 font-medium">
          <ShieldAlert size={16} className="text-purple-700 shrink-0" />
          <span>Quyền Admin: Bạn có quyền cấp tài khoản học sinh vào các lớp học để Giáo viên phụ trách tiến hành giao bài thi.</span>
        </div>
      )}

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
          <p className="text-slate-600 font-semibold">Chưa có lớp học nào</p>
          <p className="text-xs text-slate-400">Bấm "Tạo Lớp Học Mới" để tạo danh sách lớp và gán sinh viên.</p>
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(cls)}
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Chỉnh sửa / Thêm sinh viên"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cls.id, cls.name)}
                      className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Xóa lớp"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">{cls.name}</h3>
                {cls.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cls.description}</p>}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Giáo viên phụ trách:</span>
                  <span className="font-bold text-slate-800">{cls.teacherName || 'Chưa gán'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Users size={14} className="text-slate-400" /> {cls.studentCount} Sinh viên
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(cls)}
                    className="text-[11px] font-bold text-blue-800 hover:underline cursor-pointer"
                  >
                    + Thêm/Sửa sinh viên
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-xl w-full max-h-[90vh] flex flex-col shadow-xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {editingClass ? 'Chỉnh Sửa Lớp & Sinh Viên' : 'Tạo Lớp Học Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              <Input
                label="Tên Lớp Học *"
                placeholder="Ví dụ: Lớp 12A1 - Toán Học"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Mã Lớp Học *"
                placeholder="Ví dụ: LOP-12A1"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />

              {isAdmin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Giáo Viên Phụ Trách Lớp *
                  </label>
                  <select
                    value={formData.teacherId || ''}
                    onChange={(e) => setFormData({ ...formData, teacherId: Number(e.target.value) })}
                    className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="">-- Tự Động Gán Admin / Chọn Giáo Viên --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mô Tả Lớp Học
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về lớp học..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
                />
              </div>

              {/* Student selection area */}
              <div className="border border-slate-200 rounded-md p-3 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Danh Sách Sinh Viên Trong Lớp (Đã chọn: {(formData.studentIds || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllStudents}
                    className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {(formData.studentIds || []).length === filteredStudentsInModal.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên hoặc email sinh viên..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-hidden"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto bg-white border border-slate-200 rounded divide-y divide-slate-100">
                  {filteredStudentsInModal.length === 0 ? (
                    <p className="p-3 text-xs text-slate-400 text-center">Không tìm thấy sinh viên nào.</p>
                  ) : (
                    filteredStudentsInModal.map((s) => {
                      const isSelected = (formData.studentIds || []).includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleStudentToggle(s.id)}
                          className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/70 text-blue-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold block">{s.fullName}</span>
                            <span className="text-[11px] text-slate-400">{s.email}</span>
                          </div>
                          {isSelected ? <CheckSquare size={16} className="text-blue-700" /> : <Square size={16} className="text-slate-300" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : editingClass ? 'Cập Nhật Lớp' : 'Tạo Lớp Học'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
