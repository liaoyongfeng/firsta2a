'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/academy', label: '控制台', icon: '📊' },
  { href: '/academy/skills', label: '技能市场', icon: '🛒' },
  { href: '/academy/create-agent', label: '创建Agent', icon: '➕' },
];

export default function AcademyHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/academy') return pathname === '/academy';
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/academy" className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-lg font-semibold text-zinc-900">
                AI Agent 技能学院
              </span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-700"
            >
              返回主页
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
