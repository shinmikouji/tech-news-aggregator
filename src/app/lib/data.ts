import fs from "fs";
import path from "path";
import type { Article, Category, DailyData } from "./types";

export type { Article, Category, DailyData };
export { CATEGORIES, SOURCE_LABELS } from "./types";
export type { Source } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export function getAvailableDates(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  const files = fs.readdirSync(DATA_DIR);
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort((a, b) => b.localeCompare(a));
}

export function getLatestDate(): string | null {
  const dates = getAvailableDates();
  return dates.length > 0 ? dates[0] : null;
}

export function getDataByDate(date: string): DailyData | null {
  const filePath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as DailyData;
}

export function filterByCategory(
  articles: Article[],
  category: Category
): Article[] {
  return articles.filter((a) => a.categories.includes(category));
}
