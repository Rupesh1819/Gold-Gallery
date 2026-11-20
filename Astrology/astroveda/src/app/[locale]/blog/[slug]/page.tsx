import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { allBlogPosts } from '@/data/blog';
import SadeSatiChecker from '@/components/blog/SadeSatiChecker';
import BlogShareBar from '@/components/blog/BlogShareBar';
import {
  Calendar,
  Clock,
  CheckCircle,
  Menu,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export function generateStaticParams() {
  const locales = ['en', 'hi', 'mr'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const post of allBlogPosts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = allBlogPosts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full bg-midnight min-h-screen text-on-surface">
      {/* 1. Article Header Banner */}
      <section className="relative w-full bg-midnight text-on-surface overflow-hidden py-16 lg:py-24 border-b border-cosmic-surface/40">
        {/* Subtle Astronomical Radial Glow Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(216,181,109,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(39,48,74,0.6),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-on-surface-variant/40">•</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="text-on-surface-variant/40">•</span>
            <span className="text-on-surface-variant">{post.category}</span>
            <span className="text-on-surface-variant/40">•</span>
            <span className="text-gold-accent font-semibold">{post.title}</span>
          </nav>

          <div className="max-w-4xl flex flex-col gap-4">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cosmic-surface border border-gold-accent/20 w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-gold-accent animate-pulse" />
              <span className="text-[11px] font-bold text-gold-accent tracking-wider uppercase">
                {post.categoryPill} • Classical Vedic Discourse
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-ivory-canvas leading-[1.15] tracking-tight font-bold">
              {post.title}
            </h1>

            {/* Abstract */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
              {post.abstract}
            </p>

            {/* Meta Line */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-accent" />
                <span>{post.publishDate}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-accent" />
                <span>{post.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-gold-accent" />
                <span>Authored by <strong className="text-gold-accent font-semibold">{post.author}</strong> ({post.authorRole})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Split Area */}
      <section className="w-full bg-[#060D21] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Sticky Table of Contents, Share, Bio, Calculator */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6 order-2 lg:order-1">
              
              {/* Table of Contents Card */}
              <div className="bg-[#141B2F] border border-[#27304A] p-5 rounded-xl shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#27304A]">
                  <span className="text-[11px] font-bold tracking-widest text-gold-accent uppercase">
                    Contents Overview
                  </span>
                  <Menu className="w-4 h-4 text-gold-accent" />
                </div>
                <nav className="flex flex-col gap-1.5 text-xs">
                  <a href="#myth-of-fear" className="group flex items-start gap-2 text-on-surface-variant hover:text-gold-accent p-1.5 rounded-lg hover:bg-cosmic-surface/60 transition-all">
                    <span className="font-bold text-gold-accent/80 text-[11px]">01</span>
                    <span>The Myth of Fear</span>
                  </a>
                  <a href="#three-phases" className="group flex items-start gap-2 text-on-surface-variant hover:text-gold-accent p-1.5 rounded-lg hover:bg-cosmic-surface/60 transition-all">
                    <span className="font-bold text-gold-accent/80 text-[11px]">02</span>
                    <span>The Three Phases (Charanas)</span>
                  </a>
                  <a href="#moon-interaction" className="group flex items-start gap-2 text-on-surface-variant hover:text-gold-accent p-1.5 rounded-lg hover:bg-cosmic-surface/60 transition-all">
                    <span className="font-bold text-gold-accent/80 text-[11px]">03</span>
                    <span>Moon Sign Interaction</span>
                  </a>
                  <a href="#sattvic-remedies" className="group flex items-start gap-2 text-on-surface-variant hover:text-gold-accent p-1.5 rounded-lg hover:bg-cosmic-surface/60 transition-all">
                    <span className="font-bold text-gold-accent/80 text-[11px]">04</span>
                    <span>Sattvic Remedies (Upayas)</span>
                  </a>
                  <a href="#practical-sadhana" className="group flex items-start gap-2 text-on-surface-variant hover:text-gold-accent p-1.5 rounded-lg hover:bg-cosmic-surface/60 transition-all">
                    <span className="font-bold text-gold-accent/80 text-[11px]">05</span>
                    <span>Practical Daily Sadhana</span>
                  </a>
                </nav>
              </div>

              {/* Share Component */}
              <BlogShareBar title={post.title} />

              {/* Author Bio Card */}
              <div className="bg-cosmic-surface border border-gold-accent/25 p-5 rounded-xl shadow-md flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/40 flex items-center justify-center text-gold-accent font-heading text-lg font-bold shrink-0">
                    ॐ
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading text-base font-bold text-gold-accent leading-tight">
                      {post.author}
                    </span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                      {post.authorRole}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-midnight/70 rounded-lg flex items-center gap-2 text-gold-accent text-xs font-semibold border border-cosmic-surface">
                  <ShieldCheck className="w-4 h-4" />
                  <span>25+ Years Classical Vedic Scholarship</span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Disciple of traditional Varanasi Jyotish lineage. Specializing in natal Bhavat Bhavam, Jaimini Sutras, and psychological reconciliation through Sattvic Upayas.
                </p>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-gold-accent text-xs font-bold hover:underline pt-1"
                >
                  <span>Read Full Acharya Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Shani Transit Calculator Mini Widget */}
              <SadeSatiChecker />
            </aside>

            {/* Right Column: Editorial Parchment Reader (Ivory Canvas) */}
            <article className="lg:col-span-8 order-1 lg:order-2 bg-ivory-canvas text-midnight rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl flex flex-col gap-8 border border-gold-accent/30">
              
              {/* Lead Intro Section */}
              <div className="flex flex-col gap-4 border-b border-midnight/10 pb-6">
                <p className="text-base sm:text-lg text-midnight leading-relaxed font-normal">
                  Among all planetary cycles recorded in Parashari Jyotish, none suffers greater commercial demonization than the seven-and-a-half-year journey of <em className="font-serif italic font-semibold">Shanaishchara</em> (Saturn), popularly termed <strong>Shani Sade Sati</strong>. For centuries, astrologers driven by fear-based commerce have painted this period as a catastrophe of loss, disease, and unyielding misery.
                </p>
                <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                  However, when one examines the source texts—principally the <em>Brihat Parashara Hora Shastra</em> and the <em>Phaladeepika</em> of Mantreswara—Shani is revered not as a malicious torturer, but as the supreme auditor of individual destiny: the <strong className="text-midnight">Dharmaraja</strong> of the planetary cabinet who extracts gold from raw ore through patient, relentless pressure.
                </p>
              </div>

              {/* Section 1: The Myth of Fear */}
              <section className="scroll-mt-24 flex flex-col gap-3" id="myth-of-fear">
                <div className="flex items-center gap-2 text-gold-ink">
                  <span className="text-xs font-bold uppercase tracking-widest">Section 01</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Philosophical Grounding</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  The Myth of Fear: Understanding Saturn's True Mandate
                </h2>
                <p className="text-sm text-midnight/80 leading-relaxed">
                  In Sanskrit, Saturn is named <em>Manda</em> (the slow-moving) and <em>Kala</em> (time personified). When Shani enters the 12th house from your natal Moon, transits your Janma Rashi, and exits through the 2nd house, he systematically dismantles external ego attachments. This transit does not generate arbitrary suffering; it merely presents the invoice for unresolved Prarabdha Karma.
                </p>
                <div className="p-4 rounded-xl bg-midnight text-on-surface my-2 border border-gold-accent/30 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-gold-accent font-heading">
                    ॥ नीलांजन समाभासं रविपुत्रं यमाग्रजम् । छायामार्तण्ड सम्भूतं तं नमामि शनैश्चरम् ॥
                  </span>
                  <span className="text-[11px] text-on-surface-variant italic">
                    "I bow to Lord Saturn, dark as the blue night sky, the eldest brother of Yama, born of Sun and Chhaya, who moves with deliberate wisdom."
                  </span>
                </div>
              </section>

              {/* Section 2: The Three Phases */}
              <section className="scroll-mt-24 flex flex-col gap-3" id="three-phases">
                <div className="flex items-center gap-2 text-gold-ink">
                  <span className="text-xs font-bold uppercase tracking-widest">Section 02</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Planetary Mechanics</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  The Three Phases (Charanas) of Sade Sati
                </h2>
                <div className="space-y-3 pt-1">
                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/10 shadow-xs">
                    <h3 className="text-sm font-bold text-midnight mb-1">
                      1. First Phase (12th House from Moon) — Rising Phase
                    </h3>
                    <p className="text-xs text-midnight/75 leading-relaxed">
                      Governs unexpected expenditures, changes in sleep architecture, spiritual seeking, and distance from paternal connections. It invites mental surrender and detachment from shallow routines.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/10 shadow-xs">
                    <h3 className="text-sm font-bold text-midnight mb-1">
                      2. Second Phase (Over Natal Moon) — Janma Shani (Peak)
                    </h3>
                    <p className="text-xs text-midnight/75 leading-relaxed">
                      The core crucible. Because the Moon represents the mind (<em>Manas</em>), Saturn’s conjunction induces emotional weight, sobering realism, and high professional responsibility. This is the period where enduring achievements are cemented through sheer hard work.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/10 shadow-xs">
                    <h3 className="text-sm font-bold text-midnight mb-1">
                      3. Third Phase (2nd House from Moon) — Setting Phase
                    </h3>
                    <p className="text-xs text-midnight/75 leading-relaxed">
                      Focuses on family dynamics, speech cultivation, and capital consolidation. As Saturn prepares to depart, life settles into a matured, durable stability.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Moon Sign Interaction */}
              <section className="scroll-mt-24 flex flex-col gap-3" id="moon-interaction">
                <div className="flex items-center gap-2 text-gold-ink">
                  <span className="text-xs font-bold uppercase tracking-widest">Section 03</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Astrological Nuance</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  Moon Sign Interaction &amp; Planetary Dignities
                </h2>
                <p className="text-sm text-midnight/80 leading-relaxed">
                  Sade Sati produces vastly different results depending on your Lagna (Ascendant) and Moon sign lord. For Taurus (Vrishabha) and Libra (Tula) ascendants, Saturn is an exceptionally auspicious <strong>Yogakaraka</strong> planet governing both Kendra and Trikona houses. For these natives, Sade Sati frequently delivers monumental career elevation, institutional authority, and property acquisition rather than hardship.
                </p>
              </section>

              {/* Section 4: Sattvic Remedies */}
              <section className="scroll-mt-24 flex flex-col gap-3" id="sattvic-remedies">
                <div className="flex items-center gap-2 text-gold-ink">
                  <span className="text-xs font-bold uppercase tracking-widest">Section 04</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Upaya Vidya</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  Sattvic Remedies (Upayas): The Path of Dignity
                </h2>
                <p className="text-sm text-midnight/80 leading-relaxed">
                  Commercial astrologers frequently demand exorbitant fees for rare blue sapphires (Neelam) or complex tantric lockets. MyGuruji emphatically advises against fear-based commerce. The authentic remedies prescribed by Sage Parashara are purely Sattvic:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-lg bg-ivory-canvas/60 border border-gold-accent/20">
                    <span className="text-xs font-bold text-gold-ink block mb-1">Seva &amp; Dana</span>
                    <p className="text-xs text-midnight/70">
                      Voluntary service to elderly caretakers, laborers, and differently-abled individuals on Saturdays.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-ivory-canvas/60 border border-gold-accent/20">
                    <span className="text-xs font-bold text-gold-ink block mb-1">Hanuman Chalisa</span>
                    <p className="text-xs text-midnight/70">
                      Regular chanting of the Hanuman Chalisa. Lord Hanuman represents supreme mastery over the mental afflictions of Saturn.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-ivory-canvas/60 border border-gold-accent/20">
                    <span className="text-xs font-bold text-gold-ink block mb-1">Deepa Danam</span>
                    <p className="text-xs text-midnight/70">
                      Lighting a clean mustard oil or sesame oil lamp under a sacred Peepal tree on Saturday dusk.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-ivory-canvas/60 border border-gold-accent/20">
                    <span className="text-xs font-bold text-gold-ink block mb-1">Satya &amp; Discipline</span>
                    <p className="text-xs text-midnight/70">
                      Strict commitment to truthfulness in business contracts, prompt payment of dues, and honoring workers' wages.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5: Practical Daily Sadhana */}
              <section className="scroll-mt-24 flex flex-col gap-3" id="practical-sadhana">
                <div className="flex items-center gap-2 text-gold-ink">
                  <span className="text-xs font-bold uppercase tracking-widest">Section 05</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider">Integration</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  Practical Daily Sadhana for Enduring Peace
                </h2>
                <p className="text-sm text-midnight/80 leading-relaxed">
                  Approach your Sade Sati not with dread, but as a prestigious university course designed to graduate your soul into authentic emotional maturity. When you align your lifestyle with Saturnian virtues—punctuality, humility, diligence, and quiet charity—Saturn acts as your greatest celestial protector.
                </p>
              </section>

              {/* Consultation Callout */}
              <div className="p-6 rounded-2xl bg-midnight text-on-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-gold-accent/30 mt-4">
                <div className="space-y-1 text-left">
                  <h4 className="font-heading text-xl text-gold-accent font-bold">
                    Need Granular Analysis of Your Sade Sati?
                  </h4>
                  <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">
                    Schedule a private 1-on-1 reading with MyGuruji to inspect your Ashtakavarga bindus, running Dasha, and personalized Sattvic remedies.
                  </p>
                </div>
                <Link
                  href="/book?service=general-consultation"
                  className="px-6 py-3 rounded-full bg-action-red hover:bg-action-hover text-white text-xs font-bold transition-all shadow-md shrink-0 whitespace-nowrap"
                >
                  Book Reading (₹1,000)
                </Link>
              </div>

            </article>

          </div>
        </div>
      </section>
    </div>
  );
}
