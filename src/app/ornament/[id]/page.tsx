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

      <main className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-12)" }} className="detail-grid">
          {/* Image */}
          <div style={{ aspectRatio: "4/5", position: "relative", background: "var(--color-surface-container)" }}>
             <Image
              src={ornament.imageUrl}
              alt={ornament.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Details */}
          <div>
            <div className="text-label-sm text-muted mb-4" style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
              <span>{ornament.category}</span>
              <span>/</span>
              <span>{ornament.carats}K Gold</span>
              <span>/</span>
              <span>{ornament.weightGrams}g</span>
            </div>

            <h1 className="text-display-md mb-6">{ornament.name}</h1>
            
            <div className="mb-6">
               {priceLoading ? (
                  <span className="skeleton" style={{ width: "150px", height: "40px", display: "inline-block" }}></span>
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
                    <span className="text-display-lg text-gold">₹{priceCalc.estimatedPrice.toLocaleString("en-IN")}</span>
                    <span className="text-label-sm text-muted">(Estimated)</span>
                  </div>
                )}
            </div>

            <p className="text-body-lg text-muted mb-8" style={{ whiteSpace: "pre-line" }}>
              {ornament.description}
            </p>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-8)" }}>
              {ornament.isLimitedEdition && (
                <span className="status-chip limited">Limited Edition</span>
              )}
              {ornament.inStock ? (
                <span className="status-chip">In Stock</span>
              ) : (
                <span className="status-chip out-of-stock">Out of Stock</span>
              )}
            </div>

            <hr className="divider mb-8" />

            <div className="mb-8">
              <h3 className="text-label-lg mb-4">Price Breakdown (Est.)</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <li style={{ display: "flex", justifyContent: "space-between" }} className="text-body-md">
                  <span className="text-muted">Effective Gold Rate (per g)</span>
                  <span>₹{priceCalc.effectiveRate.toLocaleString("en-IN")}</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }} className="text-body-md">
                  <span className="text-muted">Weight</span>
                  <span>{ornament.weightGrams}g</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }} className="text-body-md">
                  <span className="text-muted">Making Charges</span>
                  <span>{ornament.makingChargePercent}%</span>
                </li>
              </ul>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn w-full justify-center">
              Inquire via WhatsApp
            </a>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @media(min-width: 768px) {
            .detail-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}} />
      </main>
    </>
  );
}
