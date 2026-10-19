"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { GoldRateSettings, PriceCalculation } from "@/lib/types";
import { getGoldRateSettings } from "@/lib/database";

// Standard Gold Purity Factors relative to 24K pure gold
const PURITY: Record<number, number> = {
  24: 1.0,
  22: 0.9167,
  20: 0.8333,
  18: 0.75,
};

interface GoldPriceContextType {
  rate22k: number;
  rate24k: number;
  effectiveRatePerGram: number; // Active 22K rate for backward compatibility
  settings: GoldRateSettings | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
  calculatePrice: (carats: number, weightGrams: number, makingCharge: number) => PriceCalculation;
}

const GoldPriceContext = createContext<GoldPriceContextType>({
  rate22k: 0,
  rate24k: 0,
  effectiveRatePerGram: 0,
  settings: null,
  loading: true,
  error: null,
  lastUpdated: null,
  refreshRates: async () => {},
  calculatePrice: () => ({ effectiveRate: 0, estimatedPrice: 0, purityFactor: 1 }),
});

export function GoldPriceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GoldRateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setError(null);
      const sets = await getGoldRateSettings();
      if (sets) {
        setSettings(sets);
        if (sets.last_updated) {
          setLastUpdated(new Date(sets.last_updated));
        }
      }
    } catch (err: unknown) {
      console.error("Failed to fetch gold rate settings:", err);
      const message = err instanceof Error ? err.message : "Failed to load gold rates";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial settings and subscribe to Supabase Realtime
  useEffect(() => {
    fetchRates();

    // Polling fallback every 60 seconds
    const pollInterval = setInterval(fetchRates, 60000);

    // Subscribe to realtime changes on the settings table
    const channel = supabase
      .channel("gold-rates-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        () => {
          fetchRates();
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [fetchRates]);

  // Derive explicit 22K and 24K rates
  const rate22k =
    typeof settings?.manual_rate_22k === "number" && settings.manual_rate_22k > 0
      ? settings.manual_rate_22k
      : typeof settings?.manual_rate === "number" && settings.manual_rate > 0
      ? settings.manual_rate
      : 0;

  const rate24k =
    typeof settings?.manual_rate_24k === "number" && settings.manual_rate_24k > 0
      ? settings.manual_rate_24k
      : 0;

  const effectiveRatePerGram = rate22k;

  // Accurate Price Formula supporting both 22K and 24K
  const calculatePrice = useCallback(
    (carats: number, weightGrams: number, makingCharge: number): PriceCalculation => {
      let baseRate: number;
      const purityFactor = PURITY[carats] ?? (carats / 24);

      if (carats === 24 && rate24k > 0) {
        baseRate = rate24k;
      } else if (carats === 22 && rate22k > 0) {
        baseRate = rate22k;
      } else if (rate24k > 0) {
        // Derive from 24K pure rate
        baseRate = rate24k * purityFactor;
      } else if (rate22k > 0) {
        // Derive from 22K rate
        baseRate = (rate22k / (22 / 24)) * purityFactor;
      } else {
        baseRate = 0;
      }

      const rateWithMaking = baseRate + (baseRate > 0 ? baseRate * (makingCharge / 100) : 0);
      const estimatedPrice = Math.round(rateWithMaking * weightGrams * 1.05);

      return {
        effectiveRate: carats === 24 && rate24k > 0 ? rate24k : rate22k,
        estimatedPrice,
        purityFactor,
      };
    },
    [rate22k, rate24k]
  );

  return (
    <GoldPriceContext.Provider
      value={{
        rate22k,
        rate24k,
        effectiveRatePerGram,
        settings,
        loading,
        error,
        lastUpdated,
        refreshRates: fetchRates,
        calculatePrice,
      }}
    >
      {children}
    </GoldPriceContext.Provider>
  );
}

export const useGoldPrice = () => useContext(GoldPriceContext);
