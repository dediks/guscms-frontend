import type { 
  CMSPage, 
  CMSPagesResponse, 
  CMSSettings,
  JSONAPIPagesResponse,
  JSONAPIPageResource,
  JSONAPISectionResource,
  CMSSection,
  CMSField
} from '@/types/cms';
import { logger } from './logger';
import { getImageUrl } from './cms-utils';

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

/**
 * Normalize image URLs in section fields (server-side only)
 * This ensures image URLs are normalized before being passed to client components
 * 
 * Handles CMS image field structure where:
 * - field.value is a CMSImageValue object: { id, url, original_url, alt, title, ... }
 * - field.type is "image"
 * 
 * Also supports string URLs for backward compatibility.
 * 
 * The function extracts the URL from the image value object and normalizes it,
 * then replaces the field.value with the normalized string URL for client components.
 */
function normalizeSectionFields(fields: Record<string, CMSField>): Record<string, CMSField> {
  const normalizedFields: Record<string, CMSField> = {};
  
  for (const [key, field] of Object.entries(fields)) {
    // Check if this field might contain an image URL
    // Common image field names: image, background_image, backgroundImage, etc.
    // Also check field type to be more precise (CMS returns type: "image" for image fields)
    const isImageField = /image|Image|background|Background/.test(key) || 
                        (field?.type && /image|Image/.test(field.type));
    
    if (isImageField && field?.value) {
      // Normalize the image URL using getImageUrl (works server-side)
      // getImageUrl handles CMSImageValue objects (extracts url or original_url) and string formats
      // Returns normalized string URL
      const normalizedUrl = getImageUrl(field.value);
      
      // Always replace with normalized string URL (client components expect string)
      // This ensures Next.js Image component can access the URL properly
      // If normalization fails, try to extract URL from object or use original string
      let finalUrl = normalizedUrl;
      if (!finalUrl && typeof field.value === 'object' && field.value !== null) {
        const imageObj = field.value as { url?: string; original_url?: string };
        finalUrl = imageObj.url || imageObj.original_url || null;
      } else if (!finalUrl && typeof field.value === 'string') {
        finalUrl = field.value;
      }
      
      // Log normalization for debugging (only in development)
      if (process.env.NODE_ENV === 'development' && finalUrl) {
        const originalUrl = typeof field.value === 'string' ? field.value : 
                          (typeof field.value === 'object' && field.value !== null ? 
                           (field.value as { url?: string }).url : 'unknown');
        if (originalUrl !== finalUrl) {
          logger.log(`[Image Normalization] ${key}: ${originalUrl} → ${finalUrl}`);
        }
      }
      
      normalizedFields[key] = {
        ...field,
        value: finalUrl,
      };
    } else {
      // Keep other fields as-is
      normalizedFields[key] = field;
    }
  }
  
  return normalizedFields;
}

/**
 * Transform JSON:API response format to CMSPage[] format
 * 
 * This function converts the JSON:API structure (with data, included, and meta)
 * to the expected CMSPage[] format by:
 * 1. Converting page resources from attributes structure
 * 2. Matching sections from included array based on relationships
 * 3. Converting string IDs to numbers
 * 4. Preserving all field and settings structures
 * 5. Normalizing image URLs in section fields (server-side)
 */
