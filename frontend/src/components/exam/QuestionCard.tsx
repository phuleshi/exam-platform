import React from 'react';
import { Question } from '../../types/Question';
import { Bookmark } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswerId?: number;
  isFlagged?: boolean;
  onSelectAnswer: (answerId: number) => void;
  onToggleFlag: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedAnswerId,
  isFlagged = false,
  onSelectAnswer,
  onToggleFlag,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 shadow-xs relative">
      <div className="flex items-start justify-between gap-4 mb-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-md bg-blue-900 flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Câu hỏi số {index + 1}</h4>
            <span className="text-xs text-slate-500 font-medium">({question.score} điểm)</span>
          </div>
        </div>

        <button
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border transition-all ${
            isFlagged
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Bookmark size={14} className={isFlagged ? 'fill-amber-600 text-amber-600' : ''} />
          <span>{isFlagged ? 'Đã Đánh Dấu' : 'Đánh Dấu Phân Vân'}</span>
        </button>
      </div>

      <div className="text-base font-semibold text-slate-900 leading-relaxed my-4">
        {question.content}
      </div>

      <div className="space-y-3 mt-6">
        {question.answers.map((answer, idx) => {
          const isSelected = selectedAnswerId === answer.id;
          const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D...

          return (
            <label
              key={answer.id || idx}
              onClick={() => answer.id && onSelectAnswer(answer.id)}
              className={`flex items-center gap-4 p-3.5 rounded-md border cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-blue-50 border-2 border-blue-800 text-blue-950 font-medium shadow-xs'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-900 border-blue-950 text-white'
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                {optionLabel}
              </div>
              <span className="text-sm leading-relaxed">{answer.content}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
