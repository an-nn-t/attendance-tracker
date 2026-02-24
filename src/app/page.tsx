'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  attendanceNo: number;
  nickname: string;
  attendances: { id: string }[];
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">クラス出席状況ボード</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-gray-500">読み込み中...</p>
          ) : error ? (
            <p className="text-center text-red-500">エラー: {error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">データがありません</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id} className="flex justify-between items-center p-4 border-b last:border-0">
                  <div>
                    <span className="font-semibold text-lg">出席番号: {user.attendanceNo}</span>
                    <span className="ml-4 text-gray-600">({user.nickname})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 mr-2">現在の欠席数:</span>
                    <span className="font-bold text-xl text-red-500">{user.attendances.length} 回</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}