import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { FourPillars } from '@/components/home/FourPillars';
import { ProcessSection } from '@/components/home/ProcessSection';
import { FeaturedConsultations } from '@/components/home/FeaturedConsultations';
import { EthicalAssurance } from '@/components/home/EthicalAssurance';
import { HomeBlogSection } from '@/components/home/HomeBlogSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-[#10172B] w-full max-w-full">
      {/* 1. Atmospheric Hero Section with Deep Cosmic Sanctuary */}
      <Hero />

      {/* 2. Overlapping Featured Category Strip (Ivory Field) */}
      <FourPillars />

      {/* 3. Three-Step Consultation Arc */}
      <ProcessSection />

      {/* 4. Featured Consultations Showcase */}
      <FeaturedConsultations />

      {/* 5. Astrological Insights & Guruji's Updates Section */}
      <HomeBlogSection locale={locale} />

      {/* 6. Ethical Astrological Code Banner */}
      <EthicalAssurance />
    </div>
  );
}
