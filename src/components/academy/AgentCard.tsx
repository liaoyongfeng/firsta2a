import Link from 'next/link';
import { Agent } from '@/data/academy/types';
import { mockSkills } from '@/data/academy/mock-skills';


export default function AgentCard({ agent }: { agent: Agent }) {
  const topSkills = agent.acquiredSkills.slice(0, 3).map((as) => {
    const skill = mockSkills.find((s) => s.id === as.skillId);
    return { ...as, title: skill?.title || '未知技能' };
  });

  return (
    <Link href={`/academy/agents/${agent.id}`}>
      <div className="group min-w-[220px] rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl">
            {agent.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              {agent.name}
            </h3>
            <p className="text-xs text-zinc-400">Lv.{agent.skillLevel}</p>
          </div>
        </div>
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topSkills.map((s) => (
              <span
                key={s.skillId}
                className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
              >
                {s.title}
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  s.status === 'active' ? 'bg-green-500' : s.status === 'error' ? 'bg-red-500' : 'bg-zinc-300'
                }`} />
              </span>
            ))}
          </div>
        )}
        {topSkills.length === 0 && (
          <p className="text-xs text-zinc-400">尚未安装任何技能</p>
        )}
      </div>
    </Link>
  );
}
