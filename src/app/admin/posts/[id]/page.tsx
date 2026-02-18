"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

// カテゴリをフェッチしたときのレスポンスのデータ型
type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

// 投稿記事を取得したときのレスポンスのデータ型
type PostApiResponse = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  createdAt: string;
  updatedAt: string;
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
};

// 投稿記事のカテゴリ選択用のデータ型
type SelectableCategory = {
  id: string;
  name: string;
  isSelect: boolean;
};

// 投稿記事の編集ページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCoverImageURL, setNewCoverImageURL] = useState("");

  const router = useRouter();
  const { id } = useParams() as { id: string };

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [checkableCategories, setCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    const fetchData = async () => {
      // IDが取得できていない場合は何もしない
      if (!id) {
        console.log("ID is undefined or empty");
        return;
      }
      console.log(`[Admin] Fetching post data for id: ${id}`);

      try {
        setIsLoading(true);

        // カテゴリ一覧と投稿詳細を並列で取得
        const [categoriesRes, postRes] = await Promise.all([
          fetch("/api/categories", {
            method: "GET",
            cache: "no-store",
          }),
          fetch(`/api/posts/${id}`, {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error(
            `カテゴリ一覧の取得に失敗しました: ${categoriesRes.statusText}`,
          );
        }
        if (!postRes.ok) {
          throw new Error(
            `投稿記事の取得に失敗しました: ${postRes.statusText}`,
          );
        }

        const categoriesData =
          (await categoriesRes.json()) as CategoryApiResponse[];
        const postData = (await postRes.json()) as PostApiResponse;

        // カテゴリの選択状態を構築
        const initialCategories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          isSelect: postData.categories.some((c) => c.category.id === cat.id),
        }));
        setCheckableCategories(initialCategories);

        // その他のフィールドをセット
        setNewTitle(postData.title);
        setNewContent(postData.content);
        setNewCoverImageURL(postData.coverImageURL);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : `予期せぬエラーが発生しました ${error}`;
        console.error(errorMsg);
        setFetchErrorMsg(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // チェックボックスの状態 (State) を更新する関数
  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelect: !category.isSelect }
          : category,
      ),
    );
  };

  const updateNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const updateNewContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewContent(e.target.value);
  };

  const updateNewCoverImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCoverImageURL(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("アップロードに失敗しました");
      const data = await res.json();
      setNewCoverImageURL(data.url);
    } catch (error) {
      console.error(error);
      window.alert("画像のアップロードに失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームの送信処理 (更新)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const requestBody = {
        title: newTitle,
        content: newContent,
        coverImageURL: newCoverImageURL,
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelect).map((c) => c.id)
          : [],
      };
      const requestUrl = `/api/admin/posts/${id}`;
      console.log(`${requestUrl} => ${JSON.stringify(requestBody, null, 2)}`);

      const res = await fetch(requestUrl, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const postResponse = await res.json();
      setIsSubmitting(false);
      router.push(`/posts/${postResponse.id}`); // 投稿記事の詳細ページに移動
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿記事の更新に失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!confirm("この記事を削除してもよろしいですか？")) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestUrl = `/api/admin/posts/${id}`;
      const res = await fetch(requestUrl, {
        method: "DELETE",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      setIsSubmitting(false);
      router.push("/admin/posts"); // 管理画面の投稿一覧ページに移動
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿記事の削除に失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchErrorMsg) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  if (!checkableCategories) {
    return <div className="text-red-500">データの読み込みに失敗しました</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold text-slate-700">
        投稿記事の編集
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-lg">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-2 animate-spin text-sky-400"
            />
            <div className="flex items-center text-slate-500">処理中...</div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={twMerge("space-y-4", isSubmitting && "opacity-50")}
      >
        <div className="space-y-1">
          <label htmlFor="title" className="block font-bold text-slate-700">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full rounded-lg border-2 border-slate-200 px-2 py-1 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
            value={newTitle}
            onChange={updateNewTitle}
            placeholder="タイトルを記入してください"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="content" className="block font-bold text-slate-700">
            本文
          </label>
          <textarea
            id="content"
            name="content"
            className="h-48 w-full rounded-lg border-2 border-slate-200 px-2 py-1 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
            value={newContent}
            onChange={updateNewContent}
            placeholder="本文を記入してください"
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="coverImageURL"
            className="block font-bold text-slate-700"
          >
            カバーイメージ
          </label>
          <div className="flex flex-col gap-2">
            {newCoverImageURL && (
              <div className="relative aspect-video w-48 overflow-hidden rounded-lg border border-sky-100 shadow-sm">
                <img
                  src={newCoverImageURL}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100"
            />
            <div className="text-xs text-slate-400">または URL を入力:</div>
            <input
              type="text"
              id="coverImageURL"
              name="coverImageURL"
              className="w-full rounded-lg border-2 border-slate-200 px-2 py-1 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
              value={newCoverImageURL}
              onChange={updateNewCoverImageURL}
              placeholder="カバーイメージのURLを記入してください"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-slate-700">タグ</div>
          <div className="flex flex-wrap gap-x-3.5">
            {checkableCategories.length > 0 ? (
              checkableCategories.map((c) => (
                <label key={c.id} className="flex space-x-1">
                  <input
                    id={c.id}
                    type="checkbox"
                    checked={c.isSelect}
                    className="mt-0.5 cursor-pointer accent-sky-400"
                    onChange={() => switchCategoryState(c.id)}
                  />
                  <span className="cursor-pointer text-slate-600">
                    {c.name}
                  </span>
                </label>
              ))
            ) : (
              <div className="text-slate-400">
                選択可能なカテゴリが存在しません。
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className={twMerge(
              "rounded-full bg-rose-400 px-5 py-2 font-bold text-white transition-colors hover:bg-rose-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
            削除
          </button>
          <button
            type="submit"
            className={twMerge(
              "rounded-full bg-sky-400 px-8 py-2 font-bold text-white transition-colors hover:bg-sky-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            disabled={isSubmitting}
          >
            記事を更新
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
