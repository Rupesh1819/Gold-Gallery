/**
 * AstroVeda Notification Dispatcher & Template Service
 * Coordinates automated notification templates for WhatsApp & Transactional Email
 */

import { siteConfig } from '@/config/site';

export interface NotificationBookingPayload {
  reference: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceTitle: string;
  startsAt: string; // ISO
  durationMinutes: number;
  consultationMode: string;
  priceInr: number;
  locale: string;
  notes?: string;
}

/**
 * Format IST Date and Time for human-readable messages
 */
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
 * 1. Build Notification for the Seeker
 */
export function buildSeekerNotification(payload: NotificationBookingPayload) {
  const { dateText, timeText } = formatIstDateTime(payload.startsAt);
  const modeText =
    payload.consultationMode === 'video'
      ? 'Google Meet Video Call'
      : payload.consultationMode === 'phone'
      ? 'Direct Phone Call'
      : 'Sacred Sanctuary (In-Person)';

  const messageText = [
    `🙏 *Namaste ${payload.customerName}*,`,
    '',
    `Your sacred consultation request with *${siteConfig.name}* is received.`,
    '',
    `📜 *Booking Token*: ${payload.reference}`,
    `🔮 *Service*: ${payload.serviceTitle}`,
    `📅 *Date*: ${dateText}`,
    `⏰ *Time*: ${timeText}`,
    `📡 *Mode*: ${modeText}`,
    `🪙 *Dakshina*: ₹${payload.priceInr.toLocaleString('en-IN')} (Settled post-session)`,
    '',
    `🔗 *Your Live Booking Portal*:`,
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${payload.locale}/book/confirmation/${payload.reference}`,
    '',
    `Our ashram coordinator will verify slot alignment and share the meeting link prior to the session.`,
    '',
    `Warm regards,`,
    `${siteConfig.astrologer.name} • ${siteConfig.name}`,
  ].join('\n');

  return {
    recipientPhone: payload.phone,
    recipientEmail: payload.email,
    subject: `Consultation Received: ${payload.serviceTitle} [Ref: ${payload.reference}]`,
    messageText,
    whatsappUrl: `https://wa.me/${payload.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageText)}`,
  };
}

/**
 * 2. Build Notification Alert for the Astrologer / Sanctuary Coordinator
 */
export function buildAstrologerAlert(payload: NotificationBookingPayload) {
  const { dateText, timeText } = formatIstDateTime(payload.startsAt);

  const alertText = [
    `🔔 *NEW CONSULTATION BOOKED* 🔔`,
    '',
    `Seeker: ${payload.customerName}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || 'N/A'}`,
    `Service: ${payload.serviceTitle}`,
    `Schedule: ${dateText} at ${timeText}`,
    `Mode: ${payload.consultationMode.toUpperCase()}`,
    `Token: ${payload.reference}`,
    payload.notes ? `Seeker Question: "${payload.notes}"` : '',
    '',
    `Direct Admin Action:`,
    `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/appointments`,
  ].filter(Boolean).join('\n');

  return {
    astrologerPhone: siteConfig.contact.whatsappNumber,
    astrologerEmail: siteConfig.contact.email,
    subject: `[New Booking Alert] ${payload.customerName} - ${payload.reference}`,
    alertText,
    whatsappAdminUrl: `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(alertText)}`,
  };
}

/**
 * 3. Quick Action Message Generators for the Astrologer in Admin
 */
export const adminQuickMessages = {
  sendMeetingLink: (customerName: string, serviceTitle: string, meetLink: string) =>
    encodeURIComponent(
      `🙏 Namaste ${customerName}, here are the video session coordinates for your upcoming ${serviceTitle} consultation:\n\n📹 Google Meet: ${meetLink}\n\nPlease join 2 minutes before the appointed time. Look forward to our sacred dialogue.`
    ),

  sendReminder: (customerName: string, timeStr: string) =>
    encodeURIComponent(
      `🙏 Namaste ${customerName}, friendly reminder that your MyGuruji consultation is scheduled today at ${timeStr}. Please keep your birth details handy.`
    ),

  requestDakshina: (customerName: string, amount: number, reference: string) =>
    encodeURIComponent(
      `🙏 Namaste ${customerName}, thank you for attending today's sacred Jyotish consultation (Ref: ${reference}).\n\nYou may settle the Dakshina of ₹${amount.toLocaleString('en-IN')} via UPI to: ${siteConfig.contact.email} or direct scan.\n\nMay the planetary energies bestow clarity and auspicious direction upon your path.`
    ),
};

