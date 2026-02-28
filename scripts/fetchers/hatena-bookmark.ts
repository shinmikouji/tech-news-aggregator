import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://b.hatena.ne.jp/hotentry/it.rss";

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchHatenaBookmark(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "hatena-bookmark" });

    const articles = items.map((item) => ({
      ...item,
      id: `hatena-${hashId(item.url)}`,
      categories: ["other" as const],
    }));

    return { source: "hatena-bookmark", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[hatena-bookmark] Fetch failed: ${message}`);
    return { source: "hatena-bookmark", articles: [], error: message };
  }
}
