export interface CMSPageMeta {
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots: string | null;
}

export interface CMSField {
  value: string | null | Record<string, unknown>; // Can be string, null, or object (for image fields)
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

