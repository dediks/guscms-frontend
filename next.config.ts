import type { NextConfig } from "next";

/**
 * Extract hostname from CMS API URL for image remotePatterns
 */
function getCMSHostname(): string | null {
  const cmsUrl = process.env.CMS_API_URL;
  if (!cmsUrl || cmsUrl === 'disabled' || cmsUrl.trim() === '') {
    return null;
  }

  try {
    // Normalize URL (add protocol if missing)
    let normalizedUrl = cmsUrl.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      if (/^localhost|^\d+\.\d+\.\d+\.\d+|^127\.\d+\.\d+\.\d+/i.test(normalizedUrl)) {
        normalizedUrl = `http://${normalizedUrl}`;
      } else {
        normalizedUrl = `https://${normalizedUrl}`;
      }
    }

    const url = new URL(normalizedUrl);
    return url.hostname;
  } catch {
    return null;
  }
}

const cmsHostname = getCMSHostname();

// Build remotePatterns array
const remotePatterns: Array<{
  protocol: 'http' | 'https';
  hostname: string;
  pathname: string;
}> = [
  {
    protocol: 'https',
    hostname: 'picsum.photos',
    pathname: '/**',
  },
  // Always allow localhost for development (common for CMS images)
  {
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/**',
  },
  // Add 127.0.0.1 for better server-side resolution in Docker/WSL environments
  {
    protocol: 'http',
    hostname: '127.0.0.1',
    pathname: '/**',
  },
  // Add host.docker.internal for Docker Desktop (Windows/Mac) to access host machine
  {
    protocol: 'http',
    hostname: 'host.docker.internal',
    pathname: '/**',
  },
];

// Add CMS hostname if available
if (cmsHostname) {
  // Add both http and https patterns for CMS (in case CMS uses http in dev)
  remotePatterns.push(
    {
      protocol: 'https',
      hostname: cmsHostname,
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: cmsHostname,
      pathname: '/**',
    }
  );
}

const nextConfig: NextConfig = {
  // Image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns,
  },
  
  // Enable compression
  compress: true,
  
  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Output configuration for better performance
  output: 'standalone',
  
  // Power optimization
  poweredByHeader: false,
};

export default nextConfig;
