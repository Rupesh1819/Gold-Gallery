"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Ornament } from "@/lib/types";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { Heart } from "lucide-react";

function isNewArrival(createdAt: Date): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(createdAt) > sevenDaysAgo;
}

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch { return []; }
}

function toggleWishlistItem(id: string): boolean {
  const list = getWishlist();
  const index = list.indexOf(id);
  if (index > -1) {
    list.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(list));
    return false;
  } else {
    list.push(id);
    localStorage.setItem("wishlist", JSON.stringify(list));
    return true;
  }
}

interface JewelryCardProps {
  ornament: Ornament;
}

export default function JewelryCard({ ornament }: JewelryCardProps) {
  const { calculatePrice, loading } = useGoldPrice();
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(getWishlist().includes(ornament.id));
  }, [ornament.id]);

  const priceCalc = calculatePrice(
    ornament.carats,
    ornament.weightGrams,
    ornament.makingChargePercent
  );

  const isNew = isNewArrival(ornament.createdAt);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlistItem(ornament.id);
    setWishlisted(result);
  };

  return (
    <div className="card fade-in-up visible">
      <Link href={`/ornament/${ornament.id}`} style={{ display: "block" }}>
        <div className="card-image-wrap">
          <Image
            src={ornament.imageUrl}
            alt={ornament.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
          {/* New badge */}
          {isNew && <span className="new-badge">New</span>}

          {/* Wishlist heart */}
          <button
            className={`wishlist-btn ${wishlisted ? "active" : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={wishlisted ? "#e74c3c" : "none"} />
          </button>

          {/* Status chips */}
          <div style={{ position: "absolute", bottom: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {!ornament.inStock && (
              <span className="status-chip out-of-stock" style={{ background: "rgba(255,248,242,0.9)", padding: "4px 8px" }}>
                Out of Stock
              </span>
            )}
            {ornament.isLimitedEdition && (
              <span className="status-chip limited" style={{ background: "rgba(255,248,242,0.9)", padding: "4px 8px" }}>
                Limited Edition
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="card-body">
        <div className="card-meta">
          {ornament.category} / {ornament.carats}K / {ornament.weightGrams}g
        </div>
        <h3 className="card-name">{ornament.name}</h3>
        <div className="card-price">
          {loading ? (
            <span className="skeleton" style={{ width: "80px", height: "24px", display: "inline-block" }}></span>
          ) : (
            `₹${priceCalc.estimatedPrice.toLocaleString("en-IN")}`
          )}
        </div>
      </div>
    </div>
  );
}
