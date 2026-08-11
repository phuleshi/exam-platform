import React from 'react';
import { Exam } from '../../types/Exam';
import { Clock, HelpCircle, Award, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface ExamCardProps {
  exam: Exam;
  isTeacher?: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, isTeacher = false }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (isTeacher) {
      navigate(`/teacher/exams/${exam.id}/questions`);
    } else {
      navigate(`/student/exams/${exam.id}`);
    }
  };

  const hasClasses = exam.assignedClassroomNames && exam.assignedClassroomNames.length > 0;

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-700 rounded-md p-6 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
              exam.status === 'PUBLISHED'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-amber-50 text-amber-800 border border-amber-300'
            }`}>
              {exam.status === 'PUBLISHED' ? 'Đã Xuất Bản' : 'Bản Nháp'}
            </span>

            {hasClasses && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                <BookOpen size={12} />
                {exam.assignedClassroomNames?.join(', ')}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 font-mono">Mã số: #{exam.id}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
          {exam.title}
        </h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {exam.description || 'Chưa có mô tả chi tiết cho bài thi này.'}
        </p>

        {(exam.startTime || exam.endTime) && (
          <div className="mt-3 p-2 rounded bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-0.5 font-medium">
            {exam.startTime && (
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-blue-700 shrink-0" />
                <span>Mở thi: {new Date(exam.startTime).toLocaleString('vi-VN')}</span>
              </div>
            )}
            {exam.endTime && (
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-red-600 shrink-0" />
                <span>Đóng thi: {new Date(exam.endTime).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1"><Clock size={14} /> Thời gian</span>
            <span className="font-bold text-slate-800">{exam.durationMinutes} phút</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1"><HelpCircle size={14} /> Số câu</span>
            <span className="font-bold text-slate-800">{exam.totalQuestions || 0} câu</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 flex items-center gap-1"><Award size={14} /> Điểm đạt</span>
            <span className="font-bold text-slate-800">{exam.passScore}/10</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs text-slate-500 font-medium">Tác giả: {exam.createdByName || 'Giáo viên'}</span>
        <Button onClick={handleAction} size="sm" className="gap-1.5">
          <span>{isTeacher ? 'Quản lý câu hỏi' : 'Vào thi'}</span>
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
};
