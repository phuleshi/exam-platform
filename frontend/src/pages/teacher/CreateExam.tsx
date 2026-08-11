import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi } from '../../services/examApi';
import { userApi } from '../../services/userApi';
import { classroomApi } from '../../services/classroomApi';
import { User } from '../../types/User';
import { Classroom } from '../../types/Classroom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Save, Calendar, Users, Clock, BookOpen } from 'lucide-react';

export const CreateExam: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [passScore, setPassScore] = useState(5.0);

  // Scheduling states
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Assignment states
  const [assignMode, setAssignMode] = useState<'ALL' | 'CLASS' | 'SPECIFIC'>('ALL');
  const [students, setStudents] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [selectedClassroomIds, setSelectedClassroomIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, classRes] = await Promise.all([
          userApi.getAllUsers(),
          classroomApi.getTeacherClassrooms(),
        ]);
        if (userRes.data) {
          setStudents(userRes.data.filter((u: User) => u.role === 'STUDENT'));
        }
        if (classRes.data) {
          setClassrooms(classRes.data);
        }
      } catch (err) {
        console.error('Lỗi nạp dữ liệu phân công:', err);
      }
    };
    fetchData();
  }, []);

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleClassroomToggle = (classId: number) => {
    setSelectedClassroomIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await examApi.createExam({
        title,
        description,
        durationMinutes: Number(durationMinutes),
        passScore: Number(passScore),
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
        assignedStudentIds: assignMode === 'SPECIFIC' ? selectedStudentIds : [],
        assignedClassroomIds: assignMode === 'CLASS' ? selectedClassroomIds : [],
      });

      if (res.success && res.data) {
        navigate(`/teacher/exams/${res.data.id}/questions`);
      }
    } catch (err: any) {
      setError(err || 'Tạo đề thi thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/teacher/exams')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Hủy và trở về</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-md p-6 md:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Khởi Tạo Đề Thi Mới</h2>
          <p className="text-sm text-slate-600 mt-1">
            Thiết lập thông số, phân công theo lớp/học sinh và lịch hẹn giờ cho đề thi
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
              1. Thông Tin Cơ Bản
            </h3>
            <Input
              label="Tên Đề Thi / Tiêu Đề Bài Kiểm Tra"
              placeholder="Ví dụ: Đề thi học kỳ I - Môn Tin Học 12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Mô Tả & Hướng Dẫn Làm Bài
              </label>
              <textarea
                rows={3}
                placeholder="Nhập ghi chú hoặc quy định thời gian làm bài..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-md focus:outline-hidden focus:border-blue-800 focus:ring-1 focus:ring-blue-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Thời gian làm bài (Phút)"
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
              />

              <Input
                label="Điểm chuẩn đạt (Thang điểm 10)"
                type="number"
                step={0.5}
                min={0}
                max={10}
                value={passScore}
                onChange={(e) => setPassScore(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Schedule Timing Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <Clock size={16} className="text-blue-700" />
              2. Hẹn Giờ Mở & Đóng Đề Thi
            </h3>
            <p className="text-xs text-slate-500">
              Học sinh chỉ xem và làm bài thi khi tới giờ bắt đầu. Hết giờ đóng đề thi, bài thi sẽ tự động ẩn.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Calendar size={14} /> Thời Gian Bắt Đầu Thi
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-md focus:outline-hidden focus:border-blue-800 text-sm cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Calendar size={14} /> Thời Gian Kết Thúc Thi (Tự động ẩn đề khi hết giờ)
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-md focus:outline-hidden focus:border-blue-800 text-sm cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Student/Class Assignment Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <Users size={16} className="text-blue-700" />
              3. Đối Tượng Được Phân Công Làm Bài
            </h3>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="assignMode"
                  checked={assignMode === 'ALL'}
                  onChange={() => setAssignMode('ALL')}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-800 cursor-pointer"
                />
                <span>Tất cả học sinh</span>
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="assignMode"
                  checked={assignMode === 'CLASS'}
                  onChange={() => setAssignMode('CLASS')}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-800 cursor-pointer"
                />
                <span className="font-bold text-blue-800 flex items-center gap-1">
                  <BookOpen size={14} /> Theo Lớp học
                </span>
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="assignMode"
                  checked={assignMode === 'SPECIFIC'}
                  onChange={() => setAssignMode('SPECIFIC')}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-800 cursor-pointer"
                />
                <span>Chỉ định học sinh cụ thể</span>
              </label>
            </div>

            {/* CLASS Mode */}
            {assignMode === 'CLASS' && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  Chọn Lớp Học Được Giao Bài Thi ({selectedClassroomIds.length}/{classrooms.length} Lớp)
                </span>

                {classrooms.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Bạn chưa tạo lớp học nào. Vào mục "Quản Lý Lớp Học" để thêm lớp.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {classrooms.map((cls) => (
                      <label
                        key={cls.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedClassroomIds.includes(cls.id)}
                            onChange={() => handleClassroomToggle(cls.id)}
                            className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800 cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">{cls.name}</span>
                            <span className="text-xs text-slate-500">Mã: {cls.code}</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                          {cls.studentCount} học sinh
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SPECIFIC Mode */}
            {assignMode === 'SPECIFIC' && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
                <span className="text-xs font-bold text-slate-600 block uppercase">
                  Chọn các học sinh được quyền vào thi ({selectedStudentIds.length}/{students.length} học sinh)
                </span>

                {students.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Chưa có học sinh nào trên hệ thống.</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                            className="w-4 h-4 rounded text-blue-900 focus:ring-blue-800 cursor-pointer"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">{student.fullName}</span>
                            <span className="text-xs text-slate-500">{student.email}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          ID: #{student.id}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate('/teacher/exams')}>
              Hủy bỏ
            </Button>
            <Button type="submit" isLoading={loading} className="gap-2 px-6">
              <Save size={18} />
              <span>Lưu &amp; Chuyển Đến Soạn Câu Hỏi</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
