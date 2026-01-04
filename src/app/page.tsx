import { dataClient } from '@/lib/data-source';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MaintenancePage } from '@/components/layout/MaintenancePage';
import type { CMSPage, CMSSection } from '@/types/cms';
import type { Metadata } from 'next';
import { generateMetadataFromCMS, generateDefaultMetadata } from '@/lib/seo';
import { logger } from '@/lib/logger';

// ISR Configuration: Revalidate every hour (3600 seconds)
// This can be overridden by webhook-triggered revalidation
export const revalidate = 3600;

async function getHomePage(): Promise<CMSPage | null> {
  try {
    logger.log('[Home Page] Fetching homepage...');
    // Fetch homepage by slug "/"
    const page = await dataClient.getPageBySlug('/');
    if (page) {
      logger.log('[Home Page] Homepage data received:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        sectionsCount: page.sections?.length || 0,
        dataSource: dataClient.getDataSourceType(),
      });
    } else {
      logger.warn('[Home Page] Homepage not found');
    }
    return page;
  } catch (error) {
    logger.error('[Home Page] Failed to fetch homepage:', error);
    return null;
  }
}

// Create default sections with fallback data when CMS is not available
function getDefaultSections(): CMSSection[] {
  return [
    {
      id: 1,
      type: 'hero',
      order: 1,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 2,
      type: 'stats',
      order: 2,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 3,
      type: 'services',
      order: 3,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 4,
      type: 'why-choose',
      order: 4,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 5,
      type: 'portfolio',
      order: 5,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 6,
      type: 'process',
      order: 6,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 7,
      type: 'testimonials',
      order: 7,
      is_active: true,
      settings: [],
      fields: {},
    },
    {
      id: 8,
      type: 'final-cta',
      order: 8,
      is_active: true,
      settings: [],
      fields: {},
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getHomePage();
    if (page?.meta) {
      return generateMetadataFromCMS(page.meta, page.title, page.slug || '/');
    }
  } catch (error) {
    logger.error('[Home Page] Error generating metadata:', error);
  }
  
  // Fallback to default metadata
  return generateDefaultMetadata(undefined, undefined, '/');
}

export default async function Home() {
  // Fetch settings first to check maintenance mode
  const settings = await dataClient.getSettings();
  
  // Check if maintenance mode is enabled
  if (settings?.maintenance_mode_enabled === '1') {
    return <MaintenancePage message={settings.maintenance_message} />;
  }

  const page = await getHomePage();

  // Use CMS sections if available, otherwise use default sections with fallback data
  const sections = page?.sections && page.sections.length > 0
    ? [...page.sections].sort((a, b) => a.order - b.order)
    : getDefaultSections();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-gold selection:text-white bg-brand-dark">
      <Navbar logoUrl={settings?.logo_url} />
      <main className="flex-1">
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
