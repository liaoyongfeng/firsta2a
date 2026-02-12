import Link from 'next/link';
import { Skill } from '@/data/academy/types';
import { getDifficultyLabel, getDifficultyColor, getProtocolLabel, getProtocolColor, formatPrice } from '@/lib/academy/utils';
import StarRating from './StarRating';

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/academy/skills/${skill.id}`}>
      <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <div
          className={`relative h-36 bg-gradient-to-tr ${skill.coverGradient} flex items-center justify-center`}
        >
          <span className="text-5xl opacity-80">
            {skill.category === '写作'
              ? '✍️'
              : skill.category === '分析'
                ? '📊'
                : skill.category === '编程'
                  ? '💻'
                  : skill.category === '设计'
                    ? '🎨'
                    : skill.category === '商业'
                      ? '💼'
                      : '💬'}
          </span>
          <div className="absolute right-3 top-3 flex gap-1.5">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getProtocolColor(skill.protocol)}`}
            >
              {getProtocolLabel(skill.protocol)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}
            >
              {getDifficultyLabel(skill.difficulty)}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-sm font-semibold text-zinc-900 backdrop-blur-sm">
              {formatPrice(skill.price)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-1.5 text-base font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
            {skill.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-zinc-500">
            {skill.description}
          </p>
          <div className="flex items-center justify-between">
            <StarRating rating={skill.rating} />
            <span className="text-xs text-zinc-400">
              {skill.installCount.toLocaleString()} 次{skill.protocol === 'business' ? '咨询' : '调用'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
