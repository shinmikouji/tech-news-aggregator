import fs from "node:fs";
import path from "node:path";
import type { Article, Category, DailyData, FetchResult, Source } from "../types";
import { classify } from "../classifier";
import { dedup } from "../utils/dedup";
import { getToday, getDataPath } from "../utils/date-utils";

import { fetchHackerNews } from "./hacker-news";
import { fetchReddit } from "./reddit";
import { fetchHatenaBookmark } from "./hatena-bookmark";
import { fetchZenn } from "./zenn";
import { fetchDevto } from "./devto";
import { fetchLobsters } from "./lobsters";
import { fetchTldr } from "./tldr";
import { fetchAwsWhatsNew } from "./aws-whatsnew";

interface FetcherEntry {
  name: string;
  source: Source;
  fn: () => Promise<FetchResult>;
}

const FETCHERS: FetcherEntry[] = [
  { name: "Hacker News", source: "hacker-news", fn: fetchHackerNews },
  { name: "Reddit", source: "reddit", fn: fetchReddit },
  { name: "はてなブックマーク", source: "hatena-bookmark", fn: fetchHatenaBookmark },
  { name: "Zenn", source: "zenn", fn: fetchZenn },
  { name: "dev.to", source: "devto", fn: fetchDevto },
  { name: "lobste.rs", source: "lobsters", fn: fetchLobsters },
  { name: "TLDR", source: "tldr", fn: fetchTldr },
  { name: "AWS What's New", source: "aws-whatsnew", fn: fetchAwsWhatsNew },
];

async function runFetcher(entry: FetcherEntry): Promise<FetchResult> {
  const start = Date.now();
  try {
    console.log(`[fetch] ${entry.name}: starting...`);
    const result = await entry.fn();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    if (result.error) {
      console.warn(`[fetch] ${entry.name}: completed with error (${elapsed}s) - ${result.error}`);
    } else {
      console.log(`[fetch] ${entry.name}: ${result.articles.length} articles (${elapsed}s)`);
    }
    return result;
  } catch (err) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[fetch] ${entry.name}: FAILED (${elapsed}s) - ${message}`);
    return { source: entry.source, articles: [], error: message };
  }
}

function classifyArticles(articles: Article[]): Article[] {
  return articles.map((article) => ({
    ...article,
    categories: classify(article),
  }));
}

function buildStats(articles: Article[]): DailyData["stats"] {
  const bySource: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const article of articles) {
    bySource[article.source] = (bySource[article.source] || 0) + 1;
    for (const cat of article.categories) {
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }
  }

  return { total: articles.length, bySource, byCategory };
}

async function main() {
  console.log("=== Tech News Aggregator - Daily Fetch ===");
  console.log(`Date: ${getToday()} (JST)`);
  console.log("");

  // Run all fetchers (isolated - one failure doesn't stop others)
  const results = await Promise.all(FETCHERS.map(runFetcher));

  // Collect all articles
  let allArticles: Article[] = [];
  const errors: string[] = [];

  for (const result of results) {
    allArticles.push(...result.articles);
    if (result.error) {
      errors.push(`${result.source}: ${result.error}`);
    }
  }

  console.log("");
  console.log(`[process] Total raw articles: ${allArticles.length}`);

  // Deduplicate
  allArticles = dedup(allArticles);
  console.log(`[process] After dedup: ${allArticles.length}`);

  // Classify
  allArticles = classifyArticles(allArticles);
  console.log(`[process] Classification complete`);

  // Build daily data
  const today = getToday();
  const dailyData: DailyData = {
    date: today,
    fetchedAt: new Date().toISOString(),
    articles: allArticles,
    stats: buildStats(allArticles),
  };

  // Ensure data directory exists
  const dataDir = path.resolve(__dirname, "../../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write JSON file
  const outputPath = getDataPath(today);
  fs.writeFileSync(outputPath, JSON.stringify(dailyData, null, 2), "utf-8");
  console.log(`[output] Written to ${outputPath}`);

  // Print summary
  console.log("");
  console.log("=== Summary ===");
  console.log(`Total articles: ${dailyData.stats.total}`);
  console.log("By source:");
  for (const [source, count] of Object.entries(dailyData.stats.bySource).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${source}: ${count}`);
  }
  console.log("By category:");
  for (const [cat, count] of Object.entries(dailyData.stats.byCategory).sort(
    (a, b) => b[1] - a[1]
  )) {
    console.log(`  ${cat}: ${count}`);
  }

  if (errors.length > 0) {
    console.log("");
    console.log("Errors:");
    for (const err of errors) {
      console.log(`  - ${err}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
