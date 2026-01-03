import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface PortfolioSectionProps {
  section: CMSSection;
}

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export function PortfolioSection({ section }: PortfolioSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultPortfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "National Leadership Summit 2023",
      category: "Corporate Conference",
      imageUrl: "https://picsum.photos/id/449/800/600"
    },
    {
      id: 2,
      title: "Gala Dinner BUMN",
      category: "Gala & Awarding",
      imageUrl: "https://picsum.photos/id/158/800/600"
    },
    {
      id: 3,
      title: "Konser Outdoor City Festival",
      category: "Live Music Production",
      imageUrl: "https://picsum.photos/id/452/800/600"
    },
  ];

  // Try to parse portfolio items from CMS, fallback to defaults
  let portfolioItems: PortfolioItem[] = defaultPortfolioItems;
  if (fields.portfolio_items?.value) {
    try {
      portfolioItems = JSON.parse(fields.portfolio_items.value);
    } catch {
      portfolioItems = defaultPortfolioItems;
    }
  }

  const title = fields.title?.value || 'Pengalaman Nyata di Lapangan';
  const description = fields.description?.value || 'Menangani berbagai skala acara dengan konsistensi kualitas, mulai dari ruang meeting eksklusif hingga panggung outdoor megah.';
  const ctaText = fields.cta_text?.value || 'Lihat Pengalaman Kami';
  const ctaUrl = fields.cta_url?.value || '#contact';

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
          {portfolioItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-sm cursor-pointer">
              <div className="aspect-[4/3] w-full bg-neutral-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</span>
                <h3 className="text-white text-xl font-bold">{item.title}</h3>
              </div>
            </div>
          ))}
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

