import { NextRequest, NextResponse } from 'next/server';
import { generateState, getAuthorizationUrl } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const state = generateState();
  const authUrl = getAuthorizationUrl(state);

  // 将 state 保存到 cookie 中用于验证
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 分钟
    path: '/',
  });

  return response;
}
