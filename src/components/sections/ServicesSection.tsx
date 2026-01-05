'use client';

import React, { useState } from 'react';
import { Speaker, Mic2, Users, Settings, Radio, Search } from 'lucide-react';
import type { CMSSection } from '@/types/cms';
import type { LucideIcon } from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  icon: string | null;
}

interface ServicesSectionProps {
  section: CMSSection;
}

const iconMap: Record<string, LucideIcon> = {
  Speaker,
  Mic2,
  Users,
  Settings,
  Radio,
};

export function ServicesSection({ section }: ServicesSectionProps) {
  const fields = section.fields;
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback values from original frontend component
  const defaultServices: ServiceItem[] = [
    {
      title: "Rental Sound System Premium",
      description: "Sistem audio kelas dunia yang dikalibrasi presisi untuk kejernihan suara maksimal di setiap sudut venue.",
      icon: "Speaker"
    },
    {
      title: "Corporate & Government Support",
      description: "Layanan audio visual terintegrasi khusus untuk rapat umum, konferensi, pelantikan, dan gala dinner resmi.",
      icon: "Users"
    },
    {
      title: "Event Skala Besar & Outdoor",
      description: "Kapasitas daya dan cakupan audio luas untuk festival, gathering akbar, atau acara lapangan terbuka.",
      icon: "Radio"
    },
    {
      title: "Lighting & Technical Production",
      description: "Paket dukungan pencahayaan panggung dan tata teknis menyeluruh untuk estetika visual yang selaras.",
      icon: "Settings"
    },
    {
      title: "Manpower & Audio Engineer",
      description: "Operator berpengalaman dan teknisi bersertifikat yang memastikan kelancaran teknis dari awal hingga akhir.",
      icon: "Mic2"
    }
  ];

  // Try to parse services from CMS, fallback to defaults
  let services: ServiceItem[] = defaultServices;
  if (fields.services?.value) {
    try {
      const value = fields.services.value;
      if (typeof value === 'string') {
        services = JSON.parse(value);
      } else if (Array.isArray(value)) {
        services = value as ServiceItem[];
      }
    } catch {
      services = defaultServices;
    }
  }

  const title = (typeof fields.title?.value === 'string' ? fields.title.value : null) || 'Solusi Audio Terintegrasi';
  const description = (typeof fields.description?.value === 'string' ? fields.description.value : null) || 'Kami menyediakan lebih dari sekadar peralatan. PLS memberikan ketenangan pikiran melalui layanan teknis yang komprehensif.';
  
  // Parse show_search boolean (comes as string "true" or "false")
  const showSearchValue = fields.show_search?.value;
  const showSearch = typeof showSearchValue === 'string' 
    ? showSearchValue === 'true' 
    : typeof showSearchValue === 'boolean'
    ? showSearchValue
    : false;

  const filteredServices = showSearch
    ? services.filter((service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  return (
    <section id="services" className="py-24 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`flex flex-col ${showSearch ? 'md:flex-row justify-between items-end' : ''} mb-12 gap-8`}>
          <div className="md:text-left max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
            <p className="text-neutral-400 text-lg">
              {description}
            </p>
          </div>

          {showSearch && (
            <div className="w-full md:w-auto min-w-[300px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-700 rounded-sm leading-5 bg-brand-charcoal text-neutral-300 placeholder-neutral-500 focus:outline-none focus:bg-neutral-900 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold sm:text-sm transition-colors"
                  placeholder="Cari layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon ? (iconMap[service.icon] || Speaker) : Speaker;
              return (
                <div 
                  key={index} 
                  className="group p-8 bg-brand-charcoal border border-white/5 hover:border-brand-gold/30 transition-all duration-300 rounded-sm hover:-translate-y-1"
                >
                  {service.icon && (
                    <div className="w-12 h-12 bg-neutral-800 rounded-sm flex items-center justify-center mb-6 text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors">
                      <IconComponent size={24} />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-charcoal/30 border border-white/5 rounded-sm">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800 text-neutral-500 mb-4">
               <Search size={24} />
            </div>
            <p className="text-neutral-400 text-lg mb-2">Tidak ada layanan ditemukan</p>
            <p className="text-neutral-500 text-sm mb-6">Coba kata kunci lain atau reset pencarian Anda.</p>
            <button 
                onClick={() => setSearchQuery('')}
                className="text-brand-gold hover:text-white transition-colors text-sm font-semibold uppercase tracking-wide"
            >
                Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

