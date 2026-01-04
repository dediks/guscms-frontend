/**
 * Static Data Provider
 * 
 * Provides data from static files (JSON/TypeScript) when CMS is not enabled
 * This is for clients who don't need to update content themselves
 */

import type { CMSPage, CMSSettings } from '@/types/cms';
import { logger } from '../logger';

// Import static data - you can replace this with actual file imports
// For now, we'll use a function that can load from files

/**
 * Load static pages data
 * This can be from:
 * - JSON files imported directly (recommended for Next.js)
 * - TypeScript/JavaScript files with data exports
 * - Or inline data for simple cases
 */
async function loadStaticPages(): Promise<CMSPage[]> {
  try {
    // Option 1: Try to import from static data file
    // You can create src/data/static/pages.ts and export the data
    try {
      // Dynamic import with error handling
      const staticData = await import('@/data/static/pages');
      if (staticData && staticData.default) {
        logger.log('[Static Data] Loaded pages from module');
        return Array.isArray(staticData.default) ? staticData.default : staticData.default.pages || [];
      }
      if (staticData && staticData.pages) {
        logger.log('[Static Data] Loaded pages from module export');
        return Array.isArray(staticData.pages) ? staticData.pages : [];
      }
    } catch (error) {
      logger.debug('[Static Data] Could not load from module (this is OK if file does not exist):', error);
    }

    // Option 2: Return default/fallback data
    logger.log('[Static Data] Using default static pages');
    return getDefaultStaticPages();
  } catch (error) {
    logger.error('[Static Data] Error loading static pages:', error);
    return getDefaultStaticPages();
  }
}

/**
 * Load static settings data
 */
async function loadStaticSettings(): Promise<CMSSettings | null> {
  try {
    // Try to import from static data file
    try {
      const staticData = await import('@/data/static/settings');
      if (staticData && staticData.default) {
        logger.log('[Static Data] Loaded settings from module');
        return staticData.default;
      }
      if (staticData && staticData.settings) {
        logger.log('[Static Data] Loaded settings from module export');
        return staticData.settings;
      }
    } catch (error) {
      logger.debug('[Static Data] Could not load settings from module (this is OK if file does not exist):', error);
    }

    // Return default settings
    return getDefaultStaticSettings();
  } catch (error) {
    logger.error('[Static Data] Error loading static settings:', error);
    return getDefaultStaticSettings();
  }
}

/**
 * Default static pages (fallback)
 * You can customize this or load from actual files
 */
function getDefaultStaticPages(): CMSPage[] {
  return [
    {
      id: 1,
      slug: '/',
      title: 'Home',
      template: null,
      published_at: new Date().toISOString(),
      meta: {
        title: 'Home | PLS Rental',
        description: 'Premium Sound System Rental & Event Audio Production',
        keywords: 'sound system rental, audio production',
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
          fields: {},
        },
      ],
    },
  ];
}

/**
 * Default static settings (fallback)
 */
function getDefaultStaticSettings(): CMSSettings {
  return {
    maintenance_mode_enabled: '0',
    maintenance_message: null,
    logo: null,
    logo_url: null,
  };
}

/**
 * Static Data Client
 * Mimics CMS Client interface but uses static data
 */
export class StaticDataClient {
  private cachedPages: CMSPage[] | null = null;
  private cachedSettings: CMSSettings | null = null;

  async getPages(): Promise<CMSPage[]> {
    if (this.cachedPages) {
      return this.cachedPages;
    }
    
    this.cachedPages = await loadStaticPages();
    return this.cachedPages;
  }

  async getSettings(): Promise<CMSSettings | null> {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }
    
    this.cachedSettings = await loadStaticSettings();
    return this.cachedSettings;
  }

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    const pages = await this.getPages();
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || '/';
    
    return pages.find(page => {
      const pageSlug = page.slug.replace(/^\/+|\/+$/g, '') || '/';
      return pageSlug === normalizedSlug;
    }) || null;
  }

  async getPageById(id: number): Promise<CMSPage | null> {
    const pages = await this.getPages();
    return pages.find(page => page.id === id) || null;
  }

  // Clear cache (useful for development)
  clearCache(): void {
    this.cachedPages = null;
    this.cachedSettings = null;
  }
}

