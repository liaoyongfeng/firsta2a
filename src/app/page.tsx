'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  UserRole,
  ROLE_ROUTES,
  getUserRole,
  setUserRole,
  clearUserRole,
} from '@/constants/userRoles';

type AuthStatus = 'checking' | 'unauthenticated' | 'role_selection' | 'redirecting' | 'error';

interface UserInfo {
  userId: string;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: '验证失败，请重试',
  no_code: '未收到授权码，请重试',
  auth_failed: '认证失败，请检查配置',
  access_denied: '授权已取消',
};

function getErrorMessage(error: string): string {
  return ERROR_MESSAGES[error] || error || '未知错误';
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const oauthError = searchParams.get('error');

  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    oauthError ? 'unauthenticated' : 'checking'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    oauthError ? getErrorMessage(oauthError) : null
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Auth check effect: runs on mount (if no oauthError) and on retry
  useEffect(() => {
    if (oauthError) return;

    let cancelled = false;

    async function checkAuth() {
      try {
        const res = await fetch('/api/secondme/user/info');
        if (cancelled) return;

        if (res.status === 401) {
          clearUserRole();
          setAuthStatus('unauthenticated');
          return;
        }

        if (!res.ok) {
          setAuthStatus('error');
          setErrorMessage(`服务器错误 (${res.status})，请稍后重试`);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        setUserInfo(data.data || null);

        const role = getUserRole();
        if (role) {
          setAuthStatus('redirecting');
          router.replace(ROLE_ROUTES[role]);
        } else {
          setAuthStatus('role_selection');
        }
      } catch {
        if (cancelled) return;
        setAuthStatus('error');
        setErrorMessage('无法连接到服务器，请检查网络连接');
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthError, retryCount]);

  const handleRetry = () => {
    setAuthStatus('checking');
    setErrorMessage(null);
    setRetryCount((c) => c + 1);
  };

  const handleRoleSelect = (role: UserRole) => {
    setAuthStatus('redirecting');
    setUserRole(role);
    router.replace(ROLE_ROUTES[role]);
  };

  // --- Loading / Redirecting ---
  if (authStatus === 'checking' || authStatus === 'redirecting') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="text-sm text-zinc-600">
            {authStatus === 'checking' ? '正在验证登录状态...' : '正在跳转...'}
          </p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (authStatus === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm text-center">
          <div className="mb-4 text-4xl">&#x26A0;&#xFE0F;</div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900">出错了</h2>
          <p className="mb-6 text-sm text-zinc-600">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
            >
              重试
            </button>
            <button
              onClick={() => {
                setAuthStatus('unauthenticated');
                setErrorMessage(null);
              }}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              返回登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Unauthenticated ---
  if (authStatus === 'unauthenticated') {
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

            {errorMessage && (
              <div className="w-full max-w-md rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-700">
                  错误: {errorMessage}
                </p>
                {oauthError === 'invalid_state' && (
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
                <li>&#10003; Client ID 已配置</li>
                <li>&#10003; Client Secret 已配置</li>
                <li>&#10003; Redirect URI: http://localhost:3000/api/auth/callback</li>
                <li className="text-amber-600">&#9888; 需要在 SecondMe 开发者后台添加上述 Redirect URI</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Role Selection ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-2xl px-6 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">
            {userInfo?.name ? `欢迎，${userInfo.name}` : '欢迎回来'}
          </h1>
          <p className="text-lg text-zinc-500">
            请选择你的身份以继续
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Provider Card */}
          <button
            onClick={() => handleRoleSelect('provider')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 text-left text-white transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">&#x1F393;</div>
            <h2 className="mb-2 text-xl font-bold">我是教员</h2>
            <p className="text-sm text-indigo-100">
              提供技能与知识，指导学员成长
            </p>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
          </button>

          {/* Consumer Card */}
          <button
            onClick={() => handleRoleSelect('consumer')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-left text-white transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">&#x1F4DA;</div>
            <h2 className="mb-2 text-xl font-bold">我是学员</h2>
            <p className="text-sm text-purple-100">
              探索技能市场，学习新知识
            </p>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
            <p className="text-sm text-zinc-600">加载中...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
