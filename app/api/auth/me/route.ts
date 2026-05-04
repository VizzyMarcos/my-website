import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('vicmart-token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Session expired' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.userId,
      email: user.email,
    },
  });
}
