import React from 'react';
import { Quote } from 'lucide-react';
import type { CMSSection } from '@/types/cms';

interface TestimonialsSectionProps {
  section: CMSSection;
}

interface TestimonialItem {
  id: number;
  text: string;
  author: string;
  role: string;
  company: string;
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultTestimonials: TestimonialItem[] = [
    {
      id: 1,
      text: "PLS memberikan standar audio yang sangat bersih. Tidak ada feedback, suara jernih di seluruh ballroom, dan timnya sangat kooperatif mengikuti rundown kami yang padat.",
      author: "Budi Santoso",
      role: "Head of Marketing",
      company: "PT. Nusantara Jaya Tbk"
    },
    {
      id: 2,
      text: "Ketepatan waktu saat loading barang sangat kami apresiasi. Setup rapi, kabel tidak berantakan, dan operator sangat responsif terhadap perubahan mendadak di lapangan.",
      author: "Rina Wijaya",
      role: "Event Director",
      company: "Luxe Organizer Indonesia"
    },
    {
      id: 3,
      text: "Solusi lighting dan sound yang diberikan membuat acara tahunan kementerian kami berjalan khidmat dan megah. Sangat direkomendasikan untuk event formal.",
      author: "Drs. Hendra Kusuma",
      role: "Kasubag Umum",
      company: "Kementerian BUMN (Unit)"
    }
  ];

  // Try to parse testimonials from CMS, fallback to defaults
  let testimonials: TestimonialItem[] = defaultTestimonials;
  if (fields.testimonials?.value) {
    try {
      testimonials = JSON.parse(fields.testimonials.value);
    } catch {
      testimonials = defaultTestimonials;
    }
  }

  const title = fields.title?.value || 'Kepercayaan Klien';

  return (
    <section id="testimonials" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-neutral-900/50 p-8 rounded-sm border border-white/5 relative">
              <Quote className="absolute top-8 right-8 text-brand-gold/20 h-8 w-8" />
              <p className="text-neutral-300 italic mb-8 leading-relaxed">"{item.text}"</p>
              <div className="border-t border-white/5 pt-6">
                <p className="text-white font-semibold">{item.author}</p>
                <p className="text-brand-gold text-sm text-opacity-80 mb-1">{item.company}</p>
                <p className="text-neutral-500 text-xs">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

