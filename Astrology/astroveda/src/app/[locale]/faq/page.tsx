import { setRequestLocale } from 'next-intl/server';
import FaqAccordionViewer from '@/components/faq/FaqAccordionViewer';

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FaqAccordionViewer />;
}
