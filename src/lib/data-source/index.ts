/**
 * Data Source Abstraction Layer
 * 
 * Provides unified interface for both CMS and static data sources
 * Automatically switches between CMS and static based on configuration
 */

import { getDataSourceConfig, isCMSEnabled } from './config';
import { cmsClient } from '../cms-client';
import { StaticDataClient } from './static-data';
import type { CMSPage, CMSSettings } from '@/types/cms';
import { logger } from '../logger';

// Create static data client instance
const staticDataClient = new StaticDataClient();

/**
 * Unified Data Client
 * Automatically uses CMS or static data based on configuration
 */
class UnifiedDataClient {
  async getPages(): Promise<CMSPage[]> {
    if (isCMSEnabled()) {
      logger.debug('[Data Source] Using CMS');
      return cmsClient.getPages();
    } else {
      logger.debug('[Data Source] Using static data');
      return staticDataClient.getPages();
    }
  }

  async getSettings(): Promise<CMSSettings | null> {
    if (isCMSEnabled()) {
      logger.debug('[Data Source] Using CMS for settings');
      return cmsClient.getSettings();
    } else {
      logger.debug('[Data Source] Using static data for settings');
      return staticDataClient.getSettings();
    }
  }

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    if (isCMSEnabled()) {
      logger.debug('[Data Source] Using CMS for page:', slug);
      return cmsClient.getPageBySlug(slug);
    } else {
      logger.debug('[Data Source] Using static data for page:', slug);
      return staticDataClient.getPageBySlug(slug);
    }
  }

  async getPageById(id: number): Promise<CMSPage | null> {
    if (isCMSEnabled()) {
      return cmsClient.getPageById(id);
    } else {
      return staticDataClient.getPageById(id);
    }
  }

  /**
   * Get current data source type
   */
  getDataSourceType(): 'cms' | 'static' {
    const config = getDataSourceConfig();
    return config.type;
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    if (!isCMSEnabled()) {
      staticDataClient.clearCache();
    }
    // CMS cache is handled by Next.js cache tags
  }
}

// Export singleton instance
export const dataClient = new UnifiedDataClient();

// Export types and utilities
export { getDataSourceConfig, isCMSEnabled, isStaticDataEnabled } from './config';
export { StaticDataClient } from './static-data';

