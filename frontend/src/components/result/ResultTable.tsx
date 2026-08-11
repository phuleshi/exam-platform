import React from 'react';
import { Result } from '../../types/Result';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultTableProps {
  results: Result[];
  isTeacherView?: boolean;
}

export const ResultTable: React.FC<ResultTableProps> = ({ results, isTeacherView = false }) => {
  const navigate = useNavigate();

  if (results.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-slate-500 text-sm shadow-xs">
        Chưa có kết quả làm bài nào được ghi nhận.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
            <tr>
              {isTeacherView && <th className="px-6 py-3.5">Học Sinh</th>}
              <th className="px-6 py-3.5">Bài Thi</th>
              <th className="px-6 py-3.5 text-center">Điểm Số</th>
              <th className="px-6 py-3.5 text-center">Kết Quả</th>
              <th className="px-6 py-3.5 text-center">Ngày Thi</th>
              <th className="px-6 py-3.5 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                {isTeacherView && (
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {r.studentName || `Học sinh #${r.studentId}`}
                  </td>
                )}
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {r.examTitle}
                </td>
                <td className="px-6 py-4 text-center font-black text-base text-slate-900">
                  {r.score} <span className="text-xs font-normal text-slate-500">/ 10</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                      r.isPassed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-red-50 text-red-800 border border-red-300'
                    }`}
                  >
                    {r.isPassed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {r.isPassed ? 'Đạt' : 'Chưa đạt'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-xs text-slate-600 font-medium">
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/student/results/${r.id}`)}
                    className="p-1.5 rounded text-blue-900 hover:bg-blue-50 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
