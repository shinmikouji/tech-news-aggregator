"use client";

import { useState } from "react";
import { Article, CATEGORIES, Category } from "@/app/lib/types";
import NewsCard from "./NewsCard";

export default function CategoryFilter({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<Category | "all">("all");

  const counts: Record<string, number> = {};
  for (const a of articles) {
    for (const c of a.categories) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }

  const filtered =
    active === "all"
      ? articles
      : articles.filter((a) => a.categories.includes(active));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            active === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          すべて ({articles.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = counts[cat.slug] || 0;
          if (count === 0) return null;
          return (
            <button
              key={cat.slug}
              onClick={() => setActive(cat.slug)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                active === cat.slug
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        ) : (
          <p className="py-8 text-center text-zinc-500">
            該当する記事がありません
          </p>
        )}
      </div>
    </div>
  );
}
