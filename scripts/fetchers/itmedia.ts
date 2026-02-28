import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml";

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchItmedia(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "itmedia" as any });

    const articles = items.map((item) => ({
      ...item,
      id: `itmedia-${hashId(item.url)}`,
      categories: ["other" as const],
    }));

    return { source: "itmedia" as any, articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[itmedia] Fetch failed: ${message}`);
    return { source: "itmedia" as any, articles: [], error: message };
  }
}
