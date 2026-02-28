import { notFound } from "next/navigation";
import {
  getAvailableDates,
  getDataByDate,
} from "@/app/lib/data";
import CategoryFilter from "@/app/components/CategoryFilter";
import DatePicker from "@/app/components/DatePicker";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">テックニュース アーカイブ</h1>
        <DatePicker currentDate={date} availableDates={availableDates} />
      </div>
      <CategoryFilter articles={data.articles} />
    </div>
  );
}
