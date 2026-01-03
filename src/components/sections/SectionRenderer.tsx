import type { CMSSection } from '@/types/cms';
import { HeroSection } from './HeroSection';
import { TextSection } from './TextSection';
import { StatsSection } from './StatsSection';
import { ServicesSection } from './ServicesSection';
import { WhyChooseSection } from './WhyChooseSection';
import { PortfolioSection } from './PortfolioSection';
import { ProcessSection } from './ProcessSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FinalCTASection } from './FinalCTASection';

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
    case 'stats':
      console.log('[Section Renderer] Rendering Stats section:', section.id);
      return <StatsSection section={section} />;
    case 'services':
      console.log('[Section Renderer] Rendering Services section:', section.id);
      return <ServicesSection section={section} />;
    case 'why-choose':
      console.log('[Section Renderer] Rendering WhyChoose section:', section.id);
      return <WhyChooseSection section={section} />;
    case 'portfolio':
      console.log('[Section Renderer] Rendering Portfolio section:', section.id);
      return <PortfolioSection section={section} />;
    case 'process':
      console.log('[Section Renderer] Rendering Process section:', section.id);
      return <ProcessSection section={section} />;
    case 'testimonials':
      console.log('[Section Renderer] Rendering Testimonials section:', section.id);
      return <TestimonialsSection section={section} />;
    case 'final-cta':
      console.log('[Section Renderer] Rendering FinalCTA section:', section.id);
      return <FinalCTASection section={section} />;
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

