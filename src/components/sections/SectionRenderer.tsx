import type { CMSSection } from '@/types/cms';
import { HeroSection } from './HeroSection';
import { TextSection } from './TextSection';

interface SectionRendererProps {
  section: CMSSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  console.log('[Section Renderer] Rendering section:', {
    id: section.id,
    type: section.type,
    order: section.order,
    isActive: section.is_active,
    fields: Object.keys(section.fields || {}),
  });

  // Only render active sections
  if (!section.is_active) {
    console.log('[Section Renderer] Section is inactive, skipping:', section.id);
    return null;
  }

  switch (section.type) {
    case 'hero':
      console.log('[Section Renderer] Rendering Hero section:', section.id);
      return <HeroSection section={section} />;
    case 'text':
      console.log('[Section Renderer] Rendering Text section:', section.id);
      return <TextSection section={section} />;
    default:
      // Fallback for unknown section types
      console.warn(`[Section Renderer] Unknown section type: ${section.type}`, {
        sectionId: section.id,
        sectionType: section.type,
        fields: section.fields,
      });
      return (
        <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-zinc-500 dark:text-zinc-400">
              Section type &quot;{section.type}&quot; is not yet implemented.
            </p>
          </div>
        </section>
      );
  }
}

