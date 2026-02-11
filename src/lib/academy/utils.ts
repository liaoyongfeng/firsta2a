import { Skill, SkillFilters } from '@/data/academy/types';

export function filterSkills(skills: Skill[], filters: SkillFilters): Skill[] {
  let result = [...skills];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter((s) => s.category === filters.category);
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    result = result.filter((s) => s.difficulty === filters.difficulty);
  }

  switch (filters.sort) {
    case 'popular':
      result.sort((a, b) => b.installCount - a.installCount);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    default:
      result.sort((a, b) => b.installCount - a.installCount);
  }

  return result;
}

export function getDifficultyLabel(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };
  return map[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };
  return map[difficulty] || 'bg-zinc-100 text-zinc-700';
}

export function getProtocolLabel(protocol: string): string {
  const map: Record<string, string> = {
    mcp: 'MCP',
    api: 'API',
    function: 'Function',
    business: 'Business',
  };
  return map[protocol] || protocol;
}

export function getProtocolColor(protocol: string): string {
  const map: Record<string, string> = {
    mcp: 'bg-blue-100 text-blue-700',
    api: 'bg-purple-100 text-purple-700',
    function: 'bg-emerald-100 text-emerald-700',
    business: 'bg-green-100 text-green-700',
  };
  return map[protocol] || 'bg-zinc-100 text-zinc-700';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: '运行中',
    inactive: '未启用',
    error: '异常',
  };
  return map[status] || status;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-zinc-100 text-zinc-500',
    error: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-zinc-100 text-zinc-700';
}

export function formatPrice(price: number): string {
  if (price === 0) return '免费';
  return `¥${price.toFixed(2)}`;
}
