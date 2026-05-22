"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Ornament } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoldTicker from "@/components/GoldTicker";
import JewelryCard from "@/components/JewelryCard";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { useToast } from "@/context/ToastContext";
import { Share2, Link2, Heart } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export default function OrnamentDetailPage() {
  const { id } = useParams() as { id: string };
  const [ornament, setOrnament] = useState<Ornament | null>(null);
  const [related, setRelated] = useState<Ornament[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(false);
  const { calculatePrice, loading: priceLoading } = useGoldPrice();
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchOrnament() {
      const { data, error } = await supabase
        .from("ornaments")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setOrnament(data as Ornament);
        // Fetch related items (same category, exclude current)
        const { data: relData } = await supabase
          .from("ornaments")
          .select("*")
          .eq("category", data.category)
          .neq("id", id)
          .limit(4);
        if (relData) setRelated(relData as Ornament[]);
      }
      setLoading(false);
    }
    fetchOrnament();
  }, [id]);

  // Set dynamic page title
  useEffect(() => {
    if (ornament) {
      document.title = `${ornament.name} — Shete Jewellers`;
    }
    return () => { document.title = "Shete Jewellers — Luxury Handcrafted Gold Jewelry"; };
  }, [ornament]);

  if (loading) {
    return (
      <>
        <GoldTicker />
        <Navbar />
        <main className="container section">
          <div className="detail-grid">
            <div className="skeleton" style={{ aspectRatio: "3/4" }}></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="skeleton" style={{ height: "14px", width: "40%" }}></div>
              <div className="skeleton" style={{ height: "48px", width: "80%" }}></div>
              <div className="skeleton" style={{ height: "48px", width: "50%" }}></div>
              <div className="skeleton" style={{ height: "120px", width: "100%" }}></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!ornament) {
    return (
      <>
        <GoldTicker />
        <Navbar />
        <main className="container section" style={{ textAlign: "center", padding: "120px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💎</div>
          <h2 className="text-headline-md mb-4">Ornament not found</h2>
          <Link href="/" className="btn btn-secondary">Back to Collection</Link>
        </main>
        <Footer />
      </>
    );
  }

  const priceCalc = calculatePrice(ornament.carats, ornament.weightGrams, ornament.makingChargePercent);

  const whatsappMessage = `Hi, I'm interested in the ${ornament.name} (${ornament.carats}K, ${ornament.weightGrams}g). Estimated price: ₹${priceCalc.estimatedPrice.toLocaleString("en-IN")}. ${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!", "success");
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: ornament.name, text: `Check out ${ornament.name} at Shete Jewellers`, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      <GoldTicker />
      <Navbar />

      <main style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-16)" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav className="text-label-sm text-muted mb-8" style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--color-outline)" }}>Collection</Link>
            <span>/</span>
            <span style={{ color: "var(--color-primary)" }}>{ornament.name}</span>
          </nav>

          <div className="detail-grid">
            {/* LEFT: Image */}
            <div
              style={{ position: "relative", aspectRatio: "3/4", background: "var(--color-surface-container)", overflow: "hidden", cursor: "zoom-in" }}
              onClick={() => setZoomedImage(true)}
            >
              <Image
                src={ornament.imageUrl}
                alt={ornament.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
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
              <div className="text-label-sm text-muted" style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                <span>{ornament.category}</span>
                <span style={{ color: "var(--color-gold)" }}>◆</span>
                <span>{ornament.carats}K Gold</span>
                <span style={{ color: "var(--color-gold)" }}>◆</span>
                <span>{ornament.weightGrams}g</span>
              </div>

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

              <p className="text-body-lg text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                {ornament.description}
              </p>

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
                    { label: "Gold Rate (per g)", value: `₹${priceCalc.effectiveRate.toLocaleString("en-IN")}` },
                    { label: "Weight", value: `${ornament.weightGrams}g` },
                    { label: "Making Charges", value: `${ornament.makingChargePercent}%` },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }} className="text-body-md">
                      <span className="text-muted">{row.label}</span>
                      <span style={{ fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-btn" style={{ flex: 1, justifyContent: "center", letterSpacing: "0.1em" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.541 4.063 1.488 5.777L0 24l6.305-1.654A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.36-.214-3.732.979.995-3.638-.234-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
                  Inquire via WhatsApp
                </a>
                <button className="share-btn" onClick={handleShare} title="Share">
                  <Share2 size={16} /> Share
                </button>
                <button className="share-btn" onClick={handleCopyLink} title="Copy Link">
                  <Link2 size={16} /> Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Related Items */}
          {related.length > 0 && (
            <section className="related-section">
              <h2 className="text-headline-md mb-8">You May Also Like</h2>
              <div className="grid-catalog">
                {related.map((item) => (
                  <JewelryCard key={item.id} ornament={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Image Zoom */}
      {zoomedImage && (
        <div className="image-zoom-overlay" onClick={() => setZoomedImage(false)}>
          <div style={{ position: "relative", width: "90vw", height: "90vh" }}>
            <Image
              src={ornament.imageUrl}
              alt={ornament.name}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
