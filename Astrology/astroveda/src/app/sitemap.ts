import { MetadataRoute } from 'next';
import { allServices } from '@/data/services';
import { allBlogPosts } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myguruji.com';
  const locales = ['en', 'hi', 'mr'];
  const now = new Date();

  const coreRoutes = [
    '',
    '/about',
    '/services',
    '/horoscope',
    '/testimonials',
    '/contact',
    '/faq',
    '/blog',
    '/policies',
    '/privacy-policy',
    '/terms',
    '/cancellation-policy',
    '/book',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // 1. Core pages across all locales
  for (const route of coreRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' || route === '/horoscope' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/services' || route === '/book' ? 0.9 : 0.7,
      });
    }
  }

  // 2. Individual consultation services
  for (const service of allServices) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 3. Individual blog articles
  for (const post of allBlogPosts) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}

