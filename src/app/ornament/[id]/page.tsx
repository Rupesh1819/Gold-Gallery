"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Ornament } from "@/lib/types";
import Navbar from "@/components/Navbar";
import GoldTicker from "@/components/GoldTicker";
import { useGoldPrice } from "@/context/GoldPriceContext";

export default function OrnamentDetailPage() {
  const { id } = useParams() as { id: string };
  const [ornament, setOrnament] = useState<Ornament | null>(null);
  const [loading, setLoading] = useState(true);
  const { calculatePrice, loading: priceLoading } = useGoldPrice();

  useEffect(() => {
    async function fetchOrnament() {
      const { data, error } = await supabase
        .from("ornaments")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && data) {
        setOrnament(data as Ornament);
      }
      setLoading(false);
    }
    fetchOrnament();
  }, [id]);

  if (loading) {
    return (
      <>
        <GoldTicker />
        <Navbar />
        <main className="container section">
          <div className="text-center">Loading...</div>
        </main>
      </>
    );
  }

  if (!ornament) {
    return (
      <>
        <GoldTicker />
        <Navbar />
        <main className="container section">
          <div className="text-center text-muted">Ornament not found.</div>
        </main>
      </>
    );
  }

  const priceCalc = calculatePrice(
    ornament.carats,
    ornament.weightGrams,
    ornament.makingChargePercent
  );

  const whatsappMessage = `Hi, I'm interested in the ${ornament.name}. The current estimated price is ₹${priceCalc.estimatedPrice.toLocaleString("en-IN")}. ${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <GoldTicker />
      <Navbar />

      <main style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="text-label-sm text-muted mb-8" style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <a href="/" style={{ color: "var(--color-outline)" }}>Collection</a>
            <span>/</span>
            <span style={{ color: "var(--color-primary)" }}>{ornament.name}</span>
          </nav>

          <div className="detail-grid">
            {/* LEFT: Image */}
            <div style={{ position: "relative", aspectRatio: "3/4", background: "var(--color-surface-container)", overflow: "hidden" }}>
              <Image
                src={ornament.imageUrl}
                alt={ornament.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
              {/* Badges */}
              <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {ornament.isLimitedEdition && (
                  <span className="status-chip limited" style={{ background: "rgba(255,255,255,0.92)", padding: "4px 10px" }}>Limited Edition</span>
                )}
                {!ornament.inStock && (
                  <span className="status-chip out-of-stock" style={{ background: "rgba(255,255,255,0.92)", padding: "4px 10px" }}>Out of Stock</span>
                )}
              </div>
            </div>

            {/* RIGHT: Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", paddingTop: "var(--space-4)" }}>
              {/* Category path */}
              <div className="text-label-sm text-muted" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <span>{ornament.category}</span>
                <span style={{ color: "var(--color-gold)" }}>◆</span>
                <span>{ornament.carats}K Gold</span>
                <span style={{ color: "var(--color-gold)" }}>◆</span>
                <span>{ornament.weightGrams}g</span>
              </div>

              {/* Name */}
              <h1 className="text-display-md" style={{ lineHeight: "1.15" }}>{ornament.name}</h1>

              {/* Price */}
              <div style={{ padding: "var(--space-4) 0", borderTop: "var(--border-hairline)", borderBottom: "var(--border-hairline)" }}>
                {priceLoading ? (
                  <span className="skeleton" style={{ width: "180px", height: "48px", display: "inline-block" }}></span>
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 42px)", color: "var(--color-primary)", fontWeight: 400 }}>
                      ₹{priceCalc.estimatedPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-label-sm text-muted">(Estimated)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-body-lg text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {ornament.description}
              </p>

              {/* In Stock status */}
              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <span className={`status-chip ${ornament.inStock ? "" : "out-of-stock"}`}>
                  {ornament.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: "var(--color-surface-container)", padding: "var(--space-6)" }}>
                <h3 className="text-label-lg mb-4">Price Breakdown (Est.)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {[
                    { label: "Effective Gold Rate (per g)", value: `₹${priceCalc.effectiveRate.toLocaleString("en-IN")}` },
                    { label: "Weight", value: `${ornament.weightGrams}g` },
                    { label: "Making Charges", value: `${ornament.makingChargePercent}%` },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="text-body-md">
                      <span className="text-muted">{row.label}</span>
                      <span style={{ fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
                style={{ justifyContent: "center", letterSpacing: "0.1em" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.541 4.063 1.488 5.777L0 24l6.305-1.654A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.36-.214-3.732.979.995-3.638-.234-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
                Inquire via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-12);
        }
        @media (min-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-16);
            align-items: start;
          }
        }
      `}} />
    </>
  );
}
