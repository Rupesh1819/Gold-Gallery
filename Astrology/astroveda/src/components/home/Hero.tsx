'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Play, Calendar } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-[#10172B] text-[#F7F3EA] bg-[url('/images/hero-cinematic-bg.jpg')] bg-cover bg-[center_top] lg:bg-[right_top] bg-no-repeat min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16">
      {/* Subtle Mobile Vignette Overlay to ensure text readability on narrow viewports */}
      <div 
        className="absolute inset-0 pointer-events-none lg:hidden bg-gradient-to-r from-[#10172B] via-[#10172B]/85 to-transparent" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-8 items-start">
          
          {/* Hero Content Column (Left Side: strictly 42-45% width, left-aligned) */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 text-left max-w-lg">
            
            {/* 1. Eyebrow matching reference */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#F6D186]">
              <span>{t('heroBadge')}</span>
            </div>

            {/* 2. Main Heading matching reference font, line-break & colors */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] text-[#F7F3EA] tracking-tight leading-[1.14] font-medium">
              {t('heroTitleLine1')}<br />
              <span className="text-[#F6D186]">{t('heroTitleLine2')}</span>
            </h1>

            {/* 3. Supporting Paragraph */}
            <p className="text-sm sm:text-[15px] text-[#D0C5B4] max-w-md leading-relaxed font-light font-body">
              {t('heroDescription')}
            </p>

            {/* 4. Dual Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-sm font-semibold shadow-lg shadow-[#D62839]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t('bookConsultation')}</span>
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#10172B]/80 hover:bg-[#181F33] text-[#F7F3EA] text-sm font-semibold border border-[#D8B56D]/60 transition-all transform hover:-translate-y-0.5 shadow-sm cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 text-[#F6D186] fill-[#F6D186]" />
                <span>{t('knowMore')}</span>
              </Link>
            </div>

            {/* 5. Three Compact Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 max-w-xs sm:max-w-md">
              
              {/* Indicator 1: Vedic Astrology (Lotus Flower) */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#D8B56D]/70 bg-[#10172B]/60 flex items-center justify-center text-[#F6D186] shadow-[0_0_12px_rgba(216,181,109,0.15)] group-hover:border-[#F6D186] transition-colors shrink-0">
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 text-[#F6D186]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M12 4C10.5 7.5 7 10 7 13.5C7 16.5 9.2 19 12 19C14.8 19 17 16.5 17 13.5C17 10 13.5 7.5 12 4Z" />
                    <path d="M12 19C8 19 4 16 4 12C4 9.5 6 7.5 7 6.5C7 10 9 13 12 14" />
                    <path d="M12 19C16 19 20 16 20 12C20 9.5 18 7.5 17 6.5C17 10 15 13 12 14" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs text-[#F7F3EA] font-medium leading-tight text-center">
                  {t('badge1Title')}
                </span>
              </div>

              {/* Indicator 2: Accurate Guidance (Shield with Compass Center) */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#D8B56D]/70 bg-[#10172B]/60 flex items-center justify-center text-[#F6D186] shadow-[0_0_12px_rgba(216,181,109,0.15)] group-hover:border-[#F6D186] transition-colors shrink-0">
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 text-[#F6D186]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M12 3L4 7V12C4 16.5 7.4 20.7 12 21.8C16.6 20.7 20 16.5 20 12V7L12 3Z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="1.3" />
                    <path d="M12 9V15M9 12H15" strokeWidth="1.2" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs text-[#F7F3EA] font-medium leading-tight text-center">
                  {t('badge2Title')}
                </span>
              </div>

              {/* Indicator 3: Personalised Solutions (Ayurvedic Sprout/Leaf) */}
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#D8B56D]/70 bg-[#10172B]/60 flex items-center justify-center text-[#F6D186] shadow-[0_0_12px_rgba(216,181,109,0.15)] group-hover:border-[#F6D186] transition-colors shrink-0">
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 text-[#F6D186]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M12 21V11" />
                    <path d="M12 11C12 6.5 16.5 4.5 19.5 4.5C19.5 8.5 16.5 12 12 12" />
                    <path d="M12 14C12 10 8 8 5 8C5 12 8 14.5 12 14.5" />
                  </svg>
                </div>
                <span className="text-[10px] sm:text-xs text-[#F7F3EA] font-medium leading-tight text-center">
                  {t('badge3Title')}
                </span>
              </div>

            </div>

          </div>

          {/* Right Column (7 cols): Left completely open for the golden zodiac mandala, Om, planets, yogi, and temples */}
          <div className="lg:col-span-7 xl:col-span-7 h-full pointer-events-none" aria-hidden="true" />

        </div>
      </div>
    </section>
  );
}
