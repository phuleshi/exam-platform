import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resultApi } from '../../services/resultApi';
import { Result } from '../../types/Result';
import { ResultCard } from '../../components/result/ResultCard';
import { ResultTable } from '../../components/result/ResultTable';
import { Loading } from '../../components/common/Loading';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [singleResult, setSingleResult] = useState<Result | null>(null);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await resultApi.getResultById(Number(id));
          setSingleResult(res.data);
        } else {
          const res = await resultApi.getMyResults();
          setAllResults(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loading text="Đang nạp dữ liệu kết quả thi..." />;

  if (id) {
    if (!singleResult) return <div className="text-center py-12 text-slate-500 font-medium">Không tìm thấy dữ liệu kết quả.</div>;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <ResultCard result={singleResult} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lịch Sử & Báo Cáo Kết Quả Thi</h1>
        <p className="text-sm text-slate-600 mt-1">Danh sách tất cả các bài kiểm tra bạn đã hoàn thành trên hệ thống</p>
      </div>

      <ResultTable results={allResults} />
    </div>
  );
};
