import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, Activity } from 'lucide-react';
import type { CMSSection } from '@/types/cms';
import type { LucideIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/cms-utils';

interface WhyChooseSectionProps {
  section: CMSSection;
}

interface Reason {
  icon: string;
  title: string;
  text: string;
}

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
};

export function WhyChooseSection({ section }: WhyChooseSectionProps) {
  const fields = section.fields;
  
  // Fallback values from original frontend component
  const defaultReasons: Reason[] = [
    {
      icon: "ShieldCheck",
      title: "Tim Teknis Berpengalaman",
      text: "Didukung oleh SDM yang memahami etika kerja profesional dan teknis audio mendalam."
    },
    {
      icon: "CheckCircle2",
      title: "Peralatan Terawat & Ready",
      text: "Unit selalu melalui maintenance rutin. Kebersihan dan fungsi alat adalah prioritas kami."
    },
    {
      icon: "Clock",
      title: "Tepat Waktu & Rapi",
      text: "Setup dilakukan jauh sebelum acara dimulai. Manajemen kabel yang rapi untuk estetika venue."
    },
    {
      icon: "Activity",
      title: "Monitoring Penuh",
      text: "Standby operator selama acara berlangsung untuk antisipasi dan penanganan teknis instan."
    }
  ];

  // Try to parse reasons from CMS, fallback to defaults
  let reasons: Reason[] = defaultReasons;
  if (fields.reasons?.value) {
    try {
      reasons = JSON.parse(fields.reasons.value);
    } catch {
      reasons = defaultReasons;
    }
  }

  const badge = fields.badge?.value || 'Mengapa PLS?';
  const title = fields.title?.value || 'Standar Tinggi untuk Acara Penting Anda.';
  const description = fields.description?.value || 'Kami mengerti bahwa dalam event korporat dan kenegaraan, tidak ada ruang untuk kesalahan teknis. PLS hadir sebagai mitra teknis yang memprioritaskan detail dan kesempurnaan.';
  const imageUrl = getImageUrl(fields.image?.value) || 'https://picsum.photos/id/431/800/1000';
  const quote = fields.quote?.value || '"Keberhasilan acara Anda adalah reputasi kami."';

  return (
    <section id="why-us" className="py-24 bg-neutral-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <span className="text-brand-gold font-semibold tracking-wider text-sm uppercase">{badge}</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-8">{title}</h2>
            <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {reasons.map((reason, idx) => {
                const IconComponent = iconMap[reason.icon] || ShieldCheck;
                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center mb-3 text-white font-semibold text-lg">
                      <IconComponent className="text-brand-gold mr-3 h-5 w-5" />
                      {reason.title}
                    </div>
                    <p className="text-sm text-neutral-500 pl-8 leading-relaxed">
                      {reason.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative h-[500px] w-full bg-neutral-800 rounded-sm overflow-hidden">
             <img 
               src={imageUrl} 
               alt="Sound Engineer Working" 
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
               <div className="border-l-4 border-brand-gold pl-6">
                 <p className="text-white text-xl font-medium italic">{quote}</p>
               </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

