'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function GradesPage() {
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
          <h1 className="text-3xl font-bold">📊 成績確認</h1>
        </div>

        {/* 成績逆算機能の説明 */}
        <div className="bg-green-50 border-l-4 border-green-600 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">🎯 成績逆算機能</h2>
          <div className="space-y-4 text-green-800">
            <p>
              <span className="font-bold">機能説明：</span>
            </p>
            <p>
              現在のテスト点数と平常点（自己評価）を入力すると、総合評価で60点（合格ライン）をクリアするために、次回のテストで何点必要かを自動計算して提示します。
            </p>
            <p>
              <span className="font-bold">使用例：</span>
            </p>
            <div className="bg-white bg-opacity-50 p-4 rounded mt-2 border border-green-200">
              <p className="text-sm">
                数学1で、テスト割合70%・平常点30%の場合：<br/>
                現在のテスト平均が50点、平常点が80点だとすると<br/>
                → 次のテストで「78点以上」必要と計算されます
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* テスト成績管理 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">📈 テスト成績管理</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <div>
                  <span className="font-bold">科目ごとのテスト点数を登録</span><br/>
                  <span className="text-sm">1回目～3回目のテスト点数を個別に入力できます</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <div>
                  <span className="font-bold">成績の推移を追跡</span><br/>
                  <span className="text-sm">テストのたびに目標点数が自動更新されます</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <div>
                  <span className="font-bold">必要な目標点数を可視化</span><br/>
                  <span className="text-sm">合格にあと何点必要かが一目瞭然</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 成績評価 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">📊 成績評価システム</h3>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-slate-800">評価基準</p>
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  <p>60点以上：合格 ✓</p>
                  <p>60点未満：不合格 ✗</p>
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-800">計算方法</p>
                <div className="mt-2 p-3 bg-slate-50 rounded text-sm text-slate-700">
                  <p>総合評価 = テスト点数 × (テスト割合/100) + 平常点 × (平常点割合/100)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 単位取得戦略 */}
        <div className="mt-8 bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">💡 単位取得戦略</h3>
          <div className="space-y-3 text-blue-800">
            <p>
              <span className="font-bold">Step 1：</span> 各科目のテスト点数・平常点を入力
            </p>
            <p>
              <span className="font-bold">Step 2：</span> システムが必要な目標点数を自動計算
            </p>
            <p>
              <span className="font-bold">Step 3：</span> 次のテストに向けて勉強計画を立てる
            </p>
            <p>
              <span className="font-bold">Step 4：</span> テスト成績を更新して進度確認
            </p>
          </div>
        </div>

        {/* 留年アラート */}
        <div className="mt-8 bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-red-900 mb-4">⚠️ 留年判定</h3>
          <div className="text-red-800 space-y-3">
            <p>
              <span className="font-bold">注意：</span> 落単确定の科目が合計「8単位」以上になると、留年の危機です。
            </p>
            <p className="text-sm">
              このアプリでは、危険な状況を早期に発見できる仕組みを備えています。
            </p>
          </div>
        </div>

        {/* 機能実装状況 */}
        <div className="mt-8 bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">📝 このページについて</h3>
          <p className="text-yellow-800">
            実装中のページです。テスト成績入力フォーム、成績逆算エンジン、グラフ表示などをアップデート予定です。
          </p>
        </div>
      </div>
    </div>
  );
}
