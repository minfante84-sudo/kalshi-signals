import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";
import { MobileAd } from "@/components/mobile-ad";
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
  other: {
    c9b7519defe2afdc74110756904d4ff32c843f4d: "c9b7519defe2afdc74110756904d4ff32c843f4d",
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
<Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-L2SG61SW32"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L2SG61SW32');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="sticky top-0 z-50">
          <MobileAd />
          <Navbar />
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
