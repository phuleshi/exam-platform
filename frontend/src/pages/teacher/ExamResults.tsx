import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultApi } from '../../services/resultApi';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { Result } from '../../types/Result';
import { ResultTable } from '../../components/result/ResultTable';
import { Loading } from '../../components/common/Loading';
import { ArrowLeft, Award, Users, CheckCircle, XCircle } from 'lucide-react';

export const ExamResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [examRes, resultsRes] = await Promise.all([
          examApi.getExamById(Number(id)),
          resultApi.getResultsByExam(Number(id)),
        ]);
        setExam(examRes.data);
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loading text="Đang nạp báo cáo thống kê kết quả thi..." />;

  const totalSubmissions = results.length;
  const passedCount = results.filter((r) => r.isPassed).length;
  const failedCount = totalSubmissions - passedCount;
  const avgScore =
    totalSubmissions > 0
      ? (results.reduce((acc, r) => acc + r.score, 0) / totalSubmissions).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/teacher/exams')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Trở về quản lý đề thi</span>
      </button>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Báo Cáo & Thống Kê Điểm Thi</h1>
        <p className="text-sm font-semibold text-blue-900 mt-1">{exam?.title}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-5 flex items-center gap-3 shadow-xs">
          <div className="p-3 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Lượt bài nộp</span>
            <span className="text-xl font-black text-slate-900">{totalSubmissions}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex items-center gap-3 shadow-xs">
          <div className="p-3 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Số lượt Đạt</span>
            <span className="text-xl font-black text-emerald-800">{passedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex items-center gap-3 shadow-xs">
          <div className="p-3 rounded-md bg-red-100 text-red-900 border border-red-200">
            <XCircle size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Số lượt Chưa Đạt</span>
            <span className="text-xl font-black text-red-800">{failedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5 flex items-center gap-3 shadow-xs">
          <div className="p-3 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Điểm trung bình</span>
            <span className="text-xl font-black text-amber-900">{avgScore} / 10</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Danh Sách Bảng Điểm Thí Sinh</h3>
        <ResultTable results={results} isTeacherView />
      </div>
    </div>
  );
};
