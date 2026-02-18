"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

const LoginPage: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ログインに失敗しました");
      }

      // ログイン成功時
      router.push("/admin/posts");
      router.refresh(); // 認証状態を反映させるためにリフレッシュ
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期せぬエラーが発生しました",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-sky-500">
          管理画面ログイン
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="id"
              className="block text-sm font-bold text-slate-700"
            >
              ユーザーID
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-300">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                id="id"
                className="w-full rounded-lg border-2 border-slate-200 pl-10 px-3 py-2 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                placeholder="ユーザーIDを入力"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-slate-700"
            >
              パスワード
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-300">
                <FontAwesomeIcon icon={faKey} />
              </div>
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border-2 border-slate-200 pl-10 px-3 py-2 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={twMerge(
              "w-full rounded-full bg-sky-400 py-3 font-bold text-white transition-colors hover:bg-sky-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="mr-2 animate-spin"
                />
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
