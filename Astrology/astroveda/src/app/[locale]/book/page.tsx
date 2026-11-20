import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { BookingStepper } from '@/components/booking/BookingStepper';

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EA]">
      <Suspense fallback={<div className="p-16 text-center text-[#10172B] font-heading text-xl">{t('loading')}</div>}>
        <BookingStepper />
      </Suspense>
    </div>
  );
}
