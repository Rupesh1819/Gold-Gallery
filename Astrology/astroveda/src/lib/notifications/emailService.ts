/**
 * AstroVeda Transactional Email Service
 * Supports Resend API (or falls back gracefully to preview mode when API key is not configured)
 */

import { siteConfig } from '@/config/site';

export interface EmailPayload {
  to: string;
  customerName: string;
  reference: string;
  serviceTitle: string;
  startsAt: string; // ISO
  durationMinutes: number;
  consultationMode: string;
  priceInr: number;
  locale?: string;
  meetLink?: string;
}

function formatIstDateTime(isoDate: string): { dateText: string; timeText: string } {
  const d = new Date(isoDate);
  const dateText = d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  const timeText = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
  return { dateText, timeText: `${timeText} IST` };
}

/**
 * Generates Vedic Sanctuary Styled HTML Email
 */
export function generateBookingConfirmationHtml(payload: EmailPayload): string {
  const { dateText, timeText } = formatIstDateTime(payload.startsAt);
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${payload.locale || 'en'}/book/confirmation/${payload.reference}`;

  const modeText =
    payload.consultationMode === 'video'
      ? 'Google Meet Video Session'
      : payload.consultationMode === 'phone'
      ? 'Direct Phone Consultation'
      : 'Sacred Ashram (In-Person)';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MyGuruji Consultation Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#10172B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F7F3EA;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#10172B;padding:40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#181F33;border-radius:16px;border:1px solid #27304A;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg, #10172B 0%, #1e2744 100%);padding:35px 25px;border-bottom:2px solid #D8B56D;">
              <span style="display:inline-block;padding:4px 14px;border-radius:20px;background:#27304A;border:1px solid rgba(216,181,109,0.3);color:#F6D186;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">
                Vedic Astrology Sanctuary
              </span>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#F6D186;letter-spacing:-0.5px;">
                ${siteConfig.name}
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#D0C5B4;">
                Sacred Jyotish Wisdom &bull; Acharya ${siteConfig.astrologer.name}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:35px 30px;">
              <p style="margin:0 0 16px 0;font-size:16px;color:#DBE1FD;font-weight:600;">
                🙏 Namaste ${payload.customerName},
              </p>
              <p style="margin:0 0 24px 0;font-size:14px;color:#D0C5B4;line-height:1.6;">
                Your sacred appointment request has been received with reverent blessings. Below are the verified coordinates for your upcoming consultation:
              </p>

              <!-- Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#141B2F;border:1px solid #27304A;border-radius:12px;margin-bottom:25px;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#D0C5B4;font-size:12px;font-weight:600;width:35%;">Booking Reference</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#F6D186;font-size:13px;font-family:monospace;font-weight:700;">${payload.reference}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#D0C5B4;font-size:12px;font-weight:600;">Service</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#DBE1FD;font-size:13px;font-weight:600;">${payload.serviceTitle}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#D0C5B4;font-size:12px;font-weight:600;">Scheduled Date</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#DBE1FD;font-size:13px;">${dateText}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#D0C5B4;font-size:12px;font-weight:600;">Consultation Time</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#DBE1FD;font-size:13px;font-weight:700;">${timeText} (${payload.durationMinutes} mins)</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#D0C5B4;font-size:12px;font-weight:600;">Consultation Mode</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #27304A;color:#DBE1FD;font-size:13px;">${modeText}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;color:#D0C5B4;font-size:12px;font-weight:600;">Dakshina Offering</td>
                  <td style="padding:14px 18px;color:#F6D186;font-size:14px;font-weight:700;">₹${payload.priceInr.toLocaleString('en-IN')} (Post-session settlement)</td>
                </tr>
              </table>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:25px;">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#D8B56D;color:#10172B;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 4px 15px rgba(216,181,109,0.3);">
                      View Live Booking Status &amp; Add to Calendar &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Preparation Advice -->
              <div style="background-color:#1c253d;border-left:3px solid #D8B56D;padding:14px 16px;border-radius:6px;margin-bottom:24px;">
                <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#F6D186;">
                  Preparation for the Sacred Dialogue:
                </p>
                <p style="margin:0;font-size:12px;color:#D0C5B4;line-height:1.5;">
                  Please have your exact date of birth, time of birth (from birth certificate/hospital records), and place of birth ready. If consulting via Video, ensure a quiet space for contemplation.
                </p>
              </div>

              <p style="margin:0;font-size:13px;color:#D0C5B4;line-height:1.5;">
                In sacred fellowship,<br>
                <strong style="color:#DBE1FD;">${siteConfig.astrologer.name}</strong><br>
                <span style="font-size:12px;color:#D8B56D;">${siteConfig.name}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#10172B;padding:20px 25px;border-top:1px solid #27304A;">
              <p style="margin:0;font-size:11px;color:#D0C5B4;opacity:0.7;">
                ${siteConfig.contact.address.fullText}
              </p>
              <p style="margin:4px 0 0 0;font-size:11px;color:#D0C5B4;opacity:0.7;">
                WhatsApp: ${siteConfig.contact.phone} &bull; Email: ${siteConfig.contact.email}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Dispatcher: Sends email via Resend if RESEND_API_KEY is present,
 * or logs cleanly in simulated dev mode.
 */
export async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; mode: 'resend' | 'preview'; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || `${siteConfig.name} <appointments@myguruji.com>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, mode: 'resend', error: data.message || 'Resend API error' };
      }
      return { success: true, mode: 'resend', id: data.id };
    } catch (err: any) {
      console.error('Failed to send email via Resend:', err);
      return { success: false, mode: 'resend', error: err.message };
    }
  }

  // Preview Mode when no API key configured
  const maskedTo = options.to.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.max(1, b.length)) + c);
  console.log(`[EmailService: Simulated Dispatch] To: ${maskedTo} | Subject: ${options.subject}`);
  return {
    success: true,
    mode: 'preview',
    id: `preview-${Date.now()}`,
  };
}

/**
 * High-level helper: Send Booking Confirmation Email
 */
export async function sendBookingConfirmationEmail(payload: EmailPayload) {
  if (!payload.to || !payload.to.includes('@')) {
    return { success: false, error: 'Invalid recipient email' };
  }

  const html = generateBookingConfirmationHtml(payload);
  const subject = `Consultation Confirmed: ${payload.serviceTitle} [Token: ${payload.reference}]`;

  return sendTransactionalEmail({
    to: payload.to,
    subject,
    html,
  });
}
