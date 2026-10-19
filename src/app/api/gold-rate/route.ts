import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getGoldRateSettings, updateGoldRateSettings } from "@/lib/database";
import { ADMIN_EMAIL } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/gold-rate
 * Public endpoint to fetch both 22K and 24K gold rates.
 */
export async function GET() {
  try {
    const settings = await getGoldRateSettings();

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

    return NextResponse.json(
      {
        success: true,
        rates: {
          "22k": {
            rate: rate22k,
            purity: "916",
            carats: 22,
            unit: "INR per gram",
          },
          "24k": {
            rate: rate24k,
            purity: "999",
            carats: 24,
            unit: "INR per gram",
          },
        },
        lastUpdated: settings?.last_updated || null,
        updatedBy: settings?.updated_by || null,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/gold-rate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve gold rates",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gold-rate
 * Protected admin endpoint to update both 22K and 24K gold rates.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing authentication token.",
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    if (authData.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only authorized administrators may update gold rates.",
        },
        { status: 403 }
      );
    }

    // 2. Parse & Validate Input
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload. Expected JSON body.",
        },
        { status: 400 }
      );
    }

    const { rate22k, rate24k } = body;

    const parsed22k = Number(rate22k);
    const parsed24k = Number(rate24k);

    if (isNaN(parsed22k) || parsed22k <= 0 || !Number.isFinite(parsed22k)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid 22K Gold Rate: Value must be a valid positive number greater than 0.",
        },
        { status: 400 }
      );
    }

    if (isNaN(parsed24k) || parsed24k <= 0 || !Number.isFinite(parsed24k)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid 24K Gold Rate: Value must be a valid positive number greater than 0.",
        },
        { status: 400 }
      );
    }

    // 3. Atomically Update Database with authenticated user Supabase client
    const nowIso = new Date().toISOString();
    const userSupabase = (await import("@supabase/supabase-js")).createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    await updateGoldRateSettings(
      {
        manual_rate: parsed22k,
        manual_rate_22k: parsed22k,
        manual_rate_24k: parsed24k,
        use_manual: true,
        last_updated: nowIso,
        updated_by: authData.user.email,
      },
      userSupabase
    );

    return NextResponse.json({
      success: true,
      message: "Gold rates updated successfully.",
      rates: {
        "22k": {
          rate: parsed22k,
          purity: "916",
        },
        "24k": {
          rate: parsed24k,
          purity: "999",
        },
      },
      lastUpdated: nowIso,
      updatedBy: authData.user.email,
    });
  } catch (error) {
    console.error("POST /api/gold-rate error:", error);
    const message = error instanceof Error ? error.message : "Failed to update gold rates";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
