import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth/adminSession';
import { verifyPassword } from '@/lib/auth/passwordHash';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimiter';

const ACCOUNTS_FILE = path.join(process.cwd(), 'src', 'config', 'adminAccounts.json');

function checkCustomAccounts(email: string, pass: string): { ok: boolean; name?: string } {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
      const found = data.find(
        (a: any) =>
          a.email.toLowerCase() === email.toLowerCase() &&
          verifyPassword(pass, a.password || '') &&
          a.active !== false
      );
      if (found) {
        return { ok: true, name: found.name };
      }
    }
  } catch (e) {
    console.error('Error reading custom admin accounts:', e);
  }
  return { ok: false };
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting: 5 attempts per 15-minute sliding window per IP
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`admin_login:${clientIp}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Access temporarily restricted. Try again in ${rateLimit.resetInSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    let authenticated = false;
    let adminName = 'Acharya Admin';

    // 2. Authenticate against cryptographic scrypt hashes in admin accounts registry
    const customAuth = checkCustomAccounts(cleanEmail, password);
    if (customAuth.ok) {
      authenticated = true;
      if (customAuth.name) adminName = customAuth.name;
    } else {
      // 3. Alternatively attempt Supabase Auth verification
      try {
        const supabase = createAdminClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!authError && authData?.user) {
          authenticated = true;
        }
      } catch (err) {
        // Fallback silently if supabase auth user not provisioned
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Invalid administrator email or password' },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = await createSessionToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: adminName,
        role: 'owner',
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}

