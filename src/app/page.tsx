import { cmsClient } from '@/lib/cms-client';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import type { CMSPage } from '@/types/cms';

// ISR Configuration: Revalidate every hour (3600 seconds)
// This can be overridden by webhook-triggered revalidation
export const revalidate = 3600;

async function getHomePage(): Promise<CMSPage | null> {
  try {
    console.log('[Home Page] Fetching homepage...');
    // Fetch homepage by slug "/"
    const page = await cmsClient.getPageBySlug('/');
    if (page) {
      console.log('[Home Page] Homepage data received:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        sectionsCount: page.sections?.length || 0,
      });
    } else {
      console.warn('[Home Page] Homepage not found');
    }
    return page;
  } catch (error) {
    console.error('[Home Page] Failed to fetch homepage:', error);
    return null;
  }
}

export default async function Home() {
  const page = await getHomePage();

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
              Page Not Found
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Unable to load the homepage. Please check your CMS API configuration.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full">
        {sortedSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    </div>
  );
}
