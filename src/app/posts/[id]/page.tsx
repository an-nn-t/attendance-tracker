"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTag } from "@fortawesome/free-solid-svg-icons";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import type { Post } from "@/app/_types/Post";
import type { PostApiResponse } from "@/app/_types/PostApiResponse";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期値をtrueに変更（ロード中のチラつき防止）
  const [fetchError, setFetchError] = useState<string | null>(null);

  // URLパラメータからIDを取得
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    // IDがまだ取得できていない場合は処理しない
    if (!id) return;

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const requestUrl = `/api/posts/${id}`;
        console.log(`Fetching: ${requestUrl}`); // デバッグ用ログ

        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        // 404の場合の具体的なエラーハンドリングを追加
        if (response.status === 404) {
          throw new Error(
            "指定された記事が見つかりませんでした (404 Not Found)",
          );
        }

        if (!response.ok) {
          throw new Error(`データの取得に失敗しました (${response.status})`);
        }

        const postApiResponse: PostApiResponse = await response.json();

        setPost({
          id: postApiResponse.id,
          title: postApiResponse.title,
          content: postApiResponse.content,
          coverImage: {
            url: postApiResponse.coverImageURL,
            width: 1000,
            height: 1000,
          },
          createdAt: postApiResponse.createdAt,
          categories: postApiResponse.categories.map((category) => ({
            id: category.category.id,
            name: category.category.name,
          })),
        });
      } catch (e) {
        console.error("Fetch Error:", e); // ブラウザのコンソールに詳細を出す
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  if (fetchError) {
    return <div className="font-bold text-red-500">{fetchError}</div>;
  }

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!post) {
    return <div>記事データがありません。</div>;
  }

  // MarkdownをHTMLに変換し、サニタイズする
  const htmlContent = marked.parse(post.content) as string;
  const safeHTML = DOMPurify.sanitize(htmlContent);

  return (
    <main>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-sky-500">{post.title}</div>
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <div
                key={category.id}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-500 border border-sky-100"
              >
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Image
            src={post.coverImage.url}
            alt="Example Image"
            width={post.coverImage.width}
            height={post.coverImage.height}
            priority
            className="rounded-xl shadow-sm"
          />
        </div>
        <div
          className="markdown-content text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </div>
    </main>
  );
};

export default Page;
