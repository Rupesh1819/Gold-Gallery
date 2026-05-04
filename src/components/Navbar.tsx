"use client";
import Link from "next/link";
import Image from "next/image";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { TrendingUp, Gem } from "lucide-react";

export default function Navbar() {
  const { effectiveRatePerGram, loading } = useGoldPrice();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
            <Image 
              src="/logo.png" 
              alt="Shete Jewellers" 
              width={200} 
              height={70} 
              style={{ objectFit: 'contain' }} 
              priority
            />
          </Link>

          {/* Center: breadcrumb */}
          <div className="text-label-sm text-muted" style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--color-outline)", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="var(--color-gold)"} onMouseOut={e => e.currentTarget.style.color="var(--color-outline)"}>Catalog</Link>
            <span>/</span>
            <Link href="/admin" style={{ color: "var(--color-outline)", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color="var(--color-gold)"} onMouseOut={e => e.currentTarget.style.color="var(--color-outline)"}>Admin Panel</Link>
          </div>

          {/* Right: gold price badge */}
          <div className="price-badge">
            <div className="price-dot" />
            <TrendingUp size={12} />
            <span>
              {loading
                ? "—"
                : `₹${effectiveRatePerGram.toLocaleString("en-IN")}/g`}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
