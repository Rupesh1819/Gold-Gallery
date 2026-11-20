'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

export function EthicalAssurance() {
  const t = useTranslations('home');

  return (
    <section className="w-full bg-[#10172B] py-12 sm:py-14 text-[#DBE1FD]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#27304A]/40 border border-[#D8B56D]/20 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#F6D186]/10 flex items-center justify-center text-[#F6D186] shrink-0 border border-[#D8B56D]/30">
            <ShieldCheck className="h-9 w-9 text-[#F6D186]" />
          </div>

          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <span className="text-[11px] font-bold text-[#D8B56D] uppercase tracking-widest block">
              {t('ethicsEyebrow')}
            </span>
            <h3 className="font-heading text-xl sm:text-2xl text-[#F6D186] font-bold">
              {t('ethicsTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed font-body">
              {t('ethicsDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
