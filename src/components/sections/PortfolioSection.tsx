import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { CMSSection } from '@/types/cms';
import { getImageUrl } from '@/lib/cms-utils';

interface PortfolioSectionProps {
  section: CMSSection;
}

interface PortfolioItem {
  image: number | string | Record<string, unknown> | null;
  title: string;
  category: string;
  description: string;
}

export function PortfolioSection({ section }: PortfolioSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultPortfolioItems: PortfolioItem[] = [
    {
      image: "https://picsum.photos/id/449/800/600",
      title: "National Leadership Summit 2023",
      category: "Corporate Conference",
      description: "Event korporat skala besar dengan sistem audio premium"
    },
    {
      image: "https://picsum.photos/id/158/800/600",
      title: "Gala Dinner BUMN",
      category: "Gala & Awarding",
      description: "Acara formal dengan standar teknis tinggi"
    },
    {
      image: "https://picsum.photos/id/452/800/600",
      title: "Konser Outdoor City Festival",
      category: "Live Music Production",
      description: "Produksi musik live dengan cakupan audio luas"
    },
  ];

  // Try to parse portfolio items from CMS, fallback to defaults
  let portfolioItems: PortfolioItem[] = defaultPortfolioItems;
  if (fields.items?.value) {
    try {
      const value = fields.items.value;
      if (typeof value === 'string') {
        portfolioItems = JSON.parse(value);
      } else if (Array.isArray(value)) {
        portfolioItems = value as PortfolioItem[];
      }
    } catch {
      portfolioItems = defaultPortfolioItems;
    }
  }

  const title = (typeof fields.title?.value === 'string' ? fields.title.value : null) || 'Pengalaman Nyata di Lapangan';
  const description = (typeof fields.description?.value === 'string' ? fields.description.value : null) || 'Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.';
  const ctaText = (typeof fields.cta_text?.value === 'string' ? fields.cta_text.value : null) || 'Lihat Pengalaman Kami';
  const ctaUrl = (typeof fields.cta_url?.value === 'string' ? fields.cta_url.value : null) || '#contact';

  return (
    <section id="portfolio" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-neutral-400">
              {description}
            </p>
          </div>
          <a href={ctaUrl} className="hidden md:flex items-center text-brand-gold hover:text-white transition-colors font-medium mt-6 md:mt-0">
            {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => {
            const imageUrl = getImageUrl(item.image) || 'https://picsum.photos/id/449/800/600';
            return (
              <div key={index} className="group relative overflow-hidden rounded-sm cursor-pointer">
                <div className="aspect-[4/3] w-full bg-neutral-800">
                  <img 
                    src={imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</span>
                  <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-neutral-300 text-sm line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:hidden text-center">
           <a href={ctaUrl} className="inline-flex items-center text-brand-gold font-medium">
            {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

