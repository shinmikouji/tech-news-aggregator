import { getAvailableDates, getDataByDate, getLatestDate } from "./lib/data";
import CategoryFilter from "./components/CategoryFilter";
import DatePicker from "./components/DatePicker";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">今日のテックニュース</h1>
        <DatePicker currentDate={latestDate} availableDates={availableDates} />
      </div>
      <CategoryFilter articles={data.articles} />
    </div>
  );
}
