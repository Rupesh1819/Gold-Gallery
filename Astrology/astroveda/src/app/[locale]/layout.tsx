import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsAppFloating } from '@/components/layout/WhatsAppFloating';
import { ToastProvider } from '@/components/ui/toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'MyGuruji — Ancient Wisdom. A Clearer Path Forward. | Vedic Astrology',
    hi: 'मायगुरुजी — प्राचीन ज्ञान, स्पष्ट मार्गदर्शन | वैदिक ज्योतिष',
    mr: 'मायगुरुजी — प्राचीन ज्ञान, स्पष्ट मार्गदर्शन | वैदिक ज्योतिष',
  };

  const descriptions: Record<string, string> = {
    en: 'Personalised, authentic Vedic astrology consultations for career, relationships, health, and life clarity. Book your consultation today.',
    hi: 'करियर, विवाह, स्वास्थ्य और जीवन में स्पष्टता के लिए प्रामाणिक वैदिक ज्योतिष परामर्श। आज ही परामर्श बुक करें।',
    mr: 'करिअर, विवाह, आरोग्य आणि जीवनातील स्पष्टतेसाठी अस्सल वैदिक ज्योतिष सल्ला. आजच आपली भेट निश्चित करा.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    metadataBase: new URL('http://localhost:3000'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        hi: '/hi',
        mr: '/mr',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      locale: locale === 'en' ? 'en_IN' : locale === 'hi' ? 'hi_IN' : 'mr_IN',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="min-h-screen flex flex-col bg-[#10172B] text-midnight antialiased w-full max-w-full">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <SiteHeader />
            <main id="main-content" className="flex-1 w-full max-w-full">
              {children}
            </main>
            <SiteFooter />
            <WhatsAppFloating />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

