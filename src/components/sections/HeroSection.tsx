import Image from 'next/image';
import type { CMSSection } from '@/types/cms';

interface HeroSectionProps {
  section: CMSSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  const fields = section.fields;
  
  const title = fields.title?.value || '';
  const subtitle = fields.subtitle?.value || '';
  const description = fields.description?.value || '';
  const image = fields.image?.value;
  const primaryCtaText = fields.primary_cta_text?.value;
  const primaryCtaUrl = fields.primary_cta_url?.value;
  const secondaryCtaText = fields.secondary_cta_text?.value;
  const secondaryCtaUrl = fields.secondary_cta_url?.value;
  const ctaText = fields.cta_text?.value;
  const ctaUrl = fields.cta_url?.value;

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {title && (
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black dark:text-zinc-50">
                {title}
              </h1>
            )}
            {subtitle && (
              <h2 className="text-2xl sm:text-3xl text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </h2>
            )}
            {description && (
              <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                {description}
              </p>
            )}
            {(primaryCtaText || ctaText) && (
              <div className="flex flex-wrap gap-4 pt-4">
                {primaryCtaText && primaryCtaUrl && (
                  <a
                    href={primaryCtaUrl}
                    className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    {primaryCtaText}
                  </a>
                )}
                {secondaryCtaText && secondaryCtaUrl && (
                  <a
                    href={secondaryCtaUrl}
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    {secondaryCtaText}
                  </a>
                )}
                {ctaText && ctaUrl && !primaryCtaText && (
                  <a
                    href={ctaUrl}
                    className="inline-flex items-center justify-center px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    {ctaText}
                  </a>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={title || 'Hero image'}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

