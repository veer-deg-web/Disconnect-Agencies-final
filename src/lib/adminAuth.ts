import { NextRequest } from 'next/server';
import { getAuthToken, verifyAndRotateToken } from './auth';

export async function verifyAdminToken(
  req: NextRequest
): Promise<{ valid: boolean; isAdmin: boolean; userId?: string; newToken?: string | null }> {
  const token = getAuthToken(req);
  if (!token) return { valid: false, isAdmin: false };

  const { payload: decoded, newToken } = verifyAndRotateToken(token);
  if (!decoded) return { valid: false, isAdmin: false };

  return {
    valid: true,
    isAdmin: decoded.role === 'admin',
    userId: decoded.userId,
    newToken,
  };
}
