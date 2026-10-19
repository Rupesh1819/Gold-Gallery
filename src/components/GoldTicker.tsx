"use client";
import React, { useMemo } from "react";
import { useGoldPrice } from "@/context/GoldPriceContext";
import { Clock, AlertCircle } from "lucide-react";

export default function GoldTicker() {
  const { rate22k, rate24k, loading, error, lastUpdated } = useGoldPrice();

  // Format the last updated date & time
  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return null;
    }
  }, [lastUpdated]);

  return (
    <section className="gold-rate-bar" aria-label="Rate of the Day">
      <div className="container">
        <div className="gold-rate-container">
          
          {/* Section Heading & Live Status */}
          <div className="gold-rate-header">
            <span className="gold-rate-title">
              <span className="gold-rate-dot" aria-hidden="true" />
              Rate of the Day
            </span>
          </div>

          {/* Error State Fallback */}
          {error && (
            <div className="gold-rate-error" role="alert">
              <AlertCircle size={13} />
              <span>Store rate sync unavailable · Contact store for today&apos;s quote</span>
            </div>
          )}

          {/* Two Compact, Attractive Cards Side by Side */}
          <div className="gold-rate-cards">
            {/* ── 22K Gold Card ── */}
            <div className="gold-rate-card" id="card-22k-rate">
              <div className="rate-card-details">
                <div className="rate-card-meta">
                  <span className="rate-karat">22K Gold</span>
                  <span className="rate-purity">Purity: 916</span>
                </div>
              </div>
              <div className="rate-card-price">
                {loading ? (
                  <span className="rate-loading-placeholder">Loading...</span>
                ) : rate22k > 0 ? (
                  <>
                    <strong className="rate-amount">
                      ₹{rate22k.toLocaleString("en-IN")}
                    </strong>
                    <span className="rate-unit">per gram</span>
                  </>
                ) : (
                  <span className="rate-pending">Rate Pending</span>
                )}
              </div>
            </div>

            {/* ── 24K Gold Card ── */}
            <div className="gold-rate-card" id="card-24k-rate">
              <div className="rate-card-details">
                <div className="rate-card-meta">
                  <span className="rate-karat">24K Gold</span>
                  <span className="rate-purity">Purity: 999</span>
                </div>
              </div>
              <div className="rate-card-price">
                {loading ? (
                  <span className="rate-loading-placeholder">Loading...</span>
                ) : rate24k > 0 ? (
                  <>
                    <strong className="rate-amount">
                      ₹{rate24k.toLocaleString("en-IN")}
                    </strong>
                    <span className="rate-unit">per gram</span>
                  </>
                ) : (
                  <span className="rate-pending">Rate Pending</span>
                )}
              </div>
            </div>
          </div>

          {/* Last Updated Timestamp */}
          <div className="gold-rate-timestamp">
            <Clock size={12} aria-hidden="true" />
            <span>
              {loading
                ? "Syncing rate..."
                : formattedLastUpdated
                ? `Updated: ${formattedLastUpdated}`
                : "Official Daily Store Rate"}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
