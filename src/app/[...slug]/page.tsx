import { dataClient } from '@/lib/data-source';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { MaintenancePage } from '@/components/layout/MaintenancePage';
import type { CMSPage } from '@/types/cms';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { generateMetadataFromCMS, generateDefaultMetadata, generateBreadcrumbs } from '@/lib/seo';
import { logger } from '@/lib/logger';
import { StructuredData } from '@/components/seo/StructuredData';

// ISR Configuration: Revalidate every hour (3600 seconds)
// This can be overridden by webhook-triggered revalidation
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Generate static params for all published pages at build time
 * This improves SEO and performance by pre-rendering pages
 */
export async function generateStaticParams() {
  try {
    const pages = await dataClient.getPages();
    const publishedPages = pages.filter(page => page.published_at !== null);
    
    logger.log(`[Static Params] Generating static params for ${publishedPages.length} published pages (data source: ${dataClient.getDataSourceType()})`);
    
    return publishedPages
      .filter(page => {
        // Skip homepage as it's handled by app/page.tsx
        const slug = page.slug.replace(/^\/+|\/+$/g, '');
        return slug !== '' && slug !== '/';
      })
      .map(page => {
        const slug = page.slug.replace(/^\/+|\/+$/g, '');
        const slugArray = slug ? slug.split('/').filter(Boolean) : [];
        return {
          slug: slugArray,
        };
      });
  } catch (error) {
    logger.error('[Static Params] Error generating static params:', error);
    // Return empty array to allow dynamic rendering as fallback
    return [];
  }
}

async function getPageBySlug(slug: string[]): Promise<CMSPage | null> {
  try {
    // Join slug array into path
    // If slug is empty or undefined, it's the homepage which is handled by app/page.tsx
    // This route handles all other pages
    const slugPath = slug && slug.length > 0 ? `/${slug.join('/')}` : null;
    if (!slugPath) {
      logger.log('[Dynamic Page] No slug path provided');
      return null;
    }
    logger.log('[Dynamic Page] Fetching page for slug:', slugPath);
    const page = await dataClient.getPageBySlug(slugPath);
    if (page) {
      logger.log('[Dynamic Page] Page data received:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        sectionsCount: page.sections?.length || 0,
        dataSource: dataClient.getDataSourceType(),
      });
    } else {
      logger.warn('[Dynamic Page] Page not found for slug:', slugPath);
    }
    return page;
  } catch (error) {
    logger.error('[Dynamic Page] Failed to fetch page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug && slug.length > 0 ? `/${slug.join('/')}` : null;
  
  if (!slugPath) {
    return generateDefaultMetadata();
  }

  try {
    const page = await getPageBySlug(slug);
    if (page?.meta) {
      return generateMetadataFromCMS(page.meta, page.title, page.slug || slugPath);
    }
  } catch (error) {
    logger.error('[Dynamic Page] Error generating metadata:', error);
  }
  
  // Fallback to default metadata with slug path
  return generateDefaultMetadata(undefined, undefined, slugPath);
}

export default async function DynamicPage({ params }: PageProps) {
  // Fetch settings first to check maintenance mode
  const settings = await dataClient.getSettings();
  
  // Check if maintenance mode is enabled
  if (settings?.maintenance_mode_enabled === '1') {
    return <MaintenancePage message={settings.maintenance_message} />;
  }

  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Sort sections by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  // Generate breadcrumbs for SEO
  const breadcrumbs = generateBreadcrumbs(page.slug);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <main className="w-full">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    </div>
  );
}

