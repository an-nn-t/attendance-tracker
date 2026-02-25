'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AttendancePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-colors font-bold"
          >
            ← 戻る
          </button>
          <h1 className="text-3xl font-bold">📋 出席管理</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">科目ごとの出席状況確認</h2>
          <p className="text-slate-600 mb-4">
            各科目の出席状況を詳細に確認できます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 出席情報カード */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">👁️ 表示できる情報</h3>
            <ul className="space-y-2 text-slate-700">
              <li>✓ 科目名と単位数</li>
              <li>✓ 現在の欠席回数</li>
              <li>✓ 欠席上限（総授業回数の1/3）</li>
              <li>✓ 欠席余裕回数</li>
              <li>✓ 出席率（%）</li>
              <li>✓ 欠席アウト判定</li>
            </ul>
          </div>

          {/* 警告表示 */}
          <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ 警告表示</h3>
            <div className="space-y-3 text-red-800">
              <p>
                <span className="font-bold">欠席余裕回数が3回以下：</span> 背景が赤くハイライト表示
              </p>
              <p>
                <span className="font-bold">欠席アウト確定：</span> 科目がグレー表示され、修得不可と表示
              </p>
              <p>
                <span className="font-bold">8単位以上脱落：</span> 画面上部に留年警告が表示
              </p>
            </div>
          </div>
        </div>

        {/* 工夫点 */}
        <div className="mt-8 bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">💡 このアプリの工夫点</h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              <span className="font-bold">複雑な計算ロジック：</span>
              科目ごとに異なる単位数、学修単位の有無、休講・補講を考慮し、「総コマ数の1/3」という欠席上限を正確に算出しています。
            </li>
            <li>
              <span className="font-bold">視覚的警告：</span>
              欠席が迫った科目は色でハイライトされ、クラスメイト同士のサポートを促します。
            </li>
          </ul>
        </div>

        {/* 機能実装状況 */}
        <div className="mt-8 bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">📝 このページについて</h3>
          <p className="text-yellow-800">
            実装中のページです。データベースから科目情報を取得し、科目ごとの出席状況を表示するようにアップデート予定です。
          </p>
        </div>
      </div>
    </div>
  );
}
