'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
] as const;

export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Language"
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B56D]
          ${variant === 'dark' 
            ? 'text-[#F7F3EA] bg-[#001233]/60 hover:bg-[#011C47] border border-[#D8B56D]/30' 
            : 'text-midnight hover:text-midnight hover:bg-cosmic/10 border border-cosmic/20'}
        `}
      >
        <Globe className="h-3.5 w-3.5 text-[#F6D186]" />
        <span className="uppercase tracking-wider">{currentLang.code}</span>
        <ChevronDown className="h-3 w-3 text-[#D0C5B4]" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-36 rounded-lg bg-midnight border border-gold/30 shadow-xl py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                lang={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer
                  ${isSelected
                    ? 'bg-action/20 text-gold font-semibold'
                    : 'text-ivory/80 hover:bg-cosmic hover:text-ivory'}
                `}
              >
                <span>{lang.native}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
