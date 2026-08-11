import React from 'react';
import { Exam } from '../../types/Exam';
import { Clock, HelpCircle, Award, UserCheck, ShieldCheck } from 'lucide-react';

interface ExamInfoProps {
  exam: Exam;
}

export const ExamInfo: React.FC<ExamInfoProps> = ({ exam }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 md:p-8 space-y-6 shadow-xs">
      <div>
        <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold rounded uppercase tracking-wider">
          Thông Tin Chi Tiết Bài Thi
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-3">{exam.title}</h2>
        <p className="text-slate-600 mt-2 leading-relaxed">{exam.description || 'Chưa có mô tả.'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-blue-100 text-blue-900">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Thời gian làm bài</p>
            <p className="text-base font-bold text-slate-900">{exam.durationMinutes} phút</p>
          </div>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-blue-100 text-blue-900">
            <HelpCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng số câu hỏi</p>
            <p className="text-base font-bold text-slate-900">{exam.totalQuestions || 0} câu</p>
          </div>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-amber-100 text-amber-900">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Điểm đạt tối thiểu</p>
            <p className="text-base font-bold text-slate-900">{exam.passScore} / 10</p>
          </div>
        </div>

        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-emerald-100 text-emerald-900">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Người tạo bài thi</p>
            <p className="text-base font-bold text-slate-900">{exam.createdByName || 'Giáo viên'}</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck size={20} className="shrink-0 text-amber-700 mt-0.5" />
        <div>
          <h5 className="font-bold">Lưu ý quy chế làm bài thi:</h5>
          <ul className="list-disc list-inside mt-1 space-y-1 text-amber-800">
            <li>Đảm bảo kết nối mạng internet ổn định trong suốt quá trình làm bài.</li>
            <li>Hệ thống tự động nộp bài khi hết giờ quy định.</li>
            <li>Thí sinh kiểm tra kỹ lưỡng các câu trả lời trước khi bấm Nộp bài.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
