import React from 'react';
import { Quote } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface TestimonialsSectionProps {
  section: CMSSection;
}

interface TestimonialItem {
  name: string;
  quote: string;
  avatar: string | null;
  rating: number;
  company: string;
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultTestimonials: TestimonialItem[] = [
    {
      name: "Budi Santoso",
      quote: "PLS memberikan standar audio yang sangat bersih. Tidak ada feedback, suara jernih di seluruh ballroom, dan timnya sangat kooperatif mengikuti rundown kami yang padat.",
      avatar: null,
      rating: 5,
      company: "PT. Nusantara Jaya Tbk"
    },
    {
      name: "Rina Wijaya",
      quote: "Ketepatan waktu saat loading barang sangat kami apresiasi. Setup rapi, kabel tidak berantakan, dan operator sangat responsif terhadap perubahan mendadak di lapangan.",
      avatar: null,
      rating: 5,
      company: "Luxe Organizer Indonesia"
    },
    {
      name: "Drs. Hendra Kusuma",
      quote: "Solusi lighting dan sound yang diberikan membuat acara tahunan kementerian kami berjalan khidmat dan megah. Sangat direkomendasikan untuk event formal.",
      avatar: null,
      rating: 5,
      company: "Kementerian BUMN (Unit)"
    }
  ];

  // Try to parse testimonials from CMS, fallback to defaults
  let testimonials: TestimonialItem[] = defaultTestimonials;
  if (fields.testimonials?.value) {
    try {
      const value = fields.testimonials.value;
      if (typeof value === 'string') {
        testimonials = JSON.parse(value);
      } else if (Array.isArray(value)) {
        testimonials = value as TestimonialItem[];
      }
    } catch {
      testimonials = defaultTestimonials;
    }
  }

  const title = (typeof fields.title?.value === 'string' ? fields.title.value : null) || 'Kepercayaan Klien';

  return (
    <section id="testimonials" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="bg-neutral-900/50 p-8 rounded-sm border border-white/5 relative">
              <Quote className="absolute top-8 right-8 text-brand-gold/20 h-8 w-8" />
              <p className="text-neutral-300 italic mb-8 leading-relaxed">"{item.quote}"</p>
              <div className="border-t border-white/5 pt-6">
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-brand-gold text-sm text-opacity-80 mb-1">{item.company}</p>
                {item.rating > 0 && (
                  <p className="text-brand-gold text-xs">⭐ {item.rating}/5</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

