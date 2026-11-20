'use client';

import { useTranslations } from 'next-intl';
import { CheckSquare, Calendar, Video } from 'lucide-react';

export function ProcessSection() {
  const t = useTranslations('home');

  const steps = [
    {
      num: 1,
      numBg: 'bg-[#D62839] text-white',
      icon: CheckSquare,
      title: t('step1Title'),
      desc: t('step1Desc'),
      meta: t('step1Meta'),
    },
    {
      num: 2,
      numBg: 'bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/40',
      icon: Calendar,
      title: t('step2Title'),
      desc: t('step2Desc'),
      meta: t('step2Meta'),
    },
    {
      num: 3,
      numBg: 'bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/40',
      icon: Video,
      title: t('step3Title'),
      desc: t('step3Desc'),
      meta: t('step3Meta'),
    },
  ];

  return (
    <section className="w-full bg-[#10172B] pt-10 sm:pt-14 lg:pt-16 pb-14 sm:pb-16 text-[#DBE1FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold text-[#F6D186] uppercase tracking-widest block mb-2">
            {t('stepsEyebrow')}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#F6D186] tracking-tight">
            {t('stepsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[#D0C5B4] mt-3 font-body">
            {t('stepsSubtitle')}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-[#27304A]/80 border border-[#D8B56D]/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl space-y-6 group hover:border-[#D8B56D]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-full ${s.numBg} flex items-center justify-center font-heading text-2xl font-bold shadow-md`}>
                    {s.num}
                  </div>
                  <Icon className="h-8 w-8 text-[#F6D186]" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F6D186] leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed font-body">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8B56D]/15 text-xs font-semibold text-[#D8B56D]">
                  {s.meta}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
