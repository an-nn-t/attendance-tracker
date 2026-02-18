"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import type { Category } from "@/app/_types/Category";
import PostSummary from "@/app/_components/PostSummary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTag } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const url = selectedCategoryId
          ? `/api/posts?categoryId=${selectedCategoryId}`
          : "/api/posts";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // APIレスポンスの形式をPost型に変換
          const mappedPosts: Post[] = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            categories: p.categories.map((c: any) => c.category),
            coverImage: {
              url: p.coverImageURL,
              width: 1000,
              height: 1000,
            },
          }));
          setPosts(mappedPosts);
        }
      } catch (e) {
        console.error("Failed to fetch posts", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [selectedCategoryId]);

  if (isLoading && !posts) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* フィルタリング用のタグ一覧 */}
      <div className="flex flex-wrap gap-2 py-2">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={twMerge(
            "rounded-full px-4 py-1 text-sm font-bold transition-colors",
            selectedCategoryId === null
              ? "bg-sky-400 text-white"
              : "bg-white text-sky-500 border border-sky-200 hover:bg-sky-50"
          )}
        >
          すべて
        </button>
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={twMerge(
              "rounded-full px-4 py-1 text-sm font-bold transition-colors",
              selectedCategoryId === category.id
                ? "bg-sky-400 text-white"
                : "bg-white text-sky-500 border border-sky-200 hover:bg-sky-50"
            )}
          >
            <FontAwesomeIcon icon={faTag} className="mr-1" />
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts?.length === 0 ? (
          <div className="text-slate-400">該当する記事がありません。</div>
        ) : (
          posts?.map((post) => (
            <PostSummary key={post.id} post={post} />
          ))
        )}
      </div>
    </main>
  );
};

export default Page;
