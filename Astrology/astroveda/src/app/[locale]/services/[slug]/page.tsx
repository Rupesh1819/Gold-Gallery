import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { allServices } from '@/data/services';
import { sampleFaqs } from '@/data/faqs';
import {
  Clock,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

export function generateStaticParams() {
  const locales = ['en', 'hi', 'mr'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const service of allServices) {
      params.push({ locale, slug: service.slug });
    }
  }

  return params;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = allServices.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  const relatedFaqs = sampleFaqs.filter((f) => service.faqIds.includes(f.id));

  return (
    <div className="flex flex-col w-full bg-[#10172B] min-h-screen text-on-surface">
      {/* 1. Celestial Nocturne Hero */}
      <section className="relative w-full bg-[#10172B] text-on-surface overflow-hidden pt-28 lg:pt-36 pb-14 lg:pb-18 border-b border-cosmic-surface/40">
        {/* Astrological Constellation & Coordinate Mesh Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient cx="50%" cy="30%" id="celestial-glow-detail" r="70%">
                <stop offset="0%" stopColor="#D8B56D" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#10172B" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10172B" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect fill="url(#celestial-glow-detail)" height="100%" width="100%" />
            <circle cx="20%" cy="25%" fill="none" r="140" stroke="#D8B56D" strokeDasharray="3 6" strokeWidth="0.75" />
            <circle cx="85%" cy="65%" fill="none" r="220" stroke="#D8B56D" strokeDasharray="2 8" strokeWidth="0.5" />
            <line opacity="0.6" stroke="#D8B56D" strokeWidth="0.8" x1="12%" x2="28%" y1="10%" y2="40%" />
            <line opacity="0.6" stroke="#D8B56D" strokeWidth="0.8" x1="28%" x2="35%" y1="40%" y2="20%" />
            <line opacity="0.6" stroke="#D8B56D" strokeWidth="0.8" x1="35%" x2="45%" y1="20%" y2="35%" />
          </svg>
        </div>

        {/* Soft Radial Ambient Illumination */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-on-surface-variant text-xs uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gold-accent/60">/</span>
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
            <span className="text-gold-accent/60">/</span>
            <span className="text-gold-accent font-semibold">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cosmic-surface border border-gold-accent/20 text-gold-accent text-xs font-bold tracking-widest uppercase shadow-xs w-fit">
                <span>✦</span>
                <span>{service.badge} • Classical Vedic Analysis</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-gold-accent tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-on-surface max-w-2xl leading-relaxed">
                {service.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-action-red hover:bg-action-hover text-white text-xs font-bold shadow-lg shadow-action-red/30 transition-all transform hover:-translate-y-0.5"
                >
                  Book Consultation Now
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high/80 border border-cosmic-surface/60 text-on-surface-variant text-xs font-medium">
                  <ShieldCheck className="w-4 h-4 text-gold-accent" />
                  <span>100% Sattvic • No Fear Rituals • ₹{service.price.toLocaleString('en-IN')} Dakshina</span>
                </div>
              </div>
            </div>

            {/* Astrological Emblem & Quick Metrics */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-cosmic-surface/90 border border-gold-accent/20 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold-accent/10 rounded-full blur-xl" />
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-cosmic-surface">
                  <span className="text-[11px] uppercase tracking-widest text-gold-accent font-bold">
                    Karmic Coordinates
                  </span>
                  <span className="text-gold-accent text-xs">☸</span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Primary Chart</span>
                    <span className="text-on-surface font-semibold">D1 Natal &amp; D9 / D10</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Core Houses</span>
                    <span className="text-on-surface font-semibold">2nd, 7th, 10th &amp; 11th</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Dasha System</span>
                    <span className="text-on-surface font-semibold">Vimshottari &amp; Gochar</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Evaluation</span>
                    <span className="text-gold-accent font-semibold">Mathematical Rigor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Sanctuary: Two-Column Layout */}
      <section className="w-full bg-ivory-canvas text-midnight py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column (8 cols): Comprehensive Overview */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Editorial Intro Narrative */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-gold-ink uppercase tracking-widest font-bold">
                  01 • Astrological Context
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl text-midnight font-bold tracking-tight">
                  Aligning Your Life Journey with Prarabdha Karma
                </h2>
                <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                  In classical Vedic astrology, every significant life domain is governed by planetary dignities, divisional charts, and the unfolding cycles of time (Dasha). Rather than passive fatalism, authentic Jyotish illuminates the cosmic matrix so you can act with intentional free will (Purushartha).
                </p>
                <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              {/* What This Consultation Covers */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-cosmic-surface/15 shadow-sm flex flex-col gap-6">
                <div>
                  <span className="text-xs text-gold-ink uppercase tracking-widest font-bold">
                    Scope of Study
                  </span>
                  <h3 className="font-heading text-2xl text-midnight mt-1 font-bold">
                    What This Consultation Covers
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-ivory-canvas/60 border border-cosmic-surface/10 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gold-ink uppercase tracking-wide">
                      Natal &amp; Divisional Analysis
                    </span>
                    <p className="text-xs text-midnight/80 leading-relaxed">
                      Deep cross-referencing of planetary strengths (Shadbala), house lords, and divisional placements to reveal organic inclinations and latent gifts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-ivory-canvas/60 border border-cosmic-surface/10 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gold-ink uppercase tracking-wide">
                      Dasha Transit Windows
                    </span>
                    <p className="text-xs text-midnight/80 leading-relaxed">
                      Granular assessment of running Vimshottari Mahadasha and Antardasha to pinpoint fertile periods for strategic decisions and life milestones.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-ivory-canvas/60 border border-cosmic-surface/10 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gold-ink uppercase tracking-wide">
                      Environmental &amp; Relational Sync
                    </span>
                    <p className="text-xs text-midnight/80 leading-relaxed">
                      Understanding energetic synergies with places, partners, and professional collaborators for smooth long-term harmony.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-ivory-canvas/60 border border-cosmic-surface/10 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gold-ink uppercase tracking-wide">
                      Non-Fatalistic Sattvic Remedies
                    </span>
                    <p className="text-xs text-midnight/80 leading-relaxed">
                      Customized behavioral disciplines, meditative mantra japa, and mindful ethical charity tailored to balance specific planetary afflictions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Astrological Chart Callout */}
              <div className="p-6 sm:p-8 rounded-2xl bg-midnight text-on-surface shadow-xl flex flex-col md:flex-row items-center gap-6 border border-gold-accent/20">
                <div className="w-44 h-44 rounded-xl bg-cosmic-surface flex items-center justify-center p-3 relative shrink-0">
                  <svg className="w-full h-full text-gold-accent" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 200 200">
                    <rect height="180" width="180" x="10" y="10" />
                    <line x1="10" x2="190" y1="10" y2="190" />
                    <line x1="190" x2="10" y1="10" y2="190" />
                    <polygon points="100,10 190,100 100,190 10,100" />
                    <text fill="#f6d186" fontFamily="Manrope" fontSize="10" fontWeight="bold" x="92" y="55">10H</text>
                    <text fill="#f6d186" fontFamily="Manrope" fontSize="9" x="91" y="70">Su • Me</text>
                    <text fill="#ccd5f6" fontFamily="Manrope" fontSize="9" x="48" y="95">Ma</text>
                    <text fill="#ccd5f6" fontFamily="Manrope" fontSize="9" x="135" y="95">Ju</text>
                    <text fill="#ccd5f6" fontFamily="Manrope" fontSize="9" x="92" y="145">Sa</text>
                  </svg>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-gold-accent uppercase tracking-widest font-bold">
                    Architectural Chart Reading
                  </span>
                  <h4 className="font-heading text-xl text-gold-accent font-bold">
                    Classical Vedic Chart Synthesis
                  </h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Every chart is cast with astronomical coordinates down to the exact degree of the Ascendant. We evaluate the Bhavat Bhavam principle to understand secondary ripple effects across life areas.
                  </p>
                </div>
              </div>

              {/* 4-Step Analytical Process */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs text-gold-ink uppercase tracking-widest font-bold">
                    Methodology
                  </span>
                  <h3 className="font-heading text-2xl text-midnight font-bold mt-1">
                    Our 4-Step Analytical Process
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/15 shadow-xs flex flex-col gap-1">
                    <span className="font-heading text-3xl text-gold-ink/30 font-bold">01</span>
                    <h4 className="text-xs font-bold text-midnight -mt-2">Birth Rectification</h4>
                    <p className="text-xs text-midnight/70 leading-relaxed">
                      Verification of pivotal past landmarks to ensure accurate ascendant degree alignment.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/15 shadow-xs flex flex-col gap-1">
                    <span className="font-heading text-3xl text-gold-ink/30 font-bold">02</span>
                    <h4 className="text-xs font-bold text-midnight -mt-2">Divisional Alignment</h4>
                    <p className="text-xs text-midnight/70 leading-relaxed">
                      Harmonizing the Natal chart with specific Varga divisional matrices for verified planetary strength.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/15 shadow-xs flex flex-col gap-1">
                    <span className="font-heading text-3xl text-gold-ink/30 font-bold">03</span>
                    <h4 className="text-xs font-bold text-midnight -mt-2">Dasha Timing</h4>
                    <p className="text-xs text-midnight/70 leading-relaxed">
                      Calculating transit conjunctions to pinpoint auspicious months for pivotal actions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-cosmic-surface/15 shadow-xs flex flex-col gap-1">
                    <span className="font-heading text-3xl text-gold-ink/30 font-bold">04</span>
                    <h4 className="text-xs font-bold text-midnight -mt-2">Sattvic Remedies</h4>
                    <p className="text-xs text-midnight/70 leading-relaxed">
                      Prescribing pure, actionable remedial guidance without fear tactics or costly commercial traps.
                    </p>
                  </div>
                </div>
              </div>

              {/* What to Prepare */}
              <div className="p-6 sm:p-8 rounded-2xl bg-midnight text-on-surface shadow-md flex flex-col gap-4 border border-gold-accent/20">
                <div className="flex items-center gap-2">
                  <span className="text-gold-accent text-sm">✦</span>
                  <h3 className="font-heading text-xl text-gold-accent font-bold">
                    What You Must Prepare Prior to the Session
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Because Vedic astronomical calculations require exact coordinates, please keep the following information ready:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.whatToPrepare.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-cosmic-surface/60 p-3 rounded-lg border border-cosmic-surface">
                      <CheckCircle className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                      <span className="text-xs text-on-surface leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {relatedFaqs.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs text-gold-ink uppercase tracking-widest font-bold">
                      Inquiries
                    </span>
                    <h3 className="font-heading text-2xl text-midnight font-bold mt-1">
                      Frequently Asked Questions
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {relatedFaqs.map((faq) => (
                      <div key={faq.id} className="p-5 rounded-xl bg-white border border-cosmic-surface/15 shadow-xs">
                        <h4 className="text-sm font-bold text-midnight mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-midnight/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ethical Disclaimer */}
              <div className="p-5 rounded-xl bg-ivory-canvas border border-gold-accent/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-ink shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-midnight uppercase tracking-wider">
                    Ethical Vedic Guidance Disclaimer
                  </h4>
                  <p className="text-xs text-midnight/75 leading-relaxed">
                    Astrological counsel under MyGuruji is an interpretive spiritual and mathematical guide meant for personal clarity, self-realization, and conscious dharmic decision-making. It does not provide absolute deterministic guarantees or replace certified medical, legal, or financial professional counsel.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking & Tariff Sanctuary Card */}
            <aside className="lg:col-span-4 sticky top-28" id="booking-card">
              <div className="p-6 sm:p-8 rounded-2xl bg-midnight text-on-surface shadow-2xl flex flex-col gap-6 relative overflow-hidden border border-gold-accent/25">
                {/* Subtle Gold Glow Accent */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-accent/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col gap-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmic-surface text-gold-accent text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-action-red" />
                      Individual 1-on-1 Guidance
                    </span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-gold-accent" /> {service.duration} Min
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl text-gold-accent font-bold mt-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Personalized live consultation with Omkar Ransing Guruji.
                  </p>
                </div>

                {/* Dakshina Fee Representation */}
                <div className="p-4 rounded-xl bg-cosmic-surface/90 border border-cosmic-surface flex items-baseline justify-between shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Suggested Dakshina
                    </span>
                    <span className="font-heading text-3xl font-bold text-gold-accent">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-gold-accent font-semibold uppercase tracking-wider">
                    Honest Offline Settlement
                  </span>
                </div>

                {/* Modes of Consultation */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Available Consultation Modes
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-cosmic-surface flex flex-col items-center text-center gap-1">
                      <Phone className="w-4 h-4 text-gold-accent" />
                      <span className="text-[11px] text-on-surface font-semibold">Phone Call</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-cosmic-surface flex flex-col items-center text-center gap-1">
                      <Video className="w-4 h-4 text-gold-accent" />
                      <span className="text-[11px] text-on-surface font-semibold">Google Meet</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-cosmic-surface flex flex-col items-center text-center gap-1">
                      <MapPin className="w-4 h-4 text-gold-accent" />
                      <span className="text-[11px] text-on-surface font-semibold">Ashram Visit</span>
                    </div>
                  </div>
                </div>

                {/* Booking Inclusions Checklist */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Session Inclusions
                  </span>
                  <ul className="flex flex-col gap-2 text-on-surface-variant text-xs">
                    <li className="flex items-center gap-2">
                      <span className="text-gold-accent font-bold">•</span>
                      <span>Complete Janam Kundli casting &amp; Shadbala verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold-accent font-bold">•</span>
                      <span>Evaluation of running Vimshottari Mahadasha cycles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold-accent font-bold">•</span>
                      <span>Direct Q&amp;A on your specific life concerns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gold-accent font-bold">•</span>
                      <span>Audio recording / written notes provided post-session</span>
                    </li>
                  </ul>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="w-full py-3.5 px-6 rounded-full bg-action-red hover:bg-action-hover text-white text-xs font-bold text-center shadow-lg shadow-action-red/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Book This Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    className="w-full py-3 px-6 rounded-full bg-cosmic-surface hover:bg-surface-container-high text-gold-accent text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 border border-cosmic-surface"
                    href={siteConfig.getWhatsAppUrl(`Namaste ${siteConfig.name}, I have a query regarding the ${service.title} consultation.`)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Pre-Booking Query</span>
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
