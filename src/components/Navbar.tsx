'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // ✅ Supabase セッションをクリア
      await supabase.auth.signOut();

      // ✅ localStorage をクリア
      localStorage.clear();
      sessionStorage.clear();

      // ✅ すべての Cookie を削除
      document.cookie.split(';').forEach((c) => {
        const eqPos = c.indexOf('=');
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      });

      // ✅ ブラウザキャッシュをクリア
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }

      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          📚 出席管理システム
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`px-4 py-2 rounded font-semibold transition-all ${
            isLoggingOut
              ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
              : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
          }`}
        >
          {isLoggingOut ? (
            <span className="flex items-center gap-2">
              <span className="inline-block animate-spin">⏳</span>
              ログアウト中...
            </span>
          ) : (
            'ログアウト'
          )}
        </button>
      </div>
    </nav>
  );
}