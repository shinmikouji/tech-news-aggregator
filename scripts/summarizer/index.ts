import type { Article } from '../types.js';
import { fetchOgpDescriptions } from './ogp.js';
import { summarizeWithGemini, fallbackSummary, isAvailable } from './gemini.js';

export async function addSummaries(articles: Article[]): Promise<Article[]> {
  console.log('Fetching OGP descriptions...');
  const descriptions = await fetchOgpDescriptions(articles);
  console.log(`Got OGP descriptions for ${descriptions.size}/${articles.length} articles`);

  if (!isAvailable()) {
    console.log('GOOGLE_API_KEY not set, using fallback summaries');
    return articles.map(article => {
      const desc = descriptions.get(article.url);
      if (desc) {
        return { ...article, summary: fallbackSummary(desc) };
      }
      return article;
    });
  }

  console.log('Generating summaries with Gemini 2.5 Flash...');
  let geminiCount = 0;
  const result: Article[] = [];

  for (const article of articles) {
    const desc = descriptions.get(article.url);
    if (!desc) {
      result.push(article);
      continue;
    }

    const summary = await summarizeWithGemini(article.title, desc);
    if (summary) {
      result.push({ ...article, summary });
      geminiCount++;
    } else {
      result.push({ ...article, summary: fallbackSummary(desc) });
    }

    // Rate limit: 1 second between Gemini calls
    if (geminiCount < 250) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`Generated ${geminiCount} Gemini summaries, ${result.filter(a => a.summary).length} total summaries`);
  return result;
}
