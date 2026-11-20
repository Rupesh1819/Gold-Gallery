import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        reference,
        customer_id,
        service_id,
        starts_at,
        ends_at,
        duration_minutes,
        price_inr_snapshot,
        consultation_mode,
        status,
        payment_status,
        payment_amount_inr,
        payment_method,
        customer_name,
        customer_notes,
        created_at,
        customers (id, phone_e164, email, full_name),
        services (id, slug, price_inr, service_translations (locale, title))
      `)
      .order('starts_at', { ascending: false });

    if (error) {
      return NextResponse.json({ appointments: [], error: 'Failed to retrieve appointments.' });
    }

    return NextResponse.json({ appointments: appointments || [] });
  } catch (err: any) {
    return NextResponse.json({ appointments: [], error: 'An unexpected error occurred while retrieving appointments.' });
  }
}

export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, payment_status, payment_method, payment_amount_inr } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      if (status === 'confirmed') updatePayload.confirmed_at = new Date().toISOString();
      if (status === 'completed') updatePayload.completed_at = new Date().toISOString();
      if (status === 'cancelled') {
        updatePayload.cancelled_at = new Date().toISOString();
        updatePayload.cancelled_by = 'admin';
      }
    }

    if (payment_status) {
      updatePayload.payment_status = payment_status;
      if (payment_status === 'paid') {
        updatePayload.payment_amount_inr = payment_amount_inr || 1000;
        updatePayload.payment_method = payment_method || 'upi_direct';
        updatePayload.payment_recorded_at = new Date().toISOString();
        if (!status || status !== 'completed') {
          updatePayload.status = 'completed';
          updatePayload.completed_at = new Date().toISOString();
        }
      } else if (payment_status === 'unpaid') {
        updatePayload.payment_amount_inr = null;
        updatePayload.payment_method = null;
        updatePayload.payment_recorded_at = null;
      }
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update appointment record.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, appointment: data });
  } catch (err: any) {
    return NextResponse.json({ error: 'An unexpected error occurred while updating appointment.' }, { status: 500 });
  }
}
