"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

type Post = {
  id: string;
  title: string;
  createdAt: string;
};

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
      alert("投稿記事の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post: Post) => {
    if (!confirm(`「${post.title}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "削除に失敗しました");
      }

      alert(data.msg);
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert("削除中にエラーが発生しました。");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!posts) {
    return <div className="text-red-500">記事の読み込みに失敗しました</div>;
  }

  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">投稿記事管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-sky-400 px-4 py-2 text-white hover:bg-sky-500"
        >
          新規作成
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-sky-100 shadow-sm">
        <table className="min-w-full divide-y divide-sky-100 bg-white">
          <thead className="bg-sky-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-sky-400"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-sky-400"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-sky-400"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100 bg-white">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-sky-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {post.title}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="mr-4 text-sky-500 hover:text-sky-700"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} /> 編集
                  </Link>
                  <button
                    onClick={() => handleDelete(post)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <FontAwesomeIcon icon={faTrashCan} /> 削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminPostsPage;
