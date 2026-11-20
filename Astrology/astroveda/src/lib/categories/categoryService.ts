import fs from 'fs';
import path from 'path';

export interface CategoryItem {
  id: string;
  name: string;
  translations: {
    en: string;
    hi: string;
    mr: string;
  };
}

const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'config', 'categories.json');

const defaultCategories: CategoryItem[] = [
  {
    id: 'panchang-alert',
    name: 'Panchang Alert',
    translations: { en: 'Panchang Alert', hi: 'पंचांग सूचना', mr: 'पंचांग सूचना' },
  },
  {
    id: 'graha-transit',
    name: 'Planetary Transits',
    translations: { en: 'Planetary Transits', hi: 'ग्रह गोचर', mr: 'ग्रह गोचर' },
  },
  {
    id: 'festival-muhurta',
    name: 'Festival Muhurta',
    translations: { en: 'Festival Muhurta', hi: 'त्योहार व शुभ मुहूर्त', mr: 'सण व शुभ मुहूर्त' },
  },
  {
    id: 'spiritual-guidance',
    name: 'Spiritual Guidance',
    translations: { en: 'Spiritual Guidance', hi: 'अध्यात्मिक मार्गदर्शन', mr: 'आध्यात्मिक मार्गदर्शन' },
  },
  {
    id: 'vedic-remedies',
    name: 'Vedic Remedies',
    translations: { en: 'Vedic Remedies', hi: 'वैदिक उपाय', mr: 'वैदिक तोडगे व उपाय' },
  },
  {
    id: 'vastu-space',
    name: 'Vastu & Space',
    translations: { en: 'Vastu & Space', hi: 'वास्तु शास्त्र', mr: 'वास्तू शास्त्र' },
  },
  {
    id: 'chart-interpretation',
    name: 'Chart Interpretation',
    translations: { en: 'Chart Interpretation', hi: 'कुंडली विश्लेषण', mr: 'पत्रिका विश्लेषण' },
  },
];

export function getAllCategories(): CategoryItem[] {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      return JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading categories file:', err);
  }
  return defaultCategories;
}

export function saveCategories(categories: CategoryItem[]) {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing categories file:', err);
  }
}

/**
 * Returns translated label for a given category name or ID in the desired locale
 */
export function getCategoryLabel(categoryNameOrId: string, locale: string = 'en'): string {
  if (!categoryNameOrId) return '';
  const list = getAllCategories();
  const normalized = categoryNameOrId.trim().toLowerCase();

  const found = list.find(
    (c) =>
      c.id.toLowerCase() === normalized ||
      c.name.toLowerCase() === normalized ||
      c.translations.en.toLowerCase() === normalized ||
      c.translations.hi.toLowerCase() === normalized ||
      c.translations.mr.toLowerCase() === normalized
  );

  if (found) {
    const loc = locale === 'hi' ? 'hi' : locale === 'mr' ? 'mr' : 'en';
    return found.translations[loc] || found.name;
  }

  return categoryNameOrId;
}

