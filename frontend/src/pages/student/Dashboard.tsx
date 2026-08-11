import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { examApi } from '../../services/examApi';
import { resultApi } from '../../services/resultApi';
import { Exam } from '../../types/Exam';
import { Result } from '../../types/Result';
import { ExamCard } from '../../components/exam/ExamCard';
import { ResultTable } from '../../components/result/ResultTable';
import { Loading } from '../../components/common/Loading';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, resultsRes] = await Promise.all([
          examApi.getStudentExams(),
          resultApi.getMyResults(),
        ]);
        setExams(examsRes.data || []);
        setResults(resultsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading text="Đang nạp bảng điều khiển học sinh..." />;

  const passedCount = results.filter((r) => r.isPassed).length;

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border border-blue-950 rounded-md p-6 md:p-8 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded inline-block">
            CỔNG HỌC SINH & THÍ SINH
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Xin chào, {user?.fullName} 👋
          </h1>
          <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed max-w-xl">
            Sẵn sàng làm các bài kiểm tra và theo dõi kết quả học tập của bạn trên hệ thống ExamHub.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/exams')}
          className="px-5 py-2.5 rounded-md bg-white text-blue-900 font-bold text-sm shadow-xs hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
        >
          Vào Danh Sách Bài Thi &rarr;
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
            <BookOpen size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Bài thi có sẵn</span>
            <span className="text-2xl font-black text-slate-900">{exams.length} bài</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Số bài thi đã Đạt</span>
            <span className="text-2xl font-black text-slate-900">{passedCount} bài</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-6 flex items-center gap-4 shadow-xs">
          <div className="p-3.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Tổng số lượt đã làm</span>
            <span className="text-2xl font-black text-slate-900">{results.length} lượt</span>
          </div>
        </div>
      </div>

      {/* Available Exams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Bài Thi Mới Nhất</h3>
          <button
            onClick={() => navigate('/student/exams')}
            className="text-xs font-bold text-blue-900 hover:underline transition-colors cursor-pointer"
          >
            Xem tất cả bài thi &rarr;
          </button>
        </div>

        {exams.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-md border border-slate-200 text-slate-500 text-sm shadow-xs">
            Hiện chưa có bài thi nào được xuất bản.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.slice(0, 4).map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900">Lịch Sử Làm Bài Gần Đây</h3>
        <ResultTable results={results.slice(0, 5)} />
      </div>
    </div>
  );
};
