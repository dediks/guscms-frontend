/**
 * Data Source Configuration
 * 
 * Determines whether to use CMS (client can update) or static data (developer only)
 */

export type DataSourceType = 'cms' | 'static';

export interface DataSourceConfig {
  type: DataSourceType;
  // For CMS mode
  cmsUrl?: string;
  cmsToken?: string;
  cmsEndpoint?: string;
  // For static mode
  staticDataPath?: string;
}

/**
 * Get data source configuration from environment variables
 * 
 * If CMS_API_URL is set, use CMS mode
 * Otherwise, use static data mode
 */
export function getDataSourceConfig(): DataSourceConfig {
  const cmsUrl = process.env.CMS_API_URL;
  const cmsToken = process.env.CMS_API_TOKEN;
  const cmsEndpoint = process.env.CMS_API_ENDPOINT || '/api/v1/pages';
  const staticDataPath = process.env.STATIC_DATA_PATH || '/src/data/static';

  // If CMS_API_URL is explicitly set (even if empty string), use CMS mode
  // If CMS_API_URL is not set or is 'disabled', use static mode
  const useCMS = cmsUrl && cmsUrl !== '' && cmsUrl.toLowerCase() !== 'disabled';

  return {
    type: useCMS ? 'cms' : 'static',
    cmsUrl: useCMS ? cmsUrl : undefined,
    cmsToken: useCMS ? cmsToken : undefined,
    cmsEndpoint: useCMS ? cmsEndpoint : undefined,
    staticDataPath,
  };
}

/**
 * Check if CMS is enabled
 */
export function isCMSEnabled(): boolean {
  const config = getDataSourceConfig();
  return config.type === 'cms';
}

/**
 * Check if static data is enabled
 */
export function isStaticDataEnabled(): boolean {
  const config = getDataSourceConfig();
  return config.type === 'static';
}

