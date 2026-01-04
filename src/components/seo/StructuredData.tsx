import { getSiteUrl } from '@/lib/seo';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface BreadcrumbItem {
  '@type': string;
  position: number;
  name: string;
  item: string;
}

interface BreadcrumbListSchema {
  '@context': string;
  '@type': string;
  itemListElement: BreadcrumbItem[];
}

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'breadcrumb';
  organization?: {
    name?: string;
    logo?: string;
    description?: string;
    phone?: string;
    email?: string;
    socialLinks?: string[];
  };
  website?: {
    name?: string;
    description?: string;
    searchUrl?: string;
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export function StructuredData({
  type = 'organization',
  organization,
  website,
  breadcrumbs,
}: StructuredDataProps) {
  const siteUrl = getSiteUrl();

  const schemas: Array<OrganizationSchema | WebSiteSchema | BreadcrumbListSchema> = [];

  // Organization Schema
  if (type === 'organization' || !type) {
    const orgSchema: OrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organization?.name || 'PLS Rental',
      url: siteUrl,
      description: organization?.description || 'Premium Sound System Rental & Event Audio Production for B2B, Corporate, and Government events.',
    };

    if (organization?.logo) {
      orgSchema.logo = organization.logo.startsWith('http')
        ? organization.logo
        : `${siteUrl}${organization.logo.startsWith('/') ? organization.logo : `/${organization.logo}`}`;
    }

    if (organization?.phone || organization?.email) {
      orgSchema.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
      };
      if (organization.phone) {
        orgSchema.contactPoint.telephone = organization.phone;
      }
      if (organization.email) {
        orgSchema.contactPoint.email = organization.email;
      }
    }

    if (organization?.socialLinks && organization.socialLinks.length > 0) {
      orgSchema.sameAs = organization.socialLinks;
    }

    schemas.push(orgSchema);
  }

  // WebSite Schema
  if (type === 'website') {
    const websiteSchema: WebSiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: website?.name || 'PLS Rental',
      url: siteUrl,
      description: website?.description || 'Premium Sound System Rental & Event Audio Production',
    };

    // Add search action if search URL is provided
    if (website?.searchUrl) {
      websiteSchema.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: website.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      };
    }

    schemas.push(websiteSchema);
  }

  // BreadcrumbList Schema
  if (type === 'breadcrumb' && breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema: BreadcrumbListSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url.startsWith('/') ? crumb.url : `/${crumb.url}`}`,
      })),
    };

    schemas.push(breadcrumbSchema);
  }

  if (schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}

