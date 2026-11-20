'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { allBlogPosts, BlogPost } from '@/data/blog';

export default function BlogListFilter() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Planetary Transits',
    'Chart Interpretation',
    'Vedic Philosophy',
    'Vastu & Space',
  ];

  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8">
      {/* Search & Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <h3 className="font-heading text-2xl text-on-surface font-bold">
            Vedic Discourse Archive
          </h3>
          <p className="text-xs text-on-surface-variant">
            Classified commentaries according to Parashari, Jaimini, and Vastu canons
          </p>
        </div>

        {/* Search Input Dark Surface */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shlokas, planets, sutras..."
            className="w-full bg-[#181F33] border border-[#27304A] text-on-surface placeholder:text-on-surface-variant/50 pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:border-gold-accent transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-gold-accent text-midnight font-bold shadow-md'
                : 'bg-cosmic-surface/70 text-on-surface-variant hover:text-white border border-cosmic-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col bg-white rounded-xl shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group border border-cosmic-surface/10"
          >
            {/* Card Thumbnail */}
            <div className="relative w-full h-48 overflow-hidden bg-cosmic-surface/20">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-midnight-canvas/85 backdrop-blur-xs text-gold-accent text-[10px] font-bold uppercase tracking-wider">
                {post.categoryPill}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-grow justify-between bg-white text-midnight">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-midnight/60 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-ink" /> {post.publishDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-ink" /> {post.readTime}
                  </span>
                </div>

                <h4 className="font-heading text-lg font-bold text-midnight leading-snug mb-2 group-hover:text-gold-ink transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h4>

                <p className="text-xs text-midnight/75 leading-relaxed line-clamp-3 mb-4">
                  {post.abstract}
                </p>
              </div>

              <div className="pt-3 border-t border-midnight/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gold-ink uppercase tracking-wide">
                  {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-action-red hover:text-action-hover inline-flex items-center gap-1 transition-colors"
                >
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

