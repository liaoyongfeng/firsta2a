'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      console.error('[Home Page] Error from OAuth:', error);
    }
  }, [error]);

  const getErrorMessage = (error: string | null) => {
    const errorMessages: Record<string, string> = {
      'invalid_state': '验证失败，请重试',
      'no_code': '未收到授权码，请重试',
      'auth_failed': '认证失败，请检查配置',
      'access_denied': '授权已取消',
    };

    return errorMessages[error || ''] || error || '未知错误';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex w-full max-w-2xl flex-col items-center px-6 py-20">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            FirstA2A
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-600">
            通过 SecondMe 获取你的个人信息
          </p>

          {error && (
            <div className="w-full max-w-md rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700">
                错误: {getErrorMessage(error)}
              </p>
              {error === 'invalid_state' && (
                <p className="mt-2 text-xs text-red-600">
                  请确保在 SecondMe 开发者后台配置了 Redirect URI: http://localhost:3000/api/auth/callback
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Link
              href="/api/auth/login"
              className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
            >
              使用 SecondMe 登录
            </Link>
          </div>

          <div className="mt-8 max-w-md rounded-lg bg-zinc-100 px-4 py-3 text-left">
            <p className="text-xs font-medium text-zinc-700 mb-2">配置检查清单:</p>
            <ul className="text-xs text-zinc-600 space-y-1">
              <li>✓ Client ID 已配置</li>
              <li>✓ Client Secret 已配置</li>
              <li>✓ Redirect URI: http://localhost:3000/api/auth/callback</li>
              <li className="text-amber-600">⚠ 需要在 SecondMe 开发者后台添加上述 Redirect URI</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
