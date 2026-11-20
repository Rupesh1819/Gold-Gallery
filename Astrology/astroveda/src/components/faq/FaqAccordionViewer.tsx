'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Calendar,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Wallet,
  Lock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface FaqItem {
  id: string;
  category: 'booking' | 'services' | 'payments' | 'policies' | 'ethics';
  q: string;
  a: string;
  keywords: string;
}

const faqData: FaqItem[] = [
  {
    id: 'b1',
    category: 'booking',
    q: 'How does the appointment booking process work?',
    a: 'Reserving a consultation is straightforward: 1) Select your desired astrological service. 2) Pick an open Muhurta slot from the live calendar. 3) Provide your contact details and birth coordinates. 4) Instantly receive your unique Booking Reference Token. No upfront payment is required.',
    keywords: 'booking process appointment schedule step intake form token',
  },
  {
    id: 'b2',
    category: 'booking',
    q: 'What birth coordinates do I need to provide?',
    a: 'For precise Parashari calculations, you should provide: 1) Date of Birth (DD/MM/YYYY). 2) Accurate Time of Birth down to the minute. 3) Exact City/Town of Birth for astronomical longitude and latitude calculation.',
    keywords: 'birth details date time city hospital record accuracy coordinates',
  },
  {
    id: 'b3',
    category: 'booking',
    q: 'What if I do not have my exact birth time down to the minute?',
    a: 'If your birth time uncertainty is within 10–20 minutes, our Acharya conducts Birth Time Rectification (Janma Kundli landmark cross-verification) at the start of your consultation to establish the correct Ascendant degree.',
    keywords: 'unknown birth time approximate rectification lagna degree',
  },
  {
    id: 's1',
    category: 'services',
    q: 'What consultation formats and modes are available?',
    a: 'We offer three flexible modes: 1) Private Video Consultation via Google Meet. 2) Direct Cellular Phone Call. 3) In-Person Ashram Consultation at our Pune Sanctum Chamber. All formats receive the exact same rigorous chart analysis.',
    keywords: 'formats modes video google meet phone call in-person ashram pune',
  },
  {
    id: 's2',
    category: 'services',
    q: 'Can family members or spouses join the consultation session?',
    a: 'Yes. For Marriage & Compatibility readings, Kundali Milan, or family welfare inquiries, spouses and immediate family members are warmly welcome to participate in the video or in-person session.',
    keywords: 'family members join call spouse partner marriage compatibility',
  },
  {
    id: 'p1',
    category: 'payments',
    q: 'Why is there no online payment gateway on the MyGuruji website?',
    a: 'In accordance with authentic Vedic traditions (Dharini Dakshina), guidance should never be gated behind commercial payment processors. We charge zero upfront fees. Dakshina is settled offline via UPI, QR code, bank transfer, or cash after your consultation is complete and you are fully satisfied.',
    keywords: 'payment gateway offline dakshina zero upfront upi cash fees razorpay',
  },
  {
    id: 'p2',
    category: 'payments',
    q: 'What is the suggested Dakshina amount for consultations?',
    a: 'Our suggested Dakshina is transparent: General, Career, Marriage, Health, Business, and Numerology consultations are ₹1,000 (60 minutes). Comprehensive Vastu Consultation is ₹1,500. Detailed Written Janampatri Reports are ₹2,500.',
    keywords: 'suggested dakshina tariff price cost fee rate chart report',
  },
  {
    id: 'pol1',
    category: 'policies',
    q: 'What is the cancellation and rescheduling policy?',
    a: 'You may freely reschedule or cancel your appointment up to 24 hours prior to the booked muhurta through the online self-service confirmation portal or via WhatsApp. Because no upfront advance is collected, there are zero monetary penalties.',
    keywords: 'cancellation policy rescheduling 24 hours notice penalty free',
  },
  {
    id: 'pol2',
    category: 'policies',
    q: 'How do I manage or look up my confirmed appointment?',
    a: 'Visit our booking confirmation portal with your reference token (e.g., ASTRO-XXXXXX) or mobile number to download your consultation slip, reschedule the slot, or cancel the reservation.',
    keywords: 'confirmation lookup token manage slip pdf reschedule cancel',
  },
  {
    id: 'e1',
    category: 'ethics',
    q: 'Do you guarantee absolute deterministic predictions or sell costly gems?',
    a: 'Never. MyGuruji practices authentic Sattvic Jyotish that honors human free will (Purushartha). We strictly do not sell gemstones, conduct fear-based prophecies, or mandate expensive commercial rituals. Recommended remedies are purely spiritual: meditation, mantra japa, and mindful ethical charity.',
    keywords: 'guarantee prediction fear superstition gemstone remedies puja curse',
  },
  {
    id: 'e2',
    category: 'ethics',
    q: 'How does MyGuruji safeguard personal data under the DPDP Act 2023?',
    a: 'We strictly comply with the Digital Personal Data Protection Act 2023. Birth coordinates and consultation notes are stored in sovereign Indian encrypted databases and are permanently purged upon client request.',
    keywords: 'dpdp act 2023 privacy security data protection encryption rights',
  },
];

