import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextBlogApp",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout = async (props: Props) => {
  const { children } = props;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isLoggedIn = !!token;

  return (
    <html lang="ja">
      <body
        className={`${mPlusRounded1c.className} bg-sky-50 text-slate-700`}
      >
        <Header isLoggedIn={isLoggedIn} />
        <div className="mx-4 mt-4 max-w-2xl md:mx-auto">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
