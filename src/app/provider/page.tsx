'use client';

import Link from 'next/link';
import React from 'react';

/**
 * 教员页
 */
export default function DashboardPage() {
  
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <main className="mx-auto max-w-4xl px-6 py-30">
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-semibold text-center text-zinc-900">等级达到L8才有资格申请成为教员，您当前的等级为L3</h2>
          <Link href="/academy" className='flex-1 items-center font-normal'><div className="mt-2 text-lg text-center text-blue-500 hover:text-blue-900">→ 去学习</div></Link>
        </div>
      </main>
    </div>
  );
}
