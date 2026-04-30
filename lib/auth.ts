import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vicmart-jwt-secret-2026';

export function signToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}