import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">ページが見つかりません</h2>
        <p className="text-slate-600 mb-8">
          申し訳ありません。お探しのページは存在しないか、削除された可能性があります。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ダッシュボードに戻る
          </Link>
          <Link
            href="/login"
            className="inline-block bg-slate-400 text-white px-6 py-3 rounded-lg hover:bg-slate-500 transition-colors font-semibold"
          >
            ログインページ
          </Link>
        </div>
      </div>
    </div>
  );
}