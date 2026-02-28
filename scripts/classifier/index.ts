import type { Article, Category } from "../types";
import { KEYWORD_MAP } from "./keywords";

const THRESHOLD = 2;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s\-\/.]/g, " ");
}

function countMatches(text: string, keywords: string[]): number {
  let count = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) {
      count++;
    }
  }
  return count;
}

function getSourceHintScore(article: Article, category: Category): number {
  if (category === "other") return 0;
  const { sourceHints } = KEYWORD_MAP[category];
  for (const [hint, source] of Object.entries(sourceHints)) {
    if (article.source === source && article.url.toLowerCase().includes(hint)) {
      return 1;
    }
  }
  return 0;
}

export function classify(article: Article): Category[] {
  const text = normalize(`${article.title} ${article.url}`);
  const results: Category[] = [];

  for (const [category, keywords] of Object.entries(KEYWORD_MAP) as [
    Exclude<Category, "other">,
    (typeof KEYWORD_MAP)[Exclude<Category, "other">],
  ][]) {
    const primaryHits = countMatches(text, keywords.primaryKeywords);
    const secondaryHits = countMatches(text, keywords.secondaryKeywords);
    const sourceHint = getSourceHintScore(article, category);

    const score = primaryHits * 2 + secondaryHits * 1 + sourceHint;

    if (score >= THRESHOLD) {
      results.push(category);
    }
  }

  return results.length > 0 ? results : ["other"];
}
