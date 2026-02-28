import { notFound } from "next/navigation";
import {
  getAvailableDates,
  getDataByDate,
} from "@/app/lib/data";
import type { Article, Source } from "@/app/lib/types";
import CategoryFilter from "@/app/components/CategoryFilter";
import DatePicker from "@/app/components/DatePicker";

const JP_SOURCES: Source[] = [
  "hatena-bookmark",
  "zenn",
  "publickey",
  "qiita",
  "itmedia",
];

function sortJapaneseFirst(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const aJp = JP_SOURCES.includes(a.source) ? 0 : 1;
    const bJp = JP_SOURCES.includes(b.source) ? 0 : 1;
    if (aJp !== bJp) return aJp - bJp;
    return (b.score ?? 0) - (a.score ?? 0);
  });
}

export function generateStaticParams() {
  return getAvailableDates().map((date) => ({ date }));
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const data = getDataByDate(date);
  if (!data) notFound();

  const availableDates = getAvailableDates();
  const sorted = sortJapaneseFirst(data.articles);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">テックニュース アーカイブ</h1>
        <DatePicker currentDate={date} availableDates={availableDates} />
      </div>
      <CategoryFilter articles={sorted} />
    </div>
  );
}
