import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCategoryLabel } from '@/lib/categories/categoryService';

const UPDATES_FILE = path.join(process.cwd(), 'src', 'config', 'gurujiUpdates.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    if (fs.existsSync(UPDATES_FILE)) {
      const data = JSON.parse(fs.readFileSync(UPDATES_FILE, 'utf-8'));
      const active = data
        .filter((d: any) => d.active !== false)
        .map((d: any) => ({
          ...d,
          categoryRaw: d.category,
          category: getCategoryLabel(d.category, locale),
        }));
      return NextResponse.json({ updates: active });
    }
  } catch (err) {
    console.error('Error fetching updates:', err);
  }
  return NextResponse.json({ updates: [] });
}
