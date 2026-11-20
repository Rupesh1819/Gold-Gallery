'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { zodiacSigns, type ZodiacSign } from '@/data/zodiac';
import { Sparkles, Calendar, Heart, Compass, Hash, ArrowRight, BookOpen, Clock } from 'lucide-react';

export function HoroscopeViewer() {
  const t = useTranslations('horoscope');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(zodiacSigns[0]);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const sanskritNames: Record<string, string> = {
    aries: 'मेष',
    taurus: 'वृषभ',
    gemini: 'मिथुन',
    cancer: 'कर्क',
    leo: 'सिंह',
    virgo: 'कन्या',
    libra: 'तुला',
    scorpio: 'वृश्चिक',
    sagittarius: 'धनु',
    capricorn: 'मकर',
    aquarius: 'कुंभ',
    pisces: 'मीन',
  };

  const luckyMap: Record<string, { color: string; number: string; direction: string; ruler: string; nakshatra: string }> = {
    aries: { color: 'Red', number: '3, 9', direction: 'East', ruler: 'Mangal (Mars)', nakshatra: 'Ashwini / Bharani' },
    taurus: { color: 'White', number: '6, 5', direction: 'South', ruler: 'Shukra (Venus)', nakshatra: 'Krittika / Rohini' },
    gemini: { color: 'Green', number: '5, 1', direction: 'North', ruler: 'Budha (Mercury)', nakshatra: 'Mrigashira / Ardra' },
    cancer: { color: 'Silver', number: '2, 7', direction: 'North-West', ruler: 'Chandra (Moon)', nakshatra: 'Punarvasu / Pushya' },
    leo: { color: 'Gold', number: '1, 4', direction: 'East', ruler: 'Surya (Sun)', nakshatra: 'Magha / Purva Phalguni' },
    virgo: { color: 'Emerald', number: '5, 2', direction: 'South', ruler: 'Budha (Mercury)', nakshatra: 'Uttara Phalguni / Hasta' },
    libra: { color: 'Sky Blue', number: '6, 9', direction: 'West', ruler: 'Shukra (Venus)', nakshatra: 'Chitra / Swati' },
    scorpio: { color: 'Maroon', number: '9, 8', direction: 'North', ruler: 'Mangal (Mars)', nakshatra: 'Vishakha / Anuradha' },
    sagittarius: { color: 'Yellow', number: '3, 6', direction: 'North-East', ruler: 'Brihaspati (Jupiter)', nakshatra: 'Mula / Purva Ashadha' },
    capricorn: { color: 'Navy', number: '8, 4', direction: 'South', ruler: 'Shani (Saturn)', nakshatra: 'Uttara Ashadha / Shravana' },
    aquarius: { color: 'Cyan', number: '8, 7', direction: 'West', ruler: 'Shani (Saturn)', nakshatra: 'Dhanishta / Shatabhisha' },
    pisces: { color: 'Saffron', number: '3, 1', direction: 'North', ruler: 'Brihaspati (Jupiter)', nakshatra: 'Purva Bhadrapada / Revati' },
  };

  const lucky = luckyMap[selectedSign.id] || luckyMap.aries;

  const articles = [
    {
      id: 'art-1',
      title: 'Benefits of Rudraksha in Daily Life',
      date: '15 Jan 2025',
      image: '/images/article-rudraksha.png',
      slug: 'benefits-of-rudraksha-in-daily-life',
    },
    {
      id: 'art-2',
      title: 'How Vastu Can Bring Positivity',
      date: '10 Jan 2025',
      image: '/images/article-vastu.png',
      slug: 'how-vastu-can-bring-positivity',
    },
    {
      id: 'art-3',
      title: 'Importance of Navagraha Pooja',
      date: '5 Jan 2025',
      image: '/images/article-navagraha.png',
      slug: 'importance-of-navagraha-pooja',
    },
  ];

  const localizedSignName = t(`signs.${selectedSign.id}`);
  const sanskritName = sanskritNames[selectedSign.id] || selectedSign.sanskritName;

  return (
    <div className="space-y-12">
      
      {/* 1. Zodiac Signs Selector Row */}
      <div className="bg-[#10172B] p-4 sm:p-6 rounded-2xl border border-[#D8B56D]/20 shadow-md overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {zodiacSigns.map((sign) => {
            const isSelected = selectedSign.id === sign.id;
            const signName = t(`signs.${sign.id}`);
            const hindi = sanskritNames[sign.id] || sign.sanskritName;

            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => setSelectedSign(sign)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D62839] text-white shadow-lg scale-105'
                    : 'bg-[#27304A]/60 text-[#D0C5B4] hover:bg-[#27304A] hover:text-[#F6D186] border border-[#D8B56D]/15'
                }`}
              >
                <div className="relative h-7 w-7 mb-1">
                  <Image
                    src={`/zodiac/${sign.id}.svg`}
                    alt={signName}
                    fill
                    className={`object-contain ${isSelected ? 'brightness-200 invert' : ''}`}
                  />
                </div>
                <span className="text-xs font-bold leading-tight">{signName}</span>
                <span className="text-[10px] opacity-80">{hindi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Grid: Selected Sign Forecast & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Forecast Card */}
        <div className="lg:col-span-8 bg-white text-[#10172B] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#D8B56D]/20 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Sign Artwork & Key Stats */}
            <div className="md:col-span-5 bg-[#10172B] text-[#F7F3EA] rounded-xl p-5 border border-[#D8B56D]/30 flex flex-col items-center text-center space-y-4">
              <div className="relative w-full aspect-square max-w-[180px] rounded-lg overflow-hidden shadow-inner border border-[#D8B56D]/40">
                <Image
                  src={selectedSign.id === 'aries' ? '/images/horoscope-aries.png' : '/images/hero-zodiac.png'}
                  alt={localizedSignName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D8B56D] font-bold block">
                  {selectedSign.element} Tattva
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#F6D186]">
                  {localizedSignName} ({sanskritName})
                </h3>
                <span className="text-xs text-[#D0C5B4]">{selectedSign.dateRange}</span>
              </div>

              <div className="w-full pt-3 border-t border-[#27304A] grid grid-cols-2 gap-2 text-left text-[11px]">
                <div>
                  <span className="text-[#D0C5B4] block">{t('rulerPlanet')}</span>
                  <span className="font-bold text-[#F6D186]">{lucky.ruler}</span>
                </div>
                <div>
                  <span className="text-[#D0C5B4] block">{t('keyNakshatra')}</span>
                  <span className="font-bold text-[#F6D186]">{lucky.nakshatra}</span>
                </div>
              </div>
            </div>

            {/* Prediction Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#7A5A12] uppercase tracking-wider block">
                    {t('vedicHoroscope')}
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#10172B]">
                    {localizedSignName} ({sanskritName})
                  </h2>
                </div>

                {/* Daily, Weekly, Monthly Tabs */}
                <div className="flex rounded-full bg-[#F7F3EA] p-1 border border-[#10172B]/10">
                  {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                        period === p
                          ? 'bg-[#D62839] text-white shadow-xs'
                          : 'text-[#10172B]/70 hover:text-[#10172B]'
                      }`}
                    >
                      {t(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#7A5A12] uppercase tracking-wide">
                  {t('todayGuidance')}
                </h4>
                <p className="text-xs sm:text-sm text-[#10172B]/80 leading-relaxed font-body">
                  {selectedSign.dailyPrediction}
                </p>
              </div>

              {/* Two Focus Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#F7F3EA]/70 border border-[#D8B56D]/20 space-y-1">
                  <span className="text-xs font-bold text-[#10172B] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#7A5A12]" />
                    <span>{t('careerWealth')}</span>
                  </span>
                  <p className="text-[11px] text-[#10172B]/70 leading-snug">
                    {t('careerWealthText')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F3EA]/70 border border-[#D8B56D]/20 space-y-1">
                  <span className="text-xs font-bold text-[#10172B] flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-[#D62839]" />
                    <span>{t('loveHarmony')}</span>
                  </span>
                  <p className="text-[11px] text-[#10172B]/70 leading-snug">
                    {t('loveHarmonyText')}
                  </p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="pt-3 border-t border-[#10172B]/10 space-y-2">
                <span className="text-xs font-bold text-[#10172B] uppercase tracking-wider block">
                  {t('luckyToday')}
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#F7F3EA] border border-[#10172B]/10 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#D62839] text-white flex items-center justify-center text-[10px] font-bold">
                      ●
                    </div>
                    <div>
                      <span className="text-[10px] text-[#10172B]/50 block">{t('color')}</span>
                      <span className="font-bold text-[#10172B]">{lucky.color}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F7F3EA] border border-[#10172B]/10 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#F6D186] text-[#402D00] flex items-center justify-center text-xs font-bold">
                      #
                    </div>
                    <div>
                      <span className="text-[10px] text-[#10172B]/50 block">{t('number')}</span>
                      <span className="font-bold text-[#10172B]">{lucky.number}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-[#F7F3EA] border border-[#10172B]/10 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#27304A] text-[#F6D186] flex items-center justify-center text-xs font-bold">
                      <Compass className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#10172B]/50 block">{t('direction')}</span>
                      <span className="font-bold text-[#10172B]">{lucky.direction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* In-depth Kundali CTA Banner */}
              <div className="mt-4 p-4 rounded-xl bg-[#10172B] text-white flex items-center justify-between gap-4 border border-[#D8B56D]/30">
                <div className="text-xs">
                  <span className="font-bold text-[#F6D186] block">{t('needMatching')}</span>
                  <span className="text-[#D0C5B4] text-[11px]">{t('speakAcharya')}</span>
                </div>
                <Link
                  href="/book"
                  className="px-4 py-2 rounded-full bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold whitespace-nowrap transition-colors"
                >
                  {t('consultNow')}
                </Link>
              </div>

            </div>

          </div>

        </div>

        {/* Right Column (4 cols): Latest Articles & Today's Panchang */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Latest Articles */}
          <div className="bg-white rounded-2xl p-6 border border-[#D8B56D]/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#10172B]/10">
              <h3 className="font-heading text-lg font-bold text-[#10172B]">
                {t('latestArticles')}
              </h3>
              <Link href="/blog" className="text-xs font-bold text-[#D62839] hover:underline flex items-center gap-1">
                <span>{t('viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {articles.map((art) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
                >
                  <div className="relative h-14 w-16 rounded-lg overflow-hidden bg-[#27304A] shrink-0 border border-[#D8B56D]/20">
                    <Image
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#10172B] group-hover:text-[#D62839] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <span className="text-[11px] text-[#10172B]/50 mt-1 block">
                      {art.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Today's Panchang Box */}
          <div className="bg-[#10172B] text-white rounded-2xl p-6 border border-[#D8B56D]/30 shadow-md space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#27304A]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6D186]">
                {t('todaysPanchang')}
              </span>
              <Sparkles className="h-4 w-4 text-[#D8B56D]" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#27304A]/60">
                <span className="text-[#D0C5B4]">{t('tithi')}</span>
                <span className="font-semibold text-white">{t('tithiVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27304A]/60">
                <span className="text-[#D0C5B4]">{t('nakshatra')}</span>
                <span className="font-semibold text-[#F6D186]">{t('nakshatraVal')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27304A]/60">
                <span className="text-[#D0C5B4]">{t('rahuKaal')}</span>
                <span className="font-semibold text-[#EF3340]">{t('rahuKaalVal')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#D0C5B4]">{t('abhijitMuhurat')}</span>
                <span className="font-semibold text-[#16A34A]">{t('abhijitMuhuratVal')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
