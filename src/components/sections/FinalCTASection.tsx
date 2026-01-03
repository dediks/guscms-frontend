import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface FinalCTASectionProps {
  section: CMSSection;
}

export function FinalCTASection({ section }: FinalCTASectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const title = fields.title?.value || 'Siap Wujudkan Event Berkelas?';
  const description = fields.description?.value || 'Dapatkan penawaran terbaik dan konsultasi teknis gratis untuk kesuksesan acara Anda. Respon cepat dan profesional.';
  const ctaText = fields.cta_text?.value || 'Jadwalkan Konsultasi';
  const ctaUrl = fields.cta_url?.value || 'https://wa.me/6282257289604';
  const contactInfo = fields.contact_info?.value || 'Hubungi kami: 0822-5728-9604 (WhatsApp/Call)';

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

