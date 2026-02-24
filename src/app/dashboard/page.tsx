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
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) throw new Error('データの取得に失敗しました');
        
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const handleLogout = async () => {
    // ログアウト処理（Cookieを削除するAPIを呼ぶか、シンプルに/loginへ遷移させて上書きする等の実装が別途必要です）
    document.cookie = 'token=; max-age=0; path=/';
    router.push('/login');
  };

  if (loading) return <div className="p-8 text-center text-slate-500">読み込み中...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {data.user.nickname} さんのダッシュボード
            </h1>
            <p className="text-slate-500 mt-1">出席番号: {data.user.attendanceNo}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
            ログアウト
          </button>
        </div>

        {/* 留年アラート（8単位以上アウト） */}
        {data.totalFailedCredits >= 8 && (
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-md flex items-center gap-4 animate-pulse">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h2 className="text-xl font-bold">重大な警告：留年の危機</h2>
              <p className="mt-1">現在、単位取得不可が確定している科目の合計が {data.totalFailedCredits} 単位に達しています（8単位以上で留年）。</p>
            </div>
          </div>
        )}

        {/* 科目一覧グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.subjects.map((subject) => {
            const isDanger = subject.remainingAbsences <= 3 && !subject.isAttendanceOut;
            const cardClass = subject.isAttendanceOut || subject.isGradeOut
              ? 'bg-slate-200 border-slate-300 opacity-70' // アウト状態
              : isDanger
              ? 'bg-red-50 border-red-300 shadow-sm' // 警告状態
              : 'bg-white border-slate-200 shadow-sm'; // 正常状態

            return (
              <div key={subject.id} className={`p-6 rounded-lg border ${cardClass} transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{subject.name}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {subject.credits}単位
                  </span>
                </div>

                <div className="space-y-4">
                  {/* 欠席状況 */}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">欠席状況</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-bold ${subject.isAttendanceOut ? 'text-red-600 line-through' : 'text-slate-700'}`}>
                        {subject.absenceCount}
                      </span>
                      <span className="text-slate-500 mb-1">/ {subject.limit} 回</span>
                      {!subject.isAttendanceOut && (
                        <span className={`ml-auto font-semibold ${isDanger ? 'text-red-600' : 'text-green-600'}`}>
                          残り {subject.remainingAbsences} 回
                        </span>
                      )}
                      {subject.isAttendanceOut && (
                        <span className="ml-auto font-bold text-red-600">上限超過 (アウト)</span>
                      )}
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* 成績・テスト目標 */}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">テスト成績状況 ({subject.subjectGrades.length}/{subject.totalTests} 回完了)</p>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {subject.subjectGrades.map((score, idx) => (
                        <span key={idx} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                          第{idx + 1}回: {score}点
                        </span>
                      ))}
                    </div>
                    
                    {!subject.isGradeOut ? (
                      subject.requiredScore !== null && subject.requiredScore > 0 ? (
                         <div className="bg-slate-50 p-3 rounded text-sm mt-2">
                           次のテスト目標: <span className="font-bold text-blue-600">{Math.ceil(subject.requiredScore)} 点</span> 以上
                         </div>
                      ) : subject.subjectGrades.length === subject.totalTests ? (
                        <div className="bg-green-50 text-green-700 p-3 rounded text-sm mt-2 font-bold">
                          単位取得圏内クリア！
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-3 rounded text-sm mt-2">
                          すでに合格ラインをクリアしています
                        </div>
                      )
                    ) : (
                      <div className="bg-red-100 text-red-700 p-3 rounded text-sm mt-2 font-bold">
                        点数不足による単位認定不可 (アウト)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}