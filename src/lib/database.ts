import { supabase } from "./supabase";
import { Ornament, GoldRateSettings } from "./types";

// ── ORNAMENTS ──────────────────────────────────────────────
export async function getOrnaments(): Promise<Ornament[]> {
  const { data, error } = await supabase
    .from("ornaments")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching ornaments:", error);
    throw error;
  }
  return data as Ornament[];
}

export async function addOrnament(
  data: Omit<Ornament, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const { data: result, error } = await supabase
    .from("ornaments")
    .insert([data])
    .select("id")
    .single();

  if (error) {
    console.error("Error adding ornament:", error);
    throw error;
  }
  return result.id;
}

export async function deleteOrnament(id: string): Promise<void> {
  const { error } = await supabase.from("ornaments").delete().eq("id", id);
  if (error) {
    console.error("Error deleting ornament:", error);
    throw error;
  }
}

export async function updateOrnament(
  id: string,
  data: Partial<Omit<Ornament, "id" | "createdAt">>
): Promise<void> {
  const { error } = await supabase
    .from("ornaments")
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating ornament:", error);
    throw error;
  }
}

// ── GOLD RATE SETTINGS ────────────────────────────────────
export async function getGoldRateSettings(): Promise<GoldRateSettings | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", "gold_rate")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("Error fetching settings:", error);
    throw error;
  }
  return data as GoldRateSettings;
}

export async function updateGoldRateSettings(
  settings: Partial<GoldRateSettings>
): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .update({ ...settings, last_updated: new Date().toISOString() })
    .eq("id", "gold_rate");

  if (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}
