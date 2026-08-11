import React, { useEffect, useState } from 'react';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loading } from '../../components/common/Loading';
import { PlusCircle, Edit3, Trash2, HelpCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExamManagement: React.FC = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExams = async () => {
    try {
      const res = await examApi.getTeacherExams();
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    setDeleting(true);
    try {
      await examApi.deleteExam(selectedDeleteId);
      setExams((prev) => prev.filter((e) => e.id !== selectedDeleteId));
    } catch (err) {
      console.error(err);
      alert('Xóa bài thi thất bại!');
    } finally {
      setDeleting(false);
      setSelectedDeleteId(null);
    }
  };

  const togglePublishStatus = async (exam: Exam) => {
    const newStatus = exam.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await examApi.updateExam(exam.id, { status: newStatus });
      setExams((prev) =>
        prev.map((e) => (e.id === exam.id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error(err);
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  if (loading) return <Loading text="Đang nạp danh sách đề thi..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh Sách Quản Lý Đề Thi</h1>
          <p className="text-sm text-slate-600 mt-1">Khởi tạo đề thi, xây dựng bộ câu hỏi và phát hành đề thi</p>
        </div>

        <Button onClick={() => navigate('/teacher/exams/create')} className="gap-2 shrink-0">
          <PlusCircle size={18} />
          <span>Thêm Đề Thi Mới</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Tên Đề Thi / Mô Tả</th>
                <th className="px-6 py-3.5 text-center">Thời Gian Làm Bài</th>
                <th className="px-6 py-3.5 text-center">Tổng Câu Hỏi</th>
                <th className="px-6 py-3.5 text-center">Trạng Thái Phân Phối</th>
                <th className="px-6 py-3.5 text-right">Tác Vụ Quản Lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="font-bold text-slate-900">{exam.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{exam.description || 'Chưa có mô tả thêm'}</div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-semibold text-slate-700">
                    {exam.durationMinutes} phút
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-blue-900">
                    {exam.totalQuestions || 0} câu
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => togglePublishStatus(exam)}
                      className={`px-3 py-1 rounded text-xs font-bold border transition-all cursor-pointer ${
                        exam.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {exam.status === 'PUBLISHED' ? 'Đã Phân Phối (Public)' : 'Bản Nháp (Draft)'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    <button
                      onClick={() => navigate(`/teacher/exams/${exam.id}/questions`)}
                      title="Quản lý bộ câu hỏi"
                      className="p-1.5 rounded text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <HelpCircle size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                      title="Xem báo cáo kết quả"
                      className="p-1.5 rounded text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <Award size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}
                      title="Chỉnh sửa thông tin bài thi"
                      className="p-1.5 rounded text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => setSelectedDeleteId(exam.id)}
                      title="Xóa đề thi"
                      className="p-1.5 rounded text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!selectedDeleteId}
        onClose={() => setSelectedDeleteId(null)}
        onConfirm={handleDelete}
        title="Xác Nhận Xóa Đề Thi"
        message="Hành động này sẽ xóa toàn bộ câu hỏi và dữ liệu liên quan. Bạn có chắc chắn không?"
        confirmText="Xóa vĩnh viễn"
        isDanger
        isLoading={deleting}
      />
    </div>
  );
};
