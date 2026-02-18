"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 型定義
type Subject = {
  id: string;
  name: string;
  units: number;
  baseTotalClasses: number;
  cancelledClasses: number;
  makeupClasses: number;
  dailyWeight: number;
  testWeight: number;
  passScore: number;
};

type UserStatus = {
  user: { id: string; name: string; studentNumber: string };
  subjects: {
    subjectId: string;
    absences: number; // 欠席数
    remaining: number; // あと休める回数
    isDanger: boolean; // あと3回以内
    isCritical: boolean; // あと0回以下（留年確定）
    currentScore: number | null; // 現在のテスト点（平均など）
    neededScore: number | null; // 次のテストで必要な点
  }[];
  totalCreditsLost: number; // 落単数
};

export default function HomePage() {
  const [data, setData] = useState<UserStatus[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    checkLogin();
  }, []);

  const checkLogin = async () => {
    // 簡易的にクッキー有無を確認するAPIがあれば叩くが、
    // ここではlocalStorageやAPIレスポンスから判断する想定
    // 今回は画面ロード時に /api/me のようなエンドポイントを作るか、
    // サーバーコンポーネントで取得するのが正道ですが、SPA的に実装します。
  };

  const fetchData = async () => {
    const res = await fetch("/api/dashboard");
    if (res.ok) {
      const json = await res.json();
      setData(json.users);
      setSubjects(json.subjects);
      setCurrentUser(json.currentUser);
    }
  };

  const handleAbsence = async (subjectId: string) => {
    if (!currentUser) return router.push("/login");
    if (!confirm("欠席を記録しますか？（取り消せません）")) return;

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId }),
    });
    if (res.ok) {
      alert("記録しました");
      fetchData(); // リロード
    } else {
      alert("記録に失敗しました");
    }
  };

  // 自分のデータを先頭に、それ以外を「危険度順」にソート
  const sortedData = [...data].sort((a, b) => {
    // 1. 自分を最優先
    if (currentUser && a.user.id === currentUser.id) return -1;
    if (currentUser && b.user.id === currentUser.id) return 1;

    // 2. 残り回数が少ない科目を持っている人を優先（簡易ロジック：最小のremainingを比較）
    const minRemA = Math.min(...a.subjects.map((s) => s.remaining));
    const minRemB = Math.min(...b.subjects.map((s) => s.remaining));
    return minRemA - minRemB;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 flex items-center justify-between rounded bg-white p-4 shadow">
        <h1 className="text-xl font-bold text-blue-600">
          出席・単位管理ボード
        </h1>
        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="font-bold">{currentUser.name}</span>
            {currentUser.role === "ADMIN" && (
              <a
                href="/admin"
                className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
              >
                管理者
              </a>
            )}
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                location.reload();
              }}
              className="text-sm text-red-500"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <a href="/login" className="rounded bg-blue-500 px-4 py-2 text-white">
            ログイン
          </a>
        )}
      </header>

      <div className="overflow-x-auto">
        <table className="w-full overflow-hidden rounded bg-white shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-32 p-3 text-left">名前/ID</th>
              {subjects.map((s) => (
                <th
                  key={s.id}
                  className="min-w-[120px] border-l p-3 text-center"
                >
                  <div className="text-sm">{s.name}</div>
                  <div className="text-xs text-gray-400">
                    全
                    {s.baseTotalClasses - s.cancelledClasses + s.makeupClasses}
                    回
                  </div>
                </th>
              ))}
              <th className="w-24 p-3 text-center text-xs">落単予測</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((d) => {
              const isMe = currentUser && d.user.id === currentUser.id;
              return (
                <tr
                  key={d.user.id}
                  className={`border-b ${isMe ? "border-2 border-blue-200 bg-blue-50" : ""}`}
                >
                  <td className="p-3 font-medium">
                    {d.user.name}
                    <div className="text-xs text-gray-400">
                      {d.user.studentNumber}
                    </div>
                  </td>
                  {subjects.map((sub) => {
                    const status = d.subjects.find(
                      (s) => s.subjectId === sub.id,
                    );
                    if (!status)
                      return <td key={sub.id} className="border-l"></td>;

                    // 表示ロジック
                    const isDanger = status.remaining <= 3;
                    const isSuperDanger = status.remaining <= 2;

                    return (
                      <td
                        key={sub.id}
                        className="relative border-l p-2 text-center"
                      >
                        <div
                          className={`text-lg font-bold ${status.remaining < 0 ? "text-gray-400" : isDanger ? "text-red-600" : "text-green-600"}`}
                        >
                          あと{status.remaining}回
                        </div>
                        <div className="text-xs text-gray-500">
                          (欠席: {status.absences})
                        </div>

                        {/* ログイン中かつ自分の行なら登録ボタン表示 */}
                        {isMe && status.remaining >= 0 && (
                          <button
                            onClick={() => handleAbsence(sub.id)}
                            className="mt-1 rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200"
                          >
                            欠席する
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center font-bold text-red-500">
                    {d.totalCreditsLost > 0 ? `${d.totalCreditsLost}単位` : "-"}
                    {d.totalCreditsLost >= 8 && (
                      <div className="rounded bg-red-600 px-1 text-xs text-white">
                        留年
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-xs text-gray-500">
        <p>※ 「あと何回」は、総授業数の1/3ルールに基づいています。</p>
        <p>※ 赤字は残り3回以下、リスト上位は残り2回以下の生徒です。</p>
      </div>
    </div>
  );
}
