'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { MapPin, Mail, Phone, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="w-full bg-[#10172B] text-[#D0C5B4] pt-16 pb-8 border-t border-[#D8B56D]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#27304A]">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#27304A]/60 flex items-center justify-center text-[#F6D186] border border-[#D8B56D]/40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" />
                  <path d="M12 3v18M3 12h18" strokeOpacity="0.4" />
                  <polygon fill="none" points="12,7 15,12 12,17 9,12" stroke="currentColor" />
                </svg>
              </div>
              <span className="font-heading text-xl text-[#F6D186] font-semibold">
                MyGuruji
              </span>
            </div>

            <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
              {t('tagline')}
            </p>

            <div className="flex items-center gap-2 text-[#F6D186] pt-1">
              <Sparkles className="h-3.5 w-3.5 text-[#D8B56D]" />
              <span className="text-[11px] uppercase tracking-widest text-[#D8B56D] font-bold">
                {t('motto')}
              </span>
            </div>
          </div>

          {/* Col 2: Consultation Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg text-[#F6D186] font-semibold tracking-wide">
              {t('consultationLinksTitle')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="text-[#F6D186] font-bold">∗</span>
                <Link href="/services#general-consultation" className="hover:text-[#F6D186] transition-colors">
                  {t('linkGeneral')}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F6D186] font-bold">∗</span>
                <Link href="/services#career-guidance" className="hover:text-[#F6D186] transition-colors">
                  {t('linkCareer')}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F6D186] font-bold">∗</span>
                <Link href="/services#marriage-compatibility" className="hover:text-[#F6D186] transition-colors">
                  {t('linkMarriage')}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F6D186] font-bold">∗</span>
                <Link href="/services#health-guidance" className="hover:text-[#F6D186] transition-colors">
                  {t('linkHealth')}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#F6D186] font-bold">∗</span>
                <Link href="/services#vastu-consultation" className="hover:text-[#F6D186] transition-colors">
                  {t('linkVastu')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Sanctuary */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg text-[#F6D186] font-semibold tracking-wide">
              {t('contactSanctuaryTitle')}
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F6D186] shrink-0 mt-0.5" />
                <span>{siteConfig.contact.address.shortText}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#F6D186] shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-[#F6D186] transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F6D186] shrink-0" />
                <a href={`tel:${siteConfig.contact.phoneRaw}`} className="hover:text-[#F6D186] transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={siteConfig.getWhatsAppUrl(`Namaste ${siteConfig.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#27304A] hover:bg-[#2D344A] text-[#F6D186] text-xs font-semibold transition-colors border border-[#D8B56D]/30"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{t('whatsappBtn')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Vedic Disclaimer */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg text-[#F6D186] font-semibold tracking-wide">
              {t('disclaimerTitle')}
            </h3>
            <p className="text-xs text-[#D0C5B4] leading-relaxed font-body">
              {t('disclaimerText')}
            </p>
            <div className="flex items-center gap-2 text-[#D8B56D] pt-2 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('ethicalBadge')}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D0C5B4]">
          <p>{t('allRightsReserved')}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#F6D186] transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-[#F6D186] transition-colors">
              {t('terms')}
            </Link>
            <Link href="/cancellation-policy" className="hover:text-[#F6D186] transition-colors">
              {t('cancellationPolicy')}
            </Link>
            <a href="/admin" className="hover:text-[#F6D186] transition-colors text-xs text-[#D8B56D]/80 hover:text-[#F6D186] flex items-center gap-1">
              <span>{t('adminSanctum')}</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
