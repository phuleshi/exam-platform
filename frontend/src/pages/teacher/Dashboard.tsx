import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { ExamCard } from '../../components/exam/ExamCard';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { PlusCircle, FileSpreadsheet, CheckCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchExams();
  }, []);

  if (loading) return <Loading text="Đang nạp dữ liệu trang giảng viên..." />;

  const publishedExams = exams.filter((e) => e.status === 'PUBLISHED');
  const draftExams = exams.filter((e) => e.status === 'DRAFT');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản Lý &amp; Soạn Đề Thi 👨‍🏫
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kính chào Quý Thầy/Cô <span className="font-bold text-slate-900">{user?.fullName}</span>. Hệ thống quản lý đề thi và giám sát kết quả thi sinh.
          </p>
        </div>

        <Button onClick={() => navigate('/teacher/exams/create')} size="lg" className="gap-2 shrink-0">
          <PlusCircle size={20} />
          <span>Tạo Đề Thi Mới</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Tổng Đề Thi Khởi Tạo</span>
            <span className="text-2xl font-black text-slate-900">{exams.length} bài</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Đề Thi Đã Xuất Bản</span>
            <span className="text-2xl font-black text-slate-900">{publishedExams.length} bài</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            <FileText size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Đang Soạn Thảo (Nháp)</span>
            <span className="text-2xl font-black text-slate-900">{draftExams.length} bài</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Danh Sách Đề Thi Quản Lý</h3>
          <button
            onClick={() => navigate('/teacher/exams')}
            className="text-xs font-bold text-blue-900 hover:underline transition-colors cursor-pointer"
          >
            Quản lý chi tiết &rarr;
          </button>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-500 text-sm shadow-xs">
            Thầy/cô chưa tạo đề thi nào. Nhấn &quot;Tạo Đề Thi Mới&quot; để bắt đầu biên soạn.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isTeacher />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
