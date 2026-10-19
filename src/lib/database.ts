import { supabase } from "./supabase";
import { Ornament, GoldRateSettings } from "./types";
import { SupabaseClient } from "@supabase/supabase-js";

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
export async function getGoldRateSettings(
  client: SupabaseClient = supabase
): Promise<GoldRateSettings | null> {
  const { data, error } = await client
    .from("settings")
    .select("*")
    .eq("id", "gold_rate")
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching settings:", error);
    throw error;
  }

  const result = (data as GoldRateSettings) || {
    manual_rate: 15200,
    manual_rate_22k: 15200,
    manual_rate_24k: undefined,
    last_updated: new Date(),
    updated_by: null,
  };

  // If 24K rate is not in a dedicated column, check if stored in updated_by JSON fallback
  if (!result.manual_rate_24k && result.updated_by) {
    try {
      const parsed = JSON.parse(result.updated_by);
      if (parsed && typeof parsed.rate24k === "number" && parsed.rate24k > 0) {
        result.manual_rate_24k = parsed.rate24k;
        if (parsed.email) {
          result.updated_by = parsed.email;
        }
      }
    } catch {
      // Plain text email, ignore JSON parsing
    }
  }

  return result;
}

export async function updateGoldRateSettings(
  settings: Partial<GoldRateSettings>,
  client: SupabaseClient = supabase
): Promise<void> {
  const nowIso = new Date().toISOString();
  const rate22 =
    typeof settings.manual_rate_22k === "number"
      ? settings.manual_rate_22k
      : settings.manual_rate;
  const rate24 = settings.manual_rate_24k;

  // 1. Try column-based update first (standard schema)
  const payload: Record<string, unknown> = {
    ...settings,
    last_updated: nowIso,
  };

  if (typeof rate22 === "number") {
    payload.manual_rate = rate22;
    payload.manual_rate_22k = rate22;
  }
  if (typeof rate24 === "number") {
    payload.manual_rate_24k = rate24;
  }

  const { error } = await client
    .from("settings")
    .update(payload)
    .eq("id", "gold_rate");

  if (error) {
    // If column doesn't exist in Supabase schema (PostgreSQL 42703, PostgREST PGRST204, or schema cache):
    const isMissingColumn =
      error.code === "42703" ||
      error.code === "PGRST204" ||
      (typeof error.message === "string" &&
        (error.message.includes("schema cache") ||
          error.message.includes("column")));

    if (isMissingColumn) {
      const metaPayload = JSON.stringify({
        email: settings.updated_by || null,
        rate24k: rate24 || 0,
      });

      const { error: errFallback } = await client
        .from("settings")
        .update({
          manual_rate: rate22,
          use_manual: true,
          last_updated: nowIso,
          updated_by: metaPayload,
        })
        .eq("id", "gold_rate");

      if (errFallback) {
        console.error("Fallback update failed:", errFallback);
        throw errFallback;
      }
      return;
    }

    console.error("Error updating settings:", error);
    throw error;
  }
}
