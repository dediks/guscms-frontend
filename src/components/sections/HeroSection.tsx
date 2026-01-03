import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface HeroSectionProps {
  section: CMSSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const badge = fields.badge?.value || 'Professional Audio Production';
  const title = fields.title?.value || 'Kualitas Suara';
  const titleHighlight = fields.title_highlight?.value || 'Tanpa Kompromi.';
  const description = fields.description?.value || 'PLS menghadirkan solusi sound system premium dengan standar eksekusi tinggi untuk event korporat, instansi pemerintah, dan produksi skala besar. Tenang, rapi, dan profesional.';
  const backgroundImage = fields.background_image?.value || 'https://picsum.photos/id/453/1920/1080';
  const primaryCtaText = fields.primary_cta_text?.value || 'Konsultasi Sekarang';
  const primaryCtaUrl = fields.primary_cta_url?.value || '#contact';
  const secondaryCtaText = fields.secondary_cta_text?.value || 'Lihat Portfolio';
  const secondaryCtaUrl = fields.secondary_cta_url?.value || '#portfolio';

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Premium Event Audio Setup"
          className="w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/30"></div>
      </div>

      {/* Content */}
      <div className="relative lg:flex-1 z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left pt-20">
        <div className="max-w-3xl">
          <div className="inline-block px-3 py-1 mb-6 border border-brand-gold/30 rounded-full bg-brand-gold/10 backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">{badge}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            {title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">{titleHighlight}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed font-light">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href={primaryCtaUrl}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-gold hover:bg-yellow-600 transition-all rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              {primaryCtaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href={secondaryCtaUrl}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-neutral-300 border border-neutral-700 hover:text-white hover:border-white transition-all rounded-sm bg-transparent"
            >
              {secondaryCtaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
