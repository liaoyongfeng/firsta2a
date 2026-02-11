'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearUserRole } from '@/constants/userRoles';
import { userInfo } from 'os';

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

export default function ProviderPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex-1">
             <h2 className="mb-2 mt-20 text-2xl font-semibold text-zinc-900">当前为内测阶段，教员身份是邀请制，请联系管理员获得邀请码！ </h2>
          </div>
      </main>
  );
}
