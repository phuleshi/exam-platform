import React from 'react';
import { Result } from '../../types/Result';
import { Award, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface ResultCardProps {
  result: Result;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
            result.isPassed
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-red-50 text-red-800 border border-red-300'
          }`}>
            {result.isPassed ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {result.isPassed ? 'ĐẠT KẾT QUẢ' : 'CHƯA ĐẠT'}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">{result.examTitle}</h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Calendar size={14} /> Ngày nộp bài: {new Date(result.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-md border border-slate-200 self-start md:self-auto">
          <div className={`p-3 rounded-md ${result.isPassed ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
            <Award size={28} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Tổng điểm</span>
            <span className={`text-3xl font-black ${result.isPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {result.score} <span className="text-xs font-normal text-slate-500">/ 10</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Số câu trả lời đúng</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block">
            {result.correctAnswers} / {result.totalQuestions} câu
          </span>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Tỷ lệ chính xác</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block">
            {result.totalQuestions > 0 ? Math.round((result.correctAnswers / result.totalQuestions) * 100) : 0}%
          </span>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 col-span-2 md:col-span-1">
          <span className="text-xs text-slate-500 font-bold block">Điểm chuẩn yêu cầu</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block">
            {result.passScore} / 10 điểm
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
          Về Trang Chủ
        </Button>
        <Button variant="primary" onClick={() => navigate('/student/exams')}>
          Trở về danh sách bài thi
        </Button>
      </div>
    </div>
  );
};
