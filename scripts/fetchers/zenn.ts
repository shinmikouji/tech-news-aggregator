import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://zenn.dev/feed";

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchZenn(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "zenn" });

    const articles = items.map((item) => ({
      ...item,
      id: `zenn-${hashId(item.url)}`,
      categories: ["other" as const],
    }));

    return { source: "zenn", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[zenn] Fetch failed: ${message}`);
    return { source: "zenn", articles: [], error: message };
  }
}
