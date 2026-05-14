import type { Metadata } from "next";
import "./globals.css";
import { GoldPriceProvider } from "@/context/GoldPriceContext";
import { ToastProvider } from "@/context/ToastContext";
import ClientErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Shete Jewellers — Luxury Handcrafted Gold Jewelry",
  description:
    "Discover exquisite handcrafted gold jewelry at Shete Jewellers. Browse curated collections of necklaces, rings, earrings, bangles & more with real-time gold pricing. Celebrating luxury and artisanship since 1993.",
  keywords: [
    "gold jewelry",
    "luxury jewelry",
    "handcrafted gold",
    "jewelry catalog",
    "Shete Jewellers",
    "gold necklace",
    "gold ring",
    "gold earrings",
    "22K gold",
    "Indian jewelry",
  ],
  openGraph: {
    title: "Shete Jewellers — Luxury Handcrafted Gold Jewelry",
    description:
      "Exquisite handcrafted gold jewelry. Curated collections with real-time pricing.",
    type: "website",
    siteName: "Shete Jewellers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body>
        <ToastProvider>
          <GoldPriceProvider>
            <ClientErrorBoundary>
              {children}
            </ClientErrorBoundary>
          </GoldPriceProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
