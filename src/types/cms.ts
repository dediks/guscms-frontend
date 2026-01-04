export interface CMSPageMeta {
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  robots: string | null;
}

export interface CMSField {
  value: string | null;
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
  data: CMSPage[];
  settings?: CMSSettings;
}

