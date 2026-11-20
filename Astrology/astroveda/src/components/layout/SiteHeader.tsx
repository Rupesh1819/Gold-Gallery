'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/horoscope', label: t('horoscope') },
    { href: '/testimonials', label: t('testimonials') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="fixed top-0 inset-x-0 w-full max-w-full z-50 bg-[#10172B]/95 backdrop-blur-md border-b border-[#D8B56D]/15 shadow-sm">
        <div className="h-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo matching Reference Design */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 group focus-visible:ring-2 focus-visible:ring-[#D8B56D] rounded-lg shrink-0"
            aria-label="MyGuruji Homepage"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D8B56D]/60 flex items-center justify-center shadow-[0_0_10px_rgba(216,181,109,0.2)] group-hover:border-[#D8B56D] transition-colors bg-[#001233]/60 shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#F6D186]" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeDasharray="2 2" strokeOpacity="0.6" />
                <circle cx="24" cy="24" r="14" stroke="currentColor" />
                <polygon fill="none" points="24,6 29,19 42,19 31,27 35,40 24,32 13,40 17,27 6,19 19,19" stroke="currentColor" strokeWidth="1" />
                <circle cx="24" cy="24" fill="currentColor" r="2.5" />
              </svg>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-heading text-base sm:text-lg lg:text-xl text-[#F7F3EA] tracking-wide leading-tight font-medium truncate">
                MyGuruji
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[9px] text-[#D0C5B4] uppercase tracking-wider font-medium truncate">
                VEDIC ASTROLOGY &amp; LIFE GUIDANCE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-xs sm:text-sm transition-colors duration-200 tracking-wide
                    ${active
                      ? 'text-[#F6D186] font-semibold border-b-2 border-[#D8B56D] pb-0.5'
                      : 'text-[#D0C5B4] hover:text-[#F6D186] font-medium'}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#D62839]/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap min-h-[38px] cursor-pointer"
            >
              {t('bookAppointment')}
            </Link>
          </div>

          {/* Mobile & Tablet Toggle Controls (Visible < lg: 1024px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            <LanguageSwitcher variant="dark" />
            
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#D62839] hover:bg-[#B81F2F] text-white text-xs font-semibold shadow-sm whitespace-nowrap min-h-[36px]"
            >
              {t('bookAppointment')}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F7F3EA] hover:text-[#F6D186] hover:bg-[#27304A]/40 transition-colors focus-visible:ring-2 focus-visible:ring-[#D8B56D] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Full Backdrop & Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[#10172B]/98 backdrop-blur-xl border-b border-[#D8B56D]/20 overflow-y-auto px-4 py-6 space-y-5 animate-in fade-in duration-200">
            <nav className="flex flex-col gap-2 max-w-md mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#27304A] text-[#F6D186] font-semibold border-l-4 border-[#D8B56D]'
                      : 'text-[#D0C5B4] hover:bg-[#27304A]/40 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 max-w-md mx-auto space-y-3">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-3.5 rounded-xl bg-[#D62839] hover:bg-[#B81F2F] text-white text-base font-semibold shadow-lg shadow-[#D62839]/30 transition-all cursor-pointer min-h-[48px]"
              >
                {t('bookAppointment')}
              </Link>
              <div className="text-center text-xs text-[#D0C5B4]/70 pt-2 font-medium">
                Vedic Astrology &amp; Spiritual Guidance • MyGuruji
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
