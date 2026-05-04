"use client";
import Link from "next/link";
import { useGoldPrice } from "@/context/GoldPriceContext";

export default function GoldTicker() {
  const { effectiveRatePerGram, loading, lastUpdated } = useGoldPrice();

  const label = "Rate of the Day";
  const items = Array(6).fill(null);

  return (
    <div className="gold-ticker" aria-label="Live gold price ticker">
      <div className="ticker-inner">
        {items.map((_, i) => (
          <span key={i}>
            <span style={{ color: "var(--color-gold-dim)", marginRight: "8px" }}>◆</span>
            {label}:{" "}
            {loading ? (
              "Loading..."
            ) : (
              <>
                <strong>₹{effectiveRatePerGram.toLocaleString("en-IN")}/gram</strong>
                {lastUpdated && (
                  <span style={{ opacity: 0.6, fontSize: "10px", marginLeft: "6px" }}>
                    (22K)
                  </span>
                )}
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
