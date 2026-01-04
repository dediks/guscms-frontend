import { MetadataRoute } from 'next';
import { dataClient } from '@/lib/data-source';
import { getSiteUrl } from '@/lib/seo';
import { logger } from '@/lib/logger';

// ISR Configuration: Revalidate every hour (3600 seconds)
// This matches the revalidation strategy of the pages
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    // Add homepage
    sitemapEntries.push({
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Fetch all pages from data source (CMS or static)
    const pages = await dataClient.getPages();
    
    // Filter only published pages
    const publishedPages = pages.filter(page => page.published_at !== null);

    // Add each published page to sitemap
    for (const page of publishedPages) {
      // Skip homepage as it's already added
      if (page.slug === '/' || page.slug === '') {
        continue;
      }

      const pageUrl = `${siteUrl}${page.slug.startsWith('/') ? page.slug : `/${page.slug}`}`;
      
      sitemapEntries.push({
        url: pageUrl,
        lastModified: page.published_at ? new Date(page.published_at) : new Date(),
        changeFrequency: 'weekly',
        priority: page.slug === '/' ? 1.0 : 0.8,
      });
    }
  } catch (error) {
    logger.error('[Sitemap] Error generating sitemap:', error);
    // Return at least the homepage if CMS fails
    if (sitemapEntries.length === 0) {
      sitemapEntries.push({
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      });
    }
  }
  
  logger.log(`[Sitemap] Generated sitemap with ${sitemapEntries.length} entries`);

  return sitemapEntries;
}

