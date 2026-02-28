import { createHash } from "node:crypto";
import type { FetchResult } from "../types";
import { parseRss } from "../utils/rss-parser";

const RSS_URL = "https://aws.amazon.com/about-aws/whats-new/recent/feed/";

function hashId(value: string): string {
  return createHash("md5").update(value).digest("hex").slice(0, 12);
}

export async function fetchAwsWhatsNew(): Promise<FetchResult> {
  try {
    const items = await parseRss({ url: RSS_URL, source: "aws-whatsnew" });

    const articles = items.map((item) => ({
      ...item,
      id: `aws-${hashId(item.url || item.id)}`,
      categories: ["aws" as const],
    }));

    return { source: "aws-whatsnew", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[aws-whatsnew] Fetch failed: ${message}`);
    return { source: "aws-whatsnew", articles: [], error: message };
  }
}
