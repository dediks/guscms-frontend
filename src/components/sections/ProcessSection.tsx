import React from 'react';
import type { CMSSection } from '@/types/cms';

interface ProcessSectionProps {
  section: CMSSection;
}

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface CMSStep {
  icon: string | null;
  title: string;
  description: string;
}

export function ProcessSection({ section }: ProcessSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultSteps: Step[] = [
    {
      num: "01",
      title: "Konsultasi Kebutuhan",
      desc: "Diskusikan detail acara, spesifikasi venue, dan target audiens Anda. Kami memberikan rekomendasi teknis yang efisien."
    },
    {
      num: "02",
      title: "Perencanaan & Persiapan",
      desc: "Tim kami menyusun skema layout audio dan loading list. Alat disiapkan dan dicek fungsi sebelum diberangkatkan."
    },
    {
      num: "03",
      title: "Eksekusi & Dukungan",
      desc: "Instalasi rapi tepat waktu, sound check mendetail, dan pendampingan teknis penuh selama acara berlangsung."
    }
  ];

  // Try to parse steps from CMS, fallback to defaults
  let steps: Step[] = defaultSteps;
  if (fields.steps?.value) {
    try {
      const value = fields.steps.value;
      let rawSteps: CMSStep[] | Step[] = [];
      
      if (typeof value === 'string') {
        rawSteps = JSON.parse(value);
      } else if (Array.isArray(value)) {
        rawSteps = value;
      }
      
      // Transform CMS format to component format
      if (Array.isArray(rawSteps) && rawSteps.length > 0) {
        steps = rawSteps.map((step, index) => {
          // Check if it's already in Step format (has num and desc)
          if ('num' in step && 'desc' in step) {
            return step as Step;
          }
          // Otherwise, transform from CMS format (has description)
          const cmsStep = step as CMSStep;
          return {
            num: String(index + 1).padStart(2, '0'),
            title: cmsStep.title || '',
            desc: cmsStep.description || '',
          };
        });
      }
    } catch {
      steps = defaultSteps;
    }
  }

  const title = (typeof fields.title?.value === 'string' ? fields.title.value : null) || 'Alur Kerja Profesional';
  const description = (typeof fields.description?.value === 'string' ? fields.description.value : null) || 'Proses sederhana untuk hasil maksimal tanpa kerumitan bagi Anda.';

  return (
    <section className="py-20 bg-brand-charcoal border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-neutral-400">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/10 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-3xl font-bold text-brand-gold mb-6 shadow-xl">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

