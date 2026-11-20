import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

const DOSSIER_FILE = path.join(process.cwd(), 'src', 'config', 'remedyDossiers.json');

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    
    // Fetch customers with appointments count
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        id,
        full_name,
        phone_e164,
        email,
        preferred_locale,
        anonymized_at,
        created_at,
        appointments:appointments (id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch seekers' }, { status: 400 });
    }

    const formatted = (customers || []).map((c: any) => ({
      id: c.id,
      name: c.anonymized_at ? 'Anonymized Seeker' : c.full_name,
      phone: c.anonymized_at ? 'REDACTED' : c.phone_e164,
      email: c.anonymized_at ? 'N/A' : (c.email || 'N/A'),
      preferredLanguage: c.preferred_locale === 'hi' ? 'Hindi' : c.preferred_locale === 'mr' ? 'Marathi' : 'English',
      totalBookings: Array.isArray(c.appointments) ? c.appointments.length : 0,
      anonymized: !!c.anonymized_at,
      joinedDate: new Date(c.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    }));

    return NextResponse.json({ customers: formatted });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected server error occurred while retrieving seekers.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== 'anonymize') {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const nowIso = new Date().toISOString();
    
    // Unique synthetic placeholder phone complying with E.164 and avoiding collisions
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const anonymizedPhone = `+999000${randomSuffix}`;

    // 1. Fetch all appointments associated with this customer before scrub
    const { data: customerAppointments } = await supabase
      .from('appointments')
      .select('reference')
      .eq('customer_id', id);

    const targetRefs = new Set((customerAppointments || []).map((a: any) => a.reference));

    // 2. Anonymize customer row in Supabase
    const { data: updatedCustomer, error: custErr } = await supabase
      .from('customers')
      .update({
        full_name: 'Anonymized Seeker',
        phone_e164: anonymizedPhone,
        email: null,
        anonymized_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', id)
      .select()
      .single();

    if (custErr) {
      return NextResponse.json({ error: 'Failed to anonymize customer record' }, { status: 400 });
    }

    // 3. Anonymize all related appointments in Supabase
    await supabase
      .from('appointments')
      .update({
        customer_name: 'Anonymized Seeker',
        customer_notes: null,
        updated_at: nowIso,
      })
      .eq('customer_id', id);

    // 4. Scrub any matching Remedy Dossiers from persistent storage
    if (fs.existsSync(DOSSIER_FILE)) {
      try {
        const rawContent = fs.readFileSync(DOSSIER_FILE, 'utf-8');
        const dossiers = JSON.parse(rawContent);
        if (Array.isArray(dossiers)) {
          let scrubbedCount = 0;
          const updatedDossiers = dossiers.map((d: any) => {
            if (targetRefs.has(d.reference) || d.id === id) {
              scrubbedCount++;
              return {
                ...d,
                seekerName: 'Anonymized Seeker',
                phone: anonymizedPhone,
                gurujiMessage: 'Personal seeker notes archived under DPDP Act.',
                updatedAt: nowIso,
              };
            }
            return d;
          });

          if (scrubbedCount > 0) {
            fs.writeFileSync(DOSSIER_FILE, JSON.stringify(updatedDossiers, null, 2), 'utf-8');
          }
        }
      } catch (fileErr) {
        console.error('Error scrubbing remedy dossiers during anonymization:', fileErr);
      }
    }

    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected server error occurred during data anonymization.' },
      { status: 500 }
    );
  }
}
