// Ornament document schema in Supabase "ornaments" table
export interface Ornament {
  id: string;
  name: string;
  description: string;
  carats: 18 | 20 | 22 | 24;
  weightGrams: number;
  category: "Necklace" | "Ring" | "Earring" | "Bracelet" | "Pendant" | "Bangle";
  imageUrl: string;
  inStock: boolean;
  isLimitedEdition: boolean;
  makingChargePercent: number;
  createdAt: Date;
  updatedAt: Date;
}

// Gold rate settings document in Supabase "settings" table (id = "gold_rate")
export interface GoldRateSettings {
  manual_rate: number;          // Legacy / fallback rate (22K in INR per gram)
  manual_rate_22k?: number;      // Explicit 22K rate in INR per gram (Purity: 916)
  manual_rate_24k?: number;      // Explicit 24K rate in INR per gram (Purity: 999)
  use_manual?: boolean;
  last_updated: Date | string;
  updated_by?: string | null;
}

// Calculated price result
export interface PriceCalculation {
  effectiveRate: number;    // INR per gram
  estimatedPrice: number;   // Final price in INR
  purityFactor: number;
}
