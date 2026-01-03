import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PLS | Premium Sound System Rental",
  description: "Premium Sound System Rental & Event Audio Production for B2B, Corporate, and Government events.",
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
        {children}
      </body>
    </html>
  );
}
