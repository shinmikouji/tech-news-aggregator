import Parser from "rss-parser";
import type { Article, Source } from "../types";

const DEFAULT_TIMEOUT_MS = 10_000;

interface RssParseOptions {
  url: string;
  source: Source;
  timeoutMs?: number;
}

export async function parseRss({
  url,
  source,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: RssParseOptions): Promise<Article[]> {
  const parser = new Parser({
    timeout: timeoutMs,
  });

  try {
    const feed = await parser.parseURL(url);
    const now = new Date().toISOString();

    return (feed.items ?? []).map((item) => ({
      id: `${source}:${item.link ?? item.guid ?? item.title ?? ""}`,
      title: item.title ?? "(no title)",
      url: item.link ?? "",
      source,
      categories: [],
      author: item.creator ?? item["dc:creator"] ?? undefined,
      publishedAt: item.isoDate ?? item.pubDate ?? undefined,
      fetchedAt: now,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[rss-parser] Failed to fetch ${url}: ${message}`);
    return [];
  }
}
