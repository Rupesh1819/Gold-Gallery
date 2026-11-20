/**
 * AstroVeda Cryptographic Password Hashing & Verification
 * Implements scrypt key derivation with per-password random 128-bit salt
 * and timing-safe comparison to prevent timing attacks.
 */

import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // Backwards-compatible fallback for initial legacy accounts
  if (!storedHash.startsWith('scrypt:')) {
    // Constant-time fallback comparison
    const a = Buffer.from(password);
    const b = Buffer.from(storedHash);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  const parts = storedHash.split(':');
  if (parts.length !== 3) return false;
  const [, salt, originalHash] = parts;

  try {
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const a = Buffer.from(derivedKey, 'hex');
    const b = Buffer.from(originalHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
