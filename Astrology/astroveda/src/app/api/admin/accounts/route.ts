import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth/adminSession';
import { hashPassword, verifyPassword } from '@/lib/auth/passwordHash';

const ACCOUNTS_FILE = path.join(process.cwd(), 'src', 'config', 'adminAccounts.json');

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  active: boolean;
  createdAt: string;
}

function getAccounts(): AdminAccount[] {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const content = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read admin accounts:', err);
  }
  return [
    {
      id: 'admin-primary-1',
      name: 'Omkar Ransing Guruji (Chief Daivajna)',
      email: 'admin@astroveda.com',
      password: hashPassword('AstroVeda@2025'),
      role: 'Super Admin',
      active: true,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  ];
}

function saveAccounts(accounts: AdminAccount[]) {
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  const accounts = getAccounts().map(({ password, ...rest }) => rest);
  return NextResponse.json({ accounts });
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role = 'Consultant Astrologer' } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const accounts = getAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'An admin account with this email already exists' }, { status: 400 });
    }

    const newAccount: AdminAccount = {
      id: 'admin-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashPassword(password.trim()),
      role: role.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    saveAccounts(accounts);

    const { password: _, ...safeAccount } = newAccount;
    return NextResponse.json({ success: true, account: safeAccount });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create admin account.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, currentPassword, newPassword, toggleActive } = body;

    const accounts = getAccounts();
    const accountIndex = accounts.findIndex((a) => a.id === id);

    if (accountIndex === -1) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const account = accounts[accountIndex];

    // Password change request
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }
      if (!verifyPassword(currentPassword, account.password || '')) {
        return NextResponse.json({ error: 'Current password does not match' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
      }
      account.password = hashPassword(newPassword.trim());
    }

    // Toggle active state
    if (typeof toggleActive === 'boolean') {
      if (account.id === 'admin-primary-1' && !toggleActive) {
        return NextResponse.json({ error: 'Cannot deactivate primary Super Admin' }, { status: 400 });
      }
      account.active = toggleActive;
    }

    accounts[accountIndex] = account;
    saveAccounts(accounts);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create admin account.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 });
    }

    if (id === 'admin-primary-1') {
      return NextResponse.json({ error: 'Cannot delete master Super Admin account' }, { status: 400 });
    }

    let accounts = getAccounts();
    accounts = accounts.filter((a) => a.id !== id);
    saveAccounts(accounts);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create admin account.' }, { status: 500 });
  }
}

