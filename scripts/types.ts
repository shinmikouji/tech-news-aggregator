export type Source =
  | "hacker-news"
  | "publickey"
  | "hatena-bookmark"
  | "zenn"
  | "devto"
  | "lobsters"
  | "qiita"
  | "itmedia";

export type Category =
  | "ai"
  | "security"
  | "frontend"
  | "backend"
  | "infra"
  | "other";

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "ai", label: "AI" },
  { slug: "security", label: "Security" },
  { slug: "frontend", label: "Frontend" },
  { slug: "backend", label: "Backend" },
  { slug: "infra", label: "Infra" },
  { slug: "other", label: "Other" },
];

export interface Article {
  id: string;
  title: string;
  url: string;
  source: Source;
  categories: Category[];
  score?: number;
  comments?: number;
  commentsUrl?: string;
  author?: string;
  publishedAt?: string;
  fetchedAt: string;
  summary?: string;
}

export interface DailyData {
  date: string;
  fetchedAt: string;
  articles: Article[];
  stats: {
    total: number;
    bySource: Record<string, number>;
    byCategory: Record<string, number>;
  };
}

export interface FetchResult {
  source: Source;
  articles: Article[];
  error?: string;
}
