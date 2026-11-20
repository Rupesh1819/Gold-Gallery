import { setRequestLocale } from 'next-intl/server';
import PoliciesViewer from '@/components/policies/PoliciesViewer';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PoliciesViewer initialTab="terms" />;
}
