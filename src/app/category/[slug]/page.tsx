import { notFound } from "next/navigation";
import {
  CATEGORIES,
  Category,
  filterByCategory,
  getDataByDate,
  getLatestDate,
} from "@/app/lib/data";
import NewsCard from "@/app/components/NewsCard";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const latestDate = getLatestDate();
  if (!latestDate) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-zinc-500">データがありません</p>
      </div>
    );
  }

  const data = getDataByDate(latestDate);
  if (!data) return null;

  const articles = filterByCategory(data.articles, slug as Category);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">{category.label} のニュース</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {latestDate} &middot; {articles.length} 件
        </p>
      </div>
      <div className="space-y-3">
        {articles.length > 0 ? (
          articles.map((article) => (
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
