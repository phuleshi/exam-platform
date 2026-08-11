import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SubmitExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
  isLoading?: boolean;
}

export const SubmitExamDialog: React.FC<SubmitExamDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  isLoading = false,
}) => {
  const isComplete = answeredCount === totalQuestions;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div
          className={`p-3 rounded-md border ${
            isComplete
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          {isComplete ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
        </div>

        <div>
          <h4 className="text-lg font-bold text-slate-900">Xác Nhận Nộp Bài Thi</h4>
          <p className="mt-1 text-sm text-slate-600">
            {isComplete
              ? 'Bạn đã hoàn thành tất cả các câu hỏi trong đề thi.'
              : `Bạn vẫn còn ${unansweredCount} câu hỏi chưa trả lời.`}
          </p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 grid grid-cols-2 text-center text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Số câu đã làm</span>
            <span className="text-base font-bold text-blue-900">{answeredCount} câu</span>
          </div>
          <div className="border-l border-slate-200">
            <span className="text-slate-500 font-medium block">Tổng số câu</span>
            <span className="text-base font-bold text-slate-900">{totalQuestions} câu</span>
          </div>
        </div>

        {unansweredCount > 0 && (
          <p className="text-xs font-semibold text-amber-800 bg-amber-50 p-2.5 rounded-md border border-amber-200 w-full">
            ⚠️ Lưu ý: Các câu chưa làm sẽ tính 0 điểm!
          </p>
        )}

        <div className="flex items-center gap-3 w-full mt-2">
          <Button variant="outline" onClick={onClose} className="w-1/2">
            Quay lại làm tiếp
          </Button>
          <Button onClick={onConfirm} isLoading={isLoading} className="w-1/2">
            Xác nhận nộp bài
          </Button>
        </div>
      </div>
    </Modal>
  );
};
