import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://qiita.com/popular-items/feed.atom";

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchQiita(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "qiita" as any });

    const articles = items.map((item) => ({
      ...item,
      id: `qiita-${hashId(item.url)}`,
      categories: ["other" as const],
    }));

    return { source: "qiita" as any, articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[qiita] Fetch failed: ${message}`);
    return { source: "qiita" as any, articles: [], error: message };
  }
}
