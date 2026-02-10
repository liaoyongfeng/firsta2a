import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('[OAuth Callback] Received:', { code: code ? '***' : null, state, error });

  // 检查是否有错误
  if (error) {
    console.error('[OAuth Callback] Error from SecondMe:', error);
    return NextResponse.redirect(new URL('/?error=' + encodeURIComponent(error), request.url));
  }

  // 验证 state 参数
  const cookieStore = request.cookies;
  const savedState = cookieStore.get('oauth_state')?.value;

  console.log('[OAuth Callback] State validation:', { received: state, saved: savedState });

  if (!state || state !== savedState) {
    console.error('[OAuth Callback] State validation failed');
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
  }

  if (!code) {
    console.error('[OAuth Callback] No code received');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    console.log('[OAuth Callback] Exchanging code for token...');
    // 使用授权码换取 access token
    const tokenResponse = await exchangeCodeForToken(code);
    console.log('[OAuth Callback] Token received:', { hasAccessToken: !!tokenResponse.access_token });

    // 获取用户信息
    console.log('[OAuth Callback] Fetching user info...');
    const userInfo = await getUserInfo(tokenResponse.access_token);
    console.log('[OAuth Callback] User info received:', { userId: userInfo.userId, name: userInfo.name });

    // 验证用户ID存在
    if (!userInfo.userId) {
      console.error('[OAuth Callback] User info missing userId field:', Object.keys(userInfo));
      throw new Error('用户信息缺少 userId 字段');
    }

    // 计算过期时间
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    // 查找或创建用户
    console.log('[OAuth Callback] Upserting user to database...');
    const user = await prisma.user.upsert({
      where: { secondmeUserId: userInfo.userId },
      update: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: expiresAt,
      },
      create: {
        secondmeUserId: userInfo.userId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    });
    console.log('[OAuth Callback] User saved:', { id: user.id });

    // 设置会话
    console.log('[OAuth Callback] Setting session cookie...');
    await setSessionCookie(
      user.id,
      tokenResponse.access_token,
      tokenResponse.refresh_token,
      expiresAt
    );

    // 清除 oauth_state cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.delete('oauth_state');

    console.log('[OAuth Callback] Success! Redirecting to dashboard');
    return response;
  } catch (error) {
    console.error('[OAuth Callback] Error:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.redirect(new URL('/?error=' + encodeURIComponent(errorMessage), request.url));
  }
}

/**
 * 获取用户信息
 */
async function getUserInfo(accessToken: string) {
  const apiUrl = process.env.SECONDME_API_BASE_URL || 'https://app.mindos.com/gate/lab';
  const url = `${apiUrl}/api/secondme/user/info`;

  console.log('[getUserInfo] Fetching:', { url, hasToken: !!accessToken });

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const responseText = await response.text();
  console.log('[getUserInfo] Response:', {
    status: response.status,
    statusText: response.statusText,
    body: responseText.substring(0, 500),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info (${response.status}): ${responseText}`);
  }

  const result = JSON.parse(responseText);
  console.log('[getUserInfo] Parsed result:', {
    hasData: !!result.data,
    dataKeys: result.data ? Object.keys(result.data) : [],
  });

  if (!result.data) {
    throw new Error(`Response missing data field: ${JSON.stringify(result)}`);
  }

  return result.data;
}
