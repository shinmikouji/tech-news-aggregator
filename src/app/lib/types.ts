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

export const SOURCE_LABELS: Record<Source, string> = {
  "hacker-news": "Hacker News",
  reddit: "Reddit",
  "hatena-bookmark": "はてなブックマーク",
  zenn: "Zenn",
  devto: "DEV.to",
  lobsters: "Lobsters",
  tldr: "TLDR",
  "aws-whatsnew": "AWS What's New",
};

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
