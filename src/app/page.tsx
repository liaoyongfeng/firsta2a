'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  UserRole,
  ROLE_ROUTES,
  getUserRole,
  setUserRole,
  clearUserRole,
} from '@/constants/userRoles';
import { useUser } from '@/lib/userContext';

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
  const { user, isLoading, error: userError, isAuthenticated } = useUser();

  const oauthError = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState<string | null>(
    oauthError ? getErrorMessage(oauthError) : null
  );
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 同步 UserContext 的错误到本地显示
  useEffect(() => {
    if (userError && !oauthError) {
      setErrorMessage(userError);
    }
  }, [userError, oauthError]);

  // 已登录且有角色时自动跳转
  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      const role = getUserRole();
      if (role) {
        setIsRedirecting(true);
        router.replace(ROLE_ROUTES[role]);
      }
    }
  }, [isAuthenticated, isRedirecting, router]);

  const handleRoleSelect = (role: UserRole) => {
    setIsRedirecting(true);
    setUserRole(role);
    router.replace(ROLE_ROUTES[role]);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // --- Loading / Redirecting ---
  if (isLoading || isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="text-sm text-zinc-600">
            {isRedirecting ? '正在跳转...' : '正在加载...'}
          </p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (errorMessage) {
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
          </div>
        </div>
      </div>
    );
  }

  // --- Unauthenticated: 欢迎页面 ---
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <main className="flex w-full max-w-2xl flex-col items-center px-6 py-20">
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900">
                欢迎来到 AI魔法学院
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-zinc-600">
                内修技能，外挂魔法<br />
                开启你的 AI 魔法晋级之旅
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/api/auth/login"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                使用 SecondMe 登录
              </Link>
              <p className="text-xs text-zinc-400">
                使用 SecondMe 账号快速登录，无需注册
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Role Selection: 已登录但未选择角色 ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-2xl px-6 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">
            {user?.name ? `欢迎，${user.name}` : '欢迎回来'}
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
