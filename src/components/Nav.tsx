'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserRole, setUserRole, UserRole, ROLE_ROUTES } from '@/constants/userRoles';
import { useUser } from '@/lib/userContext';


const navItems = [
  { href: '/',  label: '控制台', icon: '📊' },
  { href: '/academy/skills', label: '技能市场', icon: '🛒' },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, refreshUser, clearUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取用户信息
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 从 localStorage 读取用户角色
  useEffect(() => {
    const role = getUserRole();
    setCurrentRole(role);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      clearUser();
      setIsDropdownOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 切换角色
  const handleSwitchRole = (role: UserRole) => {
    setUserRole(role);
    setCurrentRole(role);
    setIsDropdownOpen(false);
    router.push(ROLE_ROUTES[role]);
  };

  const isActive = (href: string) => {
    if (href === '/academy') return pathname === '/academy';
    return pathname.startsWith(href);
  };

  // 获取角色显示文本
  const getRoleDisplayText = (role: UserRole | null) => {
    if (role === 'provider') return '教员';
    if (role === 'consumer') return '学员';
    return '选择身份';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-violet-200/50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo 和站点信息 */}
        <Link href="/" className="flex items-center gap-4">
          <div className="hidden sm:block">
            <h1 className="text-2xl font-extrabold text-white drop-shadow-md"><span className="text-2xl mr-2">🎓</span>AI魔法学院</h1>
            <p className="text-sm font-medium text-white/80"><span className="mr-8"></span>内修技能，外挂魔法</p>
          </div>
        </Link>

        {/* 移动端站点名称 */}
        <div className="sm:hidden">
          <h1 className="text-xl font-bold text-white drop-shadow-md">AI魔法学院</h1>
        </div>

        {/* 中间内容区 */}
        <div className="hidden flex-1 ml-8 gap-1 md:flex">
            {
            navItems.map((item) => {
                if (item.label === '控制台') {
                    item.href = currentRole === 'provider' ? '/provider' : '/academy';
                }

                return (
                <Link
                key={item.href}
                href={item.href || '/'}
                className={`rounded-lg px-3 py-2 mr-4 text-sm font-medium transition-colors ${
                    isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-zinc-50 hover:text-zinc-900'
                }`}
                >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
                </Link>
            )})
            }
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // 加载状态
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/30" />
          ) : user ? (
            // 已登录状态
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-white sm:block">
                  {user.name}
                </span>
                <svg
                  className={`h-4 w-4 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 下拉菜单 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
                  {/* 用户信息 */}
                  <div className="border-b border-zinc-100 px-4 py-3">
                    <p className="text-sm font-medium text-zinc-900">{user.name}</p>
                    <p className="text-xs text-zinc-500">ID: {user.userId}</p>
                  </div>

                  {/* 角色切换 */}
                  <div className="border-b border-zinc-100 py-2">
                    <p className="px-4 py-1 text-xs font-medium text-zinc-400">切换身份</p>
                    <button
                      onClick={() => handleSwitchRole('provider')}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-50 ${
                        currentRole === 'provider' ? 'text-violet-600' : 'text-zinc-700'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      教员
                      {currentRole === 'provider' && (
                        <svg className="ml-auto h-4 w-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleSwitchRole('consumer')}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-50 ${
                        currentRole === 'consumer' ? 'text-violet-600' : 'text-zinc-700'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      学员
                      {currentRole === 'consumer' && (
                        <svg className="ml-auto h-4 w-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* 退出登录 */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 未登录状态
            <a
              href="/api/auth/login"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-600 shadow-lg shadow-black/10 transition-all hover:bg-white/90 hover:shadow-xl hover:shadow-black/20 hover:scale-105"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">使用 SecondMe 登录</span>
              <span className="sm:hidden">登录</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
