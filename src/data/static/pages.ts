/**
 * Static Pages Data
 * 
 * This file contains static page data for clients who don't use CMS.
 * You can customize this data per client project.
 * 
 * To use this:
 * 1. Set CMS_API_URL to empty or 'disabled' in .env.local
 * 2. Customize the data below for your client
 * 3. The system will automatically use this data instead of CMS
 */

import type { CMSPage } from '@/types/cms';

// Example static pages data
// You can customize this for each client project
const staticPages: CMSPage[] = [
  {
    id: 1,
    slug: '/',
    title: 'Home',
    template: null,
    published_at: new Date().toISOString(),
    meta: {
      title: 'Home | PLS Rental',
      description: 'Premium Sound System Rental & Event Audio Production for B2B, Corporate, and Government events.',
      keywords: 'sound system rental, audio production, event audio, corporate events',
      og_image: null,
      canonical_url: null,
      robots: null,
    },
    sections: [
      {
        id: 1,
        type: 'hero',
        order: 1,
        is_active: true,
        settings: [],
        fields: {
          badge: { value: 'Premium Audio Solutions', type: 'text' },
          title: { value: 'Sound System Rental', type: 'text' },
          title_highlight: { value: 'Terpercaya', type: 'text' },
          description: { value: 'Layanan audio profesional untuk acara korporat dan kenegaraan', type: 'text' },
          primary_cta_text: { value: 'Hubungi Kami', type: 'text' },
          primary_cta_url: { value: '#contact', type: 'text' },
          secondary_cta_text: { value: 'Lihat Portfolio', type: 'text' },
          secondary_cta_url: { value: '#portfolio', type: 'text' },
          background_image: { value: '/images/hero-bg.jpg', type: 'image' },
        },
      },
      // Add more sections as needed
    ],
  },
  // Add more pages as needed
  // {
  //   id: 2,
  //   slug: '/about',
  //   title: 'About Us',
  //   ...
  // },
];

export default staticPages;

