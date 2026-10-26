/**
 * Session-token helpers shared by the serverless API routes.
 *
 * These live outside `api/` function entry points on purpose. Every `.ts` file
 * directly under `api/` is built as its own Vercel function, so importing one
 * entry file from another bundles a second copy of a function handler and, in
 * this project, failed at invocation time with FUNCTION_INVOCATION_FAILED for
 * /api/sync, /api/teams and /api/push while /api/auth itself stayed healthy.
 * `api/shared/` is not treated as a function directory, so it is safe to import
 * from any route (that is how shared/json.ts and shared/webdavSecurity.ts are
 * already used).
 */
import crypto from 'crypto';

const TOKEN_ID_PATTERN = /^[a-f0-9]{64}$/;

/** Local copy so this module does not depend on which shared helpers exist. */
function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (!value || typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Sliding session lifetime; refreshed on every successful verification. */
export const SESSION_TTL_SECONDS = 30 * 24 * 3600;

export interface VerifiedSession {
  userId: string;
  username: string;
  tokenId: string;
  token: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Fail-closed: returns null unless AUTH_TOKEN_SECRET is present and long enough
 * to be meaningful. Callers must treat null as "auth unavailable".
 */
export function getAuthTokenSecret(): string | null {
  const secret = process.env.AUTH_TOKEN_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  return secret;
}

export function getRegistrationSecret(): string | null {
  const secret = process.env.REGISTRATION_SECRET?.trim();
  if (!secret || secret.length === 0) return null;
  return secret;
}

/**
 * Constant-time string comparison via SHA-256 digests so length differences
 * never leak timing or throw RangeError in crypto.timingSafeEqual.
 */
export function constantTimeCompare(a: string, b: string): boolean {
  const digestA = crypto.createHash('sha256').update(a, 'utf8').digest();
  const digestB = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

export function signSessionToken(tokenId: string, authTokenSecret: string): string {
  const signature = crypto
    .createHmac('sha256', authTokenSecret)
    .update(tokenId, 'utf8')
    .digest('hex');
  return `${tokenId}.${signature}`;
}

export function verifySignedToken(rawToken: string, authTokenSecret: string): string | null {
  if (!rawToken || typeof rawToken !== 'string') return null;
  const parts = rawToken.trim().split('.');
  if (parts.length !== 2) return null;
  const [tokenId, signature] = parts;
  if (!TOKEN_ID_PATTERN.test(tokenId) || !TOKEN_ID_PATTERN.test(signature)) return null;

  const expectedSig = crypto
    .createHmac('sha256', authTokenSecret)
    .update(tokenId, 'utf8')
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  return tokenId;
}

export function extractBearerToken(authHeader?: string | string[]): string | null {
  if (!authHeader) return null;
  const raw = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  if (!raw || typeof raw !== 'string') return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Verifies the Bearer token HMAC signature and Redis session record,
 * and extends the sliding 30-day session TTL.
 */
export async function verifyBearerToken(
  client: any,
  authHeader?: string | string[]
): Promise<VerifiedSession | null> {
  const authTokenSecret = getAuthTokenSecret();
  if (!authTokenSecret || !client) return null;

  const token = extractBearerToken(authHeader);
  if (!token) return null;

  const tokenId = verifySignedToken(token, authTokenSecret);
  if (!tokenId) return null;

  const sessionKey = `scholar_session:${tokenId}`;
  const sessionRaw = await client.get(sessionKey);
  if (!sessionRaw) return null;

  const parsed = safeJsonParse<{
    userId: string;
    username: string;
    issuedAt: number;
    expiresAt: number;
  } | null>(sessionRaw, null);

  if (!parsed || !parsed.userId || !parsed.username) return null;

  const now = Date.now();
  const updatedSession = {
    ...parsed,
    expiresAt: now + SESSION_TTL_SECONDS * 1000,
  };

  await client.set(sessionKey, JSON.stringify(updatedSession), { EX: SESSION_TTL_SECONDS });

  return {
    userId: parsed.userId,
    username: parsed.username,
    tokenId,
    token,
    issuedAt: parsed.issuedAt,
    expiresAt: updatedSession.expiresAt,
  };
}
