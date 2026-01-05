/**
 * CMS Utility Functions
 * 
 * Helper functions for working with CMS data structures
 */

import type { CMSImageValue } from '@/types/cms';

/**
 * Extract string value from CMS field (handles both string and object types)
 * 
 * @param fieldValue - The value from a CMS field (can be string, object, or null)
 * @returns The string value or null if not found
 * 
 * @example
 * // String value
 * getStringValue('Hello World')
 * // Returns: 'Hello World'
 * 
 * @example
 * // Object or null
 * getStringValue({ url: 'test' })
 * // Returns: null
 */
export function getStringValue(fieldValue: unknown): string | null {
  if (typeof fieldValue === 'string') {
    return fieldValue;
  }
  return null;
}

/**
 * Normalize localhost URLs to use CMS_API_URL hostname for better server-side resolution
 * This fixes issues where Next.js Image Optimization cannot resolve localhost in Docker/WSL
 * 
 * For Docker containers: If CMS_API_URL is set to a container name (e.g., http://cms:8000),
 * this function will transform http://localhost/storage/... to http://cms/storage/...
 * ensuring the Next.js server can reach the CMS container.
 */
function normalizeImageUrl(url: string): string {
  // Check if URL uses localhost
  if (!url || (!url.startsWith('http://localhost') && !url.startsWith('https://localhost'))) {
    return url;
  }

  // Get CMS_API_URL from environment (only available server-side)
  // In client components, this will be undefined, but URLs should already be normalized
  const cmsUrl = typeof process !== 'undefined' && process.env ? process.env.CMS_API_URL : undefined;
  
  try {
    let targetHost: string;
    const imageUrlObj = new URL(url);
    
    if (cmsUrl && cmsUrl !== 'disabled' && cmsUrl.trim() !== '') {
      // Normalize CMS URL (add protocol if missing)
      let normalizedCmsUrl = cmsUrl.trim().replace(/\/+$/, '');
      if (!/^https?:\/\//i.test(normalizedCmsUrl)) {
        if (/^localhost|^\d+\.\d+\.\d+\.\d+|^127\.\d+\.\d+\.\d+/i.test(normalizedCmsUrl)) {
          normalizedCmsUrl = `http://${normalizedCmsUrl}`;
        } else {
          normalizedCmsUrl = `https://${normalizedCmsUrl}`;
        }
      }

      const cmsUrlObj = new URL(normalizedCmsUrl);
      
      // If CMS URL also uses localhost, use 127.0.0.1 for better server-side resolution
      if (cmsUrlObj.hostname === 'localhost') {
        targetHost = `127.0.0.1${cmsUrlObj.port ? `:${cmsUrlObj.port}` : ''}`;
      } else {
        // Use CMS hostname directly (works for Docker container names, host.docker.internal, etc.)
        // Preserve the port from CMS_API_URL if present, otherwise use port from image URL if it exists
        if (cmsUrlObj.port) {
          targetHost = cmsUrlObj.host; // Includes hostname:port
        } else if (imageUrlObj.port) {
          targetHost = `${cmsUrlObj.hostname}:${imageUrlObj.port}`;
        } else {
          targetHost = cmsUrlObj.hostname;
        }
      }
    } else {
      // No CMS_API_URL set, use 127.0.0.1 as fallback for localhost
      targetHost = `127.0.0.1${imageUrlObj.port ? `:${imageUrlObj.port}` : ''}`;
    }

    // Replace localhost with target hostname, preserving path, query, and hash
    const newUrl = `${imageUrlObj.protocol}//${targetHost}${imageUrlObj.pathname}${imageUrlObj.search}${imageUrlObj.hash}`;
    return newUrl;
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}

/**
 * Extract image URL from CMS image field value
 * 
 * Handles the CMS image field structure where image fields have:
 * - `value`: CMSImageValue object with `url` (optimized/converted) and `original_url` properties
 * - `type`: "image"
 * 
 * Also supports string format for backward compatibility.
 * Normalizes localhost URLs to use CMS_API_URL for better server-side resolution.
 * 
 * @param imageValue - The value from a CMS image field:
 *   - CMSImageValue object: { id, url, original_url, alt, title, ... }
 *   - string: URL string (backward compatibility)
 *   - null/undefined: empty field
 * @returns The image URL string (prefers optimized `url` over `original_url`) or null if not found
 * 
 * @example
 * // CMS format (CMSImageValue object from fields.image.value)
 * getImageUrl({
 *   id: 14,
 *   url: 'http://localhost/storage/14/conversions/image.webp',
 *   original_url: 'http://localhost/storage/14/image.png',
 *   alt: 'image.png',
 *   ...
 * })
 * // Returns: 'http://localhost/storage/14/conversions/image.webp' (prefers optimized url)
 * // Or normalized URL if CMS_API_URL is set
 * 
 * @example
 * // String format (backward compatibility)
 * getImageUrl('/images/hero.jpg')
 * // Returns: '/images/hero.jpg'
 */
export function getImageUrl(imageValue: unknown): string | null {
  if (!imageValue) return null;
  
  let url: string | null = null;
  
  // If it's already a string, use it (backward compatibility)
  if (typeof imageValue === 'string') {
    url = imageValue;
  }
  // If it's an object (CMSImageValue format from CMS)
  else if (typeof imageValue === 'object' && imageValue !== null) {
    // Type guard to check if it's a CMSImageValue-like object
    const imageObj = imageValue as Partial<CMSImageValue> & { url?: string; original_url?: string };
    
    // Prefer optimized/converted URL over original URL
    // The `url` property typically contains optimized versions (e.g., webp conversions)
    // Fall back to `original_url` if `url` is not available
    url = imageObj.url || imageObj.original_url || null;
  }
  
  if (!url) return null;
  
  // Normalize localhost URLs for better server-side resolution
  return normalizeImageUrl(url);
}