function transformJSONAPIResponse(response: JSONAPIPagesResponse): {
  pages: CMSPage[];
  settings: CMSSettings | null;
} {
  // Validate response structure
  if (!response || !response.data || !Array.isArray(response.data)) {
    logger.error('[JSON:API Transformer] Invalid response structure:', {
      hasResponse: !!response,
      hasData: !!response?.data,
      dataIsArray: Array.isArray(response?.data),
      responseKeys: response ? Object.keys(response) : [],
    });
    throw new Error('Invalid JSON:API response: missing or invalid data array');
  }

  // Create a map of sections by ID for quick lookup
  const sectionsMap = new Map<string, JSONAPISectionResource>();
  response.included?.forEach((section) => {
    if (section?.id && section?.attributes) {
      sectionsMap.set(section.id, section);
    } else {
      logger.warn('[JSON:API Transformer] Invalid section in included array:', section);
    }
  });

  // Transform pages
  const pages: CMSPage[] = response.data
    .map((pageResource: JSONAPIPageResource, index: number) => {
      // Validate page resource structure
      if (!pageResource) {
        logger.error(`[JSON:API Transformer] Page resource at index ${index} is null or undefined`);
        return null;
      }

      if (!pageResource.attributes) {
        logger.error(`[JSON:API Transformer] Page resource at index ${index} missing attributes:`, {
          id: pageResource.id,
          type: pageResource.type,
          resource: pageResource,
        });
        return null;
      }

      // Get section IDs from relationships
      const sectionIds = pageResource.relationships?.sections?.data || [];
      
      // Match sections from included array
      const sections: CMSSection[] = sectionIds
        .map((sectionRef) => {
          if (!sectionRef?.id) {
            logger.warn('[JSON:API Transformer] Invalid section reference:', sectionRef);
            return null;
          }

          const sectionResource = sectionsMap.get(sectionRef.id);
          if (!sectionResource) {
            logger.warn(`[JSON:API Transformer] Section ${sectionRef.id} not found in included array`);
            return null;
          }

          if (!sectionResource.attributes) {
            logger.warn(`[JSON:API Transformer] Section ${sectionRef.id} missing attributes`);
            return null;
          }

          // Transform section from JSON:API format to CMSSection
          // Normalize image URLs in fields (server-side normalization)
          // Handle case where fields might be an array instead of an object
          const rawFields = Array.isArray(sectionResource.attributes.fields) 
            ? {} 
            : (sectionResource.attributes.fields || {});
          const normalizedFields = normalizeSectionFields(rawFields);
          
          return {
            id: parseInt(sectionResource.id, 10),
            type: sectionResource.attributes.type,
            order: sectionResource.attributes.order,
            is_active: sectionResource.attributes.is_active,
            settings: (sectionResource.attributes.settings as unknown) as unknown[],
            fields: normalizedFields,
          };
        })
        .filter((section): section is CMSSection => section !== null)
        .sort((a, b) => a.order - b.order); // Sort by order

      // Transform page from JSON:API format to CMSPage
      // At this point, we've validated that attributes exists, but use optional chaining for extra safety
      const attrs = pageResource.attributes;
      if (!attrs) {
        logger.error(`[JSON:API Transformer] Attributes is null/undefined after validation for page at index ${index}`);
        return null;
      }

      return {
        id: parseInt(pageResource.id, 10),
        slug: attrs.slug || '',
        title: attrs.title || '',
        template: attrs.template ?? null,
        published_at: attrs.published_at ?? null,
        meta: attrs.meta || {
          title: null,
          description: null,
          keywords: null,
          og_image: null,
          canonical_url: null,
          robots: null,
        },
        sections,
      };
    })
    .filter((page): page is CMSPage => page !== null);

  // Extract settings from meta
  const settings = response.meta?.settings || null;

  return { pages, settings };
}

