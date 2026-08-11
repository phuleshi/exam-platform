import React from 'react';
import { Question } from '../../types/Question';
import { Bookmark } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  selectedAnswers: Record<number, number>;
  flaggedQuestions: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  selectedAnswers,
  flaggedQuestions,
  onSelectQuestion,
}) => {
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Danh Sách Câu Hỏi</h3>
        <span className="text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
          {answeredCount}/{questions.length} Đã trả lời
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isFlagged = flaggedQuestions[q.id];

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative py-2.5 rounded-md font-bold text-xs border transition-all duration-150 ${
                isCurrent
                  ? 'bg-blue-900 text-white border-blue-950 ring-2 ring-blue-700 ring-offset-1'
                  : isAnswered
                  ? 'bg-blue-100 border-blue-300 text-blue-950 hover:bg-blue-200'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-blue-100 border border-blue-300 rounded" />
          <span>Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-white border border-slate-300 rounded" />
          <span>Chưa trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-blue-900 rounded" />
          <span>Đang làm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-amber-500 rounded-full" />
          <span>Phân vân</span>
        </div>
      </div>
    </div>
  );
};
