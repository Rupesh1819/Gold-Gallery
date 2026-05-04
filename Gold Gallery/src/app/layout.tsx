import type { Metadata } from "next";
import "./globals.css";
import { GoldPriceProvider } from "@/context/GoldPriceContext";

export const metadata: Metadata = {
  title: "The Gilded Gallery — Luxury Gold Jewelry",
  description:
    "Discover exquisite handcrafted gold jewelry. Real-time gold pricing, curated collections, and bespoke artisanship.",
  keywords: ["gold jewelry", "luxury jewelry", "handcrafted gold", "jewelry catalog"],
  openGraph: {
    title: "The Gilded Gallery",
    description: "Luxury gold jewelry catalog with live pricing",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GoldPriceProvider>{children}</GoldPriceProvider>
      </body>
    </html>
  );
}
