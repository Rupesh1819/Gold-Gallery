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
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        slug,
        duration_minutes,
        buffer_minutes,
        price_inr,
        consultation_modes,
        sort_order,
        is_active,
        image_path,
        service_translations (locale, title, short_description, description)
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ services: [], error: 'Failed to retrieve services.' });
    }

    return NextResponse.json({ services: services || [] });
  } catch (err: any) {
    return NextResponse.json({ services: [], error: 'An unexpected error occurred while retrieving services.' });
  }
}

export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, price_inr, duration_minutes, buffer_minutes, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (price_inr !== undefined) updatePayload.price_inr = Number(price_inr);
    if (duration_minutes !== undefined) updatePayload.duration_minutes = Number(duration_minutes);
    if (buffer_minutes !== undefined) updatePayload.buffer_minutes = Number(buffer_minutes);
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active);

    const { data, error } = await supabase
      .from('services')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update service record.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, service: data });
  } catch (err: any) {
    return NextResponse.json({ error: 'An unexpected error occurred while modifying service.' }, { status: 500 });
  }
}
