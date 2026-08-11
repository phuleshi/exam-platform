import React, { useEffect, useState } from 'react';
import { examApi } from '../../services/examApi';
import { Exam } from '../../types/Exam';
import { ExamCard } from '../../components/exam/ExamCard';
import { Loading } from '../../components/common/Loading';
import { Search } from 'lucide-react';

export const ExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await examApi.getStudentExams();
        setExams(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loading text="Đang tải danh sách bài thi..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh Sách Bài Thi Khả Dụng</h1>
          <p className="text-sm text-slate-600 mt-1">Lựa chọn bài thi phù hợp để làm bài kiểm tra</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
          />
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-500 text-sm shadow-xs">
          Không tìm thấy bài thi nào phù hợp với từ khóa của bạn.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
};
