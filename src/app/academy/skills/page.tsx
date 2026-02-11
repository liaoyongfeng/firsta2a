'use client';

import { useState } from 'react';
import SkillCard from '@/components/academy/SkillCard';
import SearchFilterBar from '@/components/academy/SearchFilterBar';
import { mockSkills } from '@/data/academy/mock-skills';
import { SkillFilters } from '@/data/academy/types';
import { filterSkills } from '@/lib/academy/utils';

export default function SkillMarketPage() {
  const [filters, setFilters] = useState<SkillFilters>({
    search: '',
    category: 'all',
    difficulty: 'all',
    sort: 'popular',
  });

  const filteredSkills = filterSkills(mockSkills, filters);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-zinc-900">技能市场</h1>
          <p className="text-sm text-zinc-500">
            为你的 Agent 安装合适的技能工具，即装即用
          </p>
        </div>

        <div className="mb-6">
          <SearchFilterBar filters={filters} onChange={setFilters} />
        </div>

        <div className="mb-4 text-sm text-zinc-500">
          共 {filteredSkills.length} 个技能
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="mb-2 text-lg text-zinc-400">🔍</p>
            <p className="text-zinc-500">没有找到匹配的技能</p>
            <button
              onClick={() =>
                setFilters({ search: '', category: 'all', difficulty: 'all', sort: 'popular' })
              }
              className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
