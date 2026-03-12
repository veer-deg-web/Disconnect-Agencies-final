import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyAdminToken(
  req: NextRequest
): Promise<{ valid: boolean; isAdmin: boolean; userId?: string }> {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { valid: false, isAdmin: false };

  try {
    const { default: jwt } = await import('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      role?: string;
      userId?: string;
      id?: string;
      sub?: string;
    };
    return {
      valid: true,
      isAdmin: decoded.role === 'admin',
      userId: decoded.userId || decoded.id || decoded.sub,
    };
  } catch {
    return { valid: false, isAdmin: false };
  }
}
