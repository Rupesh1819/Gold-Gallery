import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { allArticles } from '@/data/articles';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

const UPDATES_FILE = path.join(process.cwd(), 'src', 'config', 'gurujiUpdates.json');

export interface SacredBulletin {
  id: string;
  type: 'bulletin' | 'article';
  title: string;
  category: string;
  date: string;
  content: string;
  pinned: boolean;
  active: boolean;
  author: string;
  slug?: string;
  readTime?: string;
  abstract?: string;
}

function getStoredUpdates(): SacredBulletin[] {
  try {
    if (fs.existsSync(UPDATES_FILE)) {
      return JSON.parse(fs.readFileSync(UPDATES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading guruji updates:', err);
  }
  return [];
}

function saveStoredUpdates(updates: SacredBulletin[]) {
  fs.writeFileSync(UPDATES_FILE, JSON.stringify(updates, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const bulletins = getStoredUpdates();
  return NextResponse.json({
    bulletins,
    standardArticles: allArticles,
  });
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, content, pinned = false, type = 'bulletin', author, readTime } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const updates = getStoredUpdates();
    const newEntry: SacredBulletin = {
      id: 'update-' + Date.now().toString(36),
      type,
      title: title.trim(),
      category: category || 'Spiritual Guidance',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }) + ', Today',
      content: content.trim(),
      pinned: Boolean(pinned),
      active: true,
      author: author || 'Omkar Ransing Guruji',
      readTime: readTime || (type === 'article' ? '5 min read' : undefined),
    };

    // If pinned, insert at front
    if (newEntry.pinned) {
      updates.unshift(newEntry);
    } else {
      updates.push(newEntry);
    }

    saveStoredUpdates(updates);
    return NextResponse.json({ success: true, item: newEntry });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process bulletin request.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, pinned, active, title, content, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const updates = getStoredUpdates();
    const idx = updates.findIndex((u) => u.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    if (typeof pinned === 'boolean') updates[idx].pinned = pinned;
    if (typeof active === 'boolean') updates[idx].active = active;
    if (title) updates[idx].title = title.trim();
    if (content) updates[idx].content = content.trim();
    if (category) updates[idx].category = category.trim();

    saveStoredUpdates(updates);
    return NextResponse.json({ success: true, item: updates[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process bulletin request.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    let updates = getStoredUpdates();
    updates = updates.filter((u) => u.id !== id);
    saveStoredUpdates(updates);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process bulletin request.' }, { status: 500 });
  }
}

