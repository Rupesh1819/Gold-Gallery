import { NextResponse } from 'next/server';
import { getAllCategories, saveCategories, CategoryItem } from '@/lib/categories/categoryService';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

export async function GET(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const categories = getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, en, hi, mr } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const categories = getAllCategories();
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if exists
    if (categories.some((c) => c.id === id || c.name.toLowerCase() === name.trim().toLowerCase())) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory: CategoryItem = {
      id,
      name: name.trim(),
      translations: {
        en: en?.trim() || name.trim(),
        hi: hi?.trim() || name.trim(),
        mr: mr?.trim() || name.trim(),
      },
    };

    categories.push(newCategory);
    saveCategories(categories);

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process category request.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, en, hi, mr, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const categories = getAllCategories();
    const idx = categories.findIndex((c) => c.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (name) categories[idx].name = name.trim();
    if (en) categories[idx].translations.en = en.trim();
    if (hi) categories[idx].translations.hi = hi.trim();
    if (mr) categories[idx].translations.mr = mr.trim();

    saveCategories(categories);
    return NextResponse.json({ success: true, category: categories[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process category request.' }, { status: 500 });
  }
}

