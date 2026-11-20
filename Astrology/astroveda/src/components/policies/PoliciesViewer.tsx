'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  CalendarX,
  FileText,
  Lock,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

interface PoliciesViewerProps {
  initialTab?: 'privacy' | 'terms' | 'cancellation';
}

export default function PoliciesViewer({ initialTab = 'privacy' }: PoliciesViewerProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cancellation'>(initialTab);

  return (
    <div className="flex flex-col w-full bg-midnight min-h-screen text-on-surface">
      {/* 1. Celestial Atmospheric Header Banner */}
      <section className="relative w-full bg-midnight text-on-surface py-16 lg:py-20 overflow-hidden border-b border-cosmic-surface/40">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-surface/40 via-midnight/80 to-midnight pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-accent/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-gold-accent text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gold-accent" />
                <span>Canonical Governance • Satya &amp; Maryada</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gold-accent tracking-tight">
                Trust, Ethics &amp; Legal Sanctuary
              </h1>
              <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed">
                Governing terms, data protection commitments under the Digital Personal Data Protection (DPDP) Act 2023, and compassionate, transparent cancellation covenants.
              </p>
            </div>

            {/* Astrolabe Emblem */}
            <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl bg-cosmic-surface/70 border border-gold-accent/20 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-gold-accent/20 flex items-center justify-center text-gold-accent font-heading text-2xl font-bold">
                ॐ
              </div>
              <span className="text-[10px] text-gold-accent tracking-widest mt-2 uppercase font-bold">
                Sanctum Sigil
              </span>
            </div>
          </div>

          {/* Legal Tab Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
            <button
              onClick={() => setActiveTab('privacy')}
              role="tab"
              aria-selected={activeTab === 'privacy'}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-gold-accent text-midnight shadow-md'
                  : 'bg-cosmic-surface text-on-surface-variant hover:text-white border border-cosmic-surface'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy Policy (DPDP Act 2023)</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              role="tab"
              aria-selected={activeTab === 'terms'}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-gold-accent text-midnight shadow-md'
                  : 'bg-cosmic-surface text-on-surface-variant hover:text-white border border-cosmic-surface'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Terms &amp; Conditions</span>
            </button>

            <button
              onClick={() => setActiveTab('cancellation')}
              role="tab"
              aria-selected={activeTab === 'cancellation'}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'cancellation'
                  ? 'bg-gold-accent text-midnight shadow-md'
                  : 'bg-cosmic-surface text-on-surface-variant hover:text-white border border-cosmic-surface'
              }`}
            >
              <CalendarX className="w-4 h-4" />
              <span>Cancellation &amp; Rescheduling</span>
            </button>
          </div>

          {/* Metadata Pill Strip */}
          <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-xs pt-1">
            <span className="inline-flex items-center gap-1.5 text-gold-accent font-semibold">
              Version: 1.0.0
            </span>
            <span className="text-on-surface-variant/40">•</span>
            <span>Last Enacted: October 2026</span>
            <span className="text-on-surface-variant/40">•</span>
            <span className="text-gold-accent">Statutory Reference: DPDP Act (2023) Compliant</span>
            <span className="text-on-surface-variant/40">•</span>
            <span>Jurisdiction: Pune, Maharashtra, India</span>
          </div>
        </div>
      </section>

      {/* 2. Editorial Reading Body Layout */}
      <section className="w-full bg-[#060D21] py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Sticky Table of Contents (Desktop Left Sidebar) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-[#141B2F] border border-[#27304A] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#27304A]">
                <span className="font-heading text-lg font-bold text-gold-accent">
                  Index of Clauses
                </span>
                <FileText className="w-4 h-4 text-gold-accent" />
              </div>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                Direct navigation across the consolidated MyGuruji statutory and spiritual codes.
              </p>
              <nav className="flex flex-col gap-1 text-xs">
                <a href="#clause-1" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>1. Data Collected &amp; Lawful Basis</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.12.1</span>
                </a>
                <a href="#clause-2" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>2. Purpose of Processing</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.12.2</span>
                </a>
                <a href="#clause-3" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>3. Secrecy &amp; Data Retention</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.12.3</span>
                </a>
                <a href="#clause-4" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>4. Customer Rights &amp; Anonymization</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.12.4</span>
                </a>
                <a href="#clause-5" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>5. Offline Dakshina Protocol</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.13.1</span>
                </a>
                <a href="#clause-6" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>6. Cancellation Cut-Off (24 Hours)</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.14.1</span>
                </a>
                <a href="#clause-7" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>7. Vedic Non-Guarantee Disclaimer</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.13.2</span>
                </a>
                <a href="#clause-8" className="flex items-center justify-between p-2 rounded-lg text-on-surface-variant hover:text-gold-accent hover:bg-cosmic-surface/60 transition-colors">
                  <span>8. Grievance Redressal Officer</span>
                  <span className="text-[10px] text-gold-accent font-bold">§ 3.12.5</span>
                </a>
              </nav>
            </div>

            {/* Quick Summary Box */}
            <div className="bg-cosmic-surface border border-gold-accent/25 rounded-xl p-5 flex flex-col gap-2 text-on-surface shadow-md">
              <div className="flex items-center gap-2 text-gold-accent font-heading text-base font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Zero Pre-Payment Risk</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                All appointments are booked without mandatory upfront payment gateways. The sacred Dakshina is settled post-guidance, guaranteeing complete freedom from financial lock-in.
              </p>
            </div>
          </aside>

          {/* Main Reading Column: Warm Ivory Parchment Surface */}
          <article className="col-span-1 lg:col-span-8 bg-ivory-canvas text-midnight rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl space-y-10 border border-gold-accent/30">
            
            {/* 1. PRIVACY TAB */}
            {(activeTab === 'privacy' || activeTab === 'terms' || activeTab === 'cancellation') && (
              <div className="space-y-8">
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-midnight/10">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gold-ink font-bold block">
                          Section 3.12 • MyGuruji Canon
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight mt-1">
                          Privacy Policy &amp; Data Protection Charter
                        </h2>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-gold-ink shrink-0" />
                    </div>

                    <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                      MyGuruji is bound by ancient spiritual vows of utmost confidentiality (<em>Gopaneeyata</em>) and full statutory alignment with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of the Republic of India.
                    </p>

                    <section id="clause-1" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        1. Data Collected &amp; Lawful Basis (§ 3.12.1)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        We collect only essential details necessary for establishing contact and calculating accurate Vedic ephemerides: Full Name, WhatsApp Contact Number, optional Email Address, Birth Date, Birth Time, and Birth City. We operate under the explicit lawful consent of the Data Principal.
                      </p>
                    </section>

                    <section id="clause-2" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        2. Purpose of Processing (§ 3.12.2)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        Data is used exclusively to generate mathematical horoscopic divisional charts (D1, D9, D10), coordinate consultation logistics, and deliver post-consultation recordings or remedial briefs. We never sell, rent, monetize, or profile customer records for third-party commercial marketing.
                      </p>
                    </section>

                    <section id="clause-3" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        3. Secrecy &amp; Data Retention (§ 3.12.3)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        Birth data and audio transcripts are stored in encrypted databases located strictly within Indian sovereign server infrastructure. Records are preserved for 12 months for repeat continuity, after which they are permanently anonymized or purged unless ongoing study is explicitly requested.
                      </p>
                    </section>

                    <section id="clause-4" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        4. Customer Rights &amp; Anonymization (§ 3.12.4)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        Under the DPDP Act 2023, you hold the unreserved right to access, rectify, or request immediate total erasure of your personal records from our databases by emailing <a href="mailto:privacy@myguruji.com" className="text-action-red font-bold underline">privacy@myguruji.com</a>.
                      </p>
                    </section>
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-midnight/10">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gold-ink font-bold block">
                          Section 3.13 • MyGuruji Canon
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight mt-1">
                          Terms of Consultation &amp; Spiritual Conduct
                        </h2>
                      </div>
                      <Scale className="w-8 h-8 text-gold-ink shrink-0" />
                    </div>

                    <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                      By reserving an appointment through MyGuruji, you acknowledge and agree to the traditional covenants of authentic Vedic astrological inquiry.
                    </p>

                    <section id="clause-5" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        5. Offline Dakshina Settlement Protocol (§ 3.13.1)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        To preserve the sacred nature of Vedic Jyotish, MyGuruji charges zero upfront payment fees during slot booking. The suggested Dakshina is settled post-consultation via direct UPI, bank transfer, or cash at the discretion of the patron.
                      </p>
                    </section>

                    <section id="clause-7" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        7. Vedic Non-Guarantee Disclaimer (§ 3.13.2)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        Astrological guidance is an interpretive spiritual art based on planetary coordinates and probabilistic karmic tendencies. MyGuruji does not provide absolute fatalistic promises. Guidance does not substitute for certified clinical medical diagnoses, formal legal counsel, or registered financial investment advisory.
                      </p>
                    </section>
                  </div>
                )}

                {activeTab === 'cancellation' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-midnight/10">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-gold-ink font-bold block">
                          Section 3.14 • MyGuruji Canon
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight mt-1">
                          Cancellation, Rescheduling &amp; Muhurta Honor
                        </h2>
                      </div>
                      <CalendarX className="w-8 h-8 text-gold-ink shrink-0" />
                    </div>

                    <p className="text-sm sm:text-base text-midnight/80 leading-relaxed">
                      Because the astrologer reserves dedicated meditation and chart casting hours prior to each consultation, we request reciprocal respect for allocated time slots.
                    </p>

                    <section id="clause-6" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        6. Cancellation &amp; Rescheduling Cut-Off (§ 3.14.1)
                      </h3>
                      <div className="p-4 rounded-xl bg-white border border-cosmic-surface/10 space-y-2 text-xs sm:text-sm text-midnight/80">
                        <p>
                          <strong>• 24-Hour Notice:</strong> Appointments may be freely rescheduled or cancelled up to 24 hours prior to the booked muhurta through the self-service booking portal or WhatsApp assistant.
                        </p>
                        <p>
                          <strong>• Zero Financial Penalty:</strong> Because no advance fees are collected, patrons incur zero monetary cancellation penalties.
                        </p>
                        <p>
                          <strong>• Courtesy Notice:</strong> In the event of an unavoidable emergency, please inform our ashram coordinator so that the auspicious window may be offered to patrons on the urgent waitlist.
                        </p>
                      </div>
                    </section>

                    <section id="clause-8" className="scroll-mt-28 space-y-2">
                      <h3 className="font-heading text-xl font-bold text-midnight">
                        8. Grievance Redressal Officer (§ 3.12.5)
                      </h3>
                      <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                        In accordance with the Information Technology Act 2000 and DPDP Act 2023, any privacy, booking, or ethical grievances may be escalated directly to our designated Grievance Officer:
                      </p>
                      <div className="p-4 rounded-xl bg-ivory-canvas/60 border border-gold-accent/20 text-xs text-midnight/80 space-y-1">
                        <p><strong>Nodal Officer:</strong> Omkar Ransing Guruji Grievance Desk, MyGuruji</p>
                        <p><strong>Sanctuary Address:</strong> Prabhat Road, Deccan Gymkhana, Pune, MH 411004</p>
                        <p><strong>Email:</strong> <a href="mailto:grievance@myguruji.com" className="text-action-red font-bold underline">grievance@myguruji.com</a></p>
                        <p><strong>Resolution SLA:</strong> Acknowledgment within 24 hours; formal resolution within 7 working days.</p>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Sanctuary Seal */}
            <div className="pt-6 border-t border-midnight/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-midnight/60">
              <span className="italic">॥ सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम् ॥</span>
              <span>Sanctified in accordance with classical Dharma Shastras</span>
            </div>

          </article>

        </div>
      </section>
    </div>
  );
}

