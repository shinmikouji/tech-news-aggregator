import type { Article } from "../types";

/**
 * Normalize a URL for deduplication:
 * - Remove trailing slashes
 * - Remove utm_* and other tracking query params
 * - Lowercase the hostname
 */
function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);

    // Lowercase hostname
    url.hostname = url.hostname.toLowerCase();

    // Remove tracking params
    const trackingPrefixes = ["utm_", "ref", "source", "via"];
    for (const key of Array.from(url.searchParams.keys())) {
      if (trackingPrefixes.some((prefix) => key.startsWith(prefix))) {
        url.searchParams.delete(key);
      }
    }

    // Sort remaining params for consistent comparison
    url.searchParams.sort();

    // Build normalized string and strip trailing slash
    let normalized = url.toString();
    if (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    // If URL is invalid, fall back to trimmed raw string
    return raw.trim();
  }
}

/**
 * Remove duplicate articles based on normalized URL.
 * Keeps the first occurrence.
 */
export function dedup(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = normalizeUrl(article.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