export default function FaqAccordionViewer() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ b1: true, p1: true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      item.q.toLowerCase().includes(query) ||
      item.a.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* 1. Header Banner */}
      <section className="relative w-full bg-midnight text-on-surface py-16 lg:py-20 overflow-hidden border-b border-cosmic-surface/40">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="40%" fill="none" opacity="0.35" r="220" stroke="#d8b56d" strokeDasharray="3 6" strokeWidth="0.75" />
            <circle cx="50%" cy="40%" fill="none" r="340" stroke="#d8b56d" strokeOpacity="0.25" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Sanctum Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cosmic-surface/90 border border-gold-accent/20 text-gold-accent shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              Knowledge &amp; Guidance Sanctum
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-gold-accent tracking-tight max-w-4xl font-bold">
            Frequently Asked Questions
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mt-3 leading-relaxed">
            Transparent answers regarding consultation bookings, offline Dakshina payment policies, appointment preparation, and classical Vedic ethics.
          </p>

          {/* Real-time Search Box */}
          <div className="w-full max-w-xl mt-8 relative">
            <div className="relative flex items-center bg-[#181F33] border border-[#27304A] rounded-full shadow-lg">
              <Search className="absolute left-4 text-gold-accent h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inquiries (e.g. dakshina, birth time, DPDP, cancellation)..."
                className="w-full pl-11 pr-10 py-3 bg-transparent text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-gold-accent rounded-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-on-surface-variant hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full max-w-5xl">
            {[
              { id: 'all', label: 'All Enquiries' },
              { id: 'booking', label: 'Appointment Booking' },
              { id: 'services', label: 'Consultation Formats' },
              { id: 'payments', label: 'Offline Dakshina' },
              { id: 'policies', label: 'Cancellations & Rescheduling' },
              { id: 'ethics', label: 'Vedic Ethics & Privacy' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gold-accent text-midnight font-bold shadow-md'
                    : 'bg-cosmic-surface/90 text-on-surface-variant hover:text-white border border-cosmic-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Editorial Section: Notice & Accordion Container */}
      <section className="w-full bg-[#060D21] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          
          {/* Sticky Side Overview Column */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="bg-cosmic-surface border border-gold-accent/25 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-gold-accent font-heading text-xl font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>Sacred Sanctuary Charter</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Jyotish is pure light (<em>Vedanga Jyotisha</em>). Consultations at MyGuruji are rooted in classical integrity without digital paywalls, fear induction, or algorithmic commercialization.
              </p>

              <div className="bg-[#141B2F] border border-[#27304A] rounded-xl p-4 flex flex-col gap-1 text-on-surface">
                <div className="flex items-center gap-1.5 text-gold-accent text-xs font-bold uppercase tracking-wider">
                  <Wallet className="w-4 h-4" />
                  <span>Post-Guidance Dakshina</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  No online gatekeeper cards required upfront. You fulfill honorary Dakshina directly via UPI or cash solely after your personalized session concludes.
                </p>
              </div>

              <div className="bg-[#141B2F] border border-[#27304A] rounded-xl p-4 flex flex-col gap-1 text-on-surface">
                <div className="flex items-center gap-1.5 text-gold-accent text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Statutory Data Custody</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  We comply strictly with India’s Digital Personal Data Protection Act (DPDP Act 2023). Natal coordinates are permanently shredded upon client request.
                </p>
              </div>
            </div>

            {/* Visual Vedic Wisdom Card */}
            <div className="relative bg-[#181F33] border border-gold-accent/20 rounded-2xl p-6 shadow-md flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gold-accent font-bold">
                Sanskrit Principle
              </span>
              <p className="font-heading text-xl text-gold-accent italic leading-snug">
                “तमसो मा ज्योतिर्गमय”
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                “Lead me from darkness unto light.” Consultations exist to liberate understanding, never to bind with astrological panic.
              </p>
            </div>
          </aside>

          {/* Main Accordion Stream */}
          <main className="w-full lg:w-2/3 flex flex-col gap-4">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-cosmic-surface/90 border border-cosmic-surface overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-[#2D344A]/60 transition-colors cursor-pointer"
                  >
                    <span className="font-heading text-base sm:text-lg text-gold-accent flex items-center gap-2 font-semibold">
                      <span className="text-gold-accent font-bold">✦</span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gold-accent transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-on-surface-variant text-xs sm:text-sm leading-relaxed border-t border-[#27304A]/60 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Booking Prompt */}
            <div className="mt-8 p-6 rounded-2xl bg-[#141B2F] border border-gold-accent/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-left">
                <h4 className="font-heading text-lg text-gold-accent font-bold">
                  Still have specific questions?
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Speak directly with our ashram coordinator on WhatsApp.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={siteConfig.getWhatsAppUrl(`Namaste, I have questions regarding ${siteConfig.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <Link
                  href="/book"
                  className="px-5 py-2.5 rounded-full bg-action-red hover:bg-action-hover text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </main>

        </div>
      </section>
    </div>
  );
}

