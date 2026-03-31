import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

/**
 * Signs a new JWT token with a 7-day expiration.
 */
export function signToken(payload: Partial<JWTPayload>): string {
  // Ensure we don't include iat/exp from an old token if we're rotating
  const { iat: _iat, exp: _exp, ...cleanPayload } = payload as any;
  return jwt.sign(cleanPayload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a token and returns the decoded payload. 
 * If the token is valid but nearing expiry (within 3 days), 
 * it also returns a fresh token.
 */
export function verifyAndRotateToken(token: string): { 
  payload: JWTPayload | null; 
  newToken: string | null;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload & { exp: number };
    
    // Check if token is nearing expiry (less than 3 days left)
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpiry = decoded.exp - currentTime;
    
    let newToken: string | null = null;
    if (timeToExpiry < 259200) {
      newToken = signToken(decoded);
    }
    
    return { payload: decoded, newToken };
  } catch (e) {
    return { payload: null, newToken: null, error: (e as Error).message };
  }
}

/**
 * Helper to extract and verify token from a request.
 */
export function getAuthToken(req: NextRequest | Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
