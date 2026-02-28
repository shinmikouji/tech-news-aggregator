import type { Article, FetchResult } from "../types";
import { fetchJson } from "./base-fetcher";

const TOP_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/topstories.json";
const ITEM_URL = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const MAX_ITEMS = 50;
const CONCURRENCY = 10;

interface HNItem {
  id: number;
  type: string;
  title?: string;
  url?: string;
  score?: number;
  by?: string;
  time?: number;
  descendants?: number;
}

async function fetchItemsBatch(ids: number[]): Promise<(HNItem | null)[]> {
  return Promise.all(
    ids.map(async (id) => {
      try {
        return await fetchJson<HNItem>(ITEM_URL(id));
      } catch {
        return null;
      }
    })
  );
}

export async function fetchHackerNews(): Promise<FetchResult> {
  try {
    const topIds = await fetchJson<number[]>(TOP_STORIES_URL);
    const ids = topIds.slice(0, MAX_ITEMS);

    // Fetch in batches of CONCURRENCY
    const items: (HNItem | null)[] = [];
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      const batch = ids.slice(i, i + CONCURRENCY);
      const results = await fetchItemsBatch(batch);
      items.push(...results);
    }

    const now = new Date().toISOString();

    const articles: Article[] = items
      .filter(
        (item): item is HNItem =>
          item !== null && item.type === "story" && !!item.url
      )
      .map((item) => ({
        id: `hn-${item.id}`,
        title: item.title ?? "(no title)",
        url: item.url!,
        source: "hacker-news" as const,
        categories: ["other" as const],
        score: item.score,
        comments: item.descendants,
        commentsUrl: `https://news.ycombinator.com/item?id=${item.id}`,
        author: item.by,
        publishedAt: item.time
          ? new Date(item.time * 1000).toISOString()
          : undefined,
        fetchedAt: now,
      }));

    return { source: "hacker-news", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[hacker-news] Fetch failed: ${message}`);
    return { source: "hacker-news", articles: [], error: message };
  }
}
