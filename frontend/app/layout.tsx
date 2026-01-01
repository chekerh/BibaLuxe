import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { I18nProvider } from "@/contexts/I18nContext";
import { LocaleProvider } from "@/components/LocaleProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "BibaLuxe - Premium Mattresses & Furniture | Sleep Deeper, Live Better",
  description: "Discover premium mattresses and handcrafted furniture engineered with sleep science. Free shipping, 100-night trial, and interactive 3D models.",
  keywords: ["mattresses", "furniture", "luxury bedding", "memory foam", "sofa", "bedroom furniture"],
  openGraph: {
    title: "BibaLuxe - Premium Mattresses & Furniture",
    description: "Discover premium mattresses and handcrafted furniture engineered with sleep science.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BibaLuxe - Premium Mattresses & Furniture",
    description: "Discover premium mattresses and handcrafted furniture engineered with sleep science.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:3001 http://localhost:3000 https:;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-sans`}
      >
        <ErrorBoundary>
          <I18nProvider>
            <LocaleProvider>
              <ToastProvider>
                <CartProvider>
                  <WishlistProvider>
                    <AntdRegistry>{children}</AntdRegistry>
                  </WishlistProvider>
                </CartProvider>
              </ToastProvider>
            </LocaleProvider>
          </I18nProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
