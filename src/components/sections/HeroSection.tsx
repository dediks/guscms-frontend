"use client";

import React, { useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { CMSSection } from '@/types/cms';
import { getImageUrl, getStringValue } from '@/lib/cms-utils';

interface HeroSectionProps {
  section: CMSSection;
}

interface HeroFields {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  backgroundImage: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

const HERO_DEFAULTS: HeroFields = {
  badge: 'Professional Audio Production',
  title: '',
  titleHighlight: '',
  description: '',
  backgroundImage: 'https://picsum.photos/id/453/1920/1080',
  primaryCtaText: 'Konsultasi Sekarang',
  primaryCtaUrl: '#contact',
  secondaryCtaText: 'Lihat Portfolio',
  secondaryCtaUrl: '#portfolio',
};

/**
 * Custom hook to extract and memoize hero section field values
 */
function useHeroFields(section: CMSSection): HeroFields {
  return useMemo(() => {
    const fields = section.fields;
    
    // Handle both 'image' and 'background_image' field names
    // Note: URLs are already normalized server-side, but we still use getImageUrl
    // to handle object formats and extract the URL string
    const imageValue = fields.image?.value || fields.background_image?.value;
    // getImageUrl will extract URL from object or return string as-is if already normalized
    const backgroundImage = getImageUrl(imageValue) || HERO_DEFAULTS.backgroundImage;
    
    return {
      badge: getStringValue(fields.badge?.value) || HERO_DEFAULTS.badge,
      title: getStringValue(fields.title?.value) || HERO_DEFAULTS.title,
      titleHighlight: getStringValue(fields.title_highlight?.value) || HERO_DEFAULTS.titleHighlight,
      description: getStringValue(fields.description?.value) || HERO_DEFAULTS.description,
      backgroundImage,
      primaryCtaText: getStringValue(fields.primary_cta_text?.value) || HERO_DEFAULTS.primaryCtaText,
      primaryCtaUrl: getStringValue(fields.primary_cta_url?.value) || HERO_DEFAULTS.primaryCtaUrl,
      secondaryCtaText: getStringValue(fields.secondary_cta_text?.value) || HERO_DEFAULTS.secondaryCtaText,
      secondaryCtaUrl: getStringValue(fields.secondary_cta_url?.value) || HERO_DEFAULTS.secondaryCtaUrl,
    };
  }, [section.fields]);
}

interface HeroBackgroundProps {
  imageUrl: string;
  onImageError: () => void;
  hasError: boolean;
}

/**
 * HeroBackground component handles the background image with error states
 */
function HeroBackground({ imageUrl, onImageError, hasError }: HeroBackgroundProps) {
  // Check if URL is localhost/127.0.0.1 - disable optimization for these
  // Next.js Image optimization cannot fetch from localhost/127.0.0.1 in many environments
  const isLocalhost = !!imageUrl && (
    imageUrl.startsWith('http://localhost') ||
    imageUrl.startsWith('https://localhost') ||
    imageUrl.startsWith('http://127.0.0.1') ||
    imageUrl.startsWith('https://127.0.0.1')
  );
  return (
    <div className="absolute inset-0 z-0">
      {!hasError && imageUrl && (
        <Image
          src={imageUrl}
          alt="Premium Event Audio Setup"
          fill
          priority
          sizes="100vw"
          unoptimized={isLocalhost}
          className="object-cover opacity-80 grayscale"
          onError={onImageError}
        />
      )}
      {hasError && (
        <div className="w-full h-full bg-linear-to-br from-brand-dark via-brand-dark/90 to-brand-dark/70" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/80 to-brand-dark/30" />
    </div>
  );
}

interface HeroContentProps {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

/**
 * HeroContent component displays the main hero content (badge, title, description, and CTAs)
 */
function HeroContent({
  badge,
  title,
  titleHighlight,
  description,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
}: HeroContentProps) {
  return (
    <div className="relative lg:flex-1 z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left pt-20">
      <div className="max-w-3xl">
        <div className="inline-block px-3 py-1 mb-6 border border-brand-gold/30 rounded-full bg-brand-gold/10 backdrop-blur-sm">
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {badge}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
          {title} <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-200 to-neutral-500">
            {titleHighlight}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed font-light">
          {description}
        </p>

        <HeroCTA
          primaryCtaText={primaryCtaText}
          primaryCtaUrl={primaryCtaUrl}
          secondaryCtaText={secondaryCtaText}
          secondaryCtaUrl={secondaryCtaUrl}
        />
      </div>
    </div>
  );
}

interface HeroCTAProps {
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
}

/**
 * HeroCTA component displays the call-to-action buttons
 */
function HeroCTA({ primaryCtaText, primaryCtaUrl, secondaryCtaText, secondaryCtaUrl }: HeroCTAProps) {
  return (
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
  );
}

/**
 * HeroSection component - Main hero section with background image, content, and CTAs
 */
export function HeroSection({ section }: HeroSectionProps) {
  const heroFields = useHeroFields(section);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <HeroBackground
        imageUrl={heroFields.backgroundImage}
        onImageError={handleImageError}
        hasError={imageError}
      />
      
      <HeroContent
        badge={heroFields.badge}
        title={heroFields.title}
        titleHighlight={heroFields.titleHighlight}
        description={heroFields.description}
        primaryCtaText={heroFields.primaryCtaText}
        primaryCtaUrl={heroFields.primaryCtaUrl}
        secondaryCtaText={heroFields.secondaryCtaText}
        secondaryCtaUrl={heroFields.secondaryCtaUrl}
      />
    </section>
  );
}
