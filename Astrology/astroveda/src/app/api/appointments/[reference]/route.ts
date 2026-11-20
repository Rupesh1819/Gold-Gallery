import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

function verifyManageToken(providedToken?: string | null, storedHash?: string | null): boolean {
  if (!providedToken || !storedHash) return false;
  try {
    const computedHash = crypto.createHash('sha256').update(providedToken.trim()).digest('hex');
    const computedBuf = Buffer.from(computedHash, 'utf8');
    const storedBuf = Buffer.from(storedHash.trim(), 'utf8');
    if (computedBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  } catch {
    return false;
  }
}

function extractProvidedManageToken(request: Request, bodyToken?: string): string | null {
  if (bodyToken && typeof bodyToken === 'string') {
    return bodyToken.trim();
  }
  const customHeader = request.headers.get('x-manage-token');
  if (customHeader) {
    return customHeader.trim();
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference parameter' }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        id,
        reference,
        customer_name,
        customer_notes,
        starts_at,
        ends_at,
        duration_minutes,
        consultation_mode,
        status,
        payment_status,
        price_inr_snapshot,
        locale,
        manage_token_hash,
        service:service_id (
          id,
          slug,
          price_inr,
          duration_minutes,
          service_translations (locale, title, short_description)
        )
      `)
      .eq('reference', reference)
      .maybeSingle();

    if (error || !appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // 1. Check Admin Authorization
    const adminAuth = await verifyAdminRequest(request);

    // 2. Check Customer Management Token Authorization
    const providedToken = extractProvidedManageToken(request);
    const isTokenAuthorized = verifyManageToken(providedToken, appointment.manage_token_hash);

    const isFullyAuthorized = adminAuth.valid || isTokenAuthorized;

    // Public Sanitized Metadata (Zero Customer PII)
    const publicMetadata = {
      id: appointment.id,
      reference: appointment.reference,
      starts_at: appointment.starts_at,
      ends_at: appointment.ends_at,
      duration_minutes: appointment.duration_minutes,
      consultation_mode: appointment.consultation_mode,
      status: appointment.status,
      payment_status: appointment.payment_status,
      price_inr_snapshot: appointment.price_inr_snapshot,
      locale: appointment.locale,
      service: appointment.service,
    };

    if (isFullyAuthorized) {
      // Return private customer information only to verified owner or admin
      return NextResponse.json({
        appointment: {
          ...publicMetadata,
          customer_name: appointment.customer_name,
          customer_notes: appointment.customer_notes,
        },
        authorized: true,
      });
    }

    // For unauthenticated/anonymous calls, return strictly public non-PII metadata
    return NextResponse.json({
      appointment: publicMetadata,
      authorized: false,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred while retrieving appointment details.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference parameter' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { action, reason, manageToken } = body;

    const supabase = createAdminClient();

    // Verify appointment exists
    const { data: existingApt, error: findError } = await supabase
      .from('appointments')
      .select('id, reference, manage_token_hash')
      .eq('reference', reference)
      .maybeSingle();

    if (findError || !existingApt) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Authorization: Must be an authenticated admin OR supply a valid cryptographic manageToken
    const adminAuth = await verifyAdminRequest(request);
    const providedToken = extractProvidedManageToken(request, manageToken);
    const isTokenAuthorized = verifyManageToken(providedToken, existingApt.manage_token_hash);

    if (!adminAuth.valid && !isTokenAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: A valid management token or admin session is required to modify this appointment.' },
        { status: 403 }
      );
    }

    if (action === 'cancel') {
      const { data, error } = await supabase
        .from('appointments')
        .update({
          status: 'cancelled',
          cancelled_by: adminAuth.valid ? 'admin' : 'customer',
          cancellation_reason: reason || 'Seeker requested cancellation via management token',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('reference', reference)
        .select('id, reference, status, cancelled_at')
        .single();

      if (error) {
        return NextResponse.json({ error: 'Failed to cancel appointment.' }, { status: 400 });
      }

      return NextResponse.json({ success: true, appointment: data });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred while modifying the appointment.' },
      { status: 500 }
    );
  }
}
