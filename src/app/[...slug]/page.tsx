import { cmsClient } from '@/lib/cms-client';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import type { CMSPage } from '@/types/cms';
import { notFound } from 'next/navigation';

// ISR Configuration: Revalidate every hour (3600 seconds)
// This can be overridden by webhook-triggered revalidation
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getPageBySlug(slug: string[]): Promise<CMSPage | null> {
  try {
    // Join slug array into path
    // If slug is empty or undefined, it's the homepage which is handled by app/page.tsx
    // This route handles all other pages
    const slugPath = slug && slug.length > 0 ? `/${slug.join('/')}` : null;
    if (!slugPath) {
      console.log('[Dynamic Page] No slug path provided');
      return null;
    }
    console.log('[Dynamic Page] Fetching page for slug:', slugPath);
    const page = await cmsClient.getPageBySlug(slugPath);
    if (page) {
      console.log('[Dynamic Page] Page data received:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        sectionsCount: page.sections?.length || 0,
      });
    } else {
      console.warn('[Dynamic Page] Page not found for slug:', slugPath);
    }
    return page;
  } catch (error) {
    console.error('[Dynamic Page] Failed to fetch page:', error);
    return null;
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
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

