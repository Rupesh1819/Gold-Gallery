// Ornament document schema in Firestore "ornaments" collection
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

// Gold rate settings document in "settings/gold_rate"
export interface GoldRateSettings {
  manual_rate: number;      // Rate in INR per gram (22K)
  use_manual: boolean;      // Toggle: true = manual, false = live API
  last_updated: Date;
  updated_by: string;
}

// Calculated price result
export interface PriceCalculation {
  effectiveRate: number;    // INR per gram
  estimatedPrice: number;   // Final price in INR
  purityFactor: number;
}
