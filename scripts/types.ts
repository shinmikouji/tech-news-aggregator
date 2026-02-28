export type Source =
  | "hacker-news"
  | "reddit"
  | "hatena-bookmark"
  | "zenn"
  | "devto"
  | "lobsters"
  | "tldr"
  | "aws-whatsnew";

export type Category =
  | "ai"
  | "security"
  | "architecture"
  | "react-nextjs"
  | "go"
  | "aws"
  | "other";

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "ai", label: "AI" },
  { slug: "security", label: "Security" },
  { slug: "architecture", label: "Architecture" },
  { slug: "react-nextjs", label: "React/Next.js" },
  { slug: "go", label: "Go" },
  { slug: "aws", label: "AWS" },
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
