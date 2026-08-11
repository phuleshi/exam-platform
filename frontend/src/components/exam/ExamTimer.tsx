import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({ durationMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300; // less than 5 minutes

  const formatTime = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-md border transition-all duration-200 ${
        isWarning
          ? 'bg-red-50 border-red-300 text-red-700 animate-pulse font-bold'
          : 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
      }`}
    >
      {isWarning ? <AlertCircle size={20} /> : <Clock size={20} />}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider block leading-none">
          Thời gian còn lại
        </span>
        <span className="text-lg font-black tracking-widest font-mono">
          {formatTime(minutes)}:{formatTime(seconds)}
        </span>
      </div>
    </div>
  );
};
