import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";
import { AdBanner } from "@/components/ad-banner";
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
  },
  twitter: {
    card: "summary",
    title: "Kalshi Signals — Largest Prediction Market Trades",
    description:
      "Track the biggest single trades happening across Kalshi prediction markets in real time.",
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
        <Navbar />
        <AdBanner className="sticky top-14 z-40 border-b border-border bg-background mx-auto max-w-7xl px-4" />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
