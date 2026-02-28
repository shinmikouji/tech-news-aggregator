import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://www.publickey1.jp/atom.xml";

function hashId(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 12);
}

export async function fetchPublickey(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "publickey" as any });

    const articles = items.map((item) => ({
      ...item,
      id: `publickey-${hashId(item.url)}`,
      categories: ["other" as const],
    }));

    return { source: "publickey" as any, articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[publickey] Fetch failed: ${message}`);
    return { source: "publickey" as any, articles: [], error: message };
  }
}
