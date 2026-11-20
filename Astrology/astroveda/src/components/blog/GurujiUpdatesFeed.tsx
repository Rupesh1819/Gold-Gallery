'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Sparkles,
  Pin,
  Calendar,
  MessageCircle,
  Share2,
  Check,
  Radio,
  BookOpen,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface SacredBulletin {
  id: string;
  type: string;
  title: string;
  category: string;
  date: string;
  content: string;
  pinned: boolean;
  author: string;
}

export default function GurujiUpdatesFeed({ locale = 'en' }: { locale?: string }) {
  const t = useTranslations('homeBlog');
  const [updates, setUpdates] = useState<SacredBulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/updates?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.updates) setUpdates(data.updates);
      })
      .catch((err) => console.error('Failed to load updates:', err))
      .finally(() => setLoading(false));
  }, [locale]);

  const handleCopy = (update: SacredBulletin) => {
    const text = `🙏 *${update.title}*\n_${update.category} • ${update.date}_\n\n${update.content}\n\n— *${update.author || siteConfig.astrologer.name}*\n${siteConfig.name}`;
    navigator.clipboard.writeText(text);
    setCopiedId(update.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getWhatsAppShareUrl = (update: SacredBulletin) => {
    const text = `🙏 *${update.title}*\n_${update.category} • ${update.date}_\n\n${update.content}\n\n— *${update.author || siteConfig.astrologer.name}*\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://myguruji.com'}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  if (loading || updates.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#181F33] via-[#1E263D] to-[#181F33] border border-[#D8B56D]/40 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Watermark Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D8B56D]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27304A]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27304A] border border-[#D8B56D]/40 text-[#F6D186] text-[11px] font-bold">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{t('feedBadge')}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F6D186] tracking-tight">
              {t('feedTitle', { name: siteConfig.astrologer.name })}
            </h2>
            <p className="text-xs text-[#D0C5B4] max-w-2xl">
              {t('feedSubtitle')}
            </p>
          </div>

          <span className="text-xs text-[#D8B56D] font-semibold bg-[#27304A]/60 px-3 py-1.5 rounded-xl border border-[#27304A] w-fit">
            {t('activeBulletins', { count: updates.length })}
          </span>
        </div>

        {/* Bulletins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {updates.map((item) => (
            <div
              key={item.id}
              className={`bg-[#141B2F] rounded-xl p-5 border transition-all flex flex-col justify-between relative group ${
                item.pinned
                  ? 'border-[#D8B56D]/70 shadow-md shadow-[#D8B56D]/5'
                  : 'border-[#27304A] hover:border-[#D8B56D]/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/30">
                    {item.category}
                  </span>
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#F6D186]">
                      <Pin className="w-3 h-3 text-[#D8B56D]" /> {t('pinned')}
                    </span>
                  )}
                </div>

                <h3 className="font-heading text-base font-bold text-[#DBE1FD] mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#D0C5B4] leading-relaxed line-clamp-4">
                  {item.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#27304A]/60 flex items-center justify-between text-[11px]">
                <div className="text-[#D0C5B4]/60">
                  <span className="block font-semibold text-[#D0C5B4]">{item.author}</span>
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg bg-[#27304A] hover:bg-[#344062] text-[#D0C5B4] hover:text-[#DBE1FD] transition-colors cursor-pointer"
                    title={t('copy')}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={getWhatsAppShareUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-semibold text-[11px] transition-colors cursor-pointer"
                    title={t('forwardWhatsApp')}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t('share')}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
