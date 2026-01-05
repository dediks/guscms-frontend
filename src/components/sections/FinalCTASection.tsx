import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface FinalCTASectionProps {
  section: CMSSection;
}

export function FinalCTASection({ section }: FinalCTASectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const title = (typeof fields.title?.value === 'string' ? fields.title.value : null) || 'Siap Wujudkan Event Berkelas?';
  const description = (typeof fields.description?.value === 'string' ? fields.description.value : null) || 'Dapatkan penawaran terbaik dan konsultasi teknis gratis untuk kesuksesan acara Anda. Respon cepat dan profesional.';
  
  // Support both CMS field names (button_text/button_url) and legacy names (cta_text/cta_url)
  const buttonText = typeof fields.button_text?.value === 'string' ? fields.button_text.value : null;
  const buttonUrl = typeof fields.button_url?.value === 'string' ? fields.button_url.value : null;
  const legacyCtaText = typeof fields.cta_text?.value === 'string' ? fields.cta_text.value : null;
  const legacyCtaUrl = typeof fields.cta_url?.value === 'string' ? fields.cta_url.value : null;
  
  const ctaText = buttonText || legacyCtaText || 'Jadwalkan Konsultasi';
  const ctaUrl = buttonUrl || legacyCtaUrl || 'https://wa.me/6282257289604';
  const contactInfo = (typeof fields.contact_info?.value === 'string' ? fields.contact_info.value : null) || 'Hubungi kami: 0822-5728-9604 (WhatsApp/Call)';

  return (
    <section id="contact" className="py-24 bg-brand-gold relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6">
          {title}
        </h2>
        <p className="text-brand-dark/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-dark hover:bg-black transition-all rounded-sm shadow-xl hover:-translate-y-1"
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            {ctaText}
          </a>
        </div>
        <p className="mt-6 text-sm text-brand-dark/60 font-medium">
          {contactInfo}
        </p>
      </div>
    </section>
  );
}

