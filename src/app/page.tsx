import prisma from '@/lib/prisma'; // 既存のPrismaクライアントを読み込みます

export default async function Home() {
  // データベースからユーザー一覧とそれぞれの欠席記録を取得
  const users = await prisma.user.findMany({
    include: {
      attendances: {
        where: { isDeleted: false } // 取消されていない欠席のみ
      },
    },
    orderBy: { attendanceNo: 'asc' } // 出席番号順に並べる
  });

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">クラス出席状況ボード</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {users.length === 0 ? (
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