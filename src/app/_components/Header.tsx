import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-slate-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          出席管理アプリ
        </Link>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link href="/" className="hover:text-gray-300">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gray-300">
                ログイン
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
