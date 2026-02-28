import type { Article } from '../types.js';

const OGP_TIMEOUT_MS = 5_000;
const BATCH_SIZE = 5;

export async function fetchOgpDescription(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OGP_TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TechNewsAggregator/1.0' },
    });
    clearTimeout(timeoutId);

    const html = await res.text();

    const ogMatch = html.match(
      /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
    );
    if (ogMatch) return ogMatch[1];

    const metaMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
    );
    if (metaMatch) return metaMatch[1];

    return undefined;
  } catch {
    return undefined;
  }
}

export async function fetchOgpDescriptions(articles: Article[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    console.log(`  OGP batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(articles.length / BATCH_SIZE)}`);

    const results = await Promise.all(
      batch.map(async (article) => {
        const desc = await fetchOgpDescription(article.url);
        return { url: article.url, desc };
      })
    );

    for (const { url, desc } of results) {
      if (desc) result.set(url, desc);
    }
  }

  return result;
}
