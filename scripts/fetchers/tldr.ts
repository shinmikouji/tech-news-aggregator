import { createHash } from "node:crypto";
import type { Article, FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const FEED_URLS = [
  "https://bullrich.dev/tldr-rss/tech.rss",
  "https://bullrich.dev/tldr-rss/ai.rss",
];

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchTldr(): Promise<FetchResult> {
  const seen = new Set<string>();
  const allArticles: Article[] = [];
  const errors: string[] = [];

  for (const feedUrl of FEED_URLS) {
    try {
      const items = await parseRss({ url: feedUrl, source: "tldr" });

      for (const item of items) {
        const id = `tldr-${hashId(item.url)}`;
        if (!seen.has(id)) {
          seen.add(id);
          allArticles.push({
            ...item,
            id,
            categories: ["other"],
          });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[tldr] Failed to fetch ${feedUrl}: ${message}`);
      errors.push(`${feedUrl}: ${message}`);
    }
  }

  return {
    source: "tldr",
    articles: allArticles,
    ...(errors.length > 0 && { error: errors.join("; ") }),
  };
}
