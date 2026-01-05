import type { CMSSection } from '@/types/cms';
import dynamic from 'next/dynamic';
import { logger } from '@/lib/logger';

// Dynamic imports for code splitting - only load sections when needed
const HeroSection = dynamic(() => import('./HeroSection').then(m => ({ default: m.HeroSection })), {
  loading: () => <div className="h-96 animate-pulse bg-zinc-200 dark:bg-zinc-800" />,
});

const TextSection = dynamic(() => import('./TextSection').then(m => ({ default: m.TextSection })));

const StatsSection = dynamic(() => import('./StatsSection').then(m => ({ default: m.StatsSection })));

const ServicesSection = dynamic(() => import('./ServicesSection').then(m => ({ default: m.ServicesSection })));

const WhyChooseSection = dynamic(() => import('./WhyChooseSection').then(m => ({ default: m.WhyChooseSection })));

const PortfolioSection = dynamic(() => import('./PortfolioSection').then(m => ({ default: m.PortfolioSection })));

const ProcessSection = dynamic(() => import('./ProcessSection').then(m => ({ default: m.ProcessSection })));

const TestimonialsSection = dynamic(() => import('./TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));

const FinalCTASection = dynamic(() => import('./FinalCTASection').then(m => ({ default: m.FinalCTASection })));

interface SectionRendererProps {
  section: CMSSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  logger.debug('[Section Renderer] Rendering section:', {
    id: section.id,
    type: section.type,
    order: section.order,
    isActive: section.is_active,
    fields: Object.keys(section.fields || {}),
  });

  // Only render active sections
  if (!section.is_active) {
    logger.debug('[Section Renderer] Section is inactive, skipping:', section.id);
    return null;
  }

  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />;
    case 'text':
      return <TextSection section={section} />;
    case 'stats':
      return <StatsSection section={section} />;
    case 'services':
      return <ServicesSection section={section} />;
    case 'why-choose':
    case 'why_choose':
      return <WhyChooseSection section={section} />;
    case 'portfolio':
      return <PortfolioSection section={section} />;
    case 'process':
      return <ProcessSection section={section} />;
    case 'testimonials':
      return <TestimonialsSection section={section} />;
    case 'final-cta':
    case 'final_cta':
      return <FinalCTASection section={section} />;
    default:
      // Fallback for unknown section types
      logger.warn(`[Section Renderer] Unknown section type: ${section.type}`, {
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

