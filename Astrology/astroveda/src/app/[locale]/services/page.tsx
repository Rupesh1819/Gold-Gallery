import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ServicesFilterGrid from '@/components/services/ServicesFilterGrid';
import { ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  return (
    <div className="flex flex-col w-full bg-[#10172B] min-h-screen">
      {/* 1. Top Celestial Midnight Banner */}
      <section className="relative w-full bg-[#10172B] text-[#DBE1FD] pt-28 md:pt-36 pb-14 md:pb-20 px-6 lg:px-12 overflow-hidden flex flex-col items-center justify-center text-center border-b border-[#D8B56D]/15">
        {/* Ambient Radial Aura & Golden Constellation Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg
            className="w-[720px] h-[720px] max-w-none text-[#D8B56D] animate-spin"
            fill="none"
            stroke="currentColor"
            style={{ animationDuration: '180s' }}
            viewBox="0 0 400 400"
          >
            <circle cx="200" cy="200" r="190" strokeDasharray="3 3" strokeWidth="0.8" />
            <circle cx="200" cy="200" r="160" strokeWidth="0.6" />
            <circle cx="200" cy="200" r="120" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="70" strokeDasharray="4 2" strokeWidth="0.5" />
            <line strokeWidth="0.5" x1="200" x2="200" y1="10" y2="390" />
            <line strokeWidth="0.5" x1="10" x2="390" y1="200" y2="200" />
            <line strokeWidth="0.5" x1="65" x2="335" y1="65" y2="335" />
            <line strokeWidth="0.5" x1="65" x2="335" y1="335" y2="65" />
            <circle cx="200" cy="40" fill="currentColor" r="2.5" />
            <circle cx="313" cy="87" fill="currentColor" r="2.5" />
            <circle cx="360" cy="200" fill="currentColor" r="2.5" />
            <circle cx="313" cy="313" fill="currentColor" r="2.5" />
            <circle cx="200" cy="360" fill="currentColor" r="2.5" />
            <circle cx="87" cy="313" fill="currentColor" r="2.5" />
            <circle cx="40" cy="200" fill="currentColor" r="2.5" />
            <circle cx="87" cy="87" fill="currentColor" r="2.5" />
          </svg>
        </div>

        {/* Glowing golden focal halo */}
        <div className="absolute w-96 h-96 bg-[#D8B56D]/10 rounded-full blur-3xl pointer-events-none -top-10" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
            <span>{t('bannerBadge')}</span>
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#F6D186] tracking-tight">
            {t('bannerTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#D0C5B4] max-w-xl mx-auto leading-relaxed font-body">
            {t('bannerSubtitle')}
          </p>
        </div>
      </section>

      {/* 2. Clean Ivory Parchment Reading Sanctuary (Filter + 8-Card Grid) */}
      <section className="w-full bg-[#F7F3EA] text-[#10172B] py-14 lg:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <ServicesFilterGrid />
        </div>
      </section>

      {/* 3. How It Works & Consultation Conduct */}
      <section className="w-full bg-[#10172B] text-[#DBE1FD] py-16 px-6 lg:px-12 border-t border-[#D8B56D]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#F6D186] text-xs font-bold tracking-widest uppercase block mb-1">
              {t('stepEyebrow')}
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#F6D186]">
              {t('stepHeading')}
            </h3>
            <p className="text-xs sm:text-sm text-[#D0C5B4] mt-2 leading-relaxed font-body">
              {t('stepDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#27304A]/60 border border-[#D8B56D]/20 flex flex-col items-center text-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#D62839] text-white flex items-center justify-center font-heading text-xl mb-4 font-bold shadow-md">
                1
              </div>
              <h4 className="font-heading text-xl text-[#F6D186] mb-2 font-bold">
                {t('step1Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed font-body">
                {t('step1Desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#27304A]/60 border border-[#D8B56D]/20 flex flex-col items-center text-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/40 flex items-center justify-center font-heading text-xl mb-4 font-bold shadow-md">
                2
              </div>
              <h4 className="font-heading text-xl text-[#F6D186] mb-2 font-bold">
                {t('step2Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed font-body">
                {t('step2Desc')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#27304A]/60 border border-[#D8B56D]/20 flex flex-col items-center text-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/40 flex items-center justify-center font-heading text-xl mb-4 font-bold shadow-md">
                3
              </div>
              <h4 className="font-heading text-xl text-[#F6D186] mb-2 font-bold">
                {t('step3Title')}
              </h4>
              <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed font-body">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ethical Assurance & WhatsApp Direct Channel */}
      <section className="w-full bg-[#10172B] text-[#DBE1FD] py-14 px-6 lg:px-12 border-t border-[#D8B56D]/15">
        <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-[#27304A]/70 border border-[#D8B56D]/30 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-[#F6D186] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#F6D186]" />
              <span>{t('charterBadge')}</span>
            </div>
            <h4 className="font-heading text-2xl text-[#F6D186] font-bold">
              {t('charterHeading')}
            </h4>
            <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-xl leading-relaxed font-body">
              {t('charterDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
            <a
              className="h-12 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              href={siteConfig.getWhatsAppUrl(`Namaste ${siteConfig.name}, I would like to enquire about your consultation services.`)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('whatsappCta')}</span>
            </a>
            <Link
              className="h-12 px-6 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold inline-flex items-center justify-center transition-all shadow-md shadow-[#D62839]/30 cursor-pointer"
              href="/book"
            >
              {t('bookAppointmentCta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
