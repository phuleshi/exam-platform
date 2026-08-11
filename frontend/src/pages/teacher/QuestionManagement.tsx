import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionApi } from '../../services/questionApi';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { Question } from '../../types/Question';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ArrowLeft, PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';

export const QuestionManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // New question form state
  const [content, setContent] = useState('');
  const [score, setScore] = useState(2.5);
  const [answers, setAnswers] = useState([
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
  ]);
  const [creating, setCreating] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    if (!id) return;
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (answers.some((a) => !a.content.trim())) {
      alert('Vui lòng nhập đầy đủ đáp án!');
      return;
    }
    setCreating(true);

    try {
      await questionApi.createQuestion({
        examId: Number(id),
        content,
        score: Number(score),
        answers,
      });

      setContent('');
      setAnswers([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ]);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Thêm câu hỏi thất bại!');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedDeleteId) return;
    try {
      await questionApi.deleteQuestion(selectedDeleteId);
      setQuestions((prev) => prev.filter((q) => q.id !== selectedDeleteId));
    } catch (err) {
      console.error(err);
      alert('Xóa câu hỏi thất bại!');
    } finally {
      setSelectedDeleteId(null);
    }
  };

  const handleAnswerChange = (idx: number, text: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, content: text } : a))
    );
  };

  const handleCorrectSelect = (idx: number) => {
    setAnswers((prev) =>
      prev.map((a, i) => ({ ...a, isCorrect: i === idx }))
    );
  };

  if (loading) return <Loading text="Đang nạp danh sách câu hỏi..." />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/teacher/exams')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Trở về quản lý đề thi</span>
      </button>

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            QUẢN LÝ NGÂN HÀNG CÂU HỎI
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{exam?.title}</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Tổng số câu hỏi hiện tại: {questions.length} câu</p>
        </div>

        <Button onClick={() => navigate('/teacher/exams')} variant="outline" className="shrink-0">
          Hoàn thành thiết lập
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Create Question Form */}
        <div className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <PlusCircle size={20} className="text-blue-900" />
            <span>Thêm Câu Hỏi Trắc Nghiệm Mới</span>
          </h3>

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Nội Dung Câu Hỏi
              </label>
              <textarea
                rows={3}
                placeholder="Nhập nội dung câu hỏi chi tiết tại đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-md focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 text-sm"
                required
              />
            </div>

            <Input
              label="Thang điểm câu hỏi"
              type="number"
              step={0.5}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
            />

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Phương Án Lựa Chọn (Đánh dấu vào phương án đúng)
              </label>
              {answers.map((ans, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={ans.isCorrect}
                    onChange={() => handleCorrectSelect(idx)}
                    className="w-4 h-4 accent-blue-900 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 w-4">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input
                    type="text"
                    placeholder={`Nội dung đáp án ${String.fromCharCode(65 + idx)}`}
                    value={ans.content}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-800"
                    required
                  />
                </div>
              ))}
            </div>

            <Button type="submit" isLoading={creating} className="w-full mt-2 py-2.5">
              Thêm Câu Hỏi Vào Đề
            </Button>
          </form>
        </div>

        {/* Right Side: List of Created Questions */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Danh Sách Câu Hỏi Đã Tạo ({questions.length})
          </h3>

          {questions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md p-8 text-center text-slate-500 text-sm shadow-xs">
              Bài thi này chưa có câu hỏi nào trong hệ thống.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-md p-5 shadow-xs relative space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-bold text-sm text-slate-900">
                      <span className="text-blue-900 mr-2">Câu {qIdx + 1}:</span>
                      {q.content}
                    </div>
                    <button
                      onClick={() => setSelectedDeleteId(q.id)}
                      className="text-slate-400 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      title="Xóa câu hỏi này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    {q.answers.map((a, aIdx) => (
                      <div
                        key={a.id || aIdx}
                        className={`p-2.5 rounded-md border flex items-center gap-2 ${
                          a.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + aIdx)}.</span>
                        <span className="line-clamp-1">{a.content}</span>
                        {a.isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-700 shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!selectedDeleteId}
        onClose={() => setSelectedDeleteId(null)}
        onConfirm={handleDeleteQuestion}
        title="Xóa Câu Hỏi Này"
        message="Bạn có chắc muốn xóa câu hỏi này khỏi đề thi không?"
        isDanger
      />
    </div>
  );
};
