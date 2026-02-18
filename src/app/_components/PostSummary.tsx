"use client";
import type { Post } from "@/app/_types/Post";
import Link from "next/link";
import { marked } from "marked";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

type Props = {
  post: Post;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  const htmlContent = marked.parse(post.content) as string;

  return (
    <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.id}`}>
        <div className="mb-2 text-lg font-bold text-sky-500">{post.title}</div>
        <div
          className="line-clamp-3 text-slate-600 markdown-content summary mb-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </Link>
      <div className="flex flex-wrap gap-2">
        {post.categories.map((category) => (
          <div
            key={category.id}
            className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-500 border border-sky-100"
          >
            <FontAwesomeIcon icon={faTag} className="mr-1" />
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostSummary;
