'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearUserRole } from '@/constants/userRoles';

interface UserInfo {
  userId: string;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
}

interface Shades {
  shades: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

interface SoftMemory {
  list: Array<{
    id: string;
    content: string;
    timestamp: number;
  }>;
}

/**
 * 课程咨询
 */
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [shades, setShades] = useState<Shades | null>(null);
  const [softMemory, setSoftMemory] = useState<SoftMemory | null>(null);

  useEffect(() => {
    // fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);

      // 并行获取所有数据
      const [infoRes, shadesRes, memoryRes] = await Promise.all([
        fetch('/api/secondme/user/info'),
        fetch('/api/secondme/user/shades'),
        fetch('/api/secondme/user/softmemory'),
      ]);

      // 检查是否未登录
      if (infoRes.status === 401) {
        router.push('/');
        return;
      }

      if (!infoRes.ok || !shadesRes.ok || !memoryRes.ok) {
        throw new Error('获取数据失败');
      }

      const [infoData, shadesData, memoryData] = await Promise.all([
        infoRes.json(),
        shadesRes.json(),
        memoryRes.json(),
      ]);

      setUserInfo(infoData.data);
      setShades(shadesData.data);
      setSoftMemory(memoryData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    clearUserRole();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

   return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-30">
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-semibold text-center text-zinc-900">功能开发中</h2>
        </div>
      </main>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="text-sm text-zinc-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900">出错了</h2>
          <p className="mb-6 text-zinc-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* 用户信息 */}
        {userInfo && (
          <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
            <div className="flex items-start gap-6">
              {userInfo.avatar && (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-semibold text-zinc-900">{userInfo.name}</h2>
                {userInfo.email && (
                  <p className="mb-2 text-sm text-zinc-600">{userInfo.email}</p>
                )}
                {userInfo.bio && (
                  <p className="text-sm text-zinc-600">{userInfo.bio}</p>
                )}
                <p className="mt-2 text-xs text-zinc-500">ID: {userInfo.userId}</p>
              </div>
            </div>
          </section>
        )}

        {/* 兴趣标签 */}
        {shades && shades.shades && shades.shades.length > 0 && (
          <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-zinc-900">兴趣标签</h3>
            <div className="flex flex-wrap gap-3">
              {shades.shades.map((shade) => (
                <span
                  key={shade.id}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  {shade.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 软记忆 */}
        {softMemory && softMemory.list && softMemory.list.length > 0 && (
          <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-zinc-900">软记忆</h3>
            <div className="space-y-4">
              {softMemory.list.map((memory) => (
                <div
                  key={memory.id}
                  className="rounded-lg border border-zinc-200 p-4"
                >
                  <p className="text-sm text-zinc-700">{memory.content}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {new Date(memory.timestamp * 1000).toLocaleString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
