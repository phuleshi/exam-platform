import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { ExamInfo } from '../../components/exam/ExamInfo';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Play, ArrowLeft } from 'lucide-react';

export const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchExam = async () => {
      try {
        const res = await examApi.getExamById(Number(id));
        setExam(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  if (loading) return <Loading text="Đang tải thông tin chi tiết bài thi..." />;
  if (!exam) return <div className="text-center py-12 text-slate-500 font-medium">Không tìm thấy thông tin bài thi.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/student/exams')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Trở về danh sách bài thi</span>
      </button>

      <ExamInfo exam={exam} />

      <div className="flex justify-end gap-4 pt-2">
        <Button size="lg" onClick={() => navigate(`/student/exams/${exam.id}/taking`)} className="gap-2 px-8">
          <Play size={20} className="fill-current" />
          <span>Bắt Đầu Làm Bài Thi</span>
        </Button>
      </div>
    </div>
  );
};
