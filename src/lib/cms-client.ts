import type { CMSPage, CMSPagesResponse } from '@/types/cms';

const CMS_API_URL = process.env.CMS_API_URL;
const CMS_API_TOKEN = process.env.CMS_API_TOKEN;
const CMS_API_ENDPOINT = process.env.CMS_API_ENDPOINT || '/api/v1/pages';

interface CMSClientConfig {
  baseUrl: string;
  token?: string;
}

/**
 * Normalizes a URL by adding protocol if missing
 */
function normalizeUrl(url: string): string {
  if (!url) {
    throw new Error('CMS_API_URL is not configured');
  }

  // Remove trailing slashes
  url = url.trim().replace(/\/+$/, '');

  // If URL already has protocol, return as is
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // For localhost or IP addresses, default to http://
  if (/^localhost|^\d+\.\d+\.\d+\.\d+|^127\.\d+\.\d+\.\d+/i.test(url)) {
    return `http://${url}`;
  }

  // For other cases, default to https://
  return `https://${url}`;
}

class CMSClient {
  private baseUrl: string;
  private token?: string;
  private defaultEndpoint: string;

  constructor(config: CMSClientConfig & { defaultEndpoint?: string }) {
    try {
      this.baseUrl = normalizeUrl(config.baseUrl);
    } catch (error) {
      throw new Error(
        `Invalid CMS API URL configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
    this.token = config.token;
    this.defaultEndpoint = config.defaultEndpoint || '/api/v1/pages';
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}`;

    // Validate URL before making request
    try {
      new URL(url);
    } catch (error) {
      throw new Error(
        `Invalid URL constructed: ${url}. Please check CMS_API_URL and CMS_API_ENDPOINT configuration.`
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        next: { 
          revalidate: false, // Cache for 1 hour by default
          tags: ['cms-pages'] // Add cache tag for revalidation
        },
      });

      if (!response.ok) {
        throw new Error(
          `CMS API error: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to parse URL')) {
        throw new Error(
          `Failed to parse URL: ${url}. Make sure CMS_API_URL includes the protocol (http:// or https://).`
        );
      }
      throw error;
    }
  }

  async getPages(): Promise<CMSPage[]> {
    try {
      console.log('[CMS Client] Fetching pages from:', `${this.baseUrl}${this.defaultEndpoint}`);
      const response = await this.fetchWithAuth<CMSPagesResponse>(this.defaultEndpoint);
      console.log('[CMS Client] Raw response:', JSON.stringify(response, null, 2));
      const pages = response.data || [];
      console.log('[CMS Client] Number of pages fetched:', pages.length);
      pages.forEach((page, index) => {
        console.log(`[CMS Client] Page ${index + 1}:`, {
          id: page.id,
          slug: page.slug,
          title: page.title,
          sectionsCount: page.sections?.length || 0,
          published: page.published_at ? 'Yes' : 'No',
        });
      });
      return pages;
    } catch (error) {
      console.error('[CMS Client] Error fetching pages:', error);
      throw error;
    }
  }

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    try {
      console.log('[CMS Client] Fetching page by slug:', slug);
      const pages = await this.getPages();
      // Normalize slug: remove leading/trailing slashes for comparison
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || '/';
      const page = pages.find(page => {
        const pageSlug = page.slug.replace(/^\/+|\/+$/g, '') || '/';
        return pageSlug === normalizedSlug;
      }) || null;
      
      if (page) {
        console.log('[CMS Client] Page found:', {
          id: page.id,
          slug: page.slug,
          title: page.title,
          sections: page.sections?.map(s => ({
            id: s.id,
            type: s.type,
            order: s.order,
            isActive: s.is_active,
            fieldsCount: Object.keys(s.fields || {}).length,
          })),
        });
        console.log('[CMS Client] Full page data:', JSON.stringify(page, null, 2));
      } else {
        console.warn('[CMS Client] Page not found for slug:', slug);
        console.log('[CMS Client] Available slugs:', pages.map(p => p.slug));
      }
      
      return page;
    } catch (error) {
      console.error('[CMS Client] Error fetching page by slug:', error);
      throw error;
    }
  }

  async getPageById(id: number): Promise<CMSPage | null> {
    try {
      const pages = await this.getPages();
      return pages.find(page => page.id === id) || null;
    } catch (error) {
      console.error('Error fetching page by ID:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const cmsClient = new CMSClient({
  baseUrl: CMS_API_URL || '',
  token: CMS_API_TOKEN,
  defaultEndpoint: CMS_API_ENDPOINT,
});

// Export the class for custom instances if needed
export { CMSClient };

