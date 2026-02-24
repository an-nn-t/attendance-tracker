// src/app/admin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 科目追加用ステート
  const [subjectForm, setSubjectForm] = useState({
    name: '', credits: 2, weekday: 1, period: 1, isHalfCourse: false, testWeight: 70, reportWeight: 30, totalTests: 2
  });

  const handleLogout = () => {
    document.cookie = 'token=; max-age=0; path=/';
    router.push('/login');
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // APIルートは src/app/api/admin/subjects/route.ts として作成を想定
    await fetch('/api/admin/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subjectForm),
    });
    alert('科目を追加しました');
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-slate-200 rounded">ログアウト</button>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">新しい科目を登録</h2>
        <form onSubmit={handleAddSubject} className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="科目名" required className="border p-2 rounded col-span-2" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
          <input type="number" placeholder="単位数" required className="border p-2 rounded" value={subjectForm.credits} onChange={e => setSubjectForm({...subjectForm, credits: Number(e.target.value)})} />
          <label className="flex items-center gap-2 border p-2 rounded cursor-pointer">
            <input type="checkbox" checked={subjectForm.isHalfCourse} onChange={e => setSubjectForm({...subjectForm, isHalfCourse: e.target.checked})} />
            学修単位（必要授業数が半分）
          </label>
          <input type="number" placeholder="テスト割合(%)" required className="border p-2 rounded" value={subjectForm.testWeight} onChange={e => setSubjectForm({...subjectForm, testWeight: Number(e.target.value)})} />
          <input type="number" placeholder="平常点割合(%)" required className="border p-2 rounded" value={subjectForm.reportWeight} onChange={e => setSubjectForm({...subjectForm, reportWeight: Number(e.target.value)})} />
          <input type="number" placeholder="年間テスト回数" required className="border p-2 rounded" value={subjectForm.totalTests} onChange={e => setSubjectForm({...subjectForm, totalTests: Number(e.target.value)})} />
          <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 text-white p-2 rounded">登録する</button>
        </form>
      </div>
      
      {/* ユーザー登録フォームなども同様の構成で追加できます */}
      <div className="bg-slate-100 p-6 rounded text-center text-slate-500">
        ※ ユーザー（生徒）の登録やスケジュールの調整（休講・補講）もこの画面に拡張可能です。
      </div>
    </div>
  );
}