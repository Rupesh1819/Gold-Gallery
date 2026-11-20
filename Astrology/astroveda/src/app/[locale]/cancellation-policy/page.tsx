import { setRequestLocale } from 'next-intl/server';
import PoliciesViewer from '@/components/policies/PoliciesViewer';

export default async function CancellationPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PoliciesViewer initialTab="cancellation" />;
}
