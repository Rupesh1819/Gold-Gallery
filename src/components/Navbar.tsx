"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { TrendingUp, Menu, X } from "lucide-react";

export default function Navbar() {
  const { effectiveRatePerGram, loading } = useGoldPrice();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Brand */}
            <Link href="/" className="navbar-brand" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt="Shete Jewellers"
                width={200}
                height={70}
                className="navbar-logo"
                style={{ objectFit: "contain" }}
                priority
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="nav-links">
              <Link href="/" className="nav-link">Catalog</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
              <Link href="/admin" className="nav-link">Admin</Link>
            </div>

            {/* Gold Price Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div className="price-badge">
                <div className="price-dot" />
                <TrendingUp size={12} />
                <span>
                  {loading ? "—" : `₹${effectiveRatePerGram.toLocaleString("en-IN")}/g`}
                </span>
              </div>

              {/* Mobile toggle */}
              <button
                className="nav-mobile-toggle"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-screen Menu */}
      <div className={`nav-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button className="nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={28} />
        </button>
        <Link href="/" className="nav-link" onClick={() => setMobileOpen(false)}>Catalog</Link>
        <Link href="/about" className="nav-link" onClick={() => setMobileOpen(false)}>About</Link>
        <Link href="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
        <Link href="/admin" className="nav-link" onClick={() => setMobileOpen(false)}>Admin</Link>
        <div className="price-badge" style={{ marginTop: "var(--space-4)" }}>
          <div className="price-dot" />
          <TrendingUp size={12} />
          <span>{loading ? "—" : `₹${effectiveRatePerGram.toLocaleString("en-IN")}/g`}</span>
        </div>
      </div>
    </>
  );
}
