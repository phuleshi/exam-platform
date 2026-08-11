import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../../services/examApi';
import { questionApi } from '../../services/questionApi';
import { resultApi } from '../../services/resultApi';
import { Exam } from '../../types/Exam';
import { Question } from '../../types/Question';
import { useExam } from '../../hooks/useExam';
import { QuestionCard } from '../../components/exam/QuestionCard';
import { QuestionNavigator } from '../../components/exam/QuestionNavigator';
import { ExamTimer } from '../../components/exam/ExamTimer';
import { SubmitExamDialog } from '../../components/exam/SubmitExamDialog';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

export const ExamTaking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { selectedAnswers, flaggedQuestions, selectAnswer, toggleFlag, getFormattedAnswers } = useExam(
    exam?.durationMinutes || 45
  );

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [examRes, questionsRes] = await Promise.all([
          examApi.getExamById(Number(id)),
          questionApi.getQuestionsByExamId(Number(id)),
        ]);
        setExam(examRes.data);
        setQuestions(questionsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!exam || submitting) return;
    setSubmitting(true);
    try {
      const res = await resultApi.submitExam({
        examId: exam.id,
        answers: getFormattedAnswers(),
      });
      if (res.success && res.data) {
        setShowSubmitModal(false);
        navigate(`/student/results/${res.data.id}`, { replace: true });
      } else {
        alert(res.message || 'Nộp bài thi thất bại!');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Nộp bài thi thất bại! Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Đang nạp dữ liệu đề thi..." fullScreen />;
  if (!exam || questions.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-md shadow-xs">
        <h3 className="text-lg font-bold text-slate-800">Bài thi này hiện chưa có câu hỏi nào.</h3>
        <Button onClick={() => navigate('/student/exams')} className="mt-4">
          Trở về danh sách bài thi
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Top Bar with Timer */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-20 z-30 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{exam.title}</h2>
          <span className="text-xs text-slate-500 font-medium">Tổng số câu hỏi: {questions.length} câu</span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">
          <ExamTimer durationMinutes={exam.durationMinutes} onTimeUp={handleSubmit} />
          <Button onClick={() => setShowSubmitModal(true)} variant="primary" className="gap-2 px-6">
            <Send size={16} />
            <span>Nộp Bài Thi</span>
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Question Display */}
        <div className="lg:col-span-2 space-y-4">
          <QuestionCard
            question={currentQuestion}
            index={currentIndex}
            selectedAnswerId={selectedAnswers[currentQuestion.id]}
            isFlagged={flaggedQuestions[currentQuestion.id]}
            onSelectAnswer={(ansId) => selectAnswer(currentQuestion.id, ansId)}
            onToggleFlag={() => toggleFlag(currentQuestion.id)}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="gap-1.5"
            >
              <ChevronLeft size={18} />
              <span>Câu phía trước</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="gap-1.5"
            >
              <span>Câu kế tiếp</span>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Right Side: Question Navigator */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            selectedAnswers={selectedAnswers}
            flaggedQuestions={flaggedQuestions}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>
      </div>

      <SubmitExamDialog
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmit}
        totalQuestions={questions.length}
        answeredCount={Object.keys(selectedAnswers).length}
        isLoading={submitting}
      />
    </div>
  );
};
