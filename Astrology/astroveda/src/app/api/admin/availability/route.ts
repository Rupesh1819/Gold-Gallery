import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

export interface DayRule {
  id?: string;
  weekday: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  kind: 'working' | 'break';
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface AvailabilityException {
  id: string;
  kind: 'holiday' | 'blocked' | 'extra_hours';
  date_from: string;
  date_to: string;
  start_time?: string | null;
  end_time?: string | null;
  reason?: string | null;
  created_at?: string;
}

const defaultRules: DayRule[] = [
  { weekday: 1, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 1, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 2, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 2, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 3, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 3, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 4, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 4, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 5, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 5, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 6, kind: 'working', start_time: '10:00:00', end_time: '19:00:00', is_active: true },
  { weekday: 6, kind: 'break', start_time: '13:00:00', end_time: '14:00:00', is_active: true },
  { weekday: 0, kind: 'working', start_time: '11:00:00', end_time: '17:00:00', is_active: false },
];

export async function GET(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch availability rules
    const { data: rulesData, error: rulesErr } = await supabase
      .from('availability_rules')
      .select('*')
      .order('weekday', { ascending: true })
      .order('kind', { ascending: false });

    // 2. Fetch exceptions from today onwards
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: exceptionsData, error: excErr } = await supabase
      .from('availability_exceptions')
      .select('*')
      .gte('date_to', todayStr)
      .order('date_from', { ascending: true });

    return NextResponse.json({
      rules: rulesData && rulesData.length > 0 ? rulesData : defaultRules,
      exceptions: exceptionsData || [],
      isLive: !rulesErr && !excErr,
    });
  } catch (err: any) {
    return NextResponse.json({
      rules: defaultRules,
      exceptions: [],
      isLive: false,
      error: 'Failed to retrieve availability rules.',
    });
  }
}

export async function PATCH(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, weekday, kind = 'working', is_active, start_time, end_time } = body;

    const supabase = createAdminClient();

    if (id) {
      // Update by existing rule ID
      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (typeof is_active === 'boolean') updateData.is_active = is_active;
      if (start_time) updateData.start_time = start_time;
      if (end_time) updateData.end_time = end_time;

      const { data, error } = await supabase
        .from('availability_rules')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, rule: data });
    } else if (weekday !== undefined) {
      // Upsert by weekday + kind
      const { data, error } = await supabase
        .from('availability_rules')
        .upsert(
          {
            weekday,
            kind,
            is_active: typeof is_active === 'boolean' ? is_active : true,
            start_time: start_time || '10:00:00',
            end_time: end_time || '19:00:00',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'weekday,kind' }
        )
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, rule: data });
    }

    return NextResponse.json({ error: 'Missing ID or weekday' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update availability rule.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { kind = 'holiday', date_from, date_to, reason, start_time, end_time } = body;

    if (!date_from || !date_to) {
      return NextResponse.json({ error: 'Date range is required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('availability_exceptions')
      .insert({
        kind,
        date_from,
        date_to,
        reason: reason || 'Sacred Holiday / Inauspicious Muhurta',
        start_time: start_time || null,
        end_time: end_time || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, exception: data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update availability rule.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing exception ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('availability_exceptions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update availability rule.' }, { status: 500 });
  }
}

