import type { Article, FetchResult } from "../types";
import { fetchJson } from "./base-fetcher";

interface DevtoArticle {
  id: number;
  title: string;
  url: string;
  positive_reactions_count: number;
  comments_count: number;
  tag_list: string[];
  user: { username: string };
  published_at: string;
}

export async function fetchDevto(): Promise<FetchResult> {
  try {
    const items = await fetchJson<DevtoArticle[]>(
      "https://dev.to/api/articles?per_page=20&top=1"
    );
    const now = new Date().toISOString();

    const articles: Article[] = items.map((item) => ({
      id: `devto-${item.id}`,
      title: item.title,
      url: item.url,
      source: "devto" as const,
      categories: ["other" as const],
      score: item.positive_reactions_count,
      comments: item.comments_count,
      author: item.user?.username,
      publishedAt: item.published_at,
      fetchedAt: now,
    }));

    return { source: "devto", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[devto] Fetch failed: ${message}`);
    return { source: "devto", articles: [], error: message };
  }
}
