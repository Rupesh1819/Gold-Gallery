'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function FourPillars() {
  const t = useTranslations('home');

  const pillars = [
    {
      title: t('pillarCareer'),
      desc: t('pillarCareerDesc'),
      slug: 'career-guidance',
      icon: (
        // Sacred orbital yantra icon
        <svg className="w-10 h-10 text-[#C99C47]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 48 48">
          <ellipse cx="24" cy="24" rx="20" ry="7" transform="rotate(-30 24 24)" />
          <ellipse cx="24" cy="24" rx="20" ry="7" transform="rotate(30 24 24)" />
          <circle cx="24" cy="24" r="5" strokeWidth="1.5" />
          <polygon points="24,14 26.5,21.5 34,24 26.5,26.5 24,34 21.5,26.5 14,24 21.5,21.5" fill="#D8B56D" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
        </svg>
      ),
    },
    {
      title: t('pillarMarriage'),
      desc: t('pillarMarriageDesc'),
      slug: 'marriage-compatibility',
      icon: (
        // Sacred lotus heart / matrimonial knot
        <svg className="w-10 h-10 text-[#C99C47]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 48 48">
          <path d="M24 10 C18 4 8 8 8 18 C8 28 20 36 24 40 C28 36 40 28 40 18 C40 8 30 4 24 10 Z" />
          <circle cx="24" cy="20" r="4" strokeWidth="1.4" />
          <path d="M16 19 C18 14 24 14 24 19 C24 14 30 14 32 19" />
          <path d="M20 28 C22 31 24 33 24 33 C24 33 26 31 28 28" />
        </svg>
      ),
    },
    {
      title: t('pillarHealth'),
      desc: t('pillarHealthDesc'),
      slug: 'health-guidance',
      icon: (
        // Sacred wellness heart with radiant leaves
        <svg className="w-10 h-10 text-[#C99C47]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 48 48">
          <path d="M24 12 C20 7 12 10 12 17 C12 25 21 32 24 35 C27 32 36 25 36 17 C36 10 28 7 24 12 Z" />
          <path d="M24 18 L24 28" strokeWidth="1.4" />
          <path d="M24 22 C21 20 18 21 17 23" />
          <path d="M24 25 C27 23 30 24 31 26" />
          <circle cx="24" cy="8" r="2" fill="#D8B56D" />
        </svg>
      ),
    },
    {
      title: t('pillarWealth'),
      desc: t('pillarWealthDesc'),
      slug: 'business-finance',
      icon: (
        // Sacred Indian Kalasha / prosperity pot with coconut and mango leaves
        <svg className="w-10 h-10 text-[#C99C47]" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 48 48">
          {/* Kalasha pot base */}
          <ellipse cx="24" cy="38" rx="8" ry="2" />
          <path d="M15 28 C14 36 17 38 24 38 C31 38 34 36 33 28 C33 25 31 23 29 23 L19 23 C17 23 15 25 15 28 Z" />
          {/* Pot neck */}
          <line x1="18" y1="23" x2="30" y2="23" strokeWidth="1.5" />
          {/* Coconut and mango leaves atop */}
          <circle cx="24" cy="18" r="5" strokeWidth="1.2" />
          <path d="M24 13 L24 7" strokeWidth="1.4" />
          <path d="M20 17 C16 14 14 10 15 6" />
          <path d="M28 17 C32 14 34 10 33 6" />
          {/* Swastika/Auspicious marking */}
          <circle cx="24" cy="30" r="1.5" fill="#D8B56D" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full z-30 pt-6 sm:pt-8 pb-4 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F3EA] text-[#10172B] rounded-2xl sm:rounded-3xl shadow-xl border border-[#D8B56D]/35 p-4 sm:p-6 lg:p-7">
          
          {/* 4 Cards in single row with equal widths and clean vertical dividers matching reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#D8B56D]/30">
            {pillars.map((item) => (
              <Link
                key={item.title}
                href={`/services#${item.slug}`}
                className="flex flex-col items-center text-center justify-start h-full w-full px-3 sm:px-4 py-4 sm:py-6 group transition-all duration-200"
              >
                {/* Decorative gold line icon with consistent centering */}
                <div className="w-14 h-14 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                  {item.icon}
                </div>

                {/* Dark navy title with consistent alignment */}
                <h3 className="font-heading text-lg sm:text-[19px] font-semibold text-[#10172B] group-hover:text-[#D62839] transition-colors mt-3 min-h-[28px] flex items-center justify-center">
                  {item.title}
                </h3>

                {/* Short description with balanced spacing */}
                <p className="text-xs sm:text-[13px] text-[#544D42] mt-1.5 leading-relaxed font-body max-w-[220px] mx-auto">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
