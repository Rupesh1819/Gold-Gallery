import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MapPin, Phone, MessageCircle, Mail, Clock, ShieldCheck, HelpCircle, Send } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EA] text-[#10172B]">
      
      {/* 1. Top Celestial Banner */}
      <section className="relative w-full bg-[#10172B] text-white pt-28 sm:pt-34 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D8B56D]/15 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#27304A]/40 via-[#10172B] to-[#10172B] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider">
            <span>{t('bannerBadge')}</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#F6D186] tracking-tight">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-lg mx-auto font-body">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. 3-Column Interactive Contact Grid */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1 (4 cols): Direct Communication */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[11px] font-bold text-[#7A5A12] uppercase tracking-wider block">
                {t('directCommsEyebrow')}
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#10172B]">
                {t('directCommsTitle')}
              </h2>
              <p className="text-xs text-[#10172B]/70 leading-relaxed font-body">
                {t('directCommsDesc')}
              </p>

              <div className="space-y-3 pt-2">
                {/* Location */}
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/20 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#27304A] text-[#F6D186] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                      {t('locationLabel')}
                    </span>
                    <span className="text-xs font-bold text-[#10172B] block">
                      {siteConfig.contact.address.locality}, {siteConfig.contact.address.city}
                    </span>
                    <span className="text-[11px] text-[#10172B]/60">
                      {siteConfig.contact.address.fullText}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/20 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#27304A] text-[#F6D186] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                      {t('callLabel')}
                    </span>
                    <a href={`tel:${siteConfig.contact.phoneRaw}`} className="text-xs font-bold text-[#10172B] hover:text-[#7A5A12] transition-colors block">
                      {siteConfig.contact.phone}
                    </a>
                    <span className="text-[11px] text-[#10172B]/60">
                      {t('callSub')}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/20 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                      {t('whatsappLabel')}
                    </span>
                    <a
                      href={siteConfig.getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#10172B] hover:text-[#16A34A] transition-colors block"
                    >
                      {siteConfig.contact.whatsappDisplay}
                    </a>
                    <span className="text-[11px] text-[#10172B]/60">
                      {t('whatsappSub')}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/20 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#27304A] text-[#F6D186] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                      {t('emailLabel')}
                    </span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-xs font-bold text-[#10172B] hover:text-[#7A5A12] transition-colors block">
                      {siteConfig.contact.email}
                    </a>
                    <span className="text-[11px] text-[#10172B]/60">
                      {t('emailSub')}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/20 shadow-2xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#27304A] text-[#F6D186] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A12] block">
                      {t('hoursLabel')}
                    </span>
                    <span className="text-xs font-bold text-[#10172B] block">
                      {siteConfig.contact.workingHours}
                    </span>
                    <span className="text-[11px] text-[#D62839] block">
                      {siteConfig.contact.closedDays}
                    </span>
                  </div>
                </div>

                {/* Payment Policy Note */}
                <div className="p-3.5 rounded-xl bg-[#FFDF9F]/30 border border-[#D8B56D]/30 space-y-1">
                  <span className="text-[11px] font-bold text-[#7A5A12] flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{t('paymentNoteTitle')}</span>
                  </span>
                  <p className="text-[11px] text-[#5B4303] leading-relaxed">
                    {t('paymentNoteDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2 (5 cols): Send Us a Message */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#D8B56D]/20 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#7A5A12] uppercase tracking-wider block mb-1">
                  {t('inquiryPortal')}
                </span>
                <h3 className="font-heading text-xl font-bold text-[#10172B]">
                  {t('formTitle')}
                </h3>
                <p className="text-xs text-[#10172B]/70 mt-1 font-body">
                  {t('formSubtitle')}
                </p>
              </div>

              <form className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('namePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs focus:outline-none focus:border-[#D8B56D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1">
                    {t('phone')}
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#10172B]/15 bg-[#10172B] text-white text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-r-lg border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs focus:outline-none focus:border-[#D8B56D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs focus:outline-none focus:border-[#D8B56D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1">
                    {t('questionArea')}
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs focus:outline-none focus:border-[#D8B56D]">
                    <option>{t('optKundali')}</option>
                    <option>{t('optCareer')}</option>
                    <option>{t('optMarriage')}</option>
                    <option>{t('optVastu')}</option>
                    <option>{t('optOther')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10172B] mb-1">
                    {t('message')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={t('messagePlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#10172B]/15 bg-[#F7F3EA]/30 text-xs focus:outline-none focus:border-[#D8B56D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>{t('submitBtn')}</span>
                  <Send className="h-3.5 w-3.5" />
                </button>

                <p className="text-[11px] text-center text-[#10172B]/50 font-body">
                  {t('ethicsProtected')}
                </p>
              </form>
            </div>

            {/* Column 3 (3 cols): Quick WhatsApp Support & Common Inquiries */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* WhatsApp Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#D8B56D]/30 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F6D186]/20 border border-[#D8B56D]/40 flex items-center justify-center text-[#7A5A12] mx-auto shadow-sm">
                  <svg className="w-7 h-7 text-[#7A5A12]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" fill="#D8B56D" />
                  </svg>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#7A5A12] uppercase tracking-wider block">
                    {t('liveSupport')}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#10172B]">
                    {t('forQuickSupport')}
                  </h3>
                  <p className="text-xs text-[#10172B]/70 mt-1 font-body">
                    {t('quickSupportDesc')}
                  </p>
                </div>

                <a
                  href={siteConfig.getWhatsAppUrl(`Namaste ${siteConfig.name}, I would like to enquire about consultation booking.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{t('chatWhatsApp')}</span>
                </a>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#16A34A] pt-1">
                  <div className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span>{t('onlineBadge')}</span>
                </div>
              </div>

              {/* Common Inquiries */}
              <div className="bg-white rounded-2xl p-5 border border-[#D8B56D]/20 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-[#10172B] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-[#7A5A12]" />
                  <span>{t('commonInquiriesTitle')}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F3EA]/70">
                    <span className="font-bold text-[#10172B] block">{t('q1')}</span>
                    <span className="text-[#10172B]/70 text-[11px]">{t('a1')}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F7F3EA]/70">
                    <span className="font-bold text-[#10172B] block">{t('q2')}</span>
                    <span className="text-[#10172B]/70 text-[11px]">{t('a2')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
