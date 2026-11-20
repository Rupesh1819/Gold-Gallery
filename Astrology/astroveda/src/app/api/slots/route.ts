import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceSlug = searchParams.get('service');
  const dateStr = searchParams.get('date');

  if (!serviceSlug || !dateStr) {
    return NextResponse.json(
      { error: 'Missing service or date parameter' },
      { status: 400 }
    );
  }

  try {
    // 1. Look up the service by slug or ID
    const { data: service, error: svcErr } = await supabase
      .from('services')
      .select('id, duration_minutes, buffer_minutes')
      .eq('slug', serviceSlug)
      .maybeSingle();

    if (svcErr || !service) {
      // Fallback slots if service not found or DB offline
      return NextResponse.json({
        service: serviceSlug,
        date: dateStr,
        slots: [
          '10:00 AM',
          '11:00 AM',
          '12:00 PM',
          '02:00 PM',
          '03:00 PM',
          '04:00 PM',
          '05:00 PM',
          '06:00 PM',
        ],
      });
    }

    // 2. Call PostgreSQL get_available_slots function
    const { data: rpcSlots, error: rpcErr } = await supabase.rpc('get_available_slots', {
      p_service_id: service.id,
      p_date: dateStr,
    });

    if (rpcErr || !rpcSlots || rpcSlots.length === 0) {
      // Return standard fallback slots if date is outside range or no slots left
      return NextResponse.json({
        service: serviceSlug,
        date: dateStr,
        slots: [
          '10:00 AM',
          '11:00 AM',
          '12:00 PM',
          '02:00 PM',
          '03:00 PM',
          '04:00 PM',
          '05:00 PM',
          '06:00 PM',
        ],
      });
    }

    // Format ISO slots to human IST times
    const formattedSlots = rpcSlots.map((s: { slot_start: string }) => {
      const d = new Date(s.slot_start);
      return d.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    });

    return NextResponse.json({
      service: serviceSlug,
      date: dateStr,
      slots: formattedSlots,
      rawSlots: rpcSlots,
    });
  } catch (err: any) {
    console.error('Error fetching slots:', err);
    return NextResponse.json({
      service: serviceSlug,
      date: dateStr,
      slots: [
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM',
      ],
    });
  }
}
