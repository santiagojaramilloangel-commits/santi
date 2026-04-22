import FirecrawlApp from '@mendable/firecrawl-js';
import 'dotenv/config';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function scrapeUrl(url) {
  const result = await app.scrapeUrl(url, { formats: ['markdown'] });
  if (!result.success) throw new Error(result.error);
  return result.markdown;
}

export async function crawlSite(url, options = {}) {
  const result = await app.crawlUrl(url, {
    limit: options.limit ?? 10,
    scrapeOptions: { formats: ['markdown'] },
  });
  if (!result.success) throw new Error(result.error);
  return result.data;
}
