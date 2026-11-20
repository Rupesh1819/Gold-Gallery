'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Clock, FileText } from 'lucide-react';
import { allServices } from '@/data/services';

export default function ServicesFilterGrid() {
  const t = useTranslations('services');
  const [activeFilter, setActiveFilter] = useState<'all' | 'life' | 'relationship' | 'spatial' | 'reports'>('all');

  const filteredServices = allServices.filter((svc) => {
    if (activeFilter === 'all') return true;
    return svc.filterGroup === activeFilter;
  });

  const categories = [
    { id: 'all', label: t('filterAll') },
    { id: 'life', label: t('filterLife') },
    { id: 'relationship', label: t('filterRelationship') },
    { id: 'spatial', label: t('filterSpatial') },
    { id: 'reports', label: t('filterReports') },
  ] as const;

  return (
    <div className="w-full">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeFilter === cat.id
                ? 'bg-[#10172B] text-[#F6D186] font-bold shadow-md border border-[#D8B56D]/40'
                : 'bg-white text-[#10172B]/75 hover:bg-[#F7F3EA] hover:text-[#10172B] border border-[#D8B56D]/30 shadow-2xs'
            }`}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 8-Card Responsive Consultation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {filteredServices.map((service) => {
          // Dynamic localized content
          const hasKey = t.has(`items.${service.slug}.title`);
          const title = hasKey ? t(`items.${service.slug}.title`) : service.title;
          const badge = hasKey ? t(`items.${service.slug}.badge`) : service.badge;
          const shortDesc = hasKey ? t(`items.${service.slug}.shortDescription`) : service.shortDescription;
          const delivery = service.deliveryLabel 
            ? (hasKey && t.has(`items.${service.slug}.deliveryLabel`) ? t(`items.${service.slug}.deliveryLabel`) : service.deliveryLabel)
            : null;

          return (
            <article
              key={service.id}
              className="flex flex-col bg-white rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group border border-[#D8B56D]/25"
            >
              {/* Card Thumbnail */}
              <div className="relative w-full h-48 overflow-hidden bg-[#10172B]/5">
                <img
                  src={service.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#10172B]/90 backdrop-blur-xs text-[#F6D186] text-[11px] font-bold uppercase tracking-wider border border-[#D8B56D]/30">
                  {badge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between bg-white text-[#10172B]">
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#10172B] mb-2 leading-snug group-hover:text-[#D62839] transition-colors">
                    <Link href={`/services/${service.slug}`}>
                      {title}
                    </Link>
                  </h2>
                  <p className="text-xs text-[#544D42] leading-relaxed mb-4 font-body">
                    {shortDesc}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between py-2.5 my-3 bg-[#F7F3EA] px-3.5 rounded-xl border border-[#D8B56D]/20">
                    <span className="flex items-center gap-1.5 text-xs text-[#7A5A12] font-semibold">
                      {delivery ? (
                        <>
                          <FileText className="w-3.5 h-3.5" /> {delivery}
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" /> {service.duration} {t('mins')}
                        </>
                      )}
                    </span>
                    <span className="text-sm font-bold text-[#10172B]">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link
                      href={`/services/${service.slug}`}
                      className="w-full min-h-[42px] inline-flex items-center justify-center rounded-xl border border-[#D8B56D]/40 text-[#10172B] text-xs font-semibold hover:bg-[#F7F3EA] transition-all"
                    >
                      {t('viewDetails')}
                    </Link>
                    <Link
                      href={`/book?service=${service.slug}`}
                      className="w-full min-h-[42px] inline-flex items-center justify-center rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-bold transition-all shadow-md shadow-[#D62839]/20 active:translate-y-0.5"
                    >
                      {t('bookNow')}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
