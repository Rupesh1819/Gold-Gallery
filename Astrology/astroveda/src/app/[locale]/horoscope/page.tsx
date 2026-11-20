import { setRequestLocale, getTranslations } from 'next-intl/server';
import { HoroscopeViewer } from '@/components/horoscope/HoroscopeViewer';
import { Sparkles } from 'lucide-react';

export default async function HoroscopePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('horoscope');

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EA] text-[#10172B]">
      {/* 1. Top Celestial Midnight Banner */}
      <section className="relative w-full bg-[#10172B] text-white pt-28 sm:pt-34 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#D8B56D]/15">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D8B56D_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden="true" 
        />
        <div className="relative max-w-4xl mx-auto text-center space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#F6D186]" />
            <span>{t('bannerBadge')}</span>
            <Sparkles className="h-3.5 w-3.5 text-[#F6D186]" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#F6D186] tracking-tight">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-xl mx-auto font-body leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. Main Interactive Horoscope Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <HoroscopeViewer />
      </div>
    </div>
  );
}
