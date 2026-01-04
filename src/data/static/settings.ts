/**
 * Static Settings Data
 * 
 * This file contains static settings for clients who don't use CMS.
 * You can customize this data per client project.
 */

import type { CMSSettings } from '@/types/cms';

// Example static settings data
// You can customize this for each client project
const staticSettings: CMSSettings = {
  maintenance_mode_enabled: '0', // '0' = disabled, '1' = enabled
  maintenance_message: null,
  logo: null,
  logo_url: '/images/logo.png', // Path to logo image
};

export default staticSettings;

