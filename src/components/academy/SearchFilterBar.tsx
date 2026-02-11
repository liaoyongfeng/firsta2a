'use client';

import { SkillFilters } from '@/data/academy/types';

const categories = [
  { value: 'all', label: '全部' },
  { value: '写作', label: '写作' },
  { value: '分析', label: '分析' },
  { value: '编程', label: '编程' },
  { value: '设计', label: '设计' },
  { value: '商业', label: '商业' },
  { value: '沟通', label: '沟通' },
];

const difficulties = [
  { value: 'all', label: '全部难度' },
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
];

const sortOptions = [
  { value: 'popular', label: '最热门' },
  { value: 'rating', label: '评分最高' },
  { value: 'newest', label: '最新' },
  { value: 'price-low', label: '价格最低' },
];

export default function SearchFilterBar({
  filters,
  onChange,
}: {
  filters: SkillFilters;
  onChange: (filters: SkillFilters) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="搜索技能..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange({ ...filters, category: c.value })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.category === c.value
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {c.label}
          </button>
        ))}
        <div className="mx-2 h-8 w-px bg-zinc-200" />
        {difficulties.map((d) => (
          <button
            key={d.value}
            onClick={() => onChange({ ...filters, difficulty: d.value })}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.difficulty === d.value
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
