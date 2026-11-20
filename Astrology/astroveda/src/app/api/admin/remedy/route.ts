/**
 * AstroVeda Remedy Dossier API
 * GET  /api/admin/remedy?reference=AST-XXXX  — fetch dossier for an appointment
 * POST /api/admin/remedy                     — create or update a dossier
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth/adminSession';
import { createAdminClient } from '@/lib/supabase/admin';

const DOSSIER_PATH = path.join(process.cwd(), 'src', 'config', 'remedyDossiers.json');

export interface RemedyDossier {
  id: string;               // same as appointment reference
  reference: string;
  seekerName: string;
  phone: string;
  service: string;
  consultationDate: string;
  createdAt: string;
  updatedAt: string;

  // Core remedy fields
  primaryPlanet: string;    // e.g. "Shani (Saturn)"
  primaryDasha: string;     // e.g. "Shani Mahadasha – Guru Antardasha"
  ascendant: string;        // e.g. "Vrishabha (Taurus)"
  moonSign: string;         // e.g. "Karka (Cancer)"

  // Mantra Sadhana
  mantra: string;           // e.g. "Om Namah Shivaya"
  mantraCount: string;      // e.g. "108 times daily"
  mantraDays: string;       // e.g. "Monday & Saturday"

  // Vrat & Daan
  fastingDay: string;       // e.g. "Every Saturday"
  fastingGuidance: string;  // e.g. "Consume only fruits and milk"
  daan: string;             // e.g. "Black sesame and mustard oil to Shani temple"
  daanDay: string;          // e.g. "Saturday before sunset"

  // Gemstone / Rudraksha
  gemstone: string;         // e.g. "Blue Sapphire (Neelam)"
  gemstoneFingers: string;  // e.g. "Middle finger, right hand"
  gemstoneDay: string;      // e.g. "Saturday morning"
  rudrakshaBeads: string;   // e.g. "14 Mukhi Rudraksha"

  // Auspicious Muhurtas (Guruji fills these)
  muhurtas: string;         // free text, e.g. upcoming auspicious dates

  // Guruji's personal message
  gurujiMessage: string;

  // Shastra Vachana (Sanskrit / scripture quote)
  shastraQuote: string;
  shastraQuoteSource: string;
}

async function readDossiers(): Promise<RemedyDossier[]> {
  try {
    const raw = await fs.readFile(DOSSIER_PATH, 'utf-8');
    return JSON.parse(raw) as RemedyDossier[];
  } catch {
    return [];
  }
}

async function writeDossiers(list: RemedyDossier[]) {
  await fs.writeFile(DOSSIER_PATH, JSON.stringify(list, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const reference = req.nextUrl.searchParams.get('reference');
  const dossiers = await readDossiers();

  if (reference) {
    const found = dossiers.find((d) => d.reference === reference);
    if (found) {
      return NextResponse.json({ dossier: found });
    }

    // Pre-populate seeker details from appointment record securely
    try {
      const supabase = createAdminClient();
      const { data: apt } = await supabase
        .from('appointments')
        .select(`
          reference,
          customer_name,
          starts_at,
          customers (phone_e164),
          services (service_translations (locale, title), slug)
        `)
        .eq('reference', reference)
        .maybeSingle();

      if (apt) {
        const d = new Date(apt.starts_at);
        const dateStr = d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        });
        const anyApt: any = apt;
        const serviceTitle =
          anyApt.services?.service_translations?.[0]?.title ||
          anyApt.services?.slug
            ?.split('-')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ') ||
          'Astrology Consultation';

        return NextResponse.json({
          dossier: {
            reference: anyApt.reference,
            seekerName: anyApt.customer_name || 'Valued Seeker',
            phone: anyApt.customers?.phone_e164 || '',
            service: serviceTitle,
            consultationDate: dateStr,
          },
        });
      }
    } catch (e) {
      console.error('Failed to pre-populate appointment for dossier:', e);
    }

    return NextResponse.json({ dossier: null });
  }

  return NextResponse.json({ dossiers });
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const dossiers = await readDossiers();
    const existing = dossiers.findIndex((d) => d.reference === body.reference);
    const now = new Date().toISOString();

    if (existing >= 0) {
      dossiers[existing] = { ...dossiers[existing], ...body, updatedAt: now };
    } else {
      dossiers.push({ ...body, createdAt: now, updatedAt: now });
    }

    await writeDossiers(dossiers);
    return NextResponse.json({ success: true, dossier: body });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save remedy dossier.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const reference = req.nextUrl.searchParams.get('reference');
  if (!reference) return NextResponse.json({ error: 'reference required' }, { status: 400 });
  const dossiers = await readDossiers();
  const filtered = dossiers.filter((d) => d.reference !== reference);
  await writeDossiers(filtered);
  return NextResponse.json({ success: true });
}
