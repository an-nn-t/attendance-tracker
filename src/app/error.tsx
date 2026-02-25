'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-red-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">エラーが発生しました</h2>
        <p className="text-slate-600 mb-4">
          申し訳ありません。予期しないエラーが発生しました。
        </p>
        <p className="text-sm text-slate-500 mb-8 break-words font-mono">
          {error.message || 'Unknown error'}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => reset()}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            もう一度試す
          </button>
          <Link
            href="/dashboard"
            className="inline-block bg-slate-400 text-white px-6 py-3 rounded-lg hover:bg-slate-500 transition-colors font-semibold"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}