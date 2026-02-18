# Next.js Blog App

Next.js 15 (App Router) と Prisma (SQLite) を使用して構築されたブログアプリケーションです。
記事の閲覧、カテゴリによるフィルタリング、および管理者向けの記事作成・編集・削除機能（CMS）を備えています。

## 機能

- **公開ページ**
  - 記事一覧表示
  - 記事詳細表示
  - カテゴリ別記事一覧
  - Markdown 形式での記事レンダリング

  ![alt text](img/home.png)

- **管理者ページ (`/admin`)**
  - ダッシュボード（記事・カテゴリ管理）
  - 記事の作成・編集・削除
  - カテゴリの作成・編集・削除
  - 画像アップロード機能
  - 認証機能（ログイン/ログアウト）

- **ログイン画面 (`/login`)**
  ![alt text](img/ログイン画面.png)

- **投稿記事管理画面 (`/admin/posts`)**
  ![alt text](img/記事投稿画面.png)

- **カテゴリ編集画面 (`/admin/categories`)**
  ![alt text](img/カテゴリ画面.png)

- **投稿編集画面 (`/admin/posts/[id]`)**
  ![alt text](img/編集画面.png)

## 🛠️ 技術スタック

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** SQLite
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [FontAwesome](https://fontawesome.com/)
- **Markdown:** [Marked](https://github.com/markedjs/marked) + [DOMPurify](https://github.com/cure53/DOMPurify)

## セットアップ手順

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone <repository-url>
cd next-blog-app
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、必要な環境変数を設定してください（必要な場合）。
※ SQLiteを使用しているため、デフォルト設定で動作する場合はスキップ可能です。

### 3. データベースのセットアップ

Prismaを使用してSQLiteデータベースを初期化し、シードデータを投入します。

```bash
# データベースのプッシュ（スキーマの適用）
npx prisma db push

# Prismaクライアントの生成
npx prisma generate

# シードデータの投入（初期データ）
npx prisma db seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## データベース開発フロー

`prisma/schema.prisma` を変更した場合の手順は以下の通りです：

1. 開発サーバー (`npm run dev`) や Prisma Studio を停止する。
2. `dev.db` ファイルを削除する（SQLiteの場合、競合を避けるためリセット推奨）。
3. データベースに変更を反映：
   ```bash
   npx prisma db push
   ```
4. クライアントを再生成：
   ```bash
   npx prisma generate
   ```
5. シードデータを再投入：
   ```bash
   npx prisma db seed
   ```

## 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動します（Turbopack有効）。
- `npm run build`: 本番用にアプリケーションをビルドします。
- `npm start`: ビルドされたアプリケーションを起動します。
- `npm run lint`: ESLintを実行してコードをチェックします。

## ディレクトリ構造

```
src/
├── app/                 # App Router ページコンポーネント
│   ├── (public)/        # 公開用ページ (Home, About, Post詳細など)
│   ├── admin/           # 管理画面用ページ
│   ├── api/             # API Routes
│   ├── login/           # ログインページ
│   └── ...
├── lib/                 # ユーティリティ (Prisma clientなど)
├── generated/           # 生成されたPrisma Client
└── ...
prisma/
├── schema.prisma        # データベーススキーマ定義
└── seed.ts              # 初期データ投入スクリプト
```
