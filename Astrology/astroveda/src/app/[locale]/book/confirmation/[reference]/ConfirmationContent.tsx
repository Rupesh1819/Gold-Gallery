'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Clock, 
  MessageCircle, 
  Calendar, 
  Copy, 
  Check, 
  Download, 
  Home, 
  RefreshCw, 
  XCircle,
  Video,
  Phone,
  MapPin,
  User,
  Loader2,
  CheckCircle2,
  CalendarPlus
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getGoogleCalendarUrl, downloadIcsFile } from '@/lib/calendar/calendarUtils';

interface AppointmentData {
  id: string;
  reference: string;
  customer_name: string;
  customer_notes?: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  consultation_mode: 'video' | 'phone' | 'in_person';
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed' | 'no_show' | 'expired';
  payment_status: 'unpaid' | 'paid' | 'waived' | 'refunded';
  price_inr_snapshot: number;
  service?: {
    slug: string;
    price_inr: number;
    duration_minutes: number;
    service_translations?: Array<{
      locale: string;
      title: string;
      short_description: string;
    }>;
  };
}

export function ConfirmationContent({ reference }: { reference: string }) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>('pending');

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const manageToken = typeof window !== 'undefined' ? sessionStorage.getItem(`manage_token_${reference}`) : null;
        const res = await fetch(`/api/appointments/${reference}`, {
          headers: manageToken ? { 'x-manage-token': manageToken } : {},
        });
        if (res.ok) {
          const json = await res.json();
          if (json.appointment) {
            setAppointment(json.appointment);
            setCurrentStatus(json.appointment.status);
          }
        }
      } catch (e) {
        console.error('Failed to load appointment details:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [reference]);

  const copyRef = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    if (cancelling || currentStatus === 'cancelled') return;
    const confirmed = window.confirm(
      locale === 'hi'
        ? 'क्या आप निश्चित रूप से इस परामर्श को रद्द करना चाहते हैं?'
        : locale === 'mr'
        ? 'तुम्हाला खात्री आहे का की तुम्ही हे मार्गदर्शन रद्द करू इच्छिता?'
        : 'Are you sure you want to cancel this consultation?'
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      const manageToken = typeof window !== 'undefined' ? sessionStorage.getItem(`manage_token_${reference}`) : null;
      const res = await fetch(`/api/appointments/${reference}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(manageToken ? { 'x-manage-token': manageToken } : {}),
        },
        body: JSON.stringify({
          action: 'cancel',
          reason: 'Seeker requested cancellation via confirmation page',
          manageToken: manageToken || undefined,
        }),
      });
      if (res.ok) {
        setCurrentStatus('cancelled');
        if (appointment) {
          setAppointment({ ...appointment, status: 'cancelled' });
        }
      }
    } catch (e) {
      console.error('Failed to cancel appointment:', e);
    } finally {
      setCancelling(false);
    }
  };

  // Derive Service Name
  const serviceTitle = (() => {
    if (!appointment?.service) return 'General Kundali Consultation';
    const translation = appointment.service.service_translations?.find(
      (tr) => tr.locale === locale
    ) || appointment.service.service_translations?.find(
      (tr) => tr.locale === 'en'
    );
    if (translation?.title) return translation.title;
    return appointment.service.slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  })();

  // Format Date and Time in IST
  const { dateStr, timeStr } = (() => {
    if (!appointment?.starts_at) {
      return {
        dateStr: 'Upcoming Consultation',
        timeStr: 'Scheduled IST (Asia/Kolkata)',
      };
    }
    const d = new Date(appointment.starts_at);
    const dateFormatted = d.toLocaleDateString(
      locale === 'hi' ? 'hi-IN' : locale === 'mr' ? 'mr-IN' : 'en-IN',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata',
      }
    );
    const timeFormatted = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
    return {
      dateStr: dateFormatted,
      timeStr: `${timeFormatted} IST (Asia/Kolkata)`,
    };
  })();

  const modeLabel = (() => {
    const m = appointment?.consultation_mode || 'video';
    if (m === 'video') return 'Google Meet / Video Call';
    if (m === 'phone') return 'Direct Phone Consultation';
    return 'In-Person Sacred Sanctuary';
  })();

  const whatsappUrl = siteConfig.getWhatsAppUrl(
    `Namaste ${siteConfig.name}, I have submitted a booking request (Ref: ${reference}). Please verify availability.`
  );

  const calendarEventPayload = appointment?.starts_at ? {
    title: `${siteConfig.name}: ${serviceTitle}`,
    description: `Vedic Consultation with ${siteConfig.astrologer.name} (${siteConfig.name}).\nReference Token: ${reference}\nDuration: ${appointment.duration_minutes || 60} mins\nMode: ${modeLabel}\nDakshina: ₹${appointment.price_inr_snapshot || 1000}`,
    location: appointment.consultation_mode === 'in_person' ? siteConfig.contact.address.fullText : 'Google Meet Video Call',
    startsAt: appointment.starts_at,
    durationMinutes: appointment.duration_minutes || 60,
    reference,
  } : null;

  const googleCalUrl = calendarEventPayload ? getGoogleCalendarUrl(calendarEventPayload) : '#';

  const handleDownloadIcs = () => {
    if (calendarEventPayload) {
      downloadIcsFile(calendarEventPayload);
    }
  };

  return (
    <div className="w-full">
      {/* Top Header */}
      <section className="w-full bg-[#10172B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#D8B56D]/15 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider">
          <span>{t('confStatusBadge')}</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F6D186]">
          {t('confTitle')}
        </h1>

        <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-xl mx-auto font-body">
          {t('confSubtitle')}
        </p>
      </section>

      {/* Main Content Area */}
      <section className="bg-[#F7F3EA] py-12 px-4 sm:px-6 lg:px-8 text-[#10172B]">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Main Ivory / White Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-[#D8B56D]/30 space-y-8">
            
            {/* Token & Status Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#10172B]/10 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#7A5A12] uppercase tracking-wider block">
                  {t('confTokenLabel')}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-[#10172B] tracking-wide">
                    {reference}
                  </span>
                  <button
                    type="button"
                    onClick={copyRef}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F3EA] hover:bg-[#D8B56D]/20 text-xs font-bold text-[#10172B] border border-[#10172B]/15 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? t('copied') : t('copy')}</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27304A]/10 text-xs text-[#10172B]/70 font-medium">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Loading live details...</span>
                </div>
              ) : currentStatus === 'confirmed' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-xs font-bold text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  <span>Confirmed &amp; Locked</span>
                </div>
              ) : currentStatus === 'cancelled' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D62839]/15 border border-[#D62839]/30 text-xs font-bold text-[#D62839]">
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Cancelled</span>
                </div>
              ) : currentStatus === 'completed' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-bold text-blue-700">
                  <Check className="h-3.5 w-3.5" />
                  <span>Completed</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFDF9F]/40 border border-[#D8B56D]/40 text-xs font-bold text-[#7A5A12]">
                  <div className="h-2 w-2 rounded-full bg-[#D8B56D] animate-pulse" />
                  <span>{t('confPendingStatus')}</span>
                </div>
              )}
            </div>

            {/* 4 Details Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Service */}
              <div className="p-4 rounded-xl bg-[#F7F3EA]/60 border border-[#10172B]/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                  {t('confCardService')}
                </span>
                <h4 className="font-heading text-base font-bold text-[#10172B]">
                  {serviceTitle}
                </h4>
                <p className="text-xs text-[#10172B]/70 flex items-center gap-1 pt-1">
                  <Clock className="h-3.5 w-3.5 text-[#7A5A12]" />
                  <span>
                    {appointment?.duration_minutes || 60} mins consultation (₹
                    {appointment?.price_inr_snapshot || 1000})
                  </span>
                </p>
              </div>

              {/* Card 2: Date & Time */}
              <div className="p-4 rounded-xl bg-[#F7F3EA]/60 border border-[#10172B]/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                  {t('confCardDateTime')}
                </span>
                <h4 className="font-heading text-base font-bold text-[#10172B]">
                  {dateStr}
                </h4>
                <p className="text-xs text-[#10172B]/70 flex items-center gap-1 pt-1">
                  <Calendar className="h-3.5 w-3.5 text-[#7A5A12]" />
                  <span>{timeStr}</span>
                </p>
              </div>

              {/* Card 3: Seeker */}
              <div className="p-4 rounded-xl bg-[#F7F3EA]/60 border border-[#10172B]/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                  {t('confCardSeeker')}
                </span>
                <h4 className="font-heading text-base font-bold text-[#10172B]">
                  {appointment?.customer_name || 'Valued Seeker'}
                </h4>
                <p className="text-xs text-[#10172B]/70 flex items-center gap-1 pt-1">
                  <User className="h-3.5 w-3.5 text-[#7A5A12]" />
                  <span>Verified Contact Recorded</span>
                </p>
              </div>

              {/* Card 4: Mode */}
              <div className="p-4 rounded-xl bg-[#F7F3EA]/60 border border-[#10172B]/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                  {t('confCardMode')}
                </span>
                <h4 className="font-heading text-base font-bold text-[#10172B]">
                  {modeLabel}
                </h4>
                <p className="text-xs text-[#10172B]/70 flex items-center gap-1 pt-1">
                  {appointment?.consultation_mode === 'in_person' ? (
                    <MapPin className="h-3.5 w-3.5 text-[#7A5A12]" />
                  ) : appointment?.consultation_mode === 'phone' ? (
                    <Phone className="h-3.5 w-3.5 text-[#7A5A12]" />
                  ) : (
                    <Video className="h-3.5 w-3.5 text-[#7A5A12]" />
                  )}
                  <span>
                    {appointment?.consultation_mode === 'in_person'
                      ? siteConfig.contact.address.fullText
                      : 'Link / Call coordinates sent prior to slot'}
                  </span>
                </p>
              </div>
            </div>

            {/* Post-Consultation Settlement (Dharini Dakshina) Box */}
            <div className="p-5 rounded-xl bg-[#FFDF9F]/25 border border-[#D8B56D]/40 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-heading text-sm font-bold text-[#10172B]">
                  {t('confPostDakshinaTitle')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10172B] text-[#F6D186] px-2.5 py-0.5 rounded-full">
                  {t('confNoAdvance')}
                </span>
              </div>
              <p className="text-xs text-[#5B4303] leading-relaxed font-body">
                {t('confPostDakshinaText')}
              </p>
            </div>

            {/* Actions Row */}
            <div className="pt-4 border-t border-[#10172B]/10 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-md transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t('confWhatsappBtn')}</span>
              </a>

              {calendarEventPayload && (
                <>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#27304A] hover:bg-[#1E2538] text-[#F6D186] text-xs font-bold border border-[#D8B56D]/30 transition-all shadow-xs"
                    title="Add to Google Calendar"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-[#D8B56D]" />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadIcs}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F7F3EA] text-[#10172B] text-xs font-bold border border-[#10172B]/20 transition-all shadow-2xs cursor-pointer"
                    title="Download .ICS Event for Apple & Outlook Calendar"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#7A5A12]" />
                    <span>Apple / Outlook (.ICS)</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F7F3EA] text-[#10172B] text-xs font-bold border border-[#10172B]/20 transition-all shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t('confDownloadSlip')}</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F7F3EA] text-[#10172B] text-xs font-bold border border-[#10172B]/20 transition-all shadow-2xs ml-auto"
              >
                <Home className="h-3.5 w-3.5" />
                <span>{t('confHome')}</span>
              </Link>
            </div>

          </div>

          {/* Manage Your Appointment Card */}
          <div className="bg-[#10172B] text-white rounded-2xl p-6 sm:p-8 border border-[#D8B56D]/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27304A] gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#D8B56D] uppercase tracking-wider block">
                  Token-Authorized Client Portal
                </span>
                <h3 className="font-heading text-xl font-bold text-[#F6D186]">
                  {t('confManageTitle')}
                </h3>
              </div>

              <div className="text-xs text-[#D0C5B4] flex items-center gap-1.5 bg-[#27304A] px-3 py-1 rounded-full border border-[#D8B56D]/20">
                <Clock className="h-3.5 w-3.5 text-[#F6D186]" />
                <span>{t('confManageWindow')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/book"
                className="p-4 rounded-xl bg-[#27304A] border border-[#D8B56D]/20 hover:border-[#D8B56D] transition-colors flex items-start gap-3.5 group"
              >
                <RefreshCw className="h-5 w-5 text-[#F6D186] shrink-0 mt-0.5 group-hover:rotate-45 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-[#F6D186]">{t('confReschedule')}</h4>
                  <p className="text-[11px] text-[#D0C5B4] mt-0.5">
                    {t('confRescheduleDesc')}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                disabled={currentStatus === 'cancelled' || cancelling}
                onClick={handleCancel}
                className="p-4 rounded-xl bg-[#27304A] border border-[#D8B56D]/20 hover:border-[#D62839] transition-colors flex items-start gap-3.5 text-left group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? (
                  <Loader2 className="h-5 w-5 text-[#D62839] shrink-0 mt-0.5 animate-spin" />
                ) : (
                  <XCircle className="h-5 w-5 text-[#D62839] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#F6D186]">{t('confCancel')}</h4>
                  <p className="text-[11px] text-[#D0C5B4] mt-0.5">
                    {currentStatus === 'cancelled'
                      ? 'This consultation has already been cancelled.'
                      : t('confCancelDesc')}
                  </p>
                </div>
              </button>
            </div>

            {currentStatus === 'cancelled' && (
              <div className="p-3.5 rounded-xl bg-[#D62839]/20 border border-[#D62839]/40 text-xs text-[#FFDAD6]">
                {t('confCancelledNotice')}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
