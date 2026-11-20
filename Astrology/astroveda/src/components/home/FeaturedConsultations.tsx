'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Clock, Video, ArrowRight } from 'lucide-react';

export function FeaturedConsultations() {
  const t = useTranslations('home');

  const services = [
    {
      id: 'svc-1',
      slug: 'general-consultation',
      badge: t('card1Badge'),
      title: t('card1Title'),
      desc: t('card1Desc'),
      duration: t('card1Duration'),
      mode: t('card1Mode'),
      price: '1,000',
      image: '/images/service-general-clean.jpg',
    },
    {
      id: 'svc-2',
      slug: 'career-guidance',
      badge: t('card2Badge'),
      title: t('card2Title'),
      desc: t('card2Desc'),
      duration: t('card2Duration'),
      mode: t('card2Mode'),
      price: '1,000',
      image: '/images/service-career.png',
    },
    {
      id: 'svc-3',
      slug: 'marriage-compatibility',
      badge: t('card3Badge'),
      title: t('card3Title'),
      desc: t('card3Desc'),
      duration: t('card3Duration'),
      mode: t('card3Mode'),
      price: '1,000',
      image: '/images/service-marriage.png',
    },
  ];

  return (
    <section className="w-full bg-[#10172B] py-14 sm:py-16 text-[#DBE1FD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F6D186] uppercase tracking-widest block mb-1">
              {t('featuredEyebrow')}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#F6D186] tracking-tight">
              {t('featuredTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#D0C5B4] mt-2 max-w-xl font-body">
              {t('featuredSubtitle')}
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[#F6D186] text-xs font-bold hover:underline"
          >
            <span>{t('viewAllServices')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-[#27304A] rounded-2xl overflow-hidden shadow-xl flex flex-col group border border-[#D8B56D]/20 hover:border-[#D8B56D]/50 transition-all duration-300"
            >
              {/* Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-[#22293E]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#27304A] via-transparent to-transparent" />
                <span className="absolute top-3 right-3 bg-[#10172B]/90 text-[#F6D186] px-3 py-1 rounded-full text-[11px] font-bold shadow-md border border-[#D8B56D]/30">
                  {item.badge}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 gap-4 justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[#D0C5B4] text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#F6D186]" />
                      <span>{item.duration}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-[#F6D186]" />
                      <span>{item.mode}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F6D186] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#D0C5B4] leading-relaxed line-clamp-3 font-body">
                    {item.desc}
                  </p>
                </div>

                {/* Footer / Price & Book Button */}
                <div className="pt-4 border-t border-[#10172B]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#D0C5B4] block">Dakshina</span>
                    <span className="font-heading text-xl font-bold text-[#F7F3EA] font-serif">
                      ₹{item.price}
                    </span>
                  </div>

                  <Link
                    href={`/book?service=${item.slug}`}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    {t('bookConsultation')}
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
