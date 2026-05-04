"use client";
import Image from "next/image";
import Link from "next/link";
import { Ornament } from "@/lib/types";
import { useGoldPrice } from "@/context/GoldPriceContext";

interface JewelryCardProps {
  ornament: Ornament;
}

export default function JewelryCard({ ornament }: JewelryCardProps) {
  const { calculatePrice, loading } = useGoldPrice();

  const priceCalc = calculatePrice(
    ornament.carats,
    ornament.weightGrams,
    ornament.makingChargePercent
  );

  return (
    <div className="card">
      <Link href={`/ornament/${ornament.id}`} style={{ display: "block" }}>
        <div className="card-image-wrap">
          <Image
            src={ornament.imageUrl}
            alt={ornament.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
          {/* Status chips float over image */}
          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {!ornament.inStock && (
              <span className="status-chip out-of-stock" style={{ background: "rgba(255, 248, 242, 0.9)", padding: "4px 8px" }}>
                Out of Stock
              </span>
            )}
            {ornament.isLimitedEdition && (
              <span className="status-chip limited" style={{ background: "rgba(255, 248, 242, 0.9)", padding: "4px 8px" }}>
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
