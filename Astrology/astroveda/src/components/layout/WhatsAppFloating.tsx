'use client';

import { usePathname } from '@/i18n/navigation';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function WhatsAppFloating() {
  const pathname = usePathname();

  // Hide on booking and admin routes per specification
  if (pathname.includes('/book') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={siteConfig.getWhatsAppUrl('Namaste, I would like to enquire about a consultation.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${siteConfig.name} on WhatsApp`}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gold"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </aside>
  );
}