class CMSClient {
  private baseUrl: string;
  private token?: string;
  private defaultEndpoint: string;
  private cachedSettings: CMSSettings | null = null;

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
          revalidate: 3600, // Cache for 1 hour (3600 seconds)
          tags: ['cms-pages'] // Add cache tag for revalidation
        },
      });

      // Handle 503 as valid response (CMS maintenance mode with settings)
      // CMS may return 503 with valid JSON body containing settings
      if (response.status === 503) {
        logger.warn('[CMS Client] CMS API returned 503 (Service Unavailable) - parsing response for maintenance settings');
        // Still parse the response body as it contains valid settings
        return response.json();
      }

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
      logger.log('[CMS Client] Fetching pages from:', `${this.baseUrl}${this.defaultEndpoint}`);
      const response = await this.fetchWithAuth<any>(this.defaultEndpoint);
      logger.debug('[CMS Client] Raw response structure:', {
        hasData: !!response?.data,
        dataIsArray: Array.isArray(response?.data),
        hasIncluded: !!response?.included,
        hasMeta: !!response?.meta,
        responseKeys: response ? Object.keys(response) : [],
        firstDataItem: response?.data?.[0] ? {
          hasId: !!response.data[0].id,
          hasType: !!response.data[0].type,
          hasAttributes: !!response.data[0].attributes,
          keys: Object.keys(response.data[0]),
        } : null,
      });
      logger.debug('[CMS Client] Raw response:', JSON.stringify(response, null, 2));
      
      // Validate that response has the expected structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response: response is not an object');
      }

      // Check if response is in JSON:API format (has data array with items that have attributes)
      const isJSONAPIFormat = Array.isArray(response.data) && 
        response.data.length > 0 && 
        response.data[0]?.attributes !== undefined;

      if (isJSONAPIFormat) {
        // Transform JSON:API response to CMSPage[] format
        const { pages, settings } = transformJSONAPIResponse(response as JSONAPIPagesResponse);
        
        // Extract and cache settings from meta.settings
        if (settings) {
          this.cachedSettings = settings;
          logger.log('[CMS Client] Settings extracted:', {
            maintenanceModeEnabled: settings.maintenance_mode_enabled,
            hasLogo: !!settings.logo_url,
          });
        }
        
        logger.log('[CMS Client] Number of pages fetched:', pages.length);
        pages.forEach((page, index) => {
          logger.debug(`[CMS Client] Page ${index + 1}:`, {
            id: page.id,
            slug: page.slug,
            title: page.title,
            sectionsCount: page.sections?.length || 0,
            published: page.published_at ? 'Yes' : 'No',
          });
        });
        return pages;
      } else {
        // Handle old format (CMSPagesResponse) for backward compatibility
        logger.warn('[CMS Client] Response appears to be in old format, attempting to parse as CMSPagesResponse');
        const oldResponse = response as CMSPagesResponse;
        
        // Extract and cache settings from old format
        if (oldResponse.settings) {
          this.cachedSettings = oldResponse.settings;
          logger.log('[CMS Client] Settings extracted (old format):', {
            maintenanceModeEnabled: oldResponse.settings.maintenance_mode_enabled,
            hasLogo: !!oldResponse.settings.logo_url,
          });
        }
        
        const pages = oldResponse.data || [];
        
        // Normalize image URLs in section fields for old format too
        const normalizedPages = pages.map(page => ({
          ...page,
          sections: page.sections?.map(section => ({
            ...section,
            fields: normalizeSectionFields(section.fields || {}),
          })) || [],
        }));
        
        logger.log('[CMS Client] Number of pages fetched (old format):', normalizedPages.length);
        return normalizedPages;
      }
    } catch (error) {
      logger.error('[CMS Client] Error fetching pages:', error);
      throw error;
    }
  }

  async getSettings(): Promise<CMSSettings | null> {
    try {
      // If settings are already cached, return them
      if (this.cachedSettings) {
        return this.cachedSettings;
      }
      
      // Otherwise, fetch pages which will also extract settings
      await this.getPages();
      return this.cachedSettings;
    } catch (error) {
      logger.error('[CMS Client] Error fetching settings:', error);
      return null;
    }
  }

  async getPageBySlug(slug: string): Promise<CMSPage | null> {
    try {
      logger.log('[CMS Client] Fetching page by slug:', slug);
      const pages = await this.getPages();
      // Normalize slug: remove leading/trailing slashes for comparison
      const normalizedSlug = slug.replace(/^\/+|\/+$/g, '') || '/';
      const page = pages.find(page => {
        const pageSlug = page.slug.replace(/^\/+|\/+$/g, '') || '/';
        return pageSlug === normalizedSlug;
      }) || null;
      
      if (page) {
        logger.log('[CMS Client] Page found:', {
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
        logger.debug('[CMS Client] Full page data:', JSON.stringify(page, null, 2));
      } else {
        logger.warn('[CMS Client] Page not found for slug:', slug);
        logger.debug('[CMS Client] Available slugs:', pages.map(p => p.slug));
      }
      
      return page;
    } catch (error) {
      logger.error('[CMS Client] Error fetching page by slug:', error);
      throw error;
    }
  }

  async getPageById(id: number): Promise<CMSPage | null> {
    try {
      const pages = await this.getPages();
      return pages.find(page => page.id === id) || null;
    } catch (error) {
      logger.error('Error fetching page by ID:', error);
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

