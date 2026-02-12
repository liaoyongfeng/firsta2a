import { cookies } from 'next/headers';

const SECONDME_OAUTH_URL = process.env.SECONDME_OAUTH_URL || 'https://go.second.me/oauth/';
// const SECONDME_AUTH_URL = process.env.SECONDME_AUTH_URL || "https://app.mindos.com"

const SECONDME_CLIENT_ID = process.env.SECONDME_CLIENT_ID || '';
const SECONDME_REDIRECT_URI = process.env.SECONDME_REDIRECT_URI || 'https://www.hzshumeng.com/api/auth/callback';
const SECONDME_TOKEN_ENDPOINT = process.env.SECONDME_TOKEN_ENDPOINT || 'https://app.mindos.com/gate/lab/api/oauth/token';

export interface OAuthState {
  state: string;
  timestamp: number;
}

/**
 * 生成随机 state 参数用于 CSRF 防护
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

/**
 * 生成 OAuth 授权 URL
 */
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: SECONDME_CLIENT_ID,
    redirect_uri: SECONDME_REDIRECT_URI,
    response_type: 'code',
    state: state,
    scope: 'user.info user.info.shades user.info.softmemory',
  });

  // return `${SECONDME_AUTH_URL}/oauth/authorize?${params.toString()}`

  return `${SECONDME_OAUTH_URL}?${params.toString()}`;
}

/**
 * 使用授权码换取 access token
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  console.log('[exchangeCodeForToken] Request:', {
    endpoint: SECONDME_TOKEN_ENDPOINT,
    client_id: SECONDME_CLIENT_ID,
    redirect_uri: SECONDME_REDIRECT_URI,
    code: code ? '***' : null,
  });

  // 使用 application/x-www-form-urlencoded 格式
  const body = new URLSearchParams({
    client_id: SECONDME_CLIENT_ID,
    client_secret: process.env.SECONDME_CLIENT_SECRET || '',
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: SECONDME_REDIRECT_URI,
  });

  const response = await fetch(SECONDME_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const responseText = await response.text();
  console.log('[exchangeCodeForToken] Response:', {
    status: response.status,
    statusText: response.statusText,
    body: responseText.substring(0, 500),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed (${response.status}): ${responseText}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Failed to parse response: ${responseText}`);
  }

  console.log('[exchangeCodeForToken] Parsed data:', {
    hasData: !!data.data,
    dataKeys: data.data ? Object.keys(data.data) : [],
  });

  if (!data.data) {
    throw new Error(`Response missing data field: ${JSON.stringify(data)}`);
  }

  // SecondMe API 使用驼峰命名 (camelCase)
  return {
    access_token: data.data.accessToken,
    refresh_token: data.data.refreshToken,
    expires_in: data.data.expiresIn,
  };
}

/**
 * 刷新 access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  // 使用刷新令牌的端点
  const refreshEndpoint = process.env.SECONDME_REFRESH_TOKEN_ENDPOINT ||
    'https://app.mindos.com/gate/lab/api/oauth/token/refresh';

  // 使用 application/x-www-form-urlencoded 格式
  const body = new URLSearchParams({
    client_id: SECONDME_CLIENT_ID,
    client_secret: process.env.SECONDME_CLIENT_SECRET || '',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(refreshEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  const data = await response.json();

  if (!data.data) {
    throw new Error(`Response missing data field: ${JSON.stringify(data)}`);
  }

  // SecondMe API 使用驼峰命名 (camelCase)
  return {
    access_token: data.data.accessToken,
    refresh_token: data.data.refreshToken || refreshToken,
    expires_in: data.data.expiresIn,
  };
}

/**
 * 设置会话 Cookie
 */
export async function setSessionCookie(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
) {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({
    userId,
    accessToken,
    refreshToken,
    expiresAt: expiresAt.toISOString(),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 天
    path: '/',
  });
}

/**
 * 获取会话 Cookie
 */
export async function getSessionCookie(): Promise<{
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
} | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

/**
 * 清除会话 Cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * 获取当前用户会话
 */
export async function getCurrentSession() {
  const session = await getSessionCookie();

  if (!session) {
    return null;
  }

  // 检查 token 是否过期
  const expiresAt = new Date(session.expiresAt);
  if (expiresAt < new Date()) {
    await clearSessionCookie();
    return null;
  }

  return session;
}
