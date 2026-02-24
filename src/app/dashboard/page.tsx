// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubjectData {
  id: string;
  name: string;
  credits: number;
  absenceCount: number;
  limit: number;
  remainingAbsences: number;
  subjectGrades: number[];
  totalTests: number;
  requiredScore: number | null;
  isAttendanceOut: boolean;
  isGradeOut: boolean;
}

interface DashboardData {
  user: { nickname: string; attendanceNo: number };
  totalFailedCredits: number;
  subjects: SubjectData[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.status === 401) return router.push('/login');
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleAttendance = async (subjectId: string, action: 'add' | 'remove') => {
    if (action === 'remove' && !confirm('最新の欠席記録を取り消しますか？')) return;
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, action }),
    });
    fetchData(); // データ再取得
  };

  const handleGradeSubmit = async (subjectId: string, testNumber: number) => {
    const scoreStr = prompt(`第${testNumber}回のテスト点数を入力してください (0-100)`);
    if (!scoreStr) return;
    const score = parseFloat(scoreStr);
    if (isNaN(score) || score < 0 || score > 100) return alert('正しい数値を入力してください');

    await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectId, type: 'test', testNumber, score }),
    });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-slate-500">読み込み中...</div>;
  if (!data) return null;

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold">{data.user.nickname} さんのダッシュボード</h1>
            <p className="text-slate-500 mt-1">出席番号: {data.user.attendanceNo}</p>
          </div>
          <button onClick={() => { document.cookie = 'token=; max-age=0; path=/'; router.push('/login'); }} className="px-4 py-2 bg-slate-100 rounded-md">
            ログアウト
          </button>
        </div>

        {data.totalFailedCredits >= 8 && (
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-md animate-pulse">
            <h2 className="text-xl font-bold">重大な警告：留年の危機</h2>
            <p>単位取得不可が確定している科目が {data.totalFailedCredits} 単位に達しています（8単位以上で留年）。</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.subjects.map((subject) => {
            const isDanger = subject.remainingAbsences <= 3 && !subject.isAttendanceOut;
            const cardClass = subject.isAttendanceOut || subject.isGradeOut ? 'bg-slate-200 opacity-70' : isDanger ? 'bg-red-50 border-red-300' : 'bg-white';

            return (
              <div key={subject.id} className={`p-6 rounded-lg border shadow-sm ${cardClass}`}>
                <h3 className="text-lg font-bold mb-2">{subject.name} <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded ml-2">{subject.credits}単位</span></h3>
                
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-500">欠席: <strong className="text-xl text-slate-700">{subject.absenceCount}</strong> / {subject.limit} 回</span>
                    <span className={`font-bold ${subject.isAttendanceOut ? 'text-red-600' : isDanger ? 'text-red-600' : 'text-green-600'}`}>
                      {subject.isAttendanceOut ? 'アウト' : `残り ${subject.remainingAbsences} 回`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAttendance(subject.id, 'add')} className="flex-1 bg-red-100 text-red-700 py-1 rounded text-sm hover:bg-red-200">+1 欠席記録</button>
                    <button onClick={() => handleAttendance(subject.id, 'remove')} disabled={subject.absenceCount === 0} className="flex-1 bg-slate-100 text-slate-600 py-1 rounded text-sm hover:bg-slate-200 disabled:opacity-50">-1 取消</button>
                  </div>
                </div>

                <hr className="my-4 border-slate-200" />

                <div>
                  <p className="text-sm text-slate-500 mb-2">テスト ({subject.subjectGrades.length}/{subject.totalTests} 回完了)</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {Array.from({ length: subject.totalTests }).map((_, idx) => (
                      <button key={idx} onClick={() => handleGradeSubmit(subject.id, idx + 1)} className={`text-sm px-3 py-1 rounded border ${subject.subjectGrades[idx] !== undefined ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-dashed hover:bg-slate-100'}`}>
                        第{idx + 1}回: {subject.subjectGrades[idx] !== undefined ? `${subject.subjectGrades[idx]}点` : '未入力'}
                      </button>
                    ))}
                  </div>
                  {!subject.isGradeOut && subject.requiredScore !== null && subject.requiredScore > 0 && (
                     <div className="text-sm">次の目標: <strong className="text-blue-600">{Math.ceil(subject.requiredScore)}点</strong> 以上</div>
                  )}
                  {subject.isGradeOut && <div className="text-sm font-bold text-red-600">点数不足による単位認定不可</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}