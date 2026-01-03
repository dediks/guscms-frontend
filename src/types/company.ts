export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  socialLinks?: SocialLink[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

export interface AboutSection {
  title?: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  history?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  tagline?: string;
  logo?: string;
  favicon?: string;
  about: AboutSection;
  services: Service[];
  team: TeamMember[];
  contact: ContactInfo;
  metadata?: {
    description?: string;
    keywords?: string[];
  };
}

