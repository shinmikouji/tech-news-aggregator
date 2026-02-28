import type { Article, FetchResult } from "../types";
import { fetchJson } from "./base-fetcher";

interface LobstersItem {
  short_id: string;
  title: string;
  url: string;
  score: number;
  comment_count: number;
  comments_url: string;
  submitter_user: { username: string };
  tags: string[];
  created_at: string;
}

export async function fetchLobsters(): Promise<FetchResult> {
  try {
    const items = await fetchJson<LobstersItem[]>(
      "https://lobste.rs/hottest.json"
    );
    const now = new Date().toISOString();

    const articles: Article[] = items.slice(0, 30).map((item) => ({
      id: `lobsters-${item.short_id}`,
      title: item.title,
      url: item.url || item.comments_url,
      source: "lobsters" as const,
      categories: ["other" as const],
      score: item.score,
      comments: item.comment_count,
      commentsUrl: item.comments_url,
      author: item.submitter_user?.username,
      publishedAt: item.created_at,
      fetchedAt: now,
    }));

    return { source: "lobsters", articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[lobsters] Fetch failed: ${message}`);
    return { source: "lobsters", articles: [], error: message };
  }
}
