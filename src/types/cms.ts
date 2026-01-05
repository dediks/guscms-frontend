export interface CMSPageMeta {
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots: string | null;
}

/**
 * Image value structure from CMS image fields
 * The CMS returns image fields with this structure in the `value` property
 */
export interface CMSImageValue {
  id: number;
  url: string;
  original_url: string;
  alt: string | null;
  title: string | null;
  width: number | null;
  height: number | null;
  mime_type: string;
  file_size: number;
  responsive_images: unknown[];
  thumbnail: string | null;
}

export interface CMSField {
  /**
   * Field value - can be:
   * - string: for text fields
   * - CMSImageValue: for image fields (when type is "image")
   * - null: for empty fields
   * - Record<string, unknown>: for other complex field types
   */
  value: string | null | CMSImageValue | Record<string, unknown>;
  type: string;
}

export interface CMSSectionFields {
  [key: string]: CMSField;
}

export interface CMSSection {
  id: number;
  type: string;
  order: number;
  is_active: boolean;
  settings: unknown[];
  fields: CMSSectionFields;
}

export interface CMSPage {
  id: number;
  slug: string;
  title: string;
  template: string | null;
  published_at: string | null;
  meta: CMSPageMeta;
  sections: CMSSection[];
}

export interface CMSSettings {
  maintenance_message: string | null;
  logo: string | null;
  maintenance_mode_enabled: string;
  logo_url: string | null;
}

export interface CMSPagesResponse {
  data?: CMSPage[]; // Optional: 503 responses may only include settings
  settings?: CMSSettings;
}

// JSON:API Format Types
export interface JSONAPIPageAttributes {
  slug: string;
  title: string;
  template: string | null;
  published_at: string | null;
  meta: CMSPageMeta;
}

export interface JSONAPIPageRelationships {
  sections: {
    data: Array<{
      type: string;
      id: string;
    }>;
  };
}

export interface JSONAPIPageResource {
  type: string;
  id: string;
  attributes: JSONAPIPageAttributes;
  relationships?: JSONAPIPageRelationships;
}

export interface JSONAPISectionAttributes {
  type: string;
  order: number;
  is_active: boolean;
  settings: Record<string, unknown>;
  fields: CMSSectionFields;
}

export interface JSONAPISectionResource {
  type: string;
  id: string;
  attributes: JSONAPISectionAttributes;
}

export interface JSONAPIPagesResponse {
  data: JSONAPIPageResource[];
  included?: JSONAPISectionResource[];
  meta?: {
    total?: number;
    settings?: CMSSettings;
  };
}

