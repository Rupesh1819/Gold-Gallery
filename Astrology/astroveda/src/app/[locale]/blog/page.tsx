import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import BlogListFilter from '@/components/blog/BlogListFilter';
import GurujiUpdatesFeed from '@/components/blog/GurujiUpdatesFeed';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { allBlogPosts } from '@/data/blog';

export default async function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'homeBlog' });

  const featuredPost = allBlogPosts.find((p) => p.featured) || allBlogPosts[0];

  return (
    <div className="flex flex-col w-full bg-midnight min-h-screen text-on-surface">
      {/* 1. Atmospheric Celestial Hero */}
      <section className="relative bg-midnight text-on-surface overflow-hidden py-16 lg:py-24 border-b border-cosmic-surface/40">
        {/* Astrological Watermark Radial */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
          <svg
            className="w-[850px] h-[850px] text-gold-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            viewBox="0 0 400 400"
          >
            <circle cx="200" cy="200" r="190" strokeDasharray="3 3" />
            <circle cx="200" cy="200" r="150" />
            <circle cx="200" cy="200" r="110" strokeDasharray="2 4" />
            <circle cx="200" cy="200" r="70" />
            <polygon opacity="0.4" points="200,10 364,295 35,295" />
            <polygon opacity="0.4" points="200,390 364,105 35,105" />
            <line strokeDasharray="4 4" x1="200" x2="200" y1="10" y2="390" />
            <line strokeDasharray="4 4" x1="10" x2="390" y1="200" y2="200" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-cosmic-surface/80 border border-gold-accent/20 px-4 py-1.5 rounded-full mb-6 shadow-xs">
            <BookOpen className="w-4 h-4 text-gold-accent" />
            <span className="text-xs font-bold text-gold-accent tracking-widest uppercase">
              {t('eyebrow')}
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-gold-accent tracking-tight max-w-4xl font-bold">
            {t('title')}
          </h1>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Classical Parashari astrological insights, transit interpretations, and holistic Vedic living authored directly by Omkar Ransing Guruji.
          </p>

          {/* Planetary Snapshot Micro Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="bg-[#141B2F] border border-cosmic-surface/60 p-3 rounded-xl text-left shadow-xs">
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Current Gochara
              </div>
              <div className="text-xs font-bold text-gold-accent flex items-center justify-between mt-1">
                <span>Guru in Vrishabha</span>
                <span className="text-[10px] text-gold-accent">✦</span>
              </div>
            </div>

            <div className="bg-[#141B2F] border border-cosmic-surface/60 p-3 rounded-xl text-left shadow-xs">
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Shani Sthiti
              </div>
              <div className="text-xs font-bold text-gold-accent flex items-center justify-between mt-1">
                <span>Kumbha (Direct)</span>
                <span className="text-[10px] text-gold-accent">✦</span>
              </div>
            </div>

            <div className="bg-[#141B2F] border border-cosmic-surface/60 p-3 rounded-xl text-left shadow-xs">
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Rahu / Ketu Axis
              </div>
              <div className="text-xs font-bold text-gold-accent flex items-center justify-between mt-1">
                <span>Meena – Kanya</span>
                <span className="text-[10px] text-gold-accent">✦</span>
              </div>
            </div>

            <div className="bg-[#141B2F] border border-cosmic-surface/60 p-3 rounded-xl text-left shadow-xs">
              <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
                Vedic Tithi
              </div>
              <div className="text-xs font-bold text-gold-accent flex items-center justify-between mt-1">
                <span>Shukla Navami</span>
                <span className="text-[10px] text-gold-accent">✦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Guruji's Sacred Vani & Live Bulletins */}
      <GurujiUpdatesFeed locale={locale} />

      {/* 2. Featured Analysis Section (Hero Editorial Anchor) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-6 lg:-mt-10 mb-16 relative z-20 w-full">
        <article className="bg-cosmic-surface border border-gold-accent/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row group">
          {/* Imagery Column */}
          <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[440px] overflow-hidden">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-cosmic-surface via-cosmic-surface/40 to-transparent" />
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-midnight/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-gold-accent text-xs font-bold border border-gold-accent/30 shadow-md">
              <Sparkles className="w-4 h-4 text-gold-accent" />
              <span className="uppercase tracking-wider">Featured Analysis</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="p-6 lg:p-10 lg:w-1/2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-xs text-on-surface-variant mb-3">
                <span className="bg-[#181F33] px-2.5 py-0.5 rounded text-gold-accent text-[11px] font-bold uppercase tracking-wider border border-cosmic-surface">
                  {featuredPost.categoryPill}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gold-accent" />
                  {featuredPost.publishDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gold-accent" />
                  {featuredPost.readTime}
                </span>
              </div>

              <h2 className="font-heading text-2xl lg:text-3xl text-gold-accent font-bold tracking-tight leading-snug">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-on-surface leading-relaxed line-clamp-3">
                {featuredPost.abstract}
              </p>

              {/* Core Insight Callout */}
              {featuredPost.keyInsight && (
                <div className="mt-5 p-4 rounded-xl bg-[#141B2F] border border-cosmic-surface flex items-start gap-3">
                  <Compass className="w-5 h-5 text-gold-accent shrink-0 mt-0.5" />
                  <div className="text-on-surface-variant text-xs leading-relaxed">
                    <span className="text-gold-accent font-bold block mb-0.5">Key Siddhanta:</span>
                    {featuredPost.keyInsight}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-cosmic-surface flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-accent/20 border border-gold-accent/40 flex items-center justify-center text-gold-accent font-heading text-base font-bold">
                  ॐ
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">{featuredPost.author}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {featuredPost.authorRole}
                  </p>
                </div>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 bg-action-red hover:bg-action-hover text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:-translate-y-0.5"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </section>

      {/* 3. Filter & Classification Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-20 w-full">
        <BlogListFilter />
      </section>
    </div>
  );
}
