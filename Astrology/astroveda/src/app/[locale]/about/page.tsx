import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Calendar, Quote, Award, BookOpen, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EA] text-[#10172B]">
      
      {/* 1. Top Celestial Midnight Banner */}
      <section className="relative w-full bg-[#10172B] text-white pt-28 sm:pt-32 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D8B56D]/15 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#27304A]/40 via-[#10172B] to-[#0B1326] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/30 text-[#F6D186] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
            <span>{t('bannerBadge')}</span>
            <Sparkles className="h-3 w-3 text-[#F6D186]" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#F6D186] tracking-tight">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm text-[#D0C5B4] max-w-lg mx-auto font-body leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. Main Editorial & Portrait Section */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column (7 cols): Bio, Philosophy, Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#7A5A12] uppercase tracking-widest block mb-1.5">
                  {t('lineageEyebrow')}
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#10172B] tracking-tight leading-tight">
                  {t('lineageTitle')}
                </h2>
                <p className="text-base sm:text-lg text-[#7A5A12] font-serif italic mt-1">
                  {t('lineageSubtitle')}
                </p>
              </div>

              <div className="w-full h-px bg-[#10172B]/10" />

              <div className="space-y-3.5 text-xs sm:text-sm text-[#10172B]/80 leading-relaxed font-body">
                <p>{t('bioP1')}</p>
                <p>{t('bioP2')}</p>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#10172B]/10">
                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/30 shadow-xs text-center sm:text-left">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-[#10172B] block">
                    {t('stat1Label')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#10172B]/60 font-semibold uppercase tracking-wider mt-0.5 block">
                    {t('stat1Desc')}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/30 shadow-xs text-center sm:text-left">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-[#10172B] block">
                    {t('stat2Label')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#10172B]/60 font-semibold uppercase tracking-wider mt-0.5 block">
                    {t('stat2Desc')}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#D8B56D]/30 shadow-xs text-center sm:text-left">
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-[#10172B] block">
                    {t('stat3Label')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#10172B]/60 font-semibold uppercase tracking-wider mt-0.5 block">
                    {t('stat3Desc')}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>{t('ctaBtn')}</span>
                  <Calendar className="h-4 w-4" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-[#F7F3EA] text-[#7A5A12] border border-[#7A5A12]/40 text-xs font-bold transition-all shadow-xs"
                >
                  {t('areasOfPractice')}
                </Link>
              </div>

            </div>

            {/* Right Column (5 cols): Astrologer Portrait Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full aspect-[4/4.8] max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D8B56D]/40 group">
                <Image
                  src="/images/about-astrologer.png"
                  alt="Omkar Ransing Guruji overlooking holy ghats at sunrise"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10172B]/90 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#10172B]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#D8B56D]/30 flex items-center justify-between text-white">
                  <div>
                    <span className="font-heading text-sm font-bold text-[#F6D186] block">
                      Omkar Ransing Guruji
                    </span>
                    <span className="text-[10px] text-[#D0C5B4]">
                      {t('bannerBadge')}
                    </span>
                  </div>
                  <Award className="h-5 w-5 text-[#F6D186]" />
                </div>
              </div>
            </div>

          </div>

          {/* 3. Bottom Row: Quote Card & 3 Pillar Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-[#10172B]/10 items-stretch">
            
            {/* Quote Card (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#D8B56D]/30 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F6D186]/20 flex items-center justify-center text-[#7A5A12] mb-3">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="font-heading text-lg sm:text-xl text-[#10172B] italic leading-relaxed">
                  &ldquo;{t('quote')}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#10172B]/10">
                <span className="font-bold text-xs text-[#10172B] block">
                  {t('quoteAuthor')}
                </span>
                <span className="text-[10px] text-[#7A5A12] uppercase tracking-wider font-semibold">
                  Founding Jyotish Counselor
                </span>
              </div>
            </div>

            {/* 3 Small Feature Cards (6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-4 border border-[#D8B56D]/20 shadow-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F6D186]/20 flex items-center justify-center text-[#7A5A12]">
                  <Compass className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#10172B] leading-tight">
                  {t('step1Title')}
                </h4>
                <p className="text-[11px] text-[#10172B]/70 leading-snug font-body">
                  {t('step1Desc')}
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-4 border border-[#D8B56D]/20 shadow-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F6D186]/20 flex items-center justify-center text-[#7A5A12]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#10172B] leading-tight">
                  {t('step2Title')}
                </h4>
                <p className="text-[11px] text-[#10172B]/70 leading-snug font-body">
                  {t('step2Desc')}
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-4 border border-[#D8B56D]/20 shadow-xs text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#F6D186]/20 flex items-center justify-center text-[#7A5A12]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-[#10172B] leading-tight">
                  {t('step4Title')}
                </h4>
                <p className="text-[11px] text-[#10172B]/70 leading-snug font-body">
                  {t('step4Desc')}
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. The Consultation Experience: Blueprint */}
      <section className="w-full bg-[#10172B] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#D8B56D]/20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold text-[#D8B56D] uppercase tracking-widest block mb-1">
              {t('blueprintEyebrow')}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#F6D186] font-bold">
              {t('blueprintTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#D0C5B4] mt-2 font-body">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#27304A]/60 border border-[#D8B56D]/20 rounded-xl p-5 space-y-3 hover:border-[#D8B56D]/40 transition-colors">
              <span className="text-[10px] font-bold text-[#D8B56D] uppercase tracking-wider block">
                01 / JANMA PATRI
              </span>
              <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                {t('step1Title')}
              </h3>
              <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
                {t('step1Desc')}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#27304A]/60 border border-[#D8B56D]/20 rounded-xl p-5 space-y-3 hover:border-[#D8B56D]/40 transition-colors">
              <span className="text-[10px] font-bold text-[#D8B56D] uppercase tracking-wider block">
                02 / DASHA MANTHANA
              </span>
              <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                {t('step2Title')}
              </h3>
              <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
                {t('step2Desc')}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#27304A]/60 border border-[#D8B56D]/20 rounded-xl p-5 space-y-3 hover:border-[#D8B56D]/40 transition-colors">
              <span className="text-[10px] font-bold text-[#D8B56D] uppercase tracking-wider block">
                03 / PRASHNA SAMVAD
              </span>
              <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                {t('step3Title')}
              </h3>
              <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
                {t('step3Desc')}
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#27304A]/60 border border-[#D8B56D]/20 rounded-xl p-5 space-y-3 hover:border-[#D8B56D]/40 transition-colors">
              <span className="text-[10px] font-bold text-[#D8B56D] uppercase tracking-wider block">
                04 / UPAAYA MARGA
              </span>
              <h3 className="font-heading text-lg font-bold text-[#F6D186]">
                {t('step4Title')}
              </h3>
              <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
                {t('step4Desc')}
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
