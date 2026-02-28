import { Article, CATEGORIES } from "@/app/lib/types";
import SourceBadge from "./SourceBadge";

export default function NewsCard({ article }: { article: Article }) {
  const categoryLabels = article.categories
    .map((c) => CATEGORIES.find((cat) => cat.slug === c)?.label ?? c)
    .filter(Boolean);

  return (
    <article className="group rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400"
          >
            {article.title}
          </a>
          {article.summary && (
            <p className="mt-1 text-sm leading-snug text-zinc-500 dark:text-zinc-400">
              {article.summary}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SourceBadge source={article.source} />
            {categoryLabels.map((label) => (
              <span
                key={label}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
        {article.score != null && <span>{article.score} ポイント</span>}
        {article.comments != null && <span>{article.comments} コメント</span>}
        {article.publishedAt && (
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
          </time>
        )}
      </div>
    </article>
  );
}
