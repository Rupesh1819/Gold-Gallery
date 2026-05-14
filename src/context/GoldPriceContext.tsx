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

// Gold purity factors
const PURITY: Record<number, number> = { 24: 1, 22: 0.9167, 20: 0.8333, 18: 0.75 };

interface GoldPriceContextType {
  effectiveRatePerGram: number;  // Active rate
  settings: GoldRateSettings | null;
  loading: boolean;
  lastUpdated: Date | null;
  calculatePrice: (carats: number, weightGrams: number, makingCharge: number) => PriceCalculation;
}

const GoldPriceContext = createContext<GoldPriceContextType>({
  effectiveRatePerGram: 0,
  settings: null,
  loading: true,
  lastUpdated: null,
  calculatePrice: () => ({ effectiveRate: 0, estimatedPrice: 0, purityFactor: 1 }),
});

export function GoldPriceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GoldRateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch initial settings and subscribe to Supabase Realtime
  useEffect(() => {
    const fetchInitialSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("id", "gold_rate")
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setSettings(data as GoldRateSettings);
          if (data.last_updated) setLastUpdated(new Date(data.last_updated));
        } else {
          setSettings({ manual_rate: 6800, last_updated: new Date(), updated_by: "" });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSettings();

    // Polling fallback every 60 seconds in case Realtime is disabled
    const pollInterval = setInterval(fetchInitialSettings, 60000);

    // Subscribe to realtime changes on the settings table
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings", filter: "id=eq.gold_rate" },
        (payload) => {
          console.log("Settings changed:", payload.new);
          if (payload.new && Object.keys(payload.new).length > 0) {
            setSettings(payload.new as GoldRateSettings);
            if ((payload.new as GoldRateSettings).last_updated) {
              setLastUpdated(new Date((payload.new as GoldRateSettings).last_updated));
            }
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const effectiveRatePerGram = settings?.manual_rate || 6800;

  // Price formula
  const calculatePrice = useCallback(
    (carats: number, weightGrams: number, makingCharge: number): PriceCalculation => {
      const purityFactor = PURITY[carats] ?? PURITY[22];
      const rateWithPurity = effectiveRatePerGram * purityFactor;
      const rateWithMaking = rateWithPurity + effectiveRatePerGram * (makingCharge / 100);
      const estimatedPrice = Math.round(rateWithMaking * weightGrams * 1.05);
      return { effectiveRate: effectiveRatePerGram, estimatedPrice, purityFactor };
    },
    [effectiveRatePerGram]
  );

  return (
    <GoldPriceContext.Provider
      value={{ effectiveRatePerGram, settings, loading, lastUpdated, calculatePrice }}
    >
      {children}
    </GoldPriceContext.Provider>
  );
}

export const useGoldPrice = () => useContext(GoldPriceContext);
