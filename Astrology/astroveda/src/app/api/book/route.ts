import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildSeekerNotification, buildAstrologerAlert } from '@/lib/notifications/notificationService';
import { sendBookingConfirmationEmail } from '@/lib/notifications/emailService';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimiter';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(`book:${clientIp}`, { limit: 10, windowMs: 15 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many booking attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    const body = await request.json();
    const {
      serviceSlug,
      dateStr,
      timeSlot,
      fullName,
      phone,
      email,
      language = 'en',
      mode = 'video',
      questionArea = '',
      consent = false,
      turnstileToken,
    } = body;

    // Optional Cloudflare Turnstile Verification if configured
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileToken) {
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${encodeURIComponent(clientIp)}`,
        });
        const verifyJson = await verifyRes.json();
        if (!verifyJson.success) {
          return NextResponse.json(
            { error: 'Human security verification failed. Please refresh and try again.' },
            { status: 403 }
          );
        }
      } catch (err) {
        console.error('Turnstile verification error:', err);
      }
    }

    if (!fullName || !phone || !consent) {
      return NextResponse.json(
        { error: 'Missing required customer details or DPDP consent' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Resolve service
    const { data: service, error: svcErr } = await supabase
      .from('services')
      .select('id, slug, duration_minutes, buffer_minutes, price_inr')
      .eq('slug', serviceSlug || 'general-consultation')
      .maybeSingle();

    if (svcErr || !service) {
      return NextResponse.json(
        { error: 'Selected service not found in registry' },
        { status: 404 }
      );
    }

    // 2. Format phone number to E.164
    let cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10) cleanPhone = '+91' + cleanPhone;
      else cleanPhone = '+' + cleanPhone;
    }

    // 3. Upsert customer record
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert(
        {
          full_name: fullName.trim(),
          phone_e164: cleanPhone,
          email: email?.trim() || null,
          preferred_locale: language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en',
        },
        { onConflict: 'phone_e164' }
      )
      .select('id')
      .single();

    if (custErr || !customer) {
      console.error('Customer upsert error:', custErr);
      return NextResponse.json(
        { error: 'Failed to record seeker details' },
        { status: 500 }
      );
    }

    // 4. Calculate appointment start and end times in IST
    const scheduledDate = dateStr || new Date().toISOString().split('T')[0];
    const slotTime = timeSlot || '11:00 AM';

    // Parse hour and minute from slotTime e.g. "11:00 AM" or "02:00 PM"
    const [timePart, modifier] = slotTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const pad = (n: number) => n.toString().padStart(2, '0');
    // IST is UTC+5:30
    const startsAtIso = `${scheduledDate}T${pad(hours)}:${pad(minutes)}:00+05:30`;
    const startDate = new Date(startsAtIso);
    const durationMs = service.duration_minutes * 60 * 1000;
    const bufferMs = (service.buffer_minutes || 15) * 60 * 1000;
    const endsDate = new Date(startDate.getTime() + durationMs);
    const occupiedDate = new Date(endsDate.getTime() + bufferMs);

    // 5. Generate Reference Token and Cryptographic Management Token
    const reference = 'AST-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const rawManageToken = crypto.randomBytes(32).toString('hex');
    const manageTokenHash = crypto.createHash('sha256').update(rawManageToken).digest('hex');

    // 6. Insert appointment
    const { data: appointment, error: apptErr } = await supabase
      .from('appointments')
      .insert({
        reference,
        customer_id: customer.id,
        service_id: service.id,
        resource_key: 'primary',
        starts_at: startDate.toISOString(),
        ends_at: endsDate.toISOString(),
        occupied_until: occupiedDate.toISOString(),
        duration_minutes: service.duration_minutes,
        price_inr_snapshot: service.price_inr,
        consultation_mode: mode === 'phone' ? 'phone' : mode === 'in_person' ? 'in_person' : 'video',
        status: 'pending',
        payment_status: 'unpaid',
        customer_name: fullName.trim(),
        customer_notes: questionArea ? questionArea.trim() : null,
        locale: language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en',
        consent_accepted_at: new Date().toISOString(),
        consent_policy_version: 'dpdp-2023-v1',
        manage_token_hash: manageTokenHash,
      })
      .select('id, reference, starts_at, status')
      .single();

    if (apptErr) {
      // Catch PostgreSQL exclusion constraint violation (SQLSTATE 23P01)
      if (
        apptErr.code === '23P01' ||
        apptErr.message?.includes('appointments_no_overlap') ||
        apptErr.message?.includes('exclusion constraint')
      ) {
        return NextResponse.json(
          { error: 'This appointment slot is no longer available. Please choose another time.' },
          { status: 409 }
        );
      }

      console.error('Appointment insertion error:', apptErr.code);
      return NextResponse.json(
        { error: 'Unable to schedule appointment. Please try again or select another time.' },
        { status: 500 }
      );
    }

    // 5. Generate automated notification payloads
    const notificationPayload = {
      reference: appointment.reference,
      customerName: fullName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      serviceTitle: service.slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      startsAt: appointment.starts_at,
      durationMinutes: service.duration_minutes,
      consultationMode: mode,
      priceInr: Number(service.price_inr || 1000),
      locale: language,
      notes: questionArea ? questionArea.trim() : undefined,
    };

    const seekerNotification = buildSeekerNotification(notificationPayload);
    const astrologerAlert = buildAstrologerAlert(notificationPayload);

    // Asynchronously dispatch transactional email if seeker provided email
    if (notificationPayload.email) {
      sendBookingConfirmationEmail({
        to: notificationPayload.email,
        customerName: notificationPayload.customerName,
        reference: notificationPayload.reference,
        serviceTitle: notificationPayload.serviceTitle,
        startsAt: notificationPayload.startsAt,
        durationMinutes: notificationPayload.durationMinutes,
        consultationMode: notificationPayload.consultationMode,
        priceInr: notificationPayload.priceInr,
        locale: notificationPayload.locale,
      }).catch((emailErr) => {
        console.error('[Email Dispatcher Error]:', emailErr);
      });
    }

    console.log('[Notification Dispatcher] Seeker notification generated for Ref:', appointment.reference);
    console.log('[Notification Dispatcher] Astrologer alert generated for Ref:', appointment.reference);

    return NextResponse.json({
      success: true,
      reference: appointment.reference,
      manageToken: rawManageToken,
      startsAt: appointment.starts_at,
      status: appointment.status,
      seekerNotificationUrl: seekerNotification.whatsappUrl,
      astrologerAlertUrl: astrologerAlert.whatsappAdminUrl,
    });
  } catch (err: any) {
    console.error('Booking API handler exception');
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your booking request. Please try again.' },
      { status: 500 }
    );
  }
}

