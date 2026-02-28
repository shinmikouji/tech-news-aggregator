import type { Article, FetchResult } from "../types";
import { fetchJson } from "./base-fetcher";

const SUBREDDITS = [
  "programming",
  "webdev",
  "golang",
  "rust",
  "machinelearning",
  "netsec",
] as const;

const USER_AGENT =
  "TechNewsAggregator/1.0 (news aggregation bot)";
const DELAY_MS = 3_000;

interface RedditChild {
  kind: string;
  data: {
    id: string;
    title: string;
    url: string;
    permalink: string;
    ups: number;
    num_comments: number;
    author: string;
    created_utc: number;
    stickied: boolean;
    subreddit: string;
  };
}

interface RedditListing {
  data: {
    children: RedditChild[];
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchReddit(): Promise<FetchResult> {
  const allArticles: Article[] = [];
  const errors: string[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < SUBREDDITS.length; i++) {
    const sub = SUBREDDITS[i];

    if (i > 0) {
      await sleep(DELAY_MS);
    }

    try {
      const listing = await fetchJson<RedditListing>(
        `https://www.reddit.com/r/${sub}/hot.json?limit=15`,
        {
          headers: { "User-Agent": USER_AGENT },
        }
      );

      const articles: Article[] = listing.data.children
        .filter((c) => c.kind === "t3" && !c.data.stickied)
        .map((c) => ({
          id: `reddit-${c.data.id}`,
          title: c.data.title,
          url: c.data.url,
          source: "reddit" as const,
          categories: ["other" as const],
          score: c.data.ups,
          comments: c.data.num_comments,
          commentsUrl: `https://www.reddit.com${c.data.permalink}`,
          author: c.data.author,
          publishedAt: new Date(c.data.created_utc * 1000).toISOString(),
          fetchedAt: now,
        }));

      allArticles.push(...articles);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[reddit] Failed to fetch r/${sub}: ${message}`);
      errors.push(`r/${sub}: ${message}`);
    }
  }

  return {
    source: "reddit",
    articles: allArticles,
    ...(errors.length > 0 && { error: errors.join("; ") }),
  };
}
