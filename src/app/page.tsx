import { getAvailableDates, getDataByDate, getLatestDate } from "./lib/data";
import type { Article, Source } from "./lib/types";
import CategoryFilter from "./components/CategoryFilter";
import DatePicker from "./components/DatePicker";

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

export default function Home() {
  const latestDate = getLatestDate();
  const availableDates = getAvailableDates();

  if (!latestDate) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Tech News Aggregator</h1>
        <p className="mt-4 text-zinc-500">
          まだニュースデータがありません。GitHub Actions
          でデータ取得が完了するまでお待ちください。
        </p>
      </div>
    );
  }

  const data = getDataByDate(latestDate);
  if (!data) return null;

  const sorted = sortJapaneseFirst(data.articles);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">今日のテックニュース</h1>
        <DatePicker currentDate={latestDate} availableDates={availableDates} />
      </div>
      <CategoryFilter articles={sorted} />
    </div>
  );
}
