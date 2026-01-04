import type { Metadata } from 'next';
import type { CMSPageMeta } from '@/types/cms';

/**
 * Get the site URL from environment variable or construct from request
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (siteUrl) {
    // Remove trailing slash
    return siteUrl.replace(/\/+$/, '');
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback - should ideally be set via env var
  return 'https://plsrental.com';
}

/**
 * Default metadata for the site
 */
export const defaultMetadata = {
  title: {
    default: 'PLS | Premium Sound System Rental',
    template: '%s | PLS Rental',
  },
  description: 'Premium Sound System Rental & Event Audio Production for B2B, Corporate, and Government events.',
  keywords: ['sound system rental', 'audio production', 'event audio', 'corporate events', 'B2B audio', 'government events'],
  siteName: 'PLS Rental',
  locale: 'id_ID',
  type: 'website',
} as const;

/**
 * Convert CMS robots meta string to Next.js robots format
 */
function parseRobotsMeta(robots: string | null): Metadata['robots'] {
  if (!robots) {
    return undefined;
  }

  const directives = robots.split(',').map(d => d.trim().toLowerCase());
  const result: Metadata['robots'] = {};

  for (const directive of directives) {
    if (directive === 'noindex') {
      result.index = false;
    } else if (directive === 'index') {
      result.index = true;
    } else if (directive === 'nofollow') {
      result.follow = false;
    } else if (directive === 'follow') {
      result.follow = true;
    } else if (directive === 'noarchive') {
      result.archive = false;
    } else if (directive === 'archive') {
      result.archive = true;
    } else if (directive === 'nosnippet') {
      result.snippet = false;
    } else if (directive === 'snippet') {
      result.snippet = true;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Generate absolute URL from relative path
 */
export function getAbsoluteUrl(path: string): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

/**
 * Generate Open Graph image URL
 */
function getOgImageUrl(ogImage: string | null, defaultPath: string = '/og-image.jpg'): string | undefined {
  if (ogImage) {
    // If it's already an absolute URL, return as is
    if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) {
      return ogImage;
    }
    // If it's a relative path, make it absolute
    return getAbsoluteUrl(ogImage);
  }
  
  // Return default OG image if available
  return getAbsoluteUrl(defaultPath);
}

/**
 * Generate metadata from CMS page meta
 */
export function generateMetadataFromCMS(
  cmsMeta: CMSPageMeta | null | undefined,
  pageTitle?: string,
  pageSlug?: string
): Metadata {
  const siteUrl = getSiteUrl();
  
  // Use CMS meta if available, otherwise fall back to defaults
  const title = cmsMeta?.title || pageTitle || defaultMetadata.title.default;
  const description = cmsMeta?.description || defaultMetadata.description;
  const keywords = cmsMeta?.keywords || defaultMetadata.keywords.join(', ');
  const canonicalUrl = cmsMeta?.canonical_url 
    ? (cmsMeta.canonical_url.startsWith('http') 
        ? cmsMeta.canonical_url 
        : getAbsoluteUrl(cmsMeta.canonical_url))
    : (pageSlug ? getAbsoluteUrl(pageSlug) : siteUrl);
  
  const ogImage = getOgImageUrl(cmsMeta?.og_image || null);
  const robots = parseRobotsMeta(cmsMeta?.robots || null);

  return {
    title,
    description,
    keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      type: 'website',
      locale: defaultMetadata.locale,
      url: canonicalUrl,
      siteName: defaultMetadata.siteName,
      title,
      description,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/**
 * Generate breadcrumbs from slug path for SEO
 */
export function generateBreadcrumbs(slug: string): Array<{ name: string; url: string }> {
  const siteUrl = getSiteUrl();
  const segments = slug.split('/').filter(Boolean);
  
  const breadcrumbs: Array<{ name: string; url: string }> = [
    { name: 'Home', url: siteUrl },
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({
      name,
      url: `${siteUrl}${currentPath}`,
    });
  });
  
  return breadcrumbs;
}

/**
 * Generate default metadata for pages without CMS data
 */
export function generateDefaultMetadata(
  title?: string,
  description?: string,
  path?: string
): Metadata {
  const siteUrl = getSiteUrl();
  const pageTitle = title || defaultMetadata.title.default;
  const pageDescription = description || defaultMetadata.description;
  const pageUrl = path ? getAbsoluteUrl(path) : siteUrl;
  const ogImage = getAbsoluteUrl('/og-image.jpg');

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: defaultMetadata.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: defaultMetadata.locale,
      url: pageUrl,
      siteName: defaultMetadata.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

