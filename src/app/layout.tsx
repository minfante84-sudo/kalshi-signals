import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";
import { AdBanner, AdBannerFooter } from "@/components/ad-banner";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://kalshisignals.net";

export const metadata: Metadata = {
  title: {
    default: "Kalshi Signals — Largest Prediction Market Trades in Real Time",
    template: "%s | Kalshi Signals",
  },
  description:
    "Track the biggest single trades happening across Kalshi prediction markets. See where large bets are being placed on politics, crypto, sports, and more — updated in real time.",
  keywords: [
    "Kalshi",
    "prediction markets",
    "trading signals",
    "large trades",
    "market inflows",
    "crypto predictions",
    "political predictions",
    "sports predictions",
    "event contracts",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Kalshi Signals — Largest Prediction Market Trades",
    description:
      "Track the biggest single trades happening across Kalshi prediction markets in real time.",
    url: siteUrl,
    siteName: "Kalshi Signals",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Kalshi Signals — Largest Prediction Market Trades in Real Time",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalshi Signals — Largest Prediction Market Trades",
    description:
      "Track the biggest single trades happening across Kalshi prediction markets in real time.",
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="monetag" content="3f89aab214b25d0ce35828421c4be536" />
        <Script
          id="monetag-vignette"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10682524',s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6706124830973350"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdBanner className="sticky top-0 z-50 border-b border-border bg-background flex justify-center py-1" />
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 pb-16 md:pb-28">{children}</main>
        <AdBannerFooter className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background flex justify-center py-1" />
        <Analytics />
      </body>
    </html>
  );
}
