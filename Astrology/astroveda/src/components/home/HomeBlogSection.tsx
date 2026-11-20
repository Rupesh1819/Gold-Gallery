'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Radio,
  Pin,
  MessageCircle,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';
import { allBlogPosts } from '@/data/blog';
import { siteConfig } from '@/config/site';

interface SacredBulletin {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  pinned: boolean;
  author: string;
}

const defaultBulletin: SacredBulletin = {
  id: 'update-1',
  title: 'Surya Grahan (Solar Eclipse) & Sadhana Guidelines',
  category: 'Panchang Alert',
  date: 'Today, 06:30 AM IST',
  content: 'Auspicious blessings to all seekers. During the upcoming celestial transit, avoid signing major contracts or starting foundation ceremonies during the Sutak period. Dedicated meditation and chanting of the Gayatri Mantra will yield 100-fold spiritual merit.',
  pinned: true,
  author: 'Omkar Ransing Guruji',
};

export function HomeBlogSection({ locale = 'en' }: { locale?: string }) {
  const t = useTranslations('homeBlog');
  const [bulletin, setBulletin] = useState<SacredBulletin | null>(defaultBulletin);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/updates?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.updates && data.updates.length > 0) {
          // Find pinned bulletin or first update
          const pinned = data.updates.find((u: SacredBulletin) => u.pinned) || data.updates[0];
          setBulletin(pinned);
        }
      })
      .catch((e) => console.error('Failed to load home bulletin:', e));
  }, [locale]);

  const handleCopy = () => {
    if (!bulletin) return;
    const text = `🙏 *${bulletin.title}*\n_${bulletin.category} • ${bulletin.date}_\n\n${bulletin.content}\n\n— *${bulletin.author || siteConfig.astrologer.name}*\n${siteConfig.name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppShareUrl = () => {
    if (!bulletin) return '#';
    const text = `🙏 *${bulletin.title}*\n_${bulletin.category} • ${bulletin.date}_\n\n${bulletin.content}\n\n— *${bulletin.author || siteConfig.astrologer.name}*\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://myguruji.com'}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Top 3 featured articles
  const featuredArticles = allBlogPosts.slice(0, 3);

  return (
    <section className="w-full bg-[#10172B] py-16 sm:py-24 border-t border-[#27304A]/60 relative overflow-hidden">
      {/* Background Celestial Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D8B56D]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181F33] border border-[#D8B56D]/30 text-[#F6D186] text-[11px] font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-[#D8B56D]" />
              <span>{t('eyebrow')}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F6D186] tracking-tight">
              {t('title')}
            </h2>
            <p className="text-sm text-[#D0C5B4] max-w-2xl leading-relaxed">
              {t('subtitle', { name: siteConfig.astrologer.name })}
            </p>
          </div>

          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181F33] hover:bg-[#27304A] border border-[#D8B56D]/30 text-xs font-bold text-[#F6D186] transition-all w-fit group shadow-sm"
          >
            <span>{t('exploreAll')}</span>
            <ArrowRight className="w-4 h-4 text-[#D8B56D] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 1. Guruji's Live Bulletin Banner (if active) */}
        {bulletin && (
          <div className="bg-gradient-to-r from-[#181F33] via-[#1E263D] to-[#181F33] border border-[#D8B56D]/50 rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27304A]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-red-500/15 text-red-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <span className="text-[10px] text-[#D8B56D] uppercase font-bold tracking-wider block">
                    {t('latestAdvisory')}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F6D186] leading-tight">
                    {bulletin.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#27304A] text-[#F6D186] border border-[#D8B56D]/30">
                  {bulletin.category}
                </span>
                {bulletin.pinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D8B56D]/20 text-[#F6D186] border border-[#D8B56D]/40">
                    <Pin className="w-3 h-3 text-[#D8B56D]" /> {t('pinned')}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D0C5B4] leading-relaxed my-4">
              &quot;{bulletin.content}&quot;
            </p>

            <div className="pt-3 border-t border-[#27304A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#D0C5B4]/70">
                {t('blessedBy', { name: bulletin.author })} • {bulletin.date}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27304A] hover:bg-[#344062] text-[#D0C5B4] hover:text-[#DBE1FD] text-xs font-semibold transition-colors cursor-pointer"
                  title={t('copy')}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? t('copied') : t('copy')}</span>
                </button>

                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-semibold text-xs transition-colors cursor-pointer"
                  title={t('forwardWhatsApp')}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('forwardWhatsApp')}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 2. Three Featured Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredArticles.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="bg-[#181F33] rounded-2xl border border-[#27304A] hover:border-[#D8B56D]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg hover:-translate-y-1"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#141B2F]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181F33] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#10172B]/90 text-[#F6D186] border border-[#D8B56D]/30 backdrop-blur-xs">
                    {post.categoryPill}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-[#D0C5B4]/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D8B56D]" /> {post.publishDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D8B56D]" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#DBE1FD] group-hover:text-[#F6D186] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#D0C5B4] line-clamp-3 leading-relaxed">
                    {post.abstract}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="p-5 sm:p-6 pt-0 border-t border-[#27304A]/40 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D8B56D] group-hover:text-[#F6D186] transition-colors">
                  <span>{t('readFull')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
