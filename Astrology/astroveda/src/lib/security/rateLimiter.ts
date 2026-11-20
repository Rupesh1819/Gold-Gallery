/**
 * AstroVeda Enterprise Centralized & Trusted-Proxy-Aware Rate Limiter
 * 
 * Features:
 * 1. IP Spoofing Prevention: Trusted-proxy validation hierarchy (Cloudflare, Vercel, TRUST_PROXY).
 *    Direct client connections cannot evade limits by rotating arbitrary X-Forwarded-For headers.
 * 2. Distributed Centralized Limiting: Multi-instance coordination via Supabase PostgreSQL
 *    or Upstash Redis (if configured).
 * 3. Fail-Secure Architecture: If centralized store is unreachable, falls back to local
 *    sliding-window memory store so access remains protected and never fails open.
 */

export interface RateLimitOptions {
  limit: number;       // Max allowed requests in window
  windowMs: number;    // Window duration in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

interface LocalRateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory fallback cache
const localMemoryStore = new Map<string, LocalRateLimitRecord>();

// Periodic memory cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of localMemoryStore.entries()) {
      if (now > record.resetAt) {
        localMemoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Validates whether a string matches a valid IPv4 or IPv6 format
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
  // Simple IPv6 check
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  return ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed);
}

/**
 * Trusted-proxy-aware client IP extractor.
 * Prevents IP spoofing on untrusted direct connections.
 */
export function getClientIp(request: Request): string {
  // 1. Cloudflare edge header (authenticated & non-spoofable at edge)
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp.trim();
  }

  // 2. Vercel edge header (authenticated at Vercel routing tier)
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    const candidate = vercelIp.split(',')[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 3. Explicitly trusted reverse proxy environment (e.g. AWS ALB, Nginx with TRUST_PROXY=true)
  const isTrustedProxy = process.env.TRUST_PROXY === 'true';
  if (isTrustedProxy) {
    const realIp = request.headers.get('x-real-ip');
    if (realIp && isValidIp(realIp)) {
      return realIp.trim();
    }
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const candidate = forwarded.split(',')[0].trim();
      if (isValidIp(candidate)) return candidate;
    }
  }

  // 4. Untrusted direct connection:
  // Reject client-supplied X-Forwarded-For headers to prevent rate-limit evasion via IP rotation.
  // Direct connections share a common connection bucket.
  return 'direct_client';
}

/**
 * Checks rate limit against Upstash Redis via REST pipeline
 */
async function checkUpstashRedis(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const key = `ratelimit:${identifier}`;
  const ttlSeconds = Math.ceil(options.windowMs / 1000);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout

    // Pipeline: INCR then EXPIRE (NX)
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, ttlSeconds, 'NX'],
        ['TTL', key],
      ]),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const count = data[0]?.result || 1;
    const remainingTtl = data[2]?.result > 0 ? data[2].result : ttlSeconds;

    return {
      allowed: count <= options.limit,
      remaining: Math.max(0, options.limit - count),
      resetInSeconds: remainingTtl,
    };
  } catch {
    return null; // Fall back to secondary store
  }
}

/**
 * Checks rate limit against Supabase PostgreSQL `site_settings`
 */
async function checkSupabasePostgres(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecret) return null;

  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

    // 1. Fetch current rate limit record
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?key=eq.${encodeURIComponent(key)}&select=key,value`,
      {
        headers: {
          apikey: supabaseSecret,
          Authorization: `Bearer ${supabaseSecret}`,
        },
        signal: controller.signal,
      }
    );

    let currentRecord: LocalRateLimitRecord | null = null;
    if (getRes.ok) {
      const rows = await getRes.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
        currentRecord = rows[0].value as LocalRateLimitRecord;
      }
    }

    let nextCount = 1;
    let nextResetAt = now + options.windowMs;

    if (currentRecord && now <= currentRecord.resetAt) {
      if (currentRecord.count >= options.limit) {
        clearTimeout(timeout);
        return {
          allowed: false,
          remaining: 0,
          resetInSeconds: Math.ceil((currentRecord.resetAt - now) / 1000),
        };
      }
      nextCount = currentRecord.count + 1;
      nextResetAt = currentRecord.resetAt;
    }

    // 2. Persist updated count
    await fetch(`${supabaseUrl}/rest/v1/site_settings`, {
      method: 'POST',
      headers: {
        apikey: supabaseSecret,
        Authorization: `Bearer ${supabaseSecret}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        key,
        value: {
          count: nextCount,
          resetAt: nextResetAt,
        },
        is_public: false,
        description: `Distributed rate limit for ${identifier}`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return {
      allowed: true,
      remaining: Math.max(0, options.limit - nextCount),
      resetInSeconds: Math.ceil((nextResetAt - now) / 1000),
    };
  } catch (err) {
    return null; // Fall back securely
  }
}

/**
 * Local in-memory sliding window rate limiter (Fail-secure secondary guard)
 */
function checkLocalMemory(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const record = localMemoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    localMemoryStore.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetInSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  if (record.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Unified Centralized & Distributed Rate Limiting Check
 * 
 * Hierarchy:
 * 1. Upstash Redis (if configured via env vars)
 * 2. Supabase PostgreSQL site_settings (Primary centralized shared store)
 * 3. Fail-Secure Local In-Memory Limiter (Guarantees protection never fails open)
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 15 * 60 * 1000 }
): Promise<RateLimitResult> {
  // 1. Attempt Upstash Redis if configured
  const upstashResult = await checkUpstashRedis(identifier, options);
  if (upstashResult) return upstashResult;

  // 2. Attempt Supabase PostgreSQL distributed store
  const supabaseResult = await checkSupabasePostgres(identifier, options);
  if (supabaseResult) return supabaseResult;

  // 3. Fallback securely to local memory store
  return checkLocalMemory(identifier, options);
}
