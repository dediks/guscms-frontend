import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { defaultMetadata, getSiteUrl } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Only load used weights for better performance
  display: 'swap', // Better font loading performance
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
  authors: [{ name: "PLS Rental" }],
  creator: "PLS Rental",
  publisher: "PLS Rental",
  applicationName: "PLS Rental",
  category: "Business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: defaultMetadata.locale,
    url: siteUrl,
    siteName: defaultMetadata.siteName,
    title: defaultMetadata.title.default,
    description: defaultMetadata.description,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: defaultMetadata.title.default,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadata.title.default,
    description: defaultMetadata.description,
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes here when available
    // google: "verification-code",
    // yandex: "verification-code",
    // yahoo: "verification-code",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${manrope.variable} antialiased bg-brand-dark text-neutral-300`}
      >
        <StructuredData type="organization" />
        <StructuredData type="website" />
        {children}
      </body>
    </html>
  );
}
