/**
 * AstroVeda Enterprise Admin Authentication & Session Management
 * Features:
 * - HMAC-SHA256 Cryptographic Token Signing
 * - Persistent Shared Session Revocation via Supabase PostgreSQL (Multi-Instance Safe)
 * - Strict Issuer, Audience, Identity and Expiration Claims Validation
 * - Origin & Sec-Fetch-Site CSRF Protection on State-Changing Admin Requests
 */

const SESSION_COOKIE_NAME = 'astroveda_admin_session';
const DEFAULT_SECRET = process.env.SUPABASE_SECRET_KEY || 'astroveda_sacred_admin_secret_key_2025';
const AUTH_ISSUER = 'astroveda-auth-authority';
const AUTH_AUDIENCE = 'astroveda-admin-sanctuary';

// Master credentials configuration
export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@astroveda.com',
  password: process.env.ADMIN_PASSWORD || 'AstroVeda@2025',
};

export { SESSION_COOKIE_NAME, AUTH_ISSUER, AUTH_AUDIENCE };

export interface AdminSessionPayload {
  sid: string;          // Cryptographic Session UUID
  sub: string;          // Admin Email (Subject)
  role: string;         // Role (owner / admin)
  iss: string;          // Issuer
  aud: string;          // Audience
  iat: number;          // Issued At (ms)
  exp: number;          // Expires At (ms)
}

/**
 * Creates a cryptographically signed session token
 */
export async function createSessionToken(email: string, role = 'owner'): Promise<string> {
  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'sid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

  const payload: AdminSessionPayload = {
    sid: sessionId,
    sub: email.trim().toLowerCase(),
    role,
    iss: AUTH_ISSUER,
    aud: AUTH_AUDIENCE,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const dataStr = JSON.stringify(payload);
  const dataBase64 = Buffer.from(dataStr, 'utf8').toString('base64url');

  // Sign using Web Crypto API HMAC-SHA256
  const signature = await generateSignature(dataBase64, DEFAULT_SECRET);
  return `${dataBase64}.${signature}`;
}

/**
 * Checks Supabase site_settings for persistent revocation record
 * Compatible with Edge & Node.js runtimes (uses standard fetch)
 */
async function isSessionRevokedInSupabase(sessionId: string, email: string, issuedAt: number): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecret) return false;

  try {
    const sessionKey = `auth:revocation:sid:${sessionId}`;
    const userKey = `auth:revocation:sub:${email}`;

    // Query revocation record via Supabase REST API
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?key=in.(${sessionKey},${userKey})&select=key,value`,
      {
        headers: {
          apikey: supabaseSecret,
          Authorization: `Bearer ${supabaseSecret}`,
        },
      }
    );

    if (!res.ok) return false;
    const records = await res.json();
    if (!Array.isArray(records) || records.length === 0) return false;

    for (const record of records) {
      if (record.key === sessionKey) {
        return true; // Specific session ID revoked
      }
      if (record.key === userKey && record.value?.revokedBefore) {
        if (issuedAt <= record.value.revokedBefore) {
          return true; // Token issued before user-level revocation timestamp
        }
      }
    }
    return false;
  } catch (err) {
    console.error('Error querying session revocation store:', err);
    return false;
  }
}

/**
 * Persistently revokes a session in Supabase site_settings
 */
export async function revokeSessionToken(token: string): Promise<boolean> {
  if (!token || !token.includes('.')) return false;
  const [dataBase64] = token.split('.');

  try {
    const jsonStr = Buffer.from(dataBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;
    if (!payload.sid || !payload.sub) return false;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !supabaseSecret) return false;

    const sessionKey = `auth:revocation:sid:${payload.sid}`;
    const res = await fetch(`${supabaseUrl}/rest/v1/site_settings`, {
      method: 'POST',
      headers: {
        apikey: supabaseSecret,
        Authorization: `Bearer ${supabaseSecret}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        key: sessionKey,
        value: {
          sid: payload.sid,
          sub: payload.sub,
          revokedAt: Date.now(),
          exp: payload.exp,
        },
        is_public: false,
        description: `Revoked admin session for ${payload.sub}`,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to record session revocation:', err);
    return false;
  }
}

/**
 * Verifies a signed session token, claims, expiration, and persistent revocation status
 */
export async function verifySessionToken(token: string): Promise<{ valid: boolean; email?: string; role?: string; sessionId?: string }> {
  if (!token || !token.includes('.')) {
    return { valid: false };
  }

  const [dataBase64, signature] = token.split('.');
  if (!dataBase64 || !signature) {
    return { valid: false };
  }

  // 1. Verify HMAC-SHA256 Signature
  const expectedSignature = await generateSignature(dataBase64, DEFAULT_SECRET);
  if (signature.length !== expectedSignature.length) {
    return { valid: false };
  }

  // Timing safe comparison for signature strings
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  if (diff !== 0) {
    return { valid: false };
  }

  try {
    const jsonStr = Buffer.from(dataBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;

    // 2. Validate Expiration
    const now = Date.now();
    const expTime = payload.exp || (payload as any).expiresAt;
    if (!expTime || now > expTime) {
      return { valid: false }; // Expired
    }

    // 3. Validate Identity and Claims
    const userEmail = payload.sub || (payload as any).email;
    if (!userEmail) {
      return { valid: false };
    }

    // Validate Issuer and Audience if present
    if (payload.iss && payload.iss !== AUTH_ISSUER) {
      return { valid: false };
    }
    if (payload.aud && payload.aud !== AUTH_AUDIENCE) {
      return { valid: false };
    }

    // 4. Validate Persistent Revocation in Supabase Store
    const issuedAt = payload.iat || (payload as any).issuedAt || 0;
    const isRevoked = await isSessionRevokedInSupabase(payload.sid || 'legacy', userEmail, issuedAt);
    if (isRevoked) {
      return { valid: false }; // Revoked session
    }

    return {
      valid: true,
      email: userEmail,
      role: payload.role || 'owner',
      sessionId: payload.sid,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Validates request origin and Sec-Fetch-Site to prevent CSRF on state-changing requests
 */
function validateCsrf(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    return true; // Safe read-only request
  }

  // Check Sec-Fetch-Site header (Supported by all modern browsers)
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite === 'cross-site') {
    return false; // Cross-origin attack blocked
  }

  // Check Origin / Referer against request host
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const requestUrl = new URL(request.url);

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== requestUrl.host) {
        return false; // Mismatched origin
      }
    } catch {
      return false;
    }
  } else if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== requestUrl.host) {
        return false; // Mismatched referer
      }
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Extracts and verifies the admin session from an incoming Request
 * Enforces both session validation and CSRF protection on mutations
 */
export async function verifyAdminRequest(
  request: Request
): Promise<{ valid: boolean; email?: string; role?: string; csrfRejected?: boolean }> {
  try {
    // Enforce CSRF protection on state-changing operations
    if (!validateCsrf(request)) {
      return { valid: false, csrfRejected: true };
    }

    // Extract token from cookie or Authorization header
    let token: string | null = null;
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
    if (match) {
      token = decodeURIComponent(match[1]);
    } else {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return { valid: false };
    return await verifySessionToken(token);
  } catch {
    return { valid: false };
  }
}

/**
 * Generate HMAC-SHA256 signature compatible with Web Crypto API
 */
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(data)
  );

  const signatureBytes = new Uint8Array(signatureBuffer);
  let binary = '';
  for (let i = 0; i < signatureBytes.byteLength; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  return Buffer.from(binary, 'binary').toString('base64url');
}
