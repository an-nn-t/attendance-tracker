"use client";
import Link from "next/link"; // 1. Linkをインポート
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish, faRightToBracket, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type Props = {
  isLoggedIn: boolean;
};

const Header: React.FC<Props> = ({ isLoggedIn }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("ログアウトに失敗しました");
      }
      router.refresh(); // 画面をリフレッシュしてサーバーコンポーネントを再レンダリング
    } catch (error) {
      console.error(error);
      window.alert("ログアウト中にエラーが発生しました");
    }
  };

  return (
    <header>
      <div className="rounded-b-2xl bg-sky-300 py-3 shadow-md">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white",
          )}
        >
          <div>
            {/* 2. Linkコンポーネントで囲む (href="/") */}
            <Link href="/">
              <FontAwesomeIcon icon={faFish} className="mr-1" />
              My blog
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            {/* 3. Linkコンポーネントで囲む (href="/about") */}
            <Link href="/about">About</Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="cursor-pointer text-white hover:text-sky-100 outline-none"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-1" />
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-white hover:text-sky-100">
                <FontAwesomeIcon icon={faRightToBracket} className="mr-1" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
