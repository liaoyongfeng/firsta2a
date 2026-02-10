import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, refreshAccessToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    let accessToken = session.accessToken;

    // 检查 token 是否需要刷新
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const refreshThreshold = 5 * 60 * 1000; // 5 分钟

    if (expiresAt.getTime() - now.getTime() < refreshThreshold) {
      // 需要刷新 token
      const tokenResponse = await refreshAccessToken(session.refreshToken);

      // 更新数据库
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        },
      });

      accessToken = tokenResponse.access_token;
    }

    // 获取用户信息
    const apiUrl = process.env.SECONDME_API_BASE_URL || 'https://app.mindos.com/gate/lab';
    const response = await fetch(`${apiUrl}/api/secondme/user/info`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const result = await response.json();

    return NextResponse.json({
      code: result.code,
      data: result.data,
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { error: '获取用户信息失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
