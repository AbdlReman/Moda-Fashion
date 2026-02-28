import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();

export async function signAuthToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const maxAgeSeconds = options.maxAgeSeconds ?? 60 * 60 * 24 * 7; // 7 days
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + maxAgeSeconds)
    .sign(encoder.encode(secret));
}

export async function verifyAuthToken(token) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  const { payload } = await jwtVerify(token, encoder.encode(secret));
  return payload;
}


