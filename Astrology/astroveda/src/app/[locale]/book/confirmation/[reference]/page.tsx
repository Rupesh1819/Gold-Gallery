import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ConfirmationContent } from './ConfirmationContent';

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; reference: string }>;
}) {
  const { locale, reference } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <div className="min-h-screen bg-[#F7F3EA] py-16">
      <Suspense fallback={<div className="p-12 text-center text-[#10172B] font-heading text-xl">{t('loading')}</div>}>
        <ConfirmationContent reference={reference} />
      </Suspense>
    </div>
  );
}
